import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, Search, Filter, MapPin, Calendar, Star, X, 
  Grid, List, SortAsc, SortDesc, Eye, Map, Clock, 
  Bookmark, Mountain, Camera, Trash2 
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import { ProfileNavigation } from '@/components/NavigationButtons';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Favorites = () => {
  const { user } = useAuth();
  const { 
    favorites, 
    removeFromFavorites, 
    updateFavorite, 
    favoritesLoading 
  } = useUserPreferences();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'wishlist' | 'visited' | 'planning'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'district'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');

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

  const handleUpdateStatus = async (favoriteId: string, newStatus: 'wishlist' | 'visited' | 'planning') => {
    try {
      await updateFavorite(favoriteId, { visit_status: newStatus });
      toast({
        title: "Updated",
        description: "Status updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  // Filter and sort favorites
  const filteredFavorites = favorites
    .filter(favorite => {
      const matchesSearch = favorite.destination_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (favorite.destination_district?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      const matchesStatus = filterStatus === 'all' || favorite.visit_status === filterStatus;
      const matchesType = filterType === 'all' || favorite.destination_type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.destination_name.localeCompare(b.destination_name);
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'district':
          comparison = (a.destination_district || '').localeCompare(b.destination_district || '');
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getStatusCounts = () => {
    return {
      all: favorites.length,
      wishlist: favorites.filter(f => f.visit_status === 'wishlist').length,
      planning: favorites.filter(f => f.visit_status === 'planning').length,
      visited: favorites.filter(f => f.visit_status === 'visited').length
    };
  };

  const getVisitStatusBadge = (status: string) => {
    switch (status) {
      case 'visited':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <Clock className="w-3 h-3 mr-1" />
          Visited
        </Badge>;
      case 'planning':
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
          <Calendar className="w-3 h-3 mr-1" />
          Planning
        </Badge>;
      default:
        return <Badge variant="outline">
          <Bookmark className="w-3 h-3 mr-1" />
          Wishlist
        </Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'visited': return <Clock className="w-4 h-4 text-green-600" />;
      case 'planning': return <Calendar className="w-4 h-4 text-emerald-600" />;
      default: return <Bookmark className="w-4 h-4 text-gray-600" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-24">
          <Card className="max-w-md mx-auto text-center p-8">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">Please sign in to view and manage your favorite destinations</p>
            <Button asChild>
              <Link to="/">Go to Home</Link>
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const statusCounts = getStatusCounts();
  const uniqueTypes = Array.from(new Set(favorites.map(f => f.destination_type).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
                  <Heart className="w-8 h-8 text-red-500" />
                  My Favorites
                </h1>
                <p className="text-muted-foreground text-lg mt-2">
                  Manage your saved destinations and travel plans
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {favorites.length} destinations saved
                </Badge>
                <Button variant="outline" asChild>
                  <Link to="/destinations">
                    <Search className="w-4 h-4 mr-2" />
                    Discover More
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-primary mb-1">{statusCounts.wishlist}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Bookmark className="w-4 h-4" />
                  Wishlist
                </div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-primary mb-1">{statusCounts.planning}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Planning
                </div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-primary mb-1">{statusCounts.visited}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  Visited
                </div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-primary mb-1">{uniqueTypes.length}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Mountain className="w-4 h-4" />
                  Categories
                </div>
              </Card>
            </div>
          </div>

          {/* Controls */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search destinations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                  <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                    <SelectTrigger className="w-36">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="wishlist">Wishlist</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="visited">Visited</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-36">
                      <Mountain className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {uniqueTypes.map(type => (
                        <SelectItem key={type} value={type!} className="capitalize">
                          {type?.replace('-', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                    const [sort, order] = value.split('-');
                    setSortBy(sort as any);
                    setSortOrder(order as any);
                  }}>
                    <SelectTrigger className="w-36">
                      {sortOrder === 'asc' ? <SortAsc className="w-4 h-4 mr-2" /> : <SortDesc className="w-4 h-4 mr-2" />}
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Newest First</SelectItem>
                      <SelectItem value="date-asc">Oldest First</SelectItem>
                      <SelectItem value="name-asc">Name A-Z</SelectItem>
                      <SelectItem value="name-desc">Name Z-A</SelectItem>
                      <SelectItem value="district-asc">District A-Z</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          {favoritesLoading ? (
            <div className="text-center py-12">
              <Loading />
            </div>
          ) : filteredFavorites.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                {favorites.length === 0 ? (
                  <>
                    <Heart className="w-24 h-24 text-muted-foreground mx-auto mb-6 opacity-30" />
                    <h2 className="text-3xl font-bold mb-4">No Favorites Yet</h2>
                    <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                      Start exploring Jharkhand's amazing destinations and save your favorites for easy access later.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild size="lg">
                        <Link to="/destinations">
                          <Search className="w-5 h-5 mr-2" />
                          Explore Destinations
                        </Link>
                      </Button>
                      <Button variant="outline" size="lg" asChild>
                        <Link to="/natural-wonders">
                          <Mountain className="w-5 h-5 mr-2" />
                          Natural Wonders
                        </Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h2 className="text-2xl font-bold mb-2">No matches found</h2>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <Button onClick={() => {
                      setSearchQuery('');
                      setFilterStatus('all');
                      setFilterType('all');
                    }}>
                      Clear Filters
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
            }>
              <AnimatePresence>
                {filteredFavorites.map((favorite, index) => (
                  <motion.div
                    key={favorite.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {viewMode === 'grid' ? (
                      // Grid View
                      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden">
                        <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-accent/10">
                          {favorite.destination_image_url ? (
                            <img 
                              src={favorite.destination_image_url} 
                              alt={favorite.destination_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Mountain className="w-12 h-12 text-muted-foreground opacity-50" />
                            </div>
                          )}
                          <div className="absolute top-3 right-3">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveFavorite(favorite.destination_id, favorite.destination_name)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="absolute top-3 left-3">
                            {getVisitStatusBadge(favorite.visit_status)}
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          <div className="mb-3">
                            <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                              {favorite.destination_name}
                            </h3>
                            {favorite.destination_district && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {favorite.destination_district}
                              </p>
                            )}
                          </div>

                          {favorite.notes && (
                            <p className="text-sm text-muted-foreground italic mb-3 line-clamp-2">
                              "{favorite.notes}"
                            </p>
                          )}

                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                            <span>Added {new Date(favorite.created_at).toLocaleDateString()}</span>
                            {favorite.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current text-yellow-500" />
                                <span>{favorite.rating}/5</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-1">
                            <Button
                              variant={favorite.visit_status === 'wishlist' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleUpdateStatus(favorite.id, 'wishlist')}
                              className="flex-1 text-xs"
                            >
                              Wishlist
                            </Button>
                            <Button
                              variant={favorite.visit_status === 'planning' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleUpdateStatus(favorite.id, 'planning')}
                              className="flex-1 text-xs"
                            >
                              Planning
                            </Button>
                            <Button
                              variant={favorite.visit_status === 'visited' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleUpdateStatus(favorite.id, 'visited')}
                              className="flex-1 text-xs"
                            >
                              Visited
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      // List View
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                                {getStatusIcon(favorite.visit_status)}
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-lg">{favorite.destination_name}</h3>
                                  {favorite.destination_district && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {favorite.destination_district}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {getVisitStatusBadge(favorite.visit_status)}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveFavorite(favorite.destination_id, favorite.destination_name)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              {favorite.notes && (
                                <p className="text-sm text-muted-foreground italic mb-2">"{favorite.notes}"</p>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                  <Button
                                    variant={favorite.visit_status === 'wishlist' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleUpdateStatus(favorite.id, 'wishlist')}
                                    className="text-xs"
                                  >
                                    Wishlist
                                  </Button>
                                  <Button
                                    variant={favorite.visit_status === 'planning' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleUpdateStatus(favorite.id, 'planning')}
                                    className="text-xs"
                                  >
                                    Planning
                                  </Button>
                                  <Button
                                    variant={favorite.visit_status === 'visited' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleUpdateStatus(favorite.id, 'visited')}
                                    className="text-xs"
                                  >
                                    Visited
                                  </Button>
                                </div>
                                
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  {favorite.rating && (
                                    <div className="flex items-center gap-1">
                                      <Star className="w-3 h-3 fill-current text-yellow-500" />
                                      <span>{favorite.rating}/5</span>
                                    </div>
                                  )}
                                  <span>{new Date(favorite.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

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

export default Favorites;