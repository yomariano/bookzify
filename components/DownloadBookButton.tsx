'use client';

import { useState, useEffect } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useToast } from './ui/use-toast';

interface DownloadBookButtonProps {
  url: string;
  title: string;
  bookId: string;
}

export function DownloadBookButton({ url, title, bookId }: DownloadBookButtonProps) {
  const [downloadState, setDownloadState] = useState<
    'idle' | 'downloading' | 'complete' | 'error'
  >('idle');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (downloadState === 'downloading') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [downloadState]);

  const handleDownload = async () => {
    try {
      setDownloadState('downloading');
      setProgress(10);
      
      // In a real implementation, we would use the url to download the file
      console.log(`Starting download for book ${bookId} from ${url}`);
      
      // Simulate download process
      setTimeout(() => {
        setDownloadState('complete');
        setProgress(100);
        
        toast({
          title: 'Download completed',
          description: `${title} downloaded successfully.`,
        });
        
      }, 3000);
    } catch (error) {
      console.error('Error in download process:', error);
      setDownloadState('error');
      
      toast({
        variant: 'destructive',
        title: 'Download error',
        description: 'An error occurred. Please try again later.',
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Button
        variant="outline"
        size="sm"
        className="w-full font-semibold"
        onClick={handleDownload}
        disabled={downloadState === 'downloading'}
      >
        {downloadState === 'idle' && (
          <>
            <Download className="mr-2 h-4 w-4" />
            Download
          </>
        )}
        {downloadState === 'downloading' && (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Downloading...
          </>
        )}
        {downloadState === 'complete' && (
          <>
            <Download className="mr-2 h-4 w-4" />
            Download Again
          </>
        )}
        {downloadState === 'error' && (
          <>
            <Download className="mr-2 h-4 w-4" />
            Retry
          </>
        )}
      </Button>
      {downloadState === 'downloading' && (
        <Progress value={progress} className="w-full h-2" />
      )}
    </div>
  );
} 