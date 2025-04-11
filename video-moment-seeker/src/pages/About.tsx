
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Github, Mail, Users, Code, Heart } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">About the Project</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 border-border/50">
            <CardHeader>
              <CardTitle>Video Temporal Grounding</CardTitle>
              <CardDescription>
                Advanced video search with natural language understanding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Video Temporal Grounding Web App is designed to help users easily find specific moments within 
                surveillance videos using natural language queries. This powerful tool combines computer vision 
                and natural language processing to understand the content of videos and match it to user queries.
              </p>
              <p>
                By uploading surveillance footage and optional witness reports, users can ask questions like 
                "When did the person enter through the front door?" or "Show me when the car parked in the lot" 
                and receive precisely timestamped video segments that answer their query.
              </p>
              <p>
                Our confidence visualization helps users understand the reliability of predictions, while the 
                history feature makes it easy to revisit past queries and results.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                The Team
              </CardTitle>
              <CardDescription>
                The people behind this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 rounded-lg bg-secondary/50">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Alex Johnson</h3>
                    <p className="text-sm text-muted-foreground">Lead Developer</p>
                  </div>
                </div>
                <div className="flex items-center p-4 rounded-lg bg-secondary/50">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Sarah Chen</h3>
                    <p className="text-sm text-muted-foreground">AI Researcher</p>
                  </div>
                </div>
                <div className="flex items-center p-4 rounded-lg bg-secondary/50">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Michael Park</h3>
                    <p className="text-sm text-muted-foreground">UI/UX Designer</p>
                  </div>
                </div>
                <div className="flex items-center p-4 rounded-lg bg-secondary/50">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Jessica Lee</h3>
                    <p className="text-sm text-muted-foreground">Project Manager</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Get in touch with the team behind the project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <a 
                  href="mailto:contact@vtg-app.com" 
                  className="flex items-center space-x-2 text-primary hover:underline"
                >
                  <Mail className="h-5 w-5" />
                  <span>contact@vtg-app.com</span>
                </a>
                <a 
                  href="https://github.com/vtg-project" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-2 text-primary hover:underline"
                >
                  <Github className="h-5 w-5" />
                  <span>github.com/vtg-project</span>
                </a>
                <div className="pt-4 text-center text-sm text-muted-foreground">
                  <p className="flex items-center justify-center gap-1">
                    Made with <Heart className="h-4 w-4 text-red-500" /> for video analysis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
