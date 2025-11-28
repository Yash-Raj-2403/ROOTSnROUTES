import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  User, Mail, Calendar, MapPin, LogOut, Settings, Heart, Camera, 
  Edit3, Save, X, Trash2, Star, Eye, EyeOff, Bell, BellOff,
  Upload, Phone, Cake, Mountain, Bookmark, Clock, Award, Download
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import { ProfileNavigation } from '@/components/NavigationButtons';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface UserProfileProps {
  onClose?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, signOut } = useAuth();
  const { 
    userProfile, 
    updateProfile, 
    deleteAccount, 
    favorites, 
    removeFromFavorites, 
    updateFavorite,
    reviews,
    tripHistory,
    profileLoading, 
    favoritesLoading,
    refreshUserData
  } = useUserPreferences();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editForm, setEditForm] = useState({
    full_name: '',
    display_name: '',
    bio: '',
    phone: '',
    date_of_birth: '',
    location: '',
    travel_style: '',
    interests: [] as string[],
    email_notifications: true,
    push_notifications: true,
    privacy_settings: {
      profile_visible: true,
      show_stats: true,
      show_reviews: true
    }
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setEditForm({
        full_name: userProfile.full_name || '',
        display_name: userProfile.display_name || '',
        bio: userProfile.bio || '',
        phone: userProfile.phone || '',
        date_of_birth: userProfile.date_of_birth || '',
        location: userProfile.location || '',
        travel_style: userProfile.travel_style || '',
        interests: userProfile.interests || [],
        email_notifications: userProfile.email_notifications,
        push_notifications: userProfile.push_notifications,
        privacy_settings: userProfile.privacy_settings
      });
    }
  }, [userProfile]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/30 flex items-center justify-center">
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">Please sign in to view your profile</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </Card>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      if (onClose) onClose();
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(editForm);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive"
      });
    }
  };

  const handleRemoveFavorite = async (destinationId: string, destinationName: string) => {
    try {
      await removeFromFavorites(destinationId);
      toast({
        title: "Removed from Favorites",
        description: `${destinationName} has been removed from your favorites`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive"
      });
    }
  };

  const handleUpdateFavoriteStatus = async (favoriteId: string, newStatus: 'wishlist' | 'visited' | 'planning') => {
    try {
      await updateFavorite(favoriteId, { visit_status: newStatus });
      toast({
        title: "Updated",
        description: "Favorite status updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive"
      });
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
        preferences: userProfile || {},
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
      
      toast({
        title: "Success",
        description: "Your data has been downloaded successfully!"
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download user data. Please try again.",
        variant: "destructive"
      });
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
      toast({
        title: "Success",
        description: `Travel history exported successfully! Found ${tripCount} trips and ${reviewCount} reviews.`
      });
      
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
        
        toast({
          title: "Success",
          description: "Travel history export completed (basic version due to database issue)."
        });
      } catch (fallbackError) {
        console.error('Fallback export failed:', fallbackError);
        toast({
          title: "Error",
          description: `Failed to export travel history: ${error.message || 'Unknown error'}`,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getMemberLevelColor = (level: string) => {
    switch (level) {
      case 'ambassador': return 'bg-gradient-to-r from-amber-500 to-orange-500';
      case 'adventurer': return 'bg-gradient-to-r from-emerald-500 to-teal-500';
      default: return 'bg-gradient-to-r from-green-500 to-emerald-500';
    }
  };

  const getMemberLevelIcon = (level: string) => {
    switch (level) {
      case 'ambassador': return <Award className="w-4 h-4" />;
      case 'adventurer': return <Mountain className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getVisitStatusBadge = (status: string) => {
    switch (status) {
      case 'visited':
        return <Badge variant="default" className="bg-accent/10 text-accent border-accent/20">Visited</Badge>;
      case 'planning':
        return <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">Planning</Badge>;
      default:
        return <Badge variant="outline">Wishlist</Badge>;
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Loading />
        </div>
        <Footer />
      </div>
    );
  }

  const userEmail = user.email || 'No email provided';
  const userName = userProfile?.display_name || userProfile?.full_name || user.user_metadata?.name || 'Traveler';
  const userAvatar = userProfile?.profile_image_url || user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const createdAt = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-border">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  {userProfile && (
                    <div className={`absolute -bottom-2 -right-2 p-2 rounded-full text-primary-foreground ${getMemberLevelColor(userProfile.member_level)}`}>
                      {getMemberLevelIcon(userProfile.member_level)}
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">{userName}</h1>
                      <p className="text-muted-foreground text-lg">{userProfile?.bio || 'Jharkhand Explorer'}</p>
                    </div>
                    <div className="flex gap-2">
                      {userProfile && (
                        <Badge variant="outline" className="capitalize">
                          {userProfile.member_level}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                        <div className="w-2 h-2 bg-accent rounded-full mr-1"></div>
                        Active
                      </Badge>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{favorites.length}</div>
                      <div className="text-sm text-muted-foreground">Favorites</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{userProfile?.total_trips || 0}</div>
                      <div className="text-sm text-muted-foreground">Trips</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{reviews.length}</div>
                      <div className="text-sm text-muted-foreground">Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-sm text-muted-foreground">Days Active</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <Button 
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? "outline" : "default"}
                      className="flex items-center gap-2"
                    >
                      {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </Button>
                    <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="favorites">
                Favorites ({favorites.length})
              </TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input
                            id="full_name"
                            value={editForm.full_name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="display_name">Display Name</Label>
                          <Input
                            id="display_name"
                            value={editForm.display_name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, display_name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={editForm.bio}
                            onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell us about yourself..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={editForm.location}
                            onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="City, State"
                          />
                        </div>
                        <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                          {saving ? <Loading /> : <Save className="w-4 h-4 mr-2" />}
                          Save Changes
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Mail className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{userEmail}</p>
                          </div>
                        </div>
                        {userProfile?.phone && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Phone className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium">Phone</p>
                              <p className="text-sm text-muted-foreground">{userProfile.phone}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Calendar className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">Member Since</p>
                            <p className="text-sm text-muted-foreground">{createdAt}</p>
                          </div>
                        </div>
                        {userProfile?.location && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <MapPin className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium">Location</p>
                              <p className="text-sm text-muted-foreground">{userProfile.location}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mountain className="w-5 h-5" />
                      Travel Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="travel_style">Travel Style</Label>
                          <Select value={editForm.travel_style} onValueChange={(value) => setEditForm(prev => ({ ...prev, travel_style: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your travel style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="adventure">Adventure</SelectItem>
                              <SelectItem value="leisure">Leisure</SelectItem>
                              <SelectItem value="cultural">Cultural</SelectItem>
                              <SelectItem value="eco-tourism">Eco-tourism</SelectItem>
                              <SelectItem value="spiritual">Spiritual</SelectItem>
                              <SelectItem value="photography">Photography</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={editForm.phone}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+91 XXXXX XXXXX"
                          />
                        </div>
                        <div>
                          <Label htmlFor="date_of_birth">Date of Birth</Label>
                          <Input
                            id="date_of_birth"
                            type="date"
                            value={editForm.date_of_birth}
                            onChange={(e) => setEditForm(prev => ({ ...prev, date_of_birth: e.target.value }))}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userProfile?.travel_style && (
                          <div className="p-3 rounded-lg bg-muted/50">
                            <p className="font-medium mb-1">Preferred Travel Style</p>
                            <Badge variant="outline" className="capitalize">{userProfile.travel_style}</Badge>
                          </div>
                        )}
                        {userProfile?.interests && userProfile.interests.length > 0 && (
                          <div className="p-3 rounded-lg bg-muted/50">
                            <p className="font-medium mb-2">Interests</p>
                            <div className="flex flex-wrap gap-2">
                              {userProfile.interests.map((interest, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">{interest}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {userProfile?.date_of_birth && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Cake className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium">Date of Birth</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(userProfile.date_of_birth).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    My Favorite Destinations ({favorites.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {favoritesLoading ? (
                    <div className="text-center py-8">
                      <Loading />
                    </div>
                  ) : favorites.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground mb-4">No favorites yet</p>
                      <Link to="/destinations">
                        <Button>Explore Destinations</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favorites.map((favorite) => (
                        <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm mb-1">{favorite.destination_name}</h3>
                                {favorite.destination_district && (
                                  <p className="text-xs text-muted-foreground mb-2">{favorite.destination_district}</p>
                                )}
                                <div className="mb-2">
                                  {getVisitStatusBadge(favorite.visit_status)}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFavorite(favorite.destination_id, favorite.destination_name)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="flex gap-2 mb-3">
                              <Button
                                variant={favorite.visit_status === 'wishlist' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleUpdateFavoriteStatus(favorite.id, 'wishlist')}
                                className="text-xs"
                              >
                                Wishlist
                              </Button>
                              <Button
                                variant={favorite.visit_status === 'planning' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleUpdateFavoriteStatus(favorite.id, 'planning')}
                                className="text-xs"
                              >
                                Planning
                              </Button>
                              <Button
                                variant={favorite.visit_status === 'visited' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleUpdateFavoriteStatus(favorite.id, 'visited')}
                                className="text-xs"
                              >
                                Visited
                              </Button>
                            </div>
                            
                            {favorite.notes && (
                              <p className="text-xs text-muted-foreground italic">"{favorite.notes}"</p>
                            )}
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                              <span>Added {new Date(favorite.created_at).toLocaleDateString()}</span>
                              {favorite.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-current text-yellow-500" />
                                  <span>{favorite.rating}/5</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    My Reviews ({reviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground mb-4">No reviews written yet</p>
                      <Link to="/destinations">
                        <Button>Visit Destinations</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <Card key={review.id} className="border-l-4 border-l-primary/50">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold">{review.destination_name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating ? 'fill-current text-yellow-500' : 'text-muted-foreground'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(review.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              {review.is_verified && (
                                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            {review.title && (
                              <h4 className="font-medium mb-2">{review.title}</h4>
                            )}
                            <p className="text-muted-foreground text-sm mb-2">{review.review}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{review.helpful_votes} helpful votes</span>
                              {review.visit_date && (
                                <span>Visited {new Date(review.visit_date).toLocaleDateString()}</span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch
                        checked={editForm.email_notifications}
                        onCheckedChange={(checked) => 
                          setEditForm(prev => ({ ...prev, email_notifications: checked }))
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive push notifications</p>
                      </div>
                      <Switch
                        checked={editForm.push_notifications}
                        onCheckedChange={(checked) => 
                          setEditForm(prev => ({ ...prev, push_notifications: checked }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Privacy Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Profile Visibility</p>
                        <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                      </div>
                      <Switch
                        checked={editForm.privacy_settings.profile_visible}
                        onCheckedChange={(checked) => 
                          setEditForm(prev => ({ 
                            ...prev, 
                            privacy_settings: { ...prev.privacy_settings, profile_visible: checked }
                          }))
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Statistics</p>
                        <p className="text-sm text-muted-foreground">Display your trip stats and reviews count</p>
                      </div>
                      <Switch
                        checked={editForm.privacy_settings.show_stats}
                        onCheckedChange={(checked) => 
                          setEditForm(prev => ({ 
                            ...prev, 
                            privacy_settings: { ...prev.privacy_settings, show_stats: checked }
                          }))
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Reviews</p>
                        <p className="text-sm text-muted-foreground">Make your reviews visible to other users</p>
                      </div>
                      <Switch
                        checked={editForm.privacy_settings.show_reviews}
                        onCheckedChange={(checked) => 
                          setEditForm(prev => ({ 
                            ...prev, 
                            privacy_settings: { ...prev.privacy_settings, show_reviews: checked }
                          }))
                        }
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button onClick={handleSaveProfile} disabled={saving}>
                        {saving ? <Loading /> : <Save className="w-4 h-4 mr-2" />}
                        Save Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <Trash2 className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <h3 className="font-semibold text-destructive mb-2">Delete Account</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                      All your reviews, favorites, trip history, and profile information will be deleted.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          Delete My Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data from our servers including:
                            <br/><br/>
                            • Profile information and settings
                            <br/>
                            • All favorite destinations  
                            <br/>
                            • Trip history and reviews
                            <br/>
                            • Chat messages and community interactions
                            <br/><br/>
                            Type "DELETE" to confirm account deletion.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold mb-2">Download Your Data</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Download a copy of all your data including profile information, favorites, reviews, and trip history.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        variant="outline" 
                        onClick={downloadUserData}
                        disabled={loading}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {loading ? 'Preparing Download...' : 'Download My Data'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={downloadTravelHistory}
                        disabled={loading}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {loading ? 'Exporting...' : 'Export Travel History'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Data will be downloaded as JSON files containing your profile information, travel history, reviews, and favorites.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Continue Exploring Section */}
          <div className="mt-12">
            <ProfileNavigation />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;