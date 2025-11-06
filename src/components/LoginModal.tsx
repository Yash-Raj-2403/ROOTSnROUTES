import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Eye, EyeOff, Mail, Lock, User, Chrome, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    userType: "traveller" // Default to traveller
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, signUp, signInWithGoogle } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null);

  // Simple announce function
  const announce = useCallback((message: string) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message;
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
      userType: "traveller"
    });
    setError("");
  };

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose]);

  // Focus management - disabled focus trap to prevent input interference
  useEffect(() => {
    if (isOpen) {
      // Just announce the dialog state without trapping focus
      announce(`${isLogin ? 'Login' : 'Sign up'} dialog opened`);
    }
  }, [isOpen, isLogin, announce]);

  // Announce form mode changes
  useEffect(() => {
    if (isOpen) {
      announce(`Switched to ${isLogin ? 'login' : 'sign up'} form`);
    }
  }, [isLogin, isOpen, announce]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return false;
    }

    if (!isLogin) {
      if (!formData.name || !formData.phone) {
        setError("All fields are required for registration");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        onClose();
        resetForm();
      } else {
        const metadata = {
          name: formData.name,
          phone: formData.phone,
          userType: formData.userType as 'traveller' | 'admin'
        };
        console.log('Attempting sign up with metadata:', metadata); // Debug log
        await signUp(formData.email, formData.password, metadata);
        // For sign up, show success message but keep modal open for email confirmation info
        setError("✅ Success! Please check your email for a confirmation link to complete your registration.");
      }
    } catch (err: unknown) {
      console.error('Form submission error:', err); // Debug log
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      await signInWithGoogle();
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Google sign in failed";
      setError(errorMessage);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <>
      {/* ARIA Live Region for announcements */}
      <div 
        ref={announcementRef}
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      />
      
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent 
          ref={modalRef}
          className="sm:max-w-sm w-full max-h-[90vh] bg-card/95 backdrop-blur-sm border shadow-2xl [&>button.absolute.right-4.top-4]:hidden overflow-hidden flex flex-col"
          aria-labelledby="login-title"
          aria-describedby="login-description"
        >
          <DialogHeader className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-8 w-8 p-0 hover:bg-muted z-10"
              onClick={handleClose}
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DialogHeader>

          <Card className="border-0 shadow-none bg-transparent flex flex-col min-h-0">
            {/* Header */}
            <CardHeader className="space-y-1 pb-4 pt-2 flex-shrink-0">            
              <div className="text-center space-y-2">
                <CardTitle 
                  id="login-title"
                  className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  {isLogin ? "Welcome Back!" : "Join ROOTSnROUTES"}
                </CardTitle>
                <CardDescription 
                  id="login-description"
                  className="text-muted-foreground text-sm"
                >
                  {isLogin 
                    ? "Sign in to explore Jharkhand's hidden gems" 
                    : "Create your account to start your Jharkhand adventure"
                  }
                </CardDescription>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 max-h-[65vh] overflow-auto">
              <CardContent className="space-y-4 pb-6 px-6">
                {/* Scroll indicator for sign-up */}
                {!isLogin && (
                  <div className="text-center text-xs text-muted-foreground mb-3 p-2 bg-muted/30 rounded-lg">
                    📋 Fill out all fields below to create your account
                  </div>
                )}
                {/* Error/Success Message */}
                {error && (
                  <div 
                    id="error-message"
                    role="alert"
                    aria-live="assertive"
                    className={`p-3 text-sm rounded-lg ${
                      error.startsWith("✅")
                        ? "text-green-700 bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                        : "text-red-700 bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                    }`}
                  >
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                {/* Name Field (Sign Up Only) */}
                {!isLogin && (
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="name"
                      ref={firstInputRef}
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10"
                      required={!isLogin}
                      aria-required={!isLogin}
                      aria-describedby={error ? "error-message" : undefined}
                      aria-invalid={!!error}
                    />
                  </div>
                </div>
              )}

              {/* Phone Field (Sign Up Only) */}
              {!isLogin && (
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10"
                      required={!isLogin}
                      aria-required={!isLogin}
                      aria-describedby={error ? "error-message" : undefined}
                      aria-invalid={!!error}
                    />
                  </div>
                </div>
              )}

              {/* User Type Selection (Sign Up Only) */}
              {!isLogin && (
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Account Type</Label>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        id="user-type-traveller"
                        type="radio"
                        name="userType"
                        value="traveller"
                        checked={formData.userType === 'traveller'}
                        onChange={(e) => handleInputChange("userType", e.target.value)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        aria-describedby="user-type-help"
                        aria-label="Select Traveller account type"
                      />
                      <Label htmlFor="user-type-traveller" className="text-sm cursor-pointer">
                        Traveller
                      </Label>
                    </div>
                  </div>
                  <p id="user-type-help" className="text-xs text-muted-foreground">
                    Select your account type to access appropriate features
                  </p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="email"
                    ref={isLogin ? firstInputRef : undefined}
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10"
                    required
                    aria-required="true"
                    aria-describedby={error ? "error-message" : undefined}
                    aria-invalid={!!error}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10"
                    required
                    aria-required="true"
                    aria-describedby={error ? "error-message" : "password-help"}
                    aria-invalid={!!error}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-7 w-7 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    )}
                  </Button>
                </div>
                {!isLogin && (
                  <p id="password-help" className="text-xs text-muted-foreground">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>

              {/* Confirm Password Field (Sign Up Only) */}
              {!isLogin && (
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10"
                      required={!isLogin}
                      aria-required={!isLogin}
                      aria-describedby={error ? "error-message" : "confirm-password-help"}
                      aria-invalid={!!error}
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-7 w-7 p-0 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      aria-pressed={showConfirmPassword}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                  <p id="confirm-password-help" className="text-xs text-muted-foreground">
                    Please enter the same password again
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 h-10 transition-all duration-200"
                disabled={loading}
                aria-describedby={error ? "error-message" : undefined}
              >
                {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full hover:bg-muted h-10"
              onClick={handleGoogleSignIn}
              disabled={loading}
              aria-label="Continue with Google account"
            >
              <Chrome className="h-4 w-4 mr-2" aria-hidden="true" />
              Continue with Google
            </Button>

            {/* Toggle Mode */}
            <div className="text-center text-sm mt-3">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={toggleMode}
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                aria-label={isLogin ? "Switch to sign up form" : "Switch to sign in form"}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
                </CardContent>
              </ScrollArea>
            </Card>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default LoginModal;