'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  BookOpenIcon, 
  DownloadIcon, 
  ArrowRightIcon, 
  ClockIcon,
  CheckCircleIcon
} from 'lucide-react';
import { useToast } from './ui/use-toast';

type DownloadButtonProps = {
  url: string;
  title: string;
  bookId: string;
  format?: string;
};

export function DownloadButton({ url, title, bookId, format = 'PDF' }: DownloadButtonProps) {
  const [downloadState, setDownloadState] = useState<
    'idle' | 'navigating' | 'countdown' | 'downloading' | 'complete' | 'error'
  >('idle');
  const [countdownTime, setCountdownTime] = useState(10);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Update progress based on download state
  useEffect(() => {
    if (downloadState === 'idle' || downloadState === 'complete' || downloadState === 'error') {
      setProgress(0); // Reset progress when idle, complete, or error
      return;
    }

    let progressValue = 0;
    let interval: NodeJS.Timeout;

    switch (downloadState) {
      case 'navigating':
        progressValue = 10;
        interval = setInterval(() => {
          setProgress(prev => Math.min(prev + 2, 30));
        }, 300);
        break;
      case 'countdown':
        progressValue = 30;
        interval = setInterval(() => {
          setProgress(prev => Math.min(prev + 1, 60));
        }, 500);
        break;
      case 'downloading':
        progressValue = 60;
        interval = setInterval(() => {
          setProgress(prev => Math.min(prev + 2, 95));
        }, 300);
        break;
    }

    setProgress(progressValue);

    return () => clearInterval(interval);
  }, [downloadState]);

  // Handle countdown timer
  useEffect(() => {
    if (downloadState === 'countdown') {
      const timer = setInterval(() => {
        setCountdownTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setDownloadState('downloading'); // Transition to downloading state
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [downloadState]);

  // useEffect to trigger download when state becomes 'downloading'
  useEffect(() => {
    if (downloadState === 'downloading') {
      const safeTitle = title.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_');
      const defaultFilename = `${safeTitle}_${bookId}.${format.toLowerCase()}`;

      const performDownload = async () => {
        try {
          // Run cleanup again right before download
          cleanupDOMElements();
          console.log('Downloading...');
          // Send POST request to the download endpoint
          const response = await fetch('http://bookzify.xyz/download', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
          });
          
          const result = await response.json();
          
          if (result.status === 'success') {
            setDownloadState('complete');
            setProgress(100);
            
            toast({
              title: 'Download completed',
              description: result.message || `${format} downloaded successfully.`,
            });
            
            // If there's a downloadable file path, create download link
            if (result.download_path) {
              const downloadLink = document.createElement('a');
              downloadLink.href = result.download_path;
              downloadLink.download = result.filename || defaultFilename;
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            }
          } else {
            throw new Error(result.message || 'Download failed');
          }
        } catch (err) {
          console.error('Download error:', err);
          setDownloadState('error');
          setProgress(0); // Reset progress on error
          
          toast({
            variant: 'destructive',
            title: 'Download failed',
            description: err instanceof Error ? err.message : 'There was an error starting your download. Please try again.',
          });
        }
      };

      performDownload();
    }
  }, [downloadState, url, title, bookId, format, toast]); // Dependencies for the download effect

  const cleanupDOMElements = () => {
    // Clean up in-page-message elements and any elements with doskip attribute
    document.querySelectorAll('in-page-message, [doskip]').forEach(element => {
      element.remove();
    });
  };

  const handleDownload = async () => {
    try {
      setDownloadState('navigating');
      // Progress is set by the useEffect hook based on downloadState
      
      // Clean up the DOM before proceeding
      cleanupDOMElements();
            
      // After 2 seconds, show countdown
      setTimeout(() => {
        setDownloadState('countdown');
        // Progress will be updated by the useEffect listening to downloadState
        // The countdown useEffect will then transition to 'downloading',
        // which in turn triggers the download useEffect.
      }, 2000); // 2 seconds after clicking
    } catch (error) {
      console.error('Error in download process initiation:', error);
      setDownloadState('error');
      setProgress(0); // Reset progress on error
      
      toast({
        variant: 'destructive',
        title: 'Download initiation error',
        description: 'An error occurred while trying to start the download. Please try again later.',
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Button
        variant="default"
        size="sm"
        className="w-full font-medium text-sm"
        onClick={handleDownload}
        disabled={downloadState !== 'idle' && downloadState !== 'error' && downloadState !== 'complete'}
      >
        {downloadState === 'idle' && (
          <>
            <DownloadIcon className="mr-1 h-3 w-3" />
            Download
          </>
        )}
        {downloadState === 'navigating' && (
          <>
            <ArrowRightIcon className="mr-1 h-3 w-3 animate-pulse" />
            Navigating...
          </>
        )}
        {downloadState === 'countdown' && (
          <>
            <ClockIcon className="mr-1 h-3 w-3 animate-spin" />
            {countdownTime}s...
          </>
        )}
        {downloadState === 'downloading' && (
          <>
            <BookOpenIcon className="mr-1 h-3 w-3 animate-bounce" />
            Downloading...
          </>
        )}
        {downloadState === 'complete' && (
          <>
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            Download Again
          </>
        )}
        {downloadState === 'error' && (
          <>
            <DownloadIcon className="mr-1 h-3 w-3" />
            Retry
          </>
        )}
      </Button>
      {downloadState !== 'idle' && downloadState !== 'complete' && downloadState !== 'error' && progress > 0 && (
        <Progress value={progress} className="w-full h-1" />
      )}
    </div>
  );
} 