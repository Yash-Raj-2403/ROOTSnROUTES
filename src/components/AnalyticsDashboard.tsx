import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign,
  Eye,
  Star,
  Globe,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Filter,
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  Zap,
  AlertCircle
} from 'lucide-react';

// Real-time data interfaces
interface LiveMetrics {
  totalVisitors: number;
  totalRevenue: number;
  avgRating: number;
  activeDistricts: number;
  currentOnlineUsers: number;
  todayBookings: number;
  realtimeGrowth: number;
}

interface VisitorData {
  timestamp: Date;
  visitors: number;
  revenue: number;
  onlineUsers: number;
}

interface DistrictMetrics {
  district: string;
  visitors: number;
  percentage: number;
  growth: number;
  status: 'trending_up' | 'trending_down' | 'stable';
}

interface LiveAttraction {
  name: string;
  views: number;
  bookings: number;
  rating: number;
  currentViewers: number;
  trend: 'hot' | 'trending' | 'normal';
}

// Real-time data generation functions
const generateRealtimeVisitorData = (): VisitorData => {
  const now = new Date();
  const hour = now.getHours();
  
  // Simulate realistic tourism patterns (peak hours: 10-12, 14-17)
  let baseVisitors = 50;
  if (hour >= 10 && hour <= 12) baseVisitors = 120;
  else if (hour >= 14 && hour <= 17) baseVisitors = 150;
  else if (hour >= 18 && hour <= 21) baseVisitors = 90;
  else if (hour >= 22 || hour <= 6) baseVisitors = 20;
  
  const randomVariation = Math.random() * 20 - 10; // ±10 variation (reduced from 20)
  const visitors = Math.max(0, Math.floor(baseVisitors + randomVariation));
  
  return {
    timestamp: now,
    visitors,
    revenue: visitors * (2800 + Math.random() * 400), // ₹2800-3200 per visitor (more stable)
    onlineUsers: Math.floor(visitors * 0.3 + Math.random() * 10) // 30% online + smaller variation
  };
};

const generateLiveDistrictData = (): DistrictMetrics[] => {
  const districts = [
    { name: 'Ranchi', baseVisitors: 120, weight: 0.285 },
    { name: 'Jamshedpur', baseVisitors: 85, weight: 0.201 },
    { name: 'Dhanbad', baseVisitors: 75, weight: 0.180 },
    { name: 'Deoghar', baseVisitors: 65, weight: 0.140 },
    { name: 'Hazaribagh', baseVisitors: 50, weight: 0.114 },
    { name: 'Others', baseVisitors: 35, weight: 0.080 }
  ];

  return districts.map(district => {
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation (reduced from 15%)
    const visitors = Math.floor(district.baseVisitors * (1 + variation));
    const growth = (Math.random() - 0.5) * 10; // ±5% growth (reduced from 15%)
    
    let status: 'trending_up' | 'trending_down' | 'stable' = 'stable';
    if (growth > 3) status = 'trending_up';
    else if (growth < -3) status = 'trending_down';
    
    return {
      district: district.name,
      visitors,
      percentage: district.weight * 100,
      growth: Number(growth.toFixed(1)),
      status
    };
  });
};

const generateLiveAttractions = (): LiveAttraction[] => {
  const attractions = [
    { name: 'Hundru Falls', baseViews: 180, baseBookings: 25 },
    { name: 'Betla National Park', baseViews: 150, baseBookings: 20 },
    { name: 'Baidyanath Temple', baseViews: 170, baseBookings: 30 },
    { name: 'Jagannath Temple', baseViews: 120, baseBookings: 18 },
    { name: 'Netarhat Hills', baseViews: 100, baseBookings: 15 },
    { name: 'Tribal Museum', baseViews: 90, baseBookings: 12 }
  ];

  return attractions.map(attr => {
    const viewVariation = Math.random() * 60 - 30; // ±30 variation
    const bookingVariation = Math.random() * 10 - 5; // ±5 variation
    const views = Math.max(0, attr.baseViews + viewVariation);
    const bookings = Math.max(0, attr.baseBookings + bookingVariation);
    const currentViewers = Math.floor(Math.random() * 25 + 5); // 5-30 current viewers
    const rating = 4.3 + Math.random() * 0.7; // 4.3-5.0 rating
    
    let trend: 'hot' | 'trending' | 'normal' = 'normal';
    if (currentViewers > 20) trend = 'hot';
    else if (currentViewers > 15) trend = 'trending';
    
    return {
      name: attr.name,
      views: Math.floor(views),
      bookings: Math.floor(bookings),
      rating: Number(rating.toFixed(1)),
      currentViewers,
      trend
    };
  });
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AnalyticsDashboardRealtime: React.FC = () => {
  const [timeRange, setTimeRange] = useState('live');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Real-time data state
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    totalVisitors: 0,
    totalRevenue: 0,
    avgRating: 4.7,
    activeDistricts: 24,
    currentOnlineUsers: 0,
    todayBookings: 0,
    realtimeGrowth: 0
  });
  
  const [visitorHistory, setVisitorHistory] = useState<VisitorData[]>([]);
  const [districtMetrics, setDistrictMetrics] = useState<DistrictMetrics[]>([]);
  const [liveAttractions, setLiveAttractions] = useState<LiveAttraction[]>([]);

  // Real-time data update function
  const updateRealtimeData = useCallback(() => {
    try {
      const newVisitorData = generateRealtimeVisitorData();
      const newDistrictData = generateLiveDistrictData();
      const newAttractionData = generateLiveAttractions();
      
      // Update visitor history (keep last 20 data points for chart)
      setVisitorHistory(prev => {
        const updated = [...prev, newVisitorData].slice(-20);
        return updated;
      });
      
      setDistrictMetrics(newDistrictData);
      setLiveAttractions(newAttractionData);
      
      // Calculate live metrics
      setLiveMetrics(prev => {
        const todayBookings = newAttractionData.reduce((sum, attr) => sum + attr.bookings, 0);
        const avgRating = newAttractionData.reduce((sum, attr) => sum + attr.rating, 0) / newAttractionData.length;
        const realtimeGrowth = prev.currentOnlineUsers > 0 ? 
          ((newVisitorData.onlineUsers - prev.currentOnlineUsers) / prev.currentOnlineUsers * 100) : 0;
        
        return {
          ...prev,
          totalVisitors: prev.totalVisitors + newVisitorData.visitors,
          totalRevenue: prev.totalRevenue + newVisitorData.revenue,
          avgRating: Number(avgRating.toFixed(1)),
          activeDistricts: 24,
          currentOnlineUsers: newVisitorData.onlineUsers,
          todayBookings,
          realtimeGrowth: Number(realtimeGrowth.toFixed(1))
        };
      });
      
      setLastUpdated(new Date());
      setIsConnected(true);
    } catch (error) {
      console.error('Real-time update failed:', error);
      setIsConnected(false);
    }
  }, []); // Remove visitorHistory dependency to prevent constant recreation

  // Initialize and setup real-time updates
  useEffect(() => {
    // Initial data load
    updateRealtimeData();
    
    // Set up real-time updates every 2 minutes (more realistic for tourism data)
    const interval = setInterval(updateRealtimeData, 120000); // 2 minutes instead of 30 seconds
    
    // Simulate network connectivity check every 5 minutes
    const connectivityCheck = setInterval(() => {
      setIsConnected(Math.random() > 0.02); // 98% uptime simulation
    }, 300000);
    
    return () => {
      clearInterval(interval);
      clearInterval(connectivityCheck);
    };
  }, []); // Remove updateRealtimeData dependency

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateRealtimeData();
    } catch (error) {
      console.error('Manual refresh failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section with Real-time Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Live Tourism Analytics</h1>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <Wifi className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 border-red-300">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline
                </Badge>
              )}
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                Updated {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">Real-time insights into Jharkhand's tourism ecosystem</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="live">Live Data</SelectItem>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Updating...' : 'Refresh'}
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Live Data
          </Button>
        </div>
      </div>

      {/* Real-time Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Visitors</CardTitle>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveMetrics.currentOnlineUsers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {liveMetrics.realtimeGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              <span className={liveMetrics.realtimeGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                {liveMetrics.realtimeGrowth >= 0 ? '+' : ''}{liveMetrics.realtimeGrowth}%
              </span>
              <span className="ml-1">vs last update</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(liveMetrics.totalRevenue / 100000).toFixed(1)}L</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+8.2%</span>
              <span className="ml-1">vs yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveMetrics.avgRating}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+0.1</span>
              <span className="ml-1">vs last hour</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveMetrics.todayBookings}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Activity className="h-3 w-3 mr-1 text-emerald-500" />
              <span className="text-emerald-500">Real-time</span>
              <span className="ml-1">bookings today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts Section */}
      <Tabs defaultValue="visitors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visitors" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Live Flow
          </TabsTrigger>
          <TabsTrigger value="districts" className="flex items-center gap-2">
            <PieChartIcon className="w-4 h-4" />
            Districts
          </TabsTrigger>
          <TabsTrigger value="attractions" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Hot Spots
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Live Feed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visitors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                Real-time Visitor Flow
              </CardTitle>
              <CardDescription>
                Live visitor count updates every 2 minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={visitorHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp"
                      tickFormatter={(time) => new Date(time).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(time) => `Time: ${new Date(time).toLocaleTimeString()}`}
                      formatter={(value: number, name: string) => [
                        name === 'visitors' ? `${value} visitors` : 
                        name === 'onlineUsers' ? `${value} online` : 
                        `₹${(value/1000).toFixed(1)}K`,
                        name === 'visitors' ? 'Current Visitors' : 
                        name === 'onlineUsers' ? 'Online Users' : 'Revenue'
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="onlineUsers"
                      stackId="2"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="districts" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Live District Performance</CardTitle>
                <CardDescription>Real-time visitor distribution by district</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {districtMetrics.map((district, index) => (
                    <div key={district.district} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="font-medium">{district.district}</span>
                        {district.status === 'trending_up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                        {district.status === 'trending_down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{district.visitors}</div>
                        <div className={`text-xs ${
                          district.growth >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {district.growth >= 0 ? '+' : ''}{district.growth}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>District Distribution</CardTitle>
                <CardDescription>Live percentage breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={districtMetrics}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ district, percentage }) => `${district} (${percentage.toFixed(1)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="visitors"
                      >
                        {districtMetrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value} visitors`, 'Visitors']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attractions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Live Attraction Hotspots
              </CardTitle>
              <CardDescription>Real-time attraction performance and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liveAttractions.map((attraction, index) => (
                  <div key={attraction.name} className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-8 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{attraction.name}</span>
                          {attraction.trend === 'hot' && (
                            <Badge className="bg-red-100 text-red-800 border-red-300">🔥 Hot</Badge>
                          )}
                          {attraction.trend === 'trending' && (
                            <Badge className="bg-orange-100 text-orange-800 border-orange-300">📈 Trending</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{attraction.views} views</span>
                          <span>{attraction.bookings} bookings</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {attraction.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-emerald-500" />
                        <span className="font-semibold text-emerald-600">{attraction.currentViewers}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">viewing now</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Live Activity Feed
                </CardTitle>
                <CardDescription>Real-time events and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">New booking at {liveAttractions[i % liveAttractions.length]?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.floor(Math.random() * 60)} seconds ago
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  System Health
                </CardTitle>
                <CardDescription>Real-time monitoring status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Data Sync</span>
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <Wifi className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API Response</span>
                    <span className="text-green-600 font-mono">~45ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Update Frequency</span>
                    <span className="text-emerald-600">2 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Points</span>
                    <span className="text-amber-600">{visitorHistory.length}/20</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Uptime</span>
                    <span className="text-green-600">99.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboardRealtime;