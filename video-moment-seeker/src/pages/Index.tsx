import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Video, Search, Database, Clock } from "lucide-react";
import { Navbar } from "@/components/dashboard/Navbar";
import { motion } from "framer-motion";
import { fadeIn, slideUp, staggerContainer } from "@/lib/animations";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <Navbar />
      <motion.main
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
        className="flex-1 container mx-auto px-4 py-16"
      >
        <div className="text-center space-y-8">
          <motion.div 
            className="max-w-4xl mx-auto"
            variants={slideUp}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-extrabold mb-2 bg-gradient-to-r from-primary to-blue-400 text-transparent bg-clip-text text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              MMVTG
            </motion.h1>
            <motion.h2 
              className="text-3xl md:text-4xl font-medium mb-6 text-white text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Find Exactly What You Need in Any Video
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Upload surveillance videos, ask questions in natural language, and receive
              precisely timestamped video segments with confidence visualizations.
            </motion.p>
            
            <motion.div 
              className="flex justify-center gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button 
                size="lg"
                onClick={() => navigate("/login")}
                className="px-8 py-6 text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="px-8 py-6 text-lg"
              >
                Go to Dashboard
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 mt-16"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              {
                icon: <Video className="h-6 w-6 text-primary" />,
                title: "Video Upload",
                description: "Upload surveillance videos in popular formats and get instant previews."
              },
              {
                icon: <Search className="h-6 w-6 text-primary" />,
                title: "Natural Language Queries",
                description: "Ask questions about video content in plain English and get precise timestamps."
              },
              {
                icon: <Clock className="h-6 w-6 text-primary" />,
                title: "Search History",
                description: "Save and review your past video queries with comprehensive results."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-card/40 p-6 rounded-lg border border-border/50 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-card/60 hover:border-primary/20"
                variants={slideUp}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-primary/10 p-3 rounded-full mb-4 transition-colors duration-300 group-hover:bg-primary/20">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.main>

      <motion.footer 
        className="container mx-auto px-4 py-6 border-t border-border/50 text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>© 2025 Video Temporal Grounding. All rights reserved.</p>
      </motion.footer>
    </div>
  );
}
