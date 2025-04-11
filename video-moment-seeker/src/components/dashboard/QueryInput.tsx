import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, Clock, Loader2, Play } from "lucide-react";
import HistoryModal from "./HistoryModal";

interface QueryInputProps {
  onSubmit: (query: string) => void;
  videoFile: File | null;
  pdfFile: File | null;
  isLoading: boolean;
  onPlayClip?: () => void;
  hasResults?: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ 
  onSubmit, 
  videoFile,
  pdfFile,
  isLoading,
  onPlayClip,
  hasResults
}) => {
  const [query, setQuery] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        variant: "destructive",
        title: "Empty query",
        description: "Please enter a question about the video.",
      });
      inputRef.current?.focus();
      return;
    }

    if (!videoFile) {
      toast({
        variant: "destructive",
        title: "No video uploaded",
        description: "Please upload a video before making a prediction.",
      });
      return;
    }

    onSubmit(query);
  };

  const handleHistoryClick = (historicalQuery: string) => {
    setQuery(historicalQuery);
    setShowHistory(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Video Query
          </CardTitle>
          <CardDescription>
            Ask a natural language question about the video content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                placeholder="Enter your question about the video..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !videoFile}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Make Prediction"
                )}
              </Button>
            </div>
            {hasResults && onPlayClip && (
              <Button 
                type="button"
                onClick={onPlayClip}
                className="w-full flex items-center gap-2"
                variant="secondary"
              >
                <Play className="h-4 w-4" />
                Play Predicted Clip
              </Button>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-1 text-xs"
          >
            <Clock className="h-3.5 w-3.5" />
            History
          </Button>
        </CardFooter>
      </Card>

      <HistoryModal 
        open={showHistory} 
        onClose={() => setShowHistory(false)} 
        onSelectQuery={handleHistoryClick}
      />
    </>
  );
};

export default QueryInput;
