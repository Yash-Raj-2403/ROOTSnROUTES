/**
 * Authentication-protected booking utility
 * Handles booking attempts for unauthenticated users by redirecting to login
 */
import { User } from '@supabase/supabase-js';

interface BookingProtectionOptions {
  user: User | null;
  onRequireAuth: () => void;
  onProceedWithBooking: () => void;
  showLoginModal?: (returnPath?: string) => void;
  currentPath?: string;
}

/**
 * Protects booking actions by checking authentication
 * @param options Configuration options for booking protection
 * @returns boolean indicating if booking should proceed
 */
export const protectBookingAction = ({
  user,
  onRequireAuth,
  onProceedWithBooking,
  showLoginModal,
  currentPath
}: BookingProtectionOptions): boolean => {
  if (!user) {
    // User is not authenticated
    if (showLoginModal) {
      // Show login modal with return path
      showLoginModal(currentPath);
    } else {
      // Fallback to custom auth required handler
      onRequireAuth();
    }
    return false;
  }
  
  // User is authenticated, proceed with booking
  onProceedWithBooking();
  return true;
};

/**
 * Creates a protected booking handler
 * @param user Current user from auth context
 * @param onRequireAuth Callback when authentication is required
 * @param showLoginModal Function to show login modal
 * @returns Protected booking handler function
 */
export const createProtectedBookingHandler = (
  user: User | null,
  onRequireAuth: () => void,
  showLoginModal?: (returnPath?: string) => void
) => {
  return (onProceedWithBooking: () => void, currentPath?: string) => {
    return protectBookingAction({
      user,
      onRequireAuth,
      onProceedWithBooking,
      showLoginModal,
      currentPath
    });
  };
};

/**
 * Default authentication required handler
 * Shows a user-friendly message instead of 404 error
 */
export const defaultAuthRequiredHandler = (
  showToast?: (message: { title: string; description: string; variant?: string }) => void
) => {
  if (showToast) {
    showToast({
      title: "Sign In Required",
      description: "Please sign in to make a booking. You'll be redirected to continue your booking after signing in.",
      variant: "destructive"
    });
  } else {
    alert("Please sign in to make a booking");
  }
};