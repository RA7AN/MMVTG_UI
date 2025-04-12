import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label, ReferenceArea } from "recharts";
import { BarChart2, Info, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { scaleUp } from "@/lib/animations";

interface Result {
  startTime: number;
  endTime: number;
  confidence: number;
}

interface ResultVisualizationProps {
  results: Result[];
  videoLength: number;
  currentTime?: number;
  onPlayClip?: (startTime: number, endTime: number) => void;
  onTimeClick: (time: number) => void;
}

const ResultVisualization: React.FC<ResultVisualizationProps> = ({ 
  results, 
  videoLength,
  currentTime,
  onPlayClip,
  onTimeClick
}) => {
  // Sort results by confidence
  const sortedResults = useMemo(() => 
    [...results].sort((a, b) => b.confidence - a.confidence), 
    [results]
  );

  const handlePlayClip = (startTime: number, endTime: number) => {
    if (onPlayClip) {
      onPlayClip(startTime, endTime);
    }
  };

  // Generate data points for the timeline
  const [chartData, setChartData] = useState<{ time: number; confidence: number }[]>([]);

  useEffect(() => {
    // Generate a smoothed confidence curve
    const resolution = 200; // Number of points in the graph
    const timeStep = videoLength / resolution;
    
    const data = [];
    for (let i = 0; i < resolution; i++) {
      const time = i * timeStep;
      
      // Calculate confidence at this time point (max of all overlapping segments)
      let maxConfidence = 0;
      for (const result of results) {
        if (time >= result.startTime && time <= result.endTime) {
          maxConfidence = Math.max(maxConfidence, result.confidence);
        }
      }
      
      data.push({
        time,
        confidence: maxConfidence
      });
    }
    
    setChartData(data);
  }, [results, videoLength]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {results.length > 0 && (
        <motion.div
          variants={scaleUp}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5" />
                  Confidence Visualization
                </CardTitle>
                {sortedResults.length > 0 && (
                  <Button
                    onClick={() => handlePlayClip(sortedResults[0].startTime, sortedResults[0].endTime)}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Play Best Match
                  </Button>
                )}
              </div>
              <CardDescription>
                Timeline showing prediction confidence levels for each moment
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 5, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={formatTime}
                      domain={[0, videoLength]}
                      type="number"
                    >
                      <Label value="Time (mm:ss)" offset={-10} position="insideBottom" />
                    </XAxis>
                    <YAxis 
                      domain={[0, 1]} 
                      tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    >
                      <Label value="Confidence" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                    </YAxis>
                    <Tooltip 
                      formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Confidence']}
                      labelFormatter={(label: number) => `Time: ${formatTime(label)}`}
                      contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: 'none', borderRadius: '8px' }}
                    />
                    
                    {/* Reference areas for the prediction segments */}
                    {results.map((result, index) => (
                      <ReferenceArea 
                        key={index}
                        x1={result.startTime} 
                        x2={result.endTime}
                        y1={0}
                        y2={1}
                        fill="#10B981"
                        fillOpacity={0.15}
                        strokeOpacity={0}
                      />
                    ))}
                    
                    {/* Current time line if provided */}
                    {currentTime !== undefined && (
                      <ReferenceLine 
                        x={currentTime} 
                        stroke="#6366F1" 
                        strokeWidth={2} 
                        strokeDasharray="3 3"
                      >
                        <Label 
                          value="Current" 
                          position="top" 
                          fill="#6366F1"
                        />
                      </ReferenceLine>
                    )}
                    
                    {/* Confidence line */}
                    <Line 
                      type="monotone" 
                      dataKey="confidence" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: "#10B981" }}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Top predictions list */}
              <div className="p-4 border-t border-border bg-card/60">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Top Predictions:
                </h3>
                <ul className="space-y-2">
                  {sortedResults.slice(0, 3).map((result, index) => (
                    <li key={index} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="inline-block w-5 h-5 rounded-full bg-green-500/20 text-xs flex items-center justify-center border border-green-500/30">
                          {index + 1}
                        </span>
                        {formatTime(result.startTime)} - {formatTime(result.endTime)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full text-xs">
                          {(result.confidence * 100).toFixed(1)}%
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handlePlayClip(result.startTime, result.endTime)}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultVisualization;
