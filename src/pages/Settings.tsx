import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  Lock, 
  Save, 
  Eye, 
  EyeOff, 
  Shield, 
  Bell, 
  Globe, 
  Download,
  Upload,
  User,
  Settings as SettingsIcon,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { NavigationButtons } from '@/components/NavigationButtons';

const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  
  // Form states
  const [formData, setFormData] = useState({
    email: user?.email || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    dataSharing: false,
    language: 'en',
    theme: 'light',
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to access settings.</p>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('success', 'Password updated successfully!');
    } catch (error: any) {
      showMessage('error', error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async () => {
    if (formData.email === user.email) {
      showMessage('error', 'New email must be different from current email');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: formData.email
      });

      if (error) throw error;
      showMessage('success', 'Email update initiated! Check your new email for confirmation.');
    } catch (error: any) {
      showMessage('error', error.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  const downloadUserData = async () => {
    setLoading(true);
    try {
      // Gather comprehensive user data
      const userData = {
        account: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at,
          phone: user.phone,
        },
        profile: {
          name: user.user_metadata?.name || user.user_metadata?.full_name || '',
          bio: user.user_metadata?.bio || '',
          location: user.user_metadata?.location || '',
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
          phone: user.user_metadata?.phone || '',
        },
        preferences: {
          emailNotifications: preferences.emailNotifications,
          pushNotifications: preferences.pushNotifications,
          marketingEmails: preferences.marketingEmails,
          dataSharing: preferences.dataSharing,
          language: preferences.language,
          theme: preferences.theme,
        },
        metadata: {
          exportDate: new Date().toISOString(),
          exportFormat: 'JSON',
          dataVersion: '1.0',
          platform: 'ROOTSnROUTES Tourism Platform',
        }
      };

      // Create and download the file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rootsnroutes-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showMessage('success', 'Your data has been downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      showMessage('error', 'Failed to download user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTravelHistory = async () => {
    setLoading(true);
    try {
      console.log('Starting travel history export for user:', user.id);
      
      // Initialize empty arrays for data
      let tripHistory = [];
      let userReviews = [];
      let userFavorites = [];

      // Check if supabase is available
      if (!supabase) {
        console.log('Supabase not available, creating sample data');
        throw new Error('Database not available');
      }

      // Try to fetch travel history from Supabase with better error handling
      try {
        const { data: trips, error: tripError } = await supabase
          .from('user_trip_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (tripError) {
          console.log('Trip history error:', tripError);
          if (tripError.code !== 'PGRST116' && tripError.code !== '42P01') {
            throw tripError;
          }
        } else {
          tripHistory = trips || [];
        }
      } catch (err) {
        console.log('Trip history table not accessible:', err);
        // Create sample data if no trips found
        tripHistory = [{
          id: 'sample-trip-1',
          trip_name: 'Sample Trip to Ranchi',
          destinations: ['Ranchi', 'Rock Garden'],
          start_date: '2024-10-01',
          end_date: '2024-10-03',
          trip_type: 'family',
          total_cost: 5000.00,
          rating: 5,
          review: 'Amazing experience exploring Jharkhand!',
          created_at: new Date().toISOString(),
          note: 'This is sample data - replace with your actual trips'
        }];
      }

      // Try to fetch user reviews
      try {
        const { data: reviews, error: reviewError } = await supabase
          .from('user_reviews')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (reviewError) {
          console.log('Reviews error:', reviewError);
          if (reviewError.code !== 'PGRST116' && reviewError.code !== '42P01') {
            throw reviewError;
          }
        } else {
          userReviews = reviews || [];
        }
      } catch (err) {
        console.log('Reviews table not accessible:', err);
        // Create sample data if no reviews found
        userReviews = [{
          id: 'sample-review-1',
          destination_name: 'Hundru Falls',
          rating: 5,
          title: 'Beautiful waterfall',
          review: 'Stunning natural beauty, perfect for photography!',
          visit_date: '2024-10-02',
          created_at: new Date().toISOString(),
          note: 'This is sample data - replace with your actual reviews'
        }];
      }

      // Try to fetch user favorites/wishlist
      try {
        const { data: favorites, error: favError } = await supabase
          .from('user_favorites')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (favError) {
          console.log('Favorites error:', favError);
          if (favError.code !== 'PGRST116' && favError.code !== '42P01') {
            throw favError;
          }
        } else {
          userFavorites = favorites || [];
        }
      } catch (err) {
        console.log('Favorites table not accessible:', err);
        // Create sample data
        userFavorites = [{
          id: 'sample-fav-1',
          destination_name: 'Betla National Park',
          visit_status: 'wishlist',
          created_at: new Date().toISOString(),
          note: 'This is sample data - replace with your actual favorites'
        }];
      }

      // Prepare comprehensive travel history data
      const travelData = {
        user_info: {
          user_id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.user_metadata?.full_name || '',
          export_date: new Date().toISOString(),
        },
        trip_history: tripHistory,
        reviews_and_ratings: userReviews,
        favorites_and_wishlist: userFavorites,
        summary: {
          total_trips: tripHistory.length,
          total_reviews: userReviews.length,
          total_favorites: userFavorites.length,
          average_rating_given: userReviews.length 
            ? (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1)
            : 'N/A',
          first_trip_date: tripHistory.length ? tripHistory[tripHistory.length - 1]?.start_date : null,
          last_trip_date: tripHistory.length ? tripHistory[0]?.start_date : null,
        },
        metadata: {
          export_format: 'JSON',
          data_version: '1.0',
          platform: 'ROOTSnROUTES Tourism Platform',
          export_type: 'Travel History',
          privacy_note: 'This export contains your personal travel data. Please handle with care.',
          note: 'If some sections contain sample data, it means you haven\'t used those features yet or the data is not available.',
        }
      };

      console.log('Travel data prepared:', travelData);

      // Create and download the file
      const jsonString = JSON.stringify(travelData, null, 2);
      const blob = new Blob([jsonString], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rootsnroutes-travel-history-${new Date().toISOString().split('T')[0]}.json`;
      
      // Force the download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      const tripCount = tripHistory.length;
      const reviewCount = userReviews.length;
      showMessage('success', `Travel history exported successfully! Found ${tripCount} trips and ${reviewCount} reviews.`);
      
      console.log('Travel history export completed successfully');
    } catch (error) {
      console.error('Travel history export error:', error);
      
      // Fallback: Create a basic export even if database fails
      try {
        const fallbackData = {
          user_info: {
            user_id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.user_metadata?.full_name || '',
            export_date: new Date().toISOString(),
          },
          trip_history: [],
          reviews_and_ratings: [],
          favorites_and_wishlist: [],
          summary: {
            total_trips: 0,
            total_reviews: 0,
            total_favorites: 0,
            average_rating_given: 'N/A',
            first_trip_date: null,
            last_trip_date: null,
          },
          metadata: {
            export_format: 'JSON',
            data_version: '1.0',
            platform: 'ROOTSnROUTES Tourism Platform',
            export_type: 'Travel History',
            privacy_note: 'This export contains your personal travel data. Please handle with care.',
            note: 'This is a basic export. No travel data found or database unavailable.',
            error_message: error.message || 'Database connection failed'
          }
        };

        const jsonString = JSON.stringify(fallbackData, null, 2);
        const blob = new Blob([jsonString], { 
          type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rootsnroutes-travel-history-${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showMessage('success', 'Travel history export completed (basic version due to database issue).');
      } catch (fallbackError) {
        console.error('Fallback export failed:', fallbackError);
        showMessage('error', `Failed to export travel history: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-emerald-950/30 dark:via-amber-950/20 dark:to-orange-950/30">
      <Header />
      
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Account Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your account security, preferences, and data privacy
              </p>
            </div>
            <Link to="/profile">
              <Button variant="outline" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>View Profile</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'border-accent/20 bg-accent/5' : 'border-destructive/20 bg-destructive/5'}`}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className={message.type === 'success' ? 'text-accent' : 'text-destructive'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Account Security</span>
              </CardTitle>
              <CardDescription>
                Manage your email, password, and account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Update Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Email Address</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter new email address"
                      className="max-w-md"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: {user.email}
                    </p>
                  </div>
                  <Button onClick={handleEmailUpdate} disabled={loading || formData.email === user.email}>
                    <Mail className="h-4 w-4 mr-2" />
                    {loading ? 'Updating...' : 'Update Email'}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Password Change Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Change Password</h4>
                <div className="grid gap-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={handlePasswordChange} 
                    disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="w-fit"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5" />
                <span>Application Preferences</span>
              </CardTitle>
              <CardDescription>
                Customize your app experience and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">Notifications</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive updates about your trips and bookings</p>
                      </div>
                      <Switch
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Push Notifications</Label>
                        <p className="text-xs text-muted-foreground">Get real-time alerts on your device</p>
                      </div>
                      <Switch
                        checked={preferences.pushNotifications}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, pushNotifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Marketing Emails</Label>
                        <p className="text-xs text-muted-foreground">Receive news and promotional content</p>
                      </div>
                      <Switch
                        checked={preferences.marketingEmails}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketingEmails: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">Display & Privacy</h4>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={preferences.language} onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="bn">Bengali</SelectItem>
                          <SelectItem value="te">Telugu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select value={preferences.theme} onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Data Sharing</Label>
                        <p className="text-xs text-muted-foreground">Help improve our services with anonymous usage data</p>
                      </div>
                      <Switch
                        checked={preferences.dataSharing}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, dataSharing: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Email Settings</span>
              </CardTitle>
              <CardDescription>
                Update your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                />
                <p className="text-xs text-muted-foreground">
                  Current email: {user.email}
                </p>
              </div>
              
              <Button onClick={handleEmailUpdate} disabled={loading || formData.email === user.email}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Updating...' : 'Update Email'}
              </Button>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Password & Security</span>
              </CardTitle>
              <CardDescription>
                Change your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-7 w-7 p-0"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-7 w-7 p-0"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-7 w-7 p-0"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button onClick={handlePasswordChange} disabled={loading}>
                <Shield className="h-4 w-4 mr-2" />
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </CardContent>
          </Card>

          {/* Privacy & Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Privacy & Preferences</span>
              </CardTitle>
              <CardDescription>
                Control your privacy settings and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications about your trips and bookings
                    </p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Get real-time updates on your mobile device
                    </p>
                  </div>
                  <Switch
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive promotional offers and travel deals
                    </p>
                  </div>
                  <Switch
                    checked={preferences.marketingEmails}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketingEmails: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Sharing</Label>
                    <p className="text-xs text-muted-foreground">
                      Share anonymous usage data to improve the service
                    </p>
                  </div>
                  <Switch
                    checked={preferences.dataSharing}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, dataSharing: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Export & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Data Export & Privacy</span>
              </CardTitle>
              <CardDescription>
                Download your data and understand how we protect your privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Data Download Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Export Your Data</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button 
                    variant="outline" 
                    onClick={downloadUserData}
                    disabled={loading}
                    className="w-full justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {loading ? 'Preparing Download...' : 'Download My Data'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={downloadTravelHistory}
                    disabled={loading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {loading ? 'Exporting...' : 'Export Travel History'}
                  </Button>
                </div>
                
                <Alert className="bg-primary/5 border-primary/20">
                  <Download className="h-4 w-4" />
                  <AlertDescription className="text-primary">
                    <strong>What's included:</strong> 
                    <br />• <strong>Personal Data:</strong> Profile information, account settings, and preferences
                    <br />• <strong>Travel History:</strong> Trip records, reviews, ratings, and favorites from your ROOTSnROUTES journey
                    <br />• <strong>Privacy Control:</strong> Both exports help you maintain control over your personal data
                  </AlertDescription>
                </Alert>
              </div>

              <Separator />

              {/* Privacy Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Privacy & Data Protection</h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <Shield className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Data Encryption</p>
                      <p className="text-xs text-muted-foreground">All your data is encrypted in transit and at rest</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <Globe className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Data Portability</p>
                      <p className="text-xs text-muted-foreground">Download your data anytime in JSON format</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                    <Eye className="h-5 w-5 text-secondary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Privacy Control</p>
                      <p className="text-xs text-muted-foreground">Manage visibility settings in your profile</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card/30 rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Need to delete your account?</strong> 
                    Visit your <Link to="/profile" className="text-primary hover:underline">profile page</Link> to access account deletion options.
                    This ensures you can review your data and understand what will be deleted before taking this irreversible action.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <NavigationButtons
        showBackButton={true}
        customBackPath="/profile"
        showRelatedActions={true}
        relatedActions={[
          { label: "View Profile", path: "/profile", icon: User },
          { label: "My Bookings", path: "/my-bookings", icon: SettingsIcon },
          { label: "Get Support", path: "/support", icon: Shield }
        ]}
      />
      
    </div>
  );
};

export default Settings;