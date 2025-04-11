
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Menu, User, LogOut, Info, Home } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("user");
    
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    
    navigate("/login");
  };

  const user = localStorage.getItem("user") 
    ? JSON.parse(localStorage.getItem("user") || "{}") 
    : null;

  return (
    <nav className="flex items-center justify-between p-4 bg-card/70 border-b border-border/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="mr-2"
        >
          <Home className="h-5 w-5" />
          <span className="sr-only">Home</span>
        </Button>
        <h1 className="text-xl font-bold">Video Temporal Grounding</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {user && (
            <>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="rounded-full bg-secondary flex items-center justify-center w-8 h-8">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="User avatar"
                      className="rounded-full w-8 h-8"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.name || user.email}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => navigate("/dashboard")}>
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/about")}>
            <Info className="mr-2 h-4 w-4" />
            <span>About</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default Navbar;
