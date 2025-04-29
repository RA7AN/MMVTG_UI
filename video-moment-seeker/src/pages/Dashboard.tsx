import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/dashboard/Navbar";
import QueryInput from "@/components/dashboard/QueryInput";
import UploadSection from "@/components/dashboard/UploadSection";
import VideoPlayer from "@/components/dashboard/VideoPlayer";
import ResultVisualization from "@/components/dashboard/ResultVisualization";
import { Video, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Prediction response type
interface PredictionResult {
  startTime: number;
  endTime: number;
  confidence: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const [videoLength, setVideoLength] = useState(0);
  const [currentTime, setCurrentTime] = useState<number | undefined>(undefined);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedClip, setSelectedClip] = useState<PredictionResult | null>(null);
  const [isClipMode, setIsClipMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Backend URL from ngrok
  const BACKEND_URL = "https://ab00-34-125-180-86.ngrok-free.app";
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error checking session:", error);
        navigate("/login");
      }
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    // Clean up URLs when component unmounts
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const handleVideoSelect = (file: File) => {
    setVideoFile(file);
    
    // Create a URL for the video file
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    
    // Reset results when a new video is uploaded
    setResults([]);
    setApiError(null);
  };

  const handlePdfSelect = (file: File) => {
    setPdfFile(file);
  };

  const handleSubmitQuery = async (query: string) => {
    if (!videoFile) {
      toast({
        variant: "destructive",
        title: "No video",
        description: "Please upload a video before submitting a query.",
      });
      return;
    }

    setIsLoading(true);
    setCurrentQuery(query);
    setApiError(null);

    try {
      // Create a FormData object to send the video and query
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("query", query);
      
      console.log("Sending request to:", `${BACKEND_URL}/predict`);
      console.log("Query:", query);
      console.log("Video file:", videoFile.name, videoFile.size, videoFile.type);
      
      // Make an API call to the backend
      const response = await fetch(`${BACKEND_URL}/predict`, {
        method: "POST",
        body: formData,
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`Server error: ${response.status}. ${errorText}`);
      }
      
      // Parse the response
      const data = await response.json();
      console.log("Raw response data:", data);
      
      if (!data.predicted_moments || !Array.isArray(data.predicted_moments)) {
        throw new Error("Invalid response format. Expected predicted_moments array.");
      }
      
      // Format the data to match our PredictionResult interface
      const formattedResults: PredictionResult[] = data.predicted_moments.map((item: [number, number, number]) => ({
        startTime: item[0],
        endTime: item[1],
        confidence: item[2],
      }));
      
      console.log("Formatted results:", formattedResults);
      
      if (formattedResults.length === 0) {
        toast({
          variant: "destructive",
          title: "No predictions found",
          description: "The model did not find any matching segments for your query.",
        });
        setResults([]);
        return;
      }
      
      setResults(formattedResults);

      // Get video duration
      const video = document.createElement('video');
      video.src = videoUrl!;
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          setVideoLength(video.duration);
          resolve(video.duration);
        };
      });

      // Save data to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      try {
        // Save all data to the history table
        const { error: historyError } = await supabase
          .from('history')
          .insert({
            user_id: user.id,
            query_text: query,
            video_filename: videoFile.name,
            pdf_filename: pdfFile?.name || null,
            results: formattedResults.map(result => ({
              startTime: result.startTime,
              endTime: result.endTime,
              confidence: result.confidence
            }))
          });

        if (historyError) {
          console.error('Error saving to history:', historyError);
          toast({
            variant: "destructive",
            title: "Database Error",
            description: "Failed to save history. Error: " + historyError.message,
          });
        } else {
          toast({
            title: "Success",
            description: "Query and results saved successfully.",
          });
        }
      } catch (dbError) {
        console.error('Database operation error:', dbError);
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Failed to save data to database. Please try again.",
        });
      }

      toast({
        title: "Prediction complete",
        description: `Found ${formattedResults.length} potential moments matching your query.`,
      });
      
      // Sort results by confidence (highest first)
      formattedResults.sort((a, b) => b.confidence - a.confidence);
      
      // Set the current time to the start of the highest confidence prediction
      if (formattedResults.length > 0) {
        setCurrentTime(formattedResults[0].startTime);
      }
    } catch (error) {
      console.error("Error submitting query:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setApiError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error && error.message === "User not authenticated" 
          ? "Please log in to save predictions."
          : "Failed to process your query. Please try again.",
      });
      
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handlePlayClip = () => {
    if (results.length > 0) {
      // Get the highest confidence result
      const bestResult = [...results].sort((a, b) => b.confidence - a.confidence)[0];
      setSelectedClip(bestResult);
      setIsClipMode(true);
      setCurrentTime(bestResult.startTime);
      
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.currentTime = bestResult.startTime;
      }
    }
  };

  const handleExitClipMode = () => {
    setSelectedClip(null);
    setIsClipMode(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">Please wait while we verify your session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-semibold">
          Video Temporal Grounding
        </Link>
        <Navbar />
      </div>
      
      <main className="container mx-auto p-4">
        {/* Query and Video Preview Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Query Section */}
          <div>
            <QueryInput 
              onSubmit={handleSubmitQuery} 
              videoFile={videoFile}
              pdfFile={pdfFile}
              isLoading={isLoading}
              onPlayClip={handlePlayClip}
              hasResults={results.length > 0}
            />
          </div>
          
          {/* Video Player */}
          <div>
            {videoUrl && (
              <VideoPlayer 
                videoSrc={videoUrl} 
                startTime={isClipMode && selectedClip ? selectedClip.startTime : 0}
                endTime={isClipMode && selectedClip ? selectedClip.endTime : undefined}
                title="Video Preview"
                onTimeUpdate={handleTimeUpdate}
                error={apiError}
                onExitClipMode={handleExitClipMode}
                isClipMode={isClipMode}
              />
            )}
          </div>
        </div>

        {/* Import Sections Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UploadSection
            title="Import Video"
            description="Upload a surveillance video file (.mp4, .webm)"
            icon={<Video className="h-5 w-5" />}
            acceptedFileTypes="video/*"
            onFileSelect={handleVideoSelect}
            maxSize={300} // 300MB max
          />
          
          <UploadSection
            title="Import Witness Report"
            description="Upload a witness report document (.pdf)"
            icon={<FileText className="h-5 w-5" />}
            acceptedFileTypes=".pdf"
            onFileSelect={handlePdfSelect}
            maxSize={50} // 50MB max
          />
        </div>
        
        {/* Results Visualization (shown if results are available) */}
        {results.length > 0 && (
          <div className="mt-6">
            <ResultVisualization
              results={results}
              currentTime={currentTime}
              videoLength={videoLength}
              onPlayClip={handlePlayClip}
              onTimeClick={setCurrentTime}
            />
          </div>
        )}
      </main>
    </div>
  );
}

