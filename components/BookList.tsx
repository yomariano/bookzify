'use client';

import { Book } from '@/app/types/book';
import { DownloadButton } from './DownloadButton';

interface BookListProps {
  books: Book[];
}

export function BookList({ books }: BookListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => (
        <div
          key={book.downloadUrl}
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
          <div className="text-sm text-gray-600 space-y-1 mb-4">
            <p>Author: {book.author}</p>
            <p>Format: {book.format}</p>
            <p>Date: {book.date}</p>
            <p>Category: {book.category}</p>
          </div>
          <DownloadButton url={book.downloadUrl} title={book.title} bookId={book.id} />
        </div>
      ))}
    </div>
  );
} 