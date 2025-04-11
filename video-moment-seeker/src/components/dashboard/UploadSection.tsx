
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload, File, Video, Check } from "lucide-react";

interface UploadSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  acceptedFileTypes: string;
  onFileSelect: (file: File) => void;
  maxSize?: number; // in MB
}

const UploadSection: React.FC<UploadSectionProps> = ({
  title,
  description,
  icon,
  acceptedFileTypes,
  onFileSelect,
  maxSize = 100 // Default 100MB
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    const fileType = file.type.split('/')[0];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    // For videos
    if (acceptedFileTypes.includes('video') && fileType !== 'video') {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a valid video file.",
      });
      return false;
    }

    // For PDFs
    if (acceptedFileTypes.includes('pdf') && fileExtension !== 'pdf') {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF file.",
      });
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `The file exceeds the maximum size of ${maxSize}MB.`,
      });
      return false;
    }

    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;

    setFile(file);
    onFileSelect(file);

    // Generate preview
    if (file.type.startsWith('video/')) {
      const videoUrl = URL.createObjectURL(file);
      setPreview(videoUrl);
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      // For PDFs, we'll just show an icon for now
      // In a real app, you'd use a library like react-pdf to render a thumbnail
      setPreview('pdf');
    }

    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <Card className={`border-border/50 ${isDragging ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {!file ? (
          <div 
            className="border-2 border-dashed border-border rounded-md p-8 text-center cursor-pointer hover:bg-secondary/30 transition-colors"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input 
              type="file" 
              ref={inputRef}
              accept={acceptedFileTypes}
              className="hidden" 
              onChange={handleChange}
            />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-1">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              {acceptedFileTypes.includes('video') 
                ? 'Supports MP4, WebM, and other video formats' 
                : 'Supports PDF documents'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-video mb-4 bg-black/20 rounded-md overflow-hidden flex items-center justify-center">
              {preview && preview !== 'pdf' ? (
                <video 
                  src={preview} 
                  className="max-h-full max-w-full object-contain"
                  controls={false}
                />
              ) : (
                <File className="h-16 w-16 text-muted-foreground" />
              )}
              <div className="absolute top-2 right-2 bg-green-500/20 text-highlight px-2 py-1 rounded-full text-xs flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Uploaded
              </div>
            </div>
            <p className="text-sm text-center truncate max-w-full">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={handleClick}
            >
              Replace File
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadSection;
