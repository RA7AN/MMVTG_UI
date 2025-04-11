
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Video, Search, Database, Clock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8 flex justify-between items-center">
        <h1 className="text-xl font-bold">MMVTG</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/about")}>
            About
          </Button>
          <Button onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 text-transparent bg-clip-text">
            Find Exactly What You Need in Any Video
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload surveillance videos, ask questions in natural language, and receive
            precisely timestamped video segments with confidence visualizations.
          </p>
          
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="px-8 py-6 text-lg"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full">
          <div className="bg-card/40 p-6 rounded-lg border border-border/50 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Video Upload</h3>
            <p className="text-muted-foreground">
              Upload surveillance videos in popular formats and get instant previews.
            </p>
          </div>
          
          <div className="bg-card/40 p-6 rounded-lg border border-border/50 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Natural Language Queries</h3>
            <p className="text-muted-foreground">
              Ask questions about video content in plain English and get precise timestamps.
            </p>
          </div>
          
          <div className="bg-card/40 p-6 rounded-lg border border-border/50 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Search History</h3>
            <p className="text-muted-foreground">
              Save and review your past video queries with comprehensive results.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 border-t border-border/50 text-center text-sm text-muted-foreground">
        <p>© 2025 Video Temporal Grounding. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
