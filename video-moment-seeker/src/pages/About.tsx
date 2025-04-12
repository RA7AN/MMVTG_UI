import React from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Search, Database, Shield, User } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold">MMVTG</h1>
        <Navbar />
      </div>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">About MMVTG</CardTitle>
            <CardDescription>
              Understanding our mission and technology
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed">
                MMVTG (Multimodal Video Temporal Grounding) is an advanced AI-powered platform designed to revolutionize 
                how we search and analyze video content. Our system allows users to find specific 
                moments in videos using natural language queries, making video analysis more efficient 
                and accessible than ever before.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Advanced Video Processing</h3>
                    <p className="text-muted-foreground">
                      Process and analyze video content with state-of-the-art AI models for accurate moment detection.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Natural Language Search</h3>
                    <p className="text-muted-foreground">
                      Find specific moments in videos using simple, natural language queries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Efficient Storage</h3>
                    <p className="text-muted-foreground">
                      Secure and efficient storage of video content with easy access to historical searches.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Secure Platform</h3>
                    <p className="text-muted-foreground">
                      Enterprise-grade security with user authentication and data protection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-lg leading-relaxed">
                  We aim to make video content as searchable and accessible as text, enabling users 
                  to quickly find and analyze specific moments in video footage. Whether you're 
                  working with surveillance footage, educational content, or media archives, our 
                  platform provides the tools you need to work efficiently with video data.
                </p>
              </div>

              <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6">Meet the Team</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Abdul Jawwad */}
                  <Card className="border-border/50 bg-card/50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="h-24 w-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                          <User className="h-12 w-12 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Abdul Jawwad</h3>
                        <p className="text-muted-foreground mb-4">Co-Founder & Technical Lead</p>
                        <p className="text-sm text-muted-foreground">
                          Specializes in computer vision and deep learning architectures. 
                          Leads the development of our video analysis technology.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Akil Krishna */}
                  <Card className="border-border/50 bg-card/50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="h-24 w-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                          <User className="h-12 w-12 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Akil Krishna</h3>
                        <p className="text-muted-foreground mb-4">Co-Founder & Research Lead</p>
                        <p className="text-sm text-muted-foreground">
                          Expert in natural language processing and temporal grounding. 
                          Drives the research and innovation of our query understanding system.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Our team combines expertise in computer vision, natural language processing, 
                    and software engineering to build the future of video search technology.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
