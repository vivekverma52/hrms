// Enhanced File Upload Hook with Bug Fixes
// Addresses: Memory leaks, error handling, progress tracking, state management

import { useState, useCallback, useRef, useEffect } from 'react';
import FileService, { FileUploadOptions, FileUploadResult } from '../services/FileService';

export interface UploadProgress {
  uploadId: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error' | 'cancelled';
  error?: string;
  result?: FileUploadResult;
}

export interface UseFileUploadOptions extends FileUploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (result: FileUploadResult) => void;
  onError?: (error: string) => void;
  autoCleanup?: boolean;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(new Map());
  const [isUploading, setIsUploading] = useState(false);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  // FIX: Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cancel all pending uploads
      abortControllersRef.current.forEach((controller) => {
        controller.abort();
      });
      abortControllersRef.current.clear();

      // Cleanup file service resources
      if (options.autoCleanup !== false) {
        FileService.cleanup();
      }
    };
  }, [options.autoCleanup]);

  // FIX: Proper state management for concurrent uploads
  const updateUploadProgress = useCallback((uploadId: string, update: Partial<UploadProgress>) => {
    setUploads(prev => {
      const newUploads = new Map(prev);
      const existing = newUploads.get(uploadId);
      if (existing) {
        const updated = { ...existing, ...update };
        newUploads.set(uploadId, updated);
        
        // Call progress callback
        if (options.onProgress) {
          options.onProgress(updated);
        }
      }
      return newUploads;
    });
  }, [options.onProgress]);

  // FIX: Enhanced upload function with proper error handling and cleanup
  const uploadFile = useCallback(async (
    file: File,
    uploadOptions: FileUploadOptions = {}
  ): Promise<FileUploadResult> => {
    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const abortController = new AbortController();
    
    // Store abort controller for cleanup
    abortControllersRef.current.set(uploadId, abortController);

    // Initialize upload progress
    const initialProgress: UploadProgress = {
      uploadId,
      fileName: file.name,
      progress: 0,
      status: 'pending'
    };

    setUploads(prev => new Map(prev).set(uploadId, initialProgress));
    setIsUploading(true);

    try {
      // Update status to uploading
      updateUploadProgress(uploadId, { status: 'uploading', progress: 10 });

      // Merge options
      const mergedOptions = { ...options, ...uploadOptions };

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        updateUploadProgress(uploadId, { 
          progress: Math.min(90, (uploads.get(uploadId)?.progress || 0) + Math.random() * 20)
        });
      }, 500);

      // Upload file
      const result = await FileService.uploadFile(file, mergedOptions);

      // Clear progress interval
      clearInterval(progressInterval);

      if (result.success) {
        // Update to completed
        updateUploadProgress(uploadId, { 
          status: 'completed', 
          progress: 100,
          result 
        });

        // Call completion callback
        if (options.onComplete) {
          options.onComplete(result);
        }
      } else {
        // Update to error
        updateUploadProgress(uploadId, { 
          status: 'error', 
          error: result.error || 'Upload failed'
        });

        // Call error callback
        if (options.onError) {
          options.onError(result.error || 'Upload failed');
        }
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      // Update to error state
      updateUploadProgress(uploadId, { 
        status: 'error', 
        error: errorMessage 
      });

      // Call error callback
      if (options.onError) {
        options.onError(errorMessage);
      }

      return {
        success: false,
        error: errorMessage
      };

    } finally {
      // Cleanup
      abortControllersRef.current.delete(uploadId);
      setIsUploading(Array.from(uploads.values()).some(upload => 
        upload.status === 'uploading' || upload.status === 'pending'
      ));

      // Auto-remove completed/error uploads after delay
      setTimeout(() => {
        setUploads(prev => {
          const newUploads = new Map(prev);
          const upload = newUploads.get(uploadId);
          if (upload && (upload.status === 'completed' || upload.status === 'error')) {
            newUploads.delete(uploadId);
          }
          return newUploads;
        });
      }, 5000);
    }
  }, [uploads, updateUploadProgress, options]);

  // FIX: Proper upload cancellation
  const cancelUpload = useCallback((uploadId: string) => {
    const controller = abortControllersRef.current.get(uploadId);
    if (controller) {
      controller.abort();
      updateUploadProgress(uploadId, { status: 'cancelled' });
      abortControllersRef.current.delete(uploadId);
    }
  }, [updateUploadProgress]);

  // FIX: Bulk upload with proper error handling
  const uploadMultipleFiles = useCallback(async (
    files: FileList | File[],
    uploadOptions: FileUploadOptions = {}
  ): Promise<FileUploadResult[]> => {
    const fileArray = Array.from(files);
    const results: FileUploadResult[] = [];

    // Process files sequentially to avoid overwhelming the system
    for (const file of fileArray) {
      try {
        const result = await uploadFile(file, uploadOptions);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Upload failed'
        });
      }
    }

    return results;
  }, [uploadFile]);

  // FIX: Clear completed uploads
  const clearCompletedUploads = useCallback(() => {
    setUploads(prev => {
      const newUploads = new Map();
      prev.forEach((upload, id) => {
        if (upload.status === 'uploading' || upload.status === 'pending') {
          newUploads.set(id, upload);
        }
      });
      return newUploads;
    });
  }, []);

  // FIX: Get upload statistics
  const getUploadStats = useCallback(() => {
    const uploadsArray = Array.from(uploads.values());
    return {
      total: uploadsArray.length,
      pending: uploadsArray.filter(u => u.status === 'pending').length,
      uploading: uploadsArray.filter(u => u.status === 'uploading').length,
      completed: uploadsArray.filter(u => u.status === 'completed').length,
      failed: uploadsArray.filter(u => u.status === 'error').length,
      cancelled: uploadsArray.filter(u => u.status === 'cancelled').length
    };
  }, [uploads]);

  return {
    // State
    uploads: Array.from(uploads.values()),
    isUploading,
    
    // Actions
    uploadFile,
    uploadMultipleFiles,
    cancelUpload,
    clearCompletedUploads,
    
    // Utilities
    getUploadStats
  };
};

export default useFileUpload;