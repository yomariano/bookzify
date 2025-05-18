'use client';

import { BookVolume } from '@/app/types/book-volume';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Book } from '@/app/types/book';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from 'next/image';
import { useState } from 'react';

interface BookCardProps {
  book: Book | BookVolume;
  onSelect: (book: BookVolume) => void;
}

export function BookCard({ book, onSelect }: BookCardProps) {
  // Handle both Book and BookVolume types
  const title = 'volumeInfo' in book ? book.volumeInfo.title : book.title;
  const authors = 'volumeInfo' in book 
    ? (book.volumeInfo.authors || []).join(', ') 
    : book.author;
  const [imageError, setImageError] = useState(false);

  // Handle cover image URL correctly for both types
  const coverImageUrl = 'volumeInfo' in book 
    ? book.volumeInfo.coverImageUrl || book.volumeInfo.imageLinks?.thumbnail 
    : book.coverImageUrl;
  
  console.log('Book:', book);
  console.log('Cover image URL:', coverImageUrl);
  
  // Try to use bookUrl to derive the image URL if coverImageUrl is missing
  const getImageUrl = () => {
    if (coverImageUrl) return coverImageUrl;
    
    // For the specific case in the example
    if ('bookUrl' in book && book.bookUrl && book.bookUrl.includes('ebook-hunter.org')) {
      // We don't use bookId, so we don't need to assign it
      if ('title' in book && book.title) {
        const bookTitle = book.title.replace(/\s+/g, '%20');
        return `https://img.ebook-hunter.org/img/${bookTitle}_small.jpg`;
      }
    }
    
    return null;
  };

  const imageUrl = getImageUrl();
  
  const handleViewDetails = () => {
    // Cast to BookVolume for the onSelect handler
    onSelect(book as BookVolume);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow group">
      <div className="overflow-hidden rounded-t-lg bg-gray-100 relative">
        {imageUrl && !imageError ? (
          <AspectRatio ratio={2/3} className="bg-secondary">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover w-full h-full rounded-t-md transition-transform group-hover:scale-105"
            onError={() => {
              setImageError(true);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
            <div className="p-2 text-white">
              <p className="text-xs font-medium">View Details</p>
            </div>
          </div>
        </AspectRatio>
        ) : (
          <AspectRatio ratio={2/3} className="bg-secondary flex items-center justify-center">
            <Image src="/placeholder.svg" alt="Placeholder" width={50} height={75} />
          </AspectRatio>
        )}
      </div>
      <CardContent className="flex-1 p-3">
        <h3 className="text-sm font-semibold mb-1 line-clamp-2">{title}</h3>
        <div className="text-xs text-muted-foreground truncate">{authors}</div>
      </CardContent>
      <CardFooter className="px-3 pb-3 pt-0">
        <Button 
          variant="outline" 
          className="w-full text-xs py-1 h-auto"
          onClick={handleViewDetails}
        >
          Details
        </Button>
      </CardFooter>
    </Card>
  );
} 