import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ProfileNavigation } from '../components/NavigationButtons';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../hooks/useLanguage';
import {
  Calendar, MapPin, Users, Clock, CheckCircle, XCircle, 
  AlertCircle, Download, Share2, Phone, Mail, Home,
  Utensils, Mountain, BookOpen, Loader2
} from 'lucide-react';

interface Booking {
  id: string;
  type: 'accommodation' | 'restaurant' | 'activity' | 'package';
  name: string;
  location: string;
  date: string;
  guests: number;
  price: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookingDate: string;
  confirmationCode: string;
  image?: string;
  contactPhone?: string;
  contactEmail?: string;
}

const MyBookings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login', { state: { from: '/my-bookings' } });
      return;
    }

    // Load bookings from localStorage
    const loadBookings = () => {
      setIsLoading(true);
      try {
        const storedBookings = localStorage.getItem(`bookings_${user.id}`);
        if (storedBookings) {
          setBookings(JSON.parse(storedBookings));
        }
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [user, navigate]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'accommodation': return <Home className="h-5 w-5" />;
      case 'restaurant': return <Utensils className="h-5 w-5" />;
      case 'activity': return <Mountain className="h-5 w-5" />;
      case 'package': return <BookOpen className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      return booking.status === 'confirmed' && new Date(booking.date) >= new Date();
    }
    if (filter === 'past') {
      return new Date(booking.date) < new Date();
    }
    if (filter === 'cancelled') {
      return booking.status === 'cancelled';
    }
    return true;
  });

  const cancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      const updatedBookings = bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      );
      setBookings(updatedBookings);
      localStorage.setItem(`bookings_${user?.id}`, JSON.stringify(updatedBookings));
    }
  };

  const downloadBooking = (booking: Booking) => {
    const content = `
BOOKING CONFIRMATION
====================

Booking ID: ${booking.confirmationCode}
Type: ${booking.type.toUpperCase()}
Name: ${booking.name}
Location: ${booking.location}
Date: ${new Date(booking.date).toLocaleDateString()}
Guests: ${booking.guests}
Price: ${booking.price}
Status: ${booking.status.toUpperCase()}

Booked on: ${new Date(booking.bookingDate).toLocaleString()}

Contact Information:
Phone: ${booking.contactPhone || 'N/A'}
Email: ${booking.contactEmail || 'N/A'}

Thank you for booking with ROOTSnROUTES!
Visit: https://rootsnroutes.com
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Booking-${booking.confirmationCode}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage and view all your bookings in one place
          </p>
        </div>

        {/* Filter Tabs and Actions */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(['all', 'upcoming', 'past', 'cancelled'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>
          
          {bookings.some(b => b.status === 'confirmed' && new Date(b.date) >= new Date()) && (
            <Button 
              variant="destructive"
              onClick={() => {
                if (confirm('Are you sure you want to cancel ALL upcoming bookings? This action cannot be undone.')) {
                  const updatedBookings = bookings.map(b => 
                    b.status === 'confirmed' && new Date(b.date) >= new Date()
                      ? { ...b, status: 'cancelled' as const }
                      : b
                  );
                  setBookings(updatedBookings);
                  localStorage.setItem(`bookings_${user?.id}`, JSON.stringify(updatedBookings));
                  
                  const cancelledCount = updatedBookings.filter(b => b.status === 'cancelled').length - 
                                        bookings.filter(b => b.status === 'cancelled').length;
                  alert(`${cancelledCount} booking${cancelledCount !== 1 ? 's' : ''} cancelled successfully`);
                }
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel All Upcoming
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading your bookings...</span>
          </div>
        )}

        {/* No Bookings */}
        {!isLoading && filteredBookings.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
              <p className="text-muted-foreground mb-6">
                {filter === 'all' 
                  ? "You haven't made any bookings yet. Start exploring Jharkhand!"
                  : `No ${filter} bookings found.`}
              </p>
              <Button onClick={() => navigate('/explore')}>
                Explore Destinations
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="md:flex">
                  {/* Image Section */}
                  {booking.image && (
                    <div className="md:w-48 h-48 md:h-auto bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20">
                      <img 
                        src={booking.image} 
                        alt={booking.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                          {getTypeIcon(booking.type)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-1">{booking.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {booking.location}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    {/* Booking Details */}
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Booked {new Date(booking.bookingDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Confirmation Code */}
                    <div className="mb-4 p-3 bg-muted rounded-lg">
                      <span className="text-xs text-muted-foreground">Confirmation Code:</span>
                      <p className="font-mono font-bold">{booking.confirmationCode}</p>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className="text-2xl font-bold text-primary">{booking.price}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm"
                          onClick={() => {
                            // Navigate to appropriate page based on booking type
                            if (booking.type === 'accommodation') {
                              navigate('/authentic-stays');
                            } else if (booking.type === 'restaurant') {
                              navigate('/restaurants');
                            } else if (booking.type === 'activity') {
                              navigate('/destinations');
                            } else {
                              navigate('/explore');
                            }
                          }}
                        >
                          <BookOpen className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadBooking(booking)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        {booking.status === 'confirmed' && new Date(booking.date) >= new Date() && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => cancelBooking(booking.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                        {booking.contactPhone && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `tel:${booking.contactPhone}`}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Exploring Section */}
        <div className="mt-12">
          <ProfileNavigation />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyBookings;
