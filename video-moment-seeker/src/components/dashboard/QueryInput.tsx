import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, Clock, Loader2, Play } from "lucide-react";
import HistoryModal from "./HistoryModal";
import { motion, AnimatePresence } from "framer-motion";
import { slideInFromRight } from "@/lib/animations";

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

    onSubmit(query.trim());
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
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  placeholder="Ask a question about the video..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  disabled={isLoading || !videoFile}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing
                    </motion.div>
                  ) : (
                    "Make Prediction"
                  )}
                </Button>
              </motion.div>
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
      </motion.div>

      <HistoryModal 
        open={showHistory} 
        onClose={() => setShowHistory(false)} 
        onSelectQuery={handleHistoryClick}
      />

      <AnimatePresence>
        {hasResults && onPlayClip && (
          <motion.div
            variants={slideInFromRight}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="button"
              onClick={onPlayClip}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Play Predicted Clip
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QueryInput;
