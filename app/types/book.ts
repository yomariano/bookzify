export interface Book {
  id: string;
  title: string;
  author: string;
  format: string;
  date: string;
  category: string;
  bookUrl: string;
  downloadUrl: string;
  coverImageUrl?: string;
}

export interface SearchResponse {
  books: Book[];
  error?: string;
} 