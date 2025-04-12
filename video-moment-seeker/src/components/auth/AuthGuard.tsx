import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard; 