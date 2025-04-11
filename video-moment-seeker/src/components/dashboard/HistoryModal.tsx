
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Search, Calendar, ArrowUpDown } from "lucide-react";

// Mock history data type
interface HistoryItem {
  id: string;
  query: string;
  videoName: string;
  confidence: number;
  startTime: number;
  endTime: number;
  date: Date;
}

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ open, onClose, onSelectQuery }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof HistoryItem>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Mock history data
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "1",
      query: "Show when the person enters through the door",
      videoName: "surveillance_cam1.mp4",
      confidence: 0.9845,
      startTime: 105.47,
      endTime: 117.15,
      date: new Date(2023, 3, 15, 14, 30)
    },
    {
      id: "2",
      query: "When does the car park in the lot?",
      videoName: "parking_lot.mp4",
      confidence: 0.8723,
      startTime: 45.32,
      endTime: 58.17,
      date: new Date(2023, 3, 14, 9, 15)
    },
    {
      id: "3",
      query: "Show the moment when people are gathered in a group",
      videoName: "office_meeting.mp4",
      confidence: 0.7654,
      startTime: 320.11,
      endTime: 390.45,
      date: new Date(2023, 3, 10, 11, 45)
    }
  ]);

  const toggleSort = (field: keyof HistoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredHistory = history.filter(item => 
    item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.videoName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Query History
          </DialogTitle>
          <DialogDescription>
            Your past video queries and their results
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="w-[40%]">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleSort("query")}
                    className="flex items-center gap-1 -ml-3 h-8"
                  >
                    Query
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleSort("videoName")}
                    className="flex items-center gap-1 -ml-3 h-8"
                  >
                    Video
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleSort("confidence")}
                    className="flex items-center gap-1 -ml-3 h-8"
                  >
                    Confidence
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Time Segment</TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleSort("date")}
                    className="flex items-center gap-1 -ml-3 h-8"
                  >
                    Date
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHistory.length > 0 ? (
                sortedHistory.map((item) => (
                  <TableRow 
                    key={item.id}
                    className="cursor-pointer hover:bg-secondary/50"
                    onClick={() => onSelectQuery(item.query)}
                  >
                    <TableCell className="font-medium">{item.query}</TableCell>
                    <TableCell>{item.videoName}</TableCell>
                    <TableCell className="text-right">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.confidence > 0.8 
                            ? 'bg-green-500/20 text-green-400' 
                            : item.confidence > 0.5 
                              ? 'bg-yellow-500/20 text-yellow-400' 
                              : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {(item.confidence * 100).toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatTime(item.startTime)} - {formatTime(item.endTime)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No history items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal;
