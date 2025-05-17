import { NextRequest, NextResponse } from "next/server";
import * as cheerio from 'cheerio';

// Add CORS headers helper function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const save = searchParams.get('save') === 'true';
    const filename = searchParams.get('filename');

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // If save parameter is true, handle direct download
    if (save && filename) {
      try {
        // Fetch the target page first
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'cross-site',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch target page: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Look for download buttons or links
        let downloadUrl = null;

        // Try to find an enabled download button or link
        const possibleButtons = [
          'input[type="submit"][id="btn_download"]:not([disabled])', 
          'a[href*="download"]', 
          'a.btn_download',
          'a[href*=".pdf"]',
          'a[href*=".epub"]',
          'a[href*=".mobi"]',
          'form[name="F1"]'
        ];

        for (const selector of possibleButtons) {
          const element = $(selector);
          if (element.length) {
            if (selector === 'form[name="F1"]') {
              // If it's a form, we need to submit it
              const formData = new FormData();
              element.find('input[type="hidden"]').each(function() {
                const name = $(this).attr('name');
                const value = $(this).val() as string;
                if (name) formData.append(name, value);
              });
              
              // Get form action URL (or default to the current URL)
              const formAction = element.attr('action') || url;
              const absoluteFormAction = new URL(formAction, url).toString();

              // Submit the form
              const formSubmit = await fetch(absoluteFormAction, {
                method: 'POST',
                body: formData,
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                  'Accept-Language': 'en-US,en;q=0.5',
                  'Referer': url,
                  'DNT': '1',
                  'Connection': 'keep-alive',
                  'Sec-Fetch-Dest': 'document',
                  'Sec-Fetch-Mode': 'navigate',
                  'Sec-Fetch-Site': 'same-origin',
                }
              });

              if (!formSubmit.ok) {
                continue; // Try other methods if form submission fails
              }

              const formResult = await formSubmit.text();
              const formResultDoc = cheerio.load(formResult);
              
              // Check for direct download links in the response
              const directLink = formResultDoc('a[href*=".pdf"], a[href*=".epub"], a[href*=".mobi"]').attr('href');
              if (directLink) {
                downloadUrl = new URL(directLink, absoluteFormAction).toString();
                break;
              }
            } else {
              // If it's a link, just get the href
              const href = element.attr('href');
              if (href && !href.startsWith('javascript:') && !href.startsWith('#')) {
                downloadUrl = new URL(href, url).toString();
                break;
              }
            }
          }
        }

        // If we found a download URL, fetch the actual file
        if (downloadUrl) {
          console.log('Found download URL:', downloadUrl);
          const fileResponse = await fetch(downloadUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': '*/*',
              'Accept-Language': 'en-US,en;q=0.5',
              'Referer': url,
              'DNT': '1',
              'Connection': 'keep-alive',
            }
          });

          if (!fileResponse.ok) {
            throw new Error(`Failed to download file: ${fileResponse.status} ${fileResponse.statusText}`);
          }

          // Get the file content as blob
          const fileBlob = await fileResponse.blob();
          
          // Set appropriate headers for file download
          const headers = new Headers();
          headers.set('Content-Type', fileResponse.headers.get('Content-Type') || 'application/octet-stream');
          headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
          
          // Return the file for download
          return new NextResponse(fileBlob, {
            status: 200,
            headers
          });
        } else {
          throw new Error('Could not find a valid download link on the page');
        }
      } catch (error) {
        console.error('Error in direct download:', error);
        return NextResponse.json({ error: 'Failed to process direct download' }, { status: 500 });
      }
    }

    // If not a direct download or direct download failed, send the iframe HTML
    const iframeContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="referrer" content="no-referrer" />
          <style>
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              overflow: hidden;
            }
            iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
        </head>
        <body>
          <iframe src="${url}" referrerpolicy="no-referrer" allowfullscreen></iframe>
        </body>
      </html>
    `;

    return new NextResponse(iframeContent, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error: unknown) {
    console.error('Download error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}