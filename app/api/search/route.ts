import { NextResponse } from 'next/server';
import { z } from 'zod';
import { chromium, Page } from 'playwright';
import type { Book, SearchResponse } from '../../types/book';

const searchParamsSchema = z.object({
  query: z.string().min(1),
});

const BASE_URL = 'https://ebook-hunter.org';

function extractCoverImageUrl(bookUrl: string, existingImageUrl: string): string {
  // If we already have a valid image URL, use it
  if (existingImageUrl && existingImageUrl.startsWith('http')) {
    return existingImageUrl;
  }

  // Extract book identifier from URL
  const bookIdMatch = bookUrl.match(/\/([^/]+)\/$/);
  if (!bookIdMatch) return '';
  const bookId = bookIdMatch[1];

  // Construct image URL based on the pattern seen in the screenshot
  return `https://img.ebook-hunter.org/img/${bookId}_small.jpg`;
}

async function getBookDownloadUrl(page: Page, bookUrl: string): Promise<{ downloadUrl: string; coverImageUrl?: string }> {
  try {
    // Navigate to the book's page
    console.log('📖 Navigating to book page:', bookUrl);
    await page.goto(bookUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Wait for and find the download link and cover image
    const result = await page.evaluate(() => {
      // Remove any overlay that might appear
      const adOverlay = document.querySelector('.pmjlvmd');
      if (adOverlay) adOverlay.remove();

      // Look for the download link in the to-lock section
      const downloadLink = document.querySelector<HTMLAnchorElement>('.to-lock a');
      
      // Look for cover image
      const coverImg = document.querySelector('.single_box_img img, .index_box_lit img');
      const coverSrc = coverImg?.getAttribute('src') || '';
      // Format the image URL correctly based on the site's structure
      const coverImageUrl = coverSrc.startsWith('http') ? coverSrc : coverSrc ? `https://img.ebook-hunter.org${coverSrc}` : '';
      
      return { 
        downloadUrl: downloadLink?.href || '',
        coverImageUrl
      };
    });

    if (!result.downloadUrl) {
      console.log('❌ No download link found on book page');
    }

    // Return the result
    return result;
  } catch (error) {
    console.error('❌ Failed to get book download URL:', error);
    return { downloadUrl: '' };
  }
}

export async function GET(request: Request) {
  console.log('🔍 Starting book search...');
  let browser;
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    console.log('📝 Search query:', query);

    const validatedParams = searchParamsSchema.parse({ query });
    console.log('✅ Query validation passed');

    // Launch browser with specific options
    console.log('🌐 Launching browser...');
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      javaScriptEnabled: true,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    
    const page = await context.newPage();
    console.log('✅ Browser launched successfully');

    // Navigate directly to search URL
    const searchUrl = `${BASE_URL}/search/?keyword=${encodeURIComponent(validatedParams.query)}`;
    console.log('🔄 Navigating to search URL:', searchUrl);
    await page.goto(searchUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    console.log('✅ Search page loaded');

    // Remove any overlay and wait for it to be gone
    console.log('🔍 Checking for advertisement overlay...');
    await page.evaluate(() => {
      const adOverlay = document.querySelector('.pmjlvmd');
      if (adOverlay) {
        console.log('🗑️ Removing advertisement overlay');
        adOverlay.remove();
      }
    });

    // First collect all book metadata and page URLs
    const bookMetadata = await page.evaluate(() => {
      // Remove any overlay that might have appeared
      const adOverlay = document.querySelector('.pmjlvmd');
      if (adOverlay) {
        adOverlay.remove();
      }

      // Find all book entries - they're in div.index_box containers
      const results: Array<{
        title: string;
        author: string;
        format: string;
        date: string;
        category: string;
        bookUrl: string;
        coverImageUrl?: string;
      }> = [];
      
      // Look for book entries that match the structure in the DOM
      document.querySelectorAll('div.index_box').forEach(bookBox => {
        // Get the title element which contains the link and metadata
        const titleElement = bookBox.querySelector('.index_box_title.list_title');
        if (!titleElement) return;

        // Get the link element
        const linkElement = titleElement.querySelector('a');
        if (!linkElement) return;

        // Extract the cover image URL if it exists
        const coverImageElement = bookBox.querySelector('.index_box_img img, .index_box_lit img');
        const coverImageSrc = coverImageElement?.getAttribute('src') || '';
        // Ensure we're getting the full URL, either already absolute or relative that we need to make absolute
        const coverImageUrl = coverImageSrc.startsWith('http') ? coverImageSrc : coverImageSrc ? `https://img.ebook-hunter.org${coverImageSrc}` : '';
        
        // Get the info element that contains metadata
        const infoElement = bookBox.querySelector('.index_box_info.list_title');
        const infoText = infoElement?.textContent || '';

        // Get the full text content for parsing
        const fullText = infoText.trim();
        
        // Parse the format (usually at the start, like "pdf |")
        const formatMatch = fullText.match(/^(\w+)\s*\|/);
        const format = formatMatch ? formatMatch[1].toLowerCase() : 'unknown';

        // Parse the date (usually in YYYY-MM-DD format)
        const dateMatch = fullText.match(/\|\s*(\d{4}-\d{2}-\d{2})/);
        const date = dateMatch ? dateMatch[1] : '';

        // Parse the author (usually after "Author:")
        const authorMatch = fullText.match(/Author:\s*([^|)]+)/);
        const author = authorMatch ? authorMatch[1].trim() : 'Unknown';

        // Parse the category (usually in parentheses with "Category:" prefix)
        const categoryMatch = fullText.match(/Category:\s*([^)]+)\)/);
        const category = categoryMatch ? categoryMatch[1].trim() : '';

        // Get the title from the link text
        const title = linkElement.textContent?.trim();
        if (!title) return; // Skip if no title found

        results.push({
          title,
          author,
          format,
          date,
          category,
          bookUrl: linkElement.href,
          coverImageUrl: coverImageUrl.startsWith('http') ? coverImageUrl : coverImageUrl ? `${BASE_URL}${coverImageUrl}` : '',
        });
      });

      return results;
    });

    console.log('📚 Raw books found:', bookMetadata.length);

    // Process books sequentially to avoid race conditions
    const books: Book[] = [];
    for (const metadata of bookMetadata.slice(0, 10)) { // Limit to first 10 to avoid too many requests
      try {
        // Create a new page for each book to avoid navigation conflicts
        const bookPage = await context.newPage();
        const { downloadUrl, coverImageUrl: bookPageCoverImageUrl } = await getBookDownloadUrl(bookPage, metadata.bookUrl);
        await bookPage.close();
        if (downloadUrl) {
          books.push({
            id: crypto.randomUUID(), // Add unique ID
            ...metadata,
            downloadUrl,
            // Extract cover image URL from metadata or book page
            coverImageUrl: extractCoverImageUrl(metadata.bookUrl, metadata.coverImageUrl || bookPageCoverImageUrl || ''),
          });
          console.log('✅ Got download URL for:', metadata.title);
        }
      } catch (error) {
        console.error('❌ Failed to get download URL for:', metadata.title, error);
      }
    }

    console.log('📚 Books with download URLs:', books.length);
    if (books.length > 0) {
      console.log('📖 First book:', books[0]);
    }

    const searchResponse: SearchResponse = {
      books,
    };

    console.log('✅ Search completed successfully');
    return NextResponse.json(searchResponse);
  } catch (error) {
    console.error('❌ Search error:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to search books', books: [] },
      { status: 500 }
    );
  } finally {
    // Ensure browser is always closed
    if (browser) {
      await browser.close();
      console.log('✅ Browser closed');
    }
  }
} 