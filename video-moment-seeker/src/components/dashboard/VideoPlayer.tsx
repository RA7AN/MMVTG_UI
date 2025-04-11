import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, AlertCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VideoPlayerProps {
  videoSrc: string;
  startTime?: number;
  endTime?: number;
  title?: string;
  onTimeUpdate?: (time: number) => void;
  error?: string | null;
  isClipMode?: boolean;
  onExitClipMode?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoSrc, 
  startTime = 0, 
  endTime,
  title = "Video Preview",
  onTimeUpdate,
  error,
  isClipMode,
  onExitClipMode
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef<number | null>(null);

  // Reset video position when startTime changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = startTime;
    setCurrentTime(startTime);
  }, [startTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentVideoTime = video.currentTime;
      
      // Only enforce boundaries if we're in clip mode
      if (isClipMode && endTime) {
        // If we're before startTime, seek to startTime
        if (currentVideoTime < startTime) {
          video.currentTime = startTime;
          setCurrentTime(startTime);
          return;
        }
        
        // If we reach endTime, pause the video
        if (currentVideoTime >= endTime) {
          video.pause();
          setIsPlaying(false);
          return;
        }
      }
      
      setCurrentTime(currentVideoTime);
      if (onTimeUpdate) {
        onTimeUpdate(currentVideoTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      // Only set initial position to startTime if we're in clip mode
      if (isClipMode && endTime) {
        video.currentTime = startTime;
        setCurrentTime(startTime);
        if (onTimeUpdate) {
          onTimeUpdate(startTime);
        }
      }
    };

    const handleSeeking = () => {
      // Only enforce boundaries if we're in clip mode
      if (isClipMode && endTime) {
        const currentVideoTime = video.currentTime;
        if (currentVideoTime < startTime) {
          video.currentTime = startTime;
        } else if (currentVideoTime > endTime) {
          video.currentTime = endTime;
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeking', handleSeeking);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeking', handleSeeking);
    };
  }, [startTime, endTime, onTimeUpdate, isClipMode]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    
    // Only enforce boundaries if we have an endTime
    if (endTime) {
      if (video.currentTime < startTime) {
        video.currentTime = startTime;
        setCurrentTime(startTime);
      } else if (video.currentTime >= endTime) {
        // If we're at or past endTime, start from beginning of clip
        video.currentTime = startTime;
        setCurrentTime(startTime);
      }
    }
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    // Only constrain seek position if we have an endTime
    const newTime = endTime 
      ? Math.min(Math.max(value[0], startTime), endTime)
      : value[0];
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newMutedState = !isMuted;
    video.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    // Only constrain skip if we have an endTime
    const maxTime = endTime || duration;
    const newTime = Math.min(video.currentTime + 10, maxTime);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    // Only constrain skip if we have an endTime
    const minTime = endTime ? startTime : 0;
    const newTime = Math.max(video.currentTime - 10, minTime);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show/hide controls on mouse move
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeout.current) {
      window.clearTimeout(controlsTimeout.current);
    }
    
    controlsTimeout.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {title}
          </CardTitle>
          {isClipMode && onExitClipMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExitClipMode}
              className="flex items-center gap-2"
            >
              Exit Clip Mode
            </Button>
          )}
        </div>
        <CardDescription>
          {isClipMode && endTime 
            ? `Showing segment from ${formatTime(startTime)} to ${formatTime(endTime)}`
            : 'Video preview with playback controls'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden">
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to process your query. Please try again.
              {error !== "Failed to process your query. Please try again." && (
                <div className="mt-2 text-xs opacity-80 max-h-20 overflow-auto">
                  Details: {error}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <div 
          className="relative bg-black w-full aspect-video group"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full"
            onClick={handlePlayPause}
          />
          
          {/* Play/Pause overlay icon */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 transition-all"
                onClick={handlePlayPause}
              >
                <Play className="h-8 w-8" />
              </Button>
            </div>
          )}
          
          {/* Video controls */}
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Progress bar */}
            <div className="mb-2">
              <Slider
                value={[currentTime]}
                min={startTime}
                max={endTime || duration}
                step={0.01}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={skipBackward}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={skipForward}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
                
                <div className="text-xs text-white">
                  {formatTime(currentTime)} / {formatTime(endTime || duration)}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 w-24">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer"
                  />
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleFullscreen}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
