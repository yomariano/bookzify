export interface BookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    language?: string;
    coverImageUrl?: string;
  };
  accessInfo?: {
    webReaderLink?: string;
    downloadAccess?: {
      isAvailable: boolean;
    };
  };
  saleInfo?: {
    isEbook?: boolean;
    listPrice?: {
      amount: number;
      currencyCode: string;
    };
  };
  // Additional fields for book crawler
  downloadUrl?: string;
  bookUrl?: string;
  format?: string;
  date?: string;
  category?: string;
  author?: string;
  title?: string;
} 