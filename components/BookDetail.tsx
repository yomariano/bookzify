'use client';

import { BookVolume } from '@/app/types/book-volume';
import { X, Book, Globe, FileText, Share } from 'lucide-react';
import { Button } from './ui/button';
import { DownloadButton } from './DownloadButton';

interface BookDetailProps {
  book: BookVolume;
  onClose: () => void;
}

export function BookDetail({ book, onClose }: BookDetailProps) {
  // Extract book details with fallbacks between different book types
  const title = book.volumeInfo?.title || book.title || 'Unknown Title';
  const authors = book.volumeInfo?.authors?.join(', ') || book.author || 'Unknown Author';
  const description = book.volumeInfo?.description || '';
  const publishedDate = book.volumeInfo?.publishedDate || book.date || 'Unknown Date';
  const publisher = book.volumeInfo?.publisher || 'Unknown Publisher';
  const pageCount = book.volumeInfo?.pageCount || 'Unknown';
  const language = book.volumeInfo?.language || 'Unknown';
  const categories = book.volumeInfo?.categories?.join(', ') || book.category || 'Unknown';
  const thumbnail = book.volumeInfo?.imageLinks?.thumbnail || '';
  const downloadUrl = book.downloadUrl;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose}
        className="absolute right-4 top-4 z-10 text-white hover:text-white/80 hover:bg-transparent"
      >
        <X size={24} />
      </Button>
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col">
          {/* Title and author */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{title}</h1>
          <p className="text-gray-400 mb-6">{authors}</p>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book cover */}
            <div className="flex-shrink-0 mb-6 md:mb-0">
              {thumbnail ? (
                <img 
                  src={thumbnail.replace('http:', 'https:')} 
                  alt={title}
                  className="w-full md:w-64 h-auto shadow-lg rounded-md object-cover"
                />
              ) : (
                <div className="w-full md:w-64 h-96 bg-gray-800 flex items-center justify-center rounded-md">
                  <Book size={64} className="text-gray-600" />
                </div>
              )}
            </div>
            
            {/* Book details */}
            <div className="flex-1">
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {description || "No description available for this book."}
                </p>
              </div>
              
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-y-4 mb-8">
                <MetadataItem label="Publisher" value={publisher} />
                <MetadataItem label="Published Date" value={publishedDate} />
                <MetadataItem label="Page Count" value={pageCount.toString()} />
                <MetadataItem label="Language" value={language.toUpperCase()} />
                <MetadataItem label="Categories" value={categories} />
                <MetadataItem label="Rating" value="Not rated" />
              </div>
              
              {/* Available actions section */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-white mb-4">Available Actions</h2>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                    <FileText className="mr-2 h-4 w-4" />
                    Summarize
                  </Button>
                  <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                    <Globe className="mr-2 h-4 w-4" />
                    Create Audiobook
                  </Button>
                  <Button variant="outline" className="border-violet-600 text-violet-400 hover:bg-violet-900/20">
                    <Book className="mr-2 h-4 w-4" />
                    Bookmark
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action buttons at bottom */}
          <div className="flex flex-col-reverse md:flex-row gap-3 mt-8">
            {downloadUrl && (
                <DownloadButton url={downloadUrl} title={title} bookId={book.id} />
             )}
            <Button variant="outline" className="border-gray-700 text-gray-400 hover:bg-gray-800 flex-1 md:flex-none" size="lg">
              <Share className="mr-2 h-5 w-5" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetadataItemProps {
  label: string;
  value: string;
}

function MetadataItem({ label, value }: MetadataItemProps) {
  return (
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white text-sm font-medium">{value || "Unknown"}</p>
    </div>
  );
} 