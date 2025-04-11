import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/dashboard/Navbar";
import QueryInput from "@/components/dashboard/QueryInput";
import UploadSection from "@/components/dashboard/UploadSection";
import VideoPlayer from "@/components/dashboard/VideoPlayer";
import ResultVisualization from "@/components/dashboard/ResultVisualization";
import { Video, FileText } from "lucide-react";

// Prediction response type
interface PredictionResult {
  startTime: number;
  endTime: number;
  confidence: number;
}

const Dashboard = () => {
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

  // Backend URL from ngrok
  const BACKEND_URL = "https://3681-34-125-57-71.ngrok-free.app";

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
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
      
      // PDF handling temporarily disabled
      // if (pdfFile) {
      //   formData.append("pdf", pdfFile);
      // }
      
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

      // Automatically detect video length
      const video = document.createElement('video');
      video.src = videoUrl!;
      video.onloadedmetadata = () => {
        setVideoLength(video.duration);
      };

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
        description: "Failed to process your query. Please try again.",
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

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Query Section */}
          <QueryInput 
            onSubmit={handleSubmitQuery} 
            videoFile={videoFile}
            pdfFile={pdfFile}
            isLoading={isLoading}
            onPlayClip={handlePlayClip}
            hasResults={results.length > 0}
          />
          
          {/* Video Player (shown if video is uploaded or results are available) */}
          {videoUrl && (
            <VideoPlayer 
              videoSrc={videoUrl} 
              startTime={isClipMode && selectedClip ? selectedClip.startTime : 0}
              endTime={isClipMode && selectedClip ? selectedClip.endTime : undefined}
              title={results.length > 0 ? `Results for: "${currentQuery}"` : "Video Preview"}
              onTimeUpdate={handleTimeUpdate}
              error={apiError}
              onExitClipMode={handleExitClipMode}
              isClipMode={isClipMode}
            />
          )}
          
          {/* Upload Sections */}
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
          
          {/* Results Visualization (shown if results are available) */}
          {results.length > 0 && (
            <div className="lg:col-span-2">
              <ResultVisualization 
                results={results} 
                videoLength={videoLength || 150} // Fallback to 150s if duration not detected
                currentTime={currentTime}
                onPlayClip={handlePlayClip}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

