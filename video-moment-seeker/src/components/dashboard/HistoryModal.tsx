import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Search, Calendar, ArrowUpDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface HistoryItem {
  id: string;
  created_at: string;
  user_id: string;
  query_text: string;
  video_filename: string;
  pdf_filename: string | null;
  results: {
    startTime: number;
    endTime: number;
    confidence: number;
  }[];
}

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ open, onClose, onSelectQuery }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof HistoryItem>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (open) {
      fetchHistory();
    }
  }, [open, page, sortField, sortDirection]);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch history with pagination
      const { data: historyData, error: historyError, count } = await supabase
        .from('history')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order(sortField, { ascending: sortDirection === 'asc' })
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

      if (historyError) throw historyError;

      setHistory(historyData || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSort = (field: keyof HistoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredHistory = history.filter(item => 
    item.query_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.video_filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getBestResult = (results: HistoryItem['results']) => {
    return results.reduce((best, current) => 
      current.confidence > (best?.confidence || 0) ? current : best
    , results[0]);
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
              placeholder="Search queries or video names..."
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
                    onClick={() => toggleSort("query_text")}
                    className="flex items-center gap-1 -ml-3 h-8"
                  >
                    Query
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Video</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
                <TableHead className="text-right">Time Segment</TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleSort("created_at")}
                    className="flex items-center gap-1 -ml-3 h-8"
                  >
                    Date
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredHistory.length > 0 ? (
                filteredHistory.map((item) => {
                  const bestResult = getBestResult(item.results);
                  return (
                    <TableRow 
                      key={item.id}
                      className="cursor-pointer hover:bg-secondary/50"
                      onClick={() => onSelectQuery(item.query_text)}
                    >
                      <TableCell className="font-medium">{item.query_text}</TableCell>
                      <TableCell>{item.video_filename}</TableCell>
                      <TableCell className="text-right">
                        <span 
                          className={`px-2 py-1 rounded-full text-xs ${
                            bestResult.confidence > 0.8 
                              ? 'bg-green-500/20 text-green-400' 
                              : bestResult.confidence > 0.5 
                                ? 'bg-yellow-500/20 text-yellow-400' 
                                : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {(bestResult.confidence * 100).toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatTime(bestResult.startTime)} - {formatTime(bestResult.endTime)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No history items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="py-2 px-3 text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal;
