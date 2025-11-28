/**
 * Hook for authentication-protected booking functionality
 */
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLogin } from '@/contexts/LoginContext';
import { useToast } from '@/components/ui/use-toast';
import { createProtectedBookingHandler, defaultAuthRequiredHandler } from '@/utils/authProtectedBooking';
import { useLocation } from 'react-router-dom';

interface UseBookingProtectionOptions {
  redirectPath?: string;
  customAuthMessage?: {
    title: string;
    description: string;
  };
}

/**
 * Custom hook for protecting booking actions with authentication
 * @param options Configuration options
 * @returns Object with protected booking handler
 */
export const useBookingProtection = (options: UseBookingProtectionOptions = {}) => {
  const { user } = useAuth();
  const { showLogin } = useLogin();
  const { toast } = useToast();
  const location = useLocation();

  const showAuthRequiredToast = useCallback(() => {
    const message = options.customAuthMessage || {
      title: "Sign In Required",
      description: "Please sign in to make a booking. You'll be able to continue where you left off after signing in."
    };
    
    // Show the login modal with current path as return path
    const returnPath = options.redirectPath || location.pathname;
    showLogin(returnPath);
    
    // Also show a toast for better UX
    toast({
      title: message.title,
      description: message.description,
      variant: "default",
      duration: 4000
    });
  }, [toast, options.customAuthMessage, options.redirectPath, location.pathname, showLogin]);

  const protectedBookingHandler = useCallback(
    createProtectedBookingHandler(
      user,
      showAuthRequiredToast,
      (returnPath) => showLogin(returnPath)
    ),
    [user, showAuthRequiredToast, showLogin]
  );

  const handleProtectedBooking = useCallback(
    (onProceedWithBooking: () => void) => {
      protectedBookingHandler(onProceedWithBooking, options.redirectPath);
    },
    [protectedBookingHandler, options.redirectPath]
  );

  return {
    isAuthenticated: !!user,
    handleProtectedBooking,
    user
  };
};