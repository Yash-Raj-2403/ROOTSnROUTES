import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow, 
  Wind, 
  Thermometer, 
  Eye, 
  Droplets,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { weatherService, WeatherData, WeatherSafety } from '@/services/weatherService';
import styles from './WeatherSafetyWidget.module.css';

interface WeatherSafetyWidgetProps {
  location: string;
  className?: string;
  showDetails?: boolean;
}

const WeatherSafetyWidget: React.FC<WeatherSafetyWidgetProps> = ({ 
  location, 
  className = "",
  showDetails = true 
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [safety, setSafety] = useState<WeatherSafety | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const report = await weatherService.getTravelWeatherReport(location);
      if (report) {
        setWeather(report.current);
        setSafety(report.safety);
      } else {
        setError('Unable to fetch weather data for this location');
      }
    } catch (err) {
      setError('Weather service is currently unavailable');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('rain') || cond.includes('drizzle')) return <CloudRain className="h-6 w-6" />;
    if (cond.includes('snow')) return <CloudSnow className="h-6 w-6" />;
    if (cond.includes('cloud')) return <Cloud className="h-6 w-6" />;
    if (cond.includes('clear') || cond.includes('sun')) return <Sun className="h-6 w-6" />;
    return <Cloud className="h-6 w-6" />;
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-teal-500';
      case 'moderate': return 'bg-yellow-500';
      case 'poor': return 'bg-orange-500';
      case 'dangerous': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSafetyIcon = (level: string) => {
    switch (level) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'moderate':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'poor':
      case 'dangerous':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading weather data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather || !safety) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Weather data unavailable'}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchWeatherData}
                className="ml-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Weather Safety: {weather.location}</span>
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchWeatherData}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Weather Overview */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            {getWeatherIcon(weather.condition)}
            <div>
              <p className="font-semibold">{weather.temperature}°C</p>
              <p className="text-sm text-muted-foreground">{weather.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Feels like</p>
            <p className="font-semibold">{weather.feelsLike}°C</p>
          </div>
        </div>

        {/* Safety Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Travel Safety</span>
            <div className="flex items-center space-x-2">
              {getSafetyIcon(safety.safetyLevel)}
              <Badge className={`${getSafetyColor(safety.safetyLevel)} text-white`}>
                {safety.safetyLevel.toUpperCase()}
              </Badge>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getSafetyColor(safety.safetyLevel)} ${styles.progressBar}`}
              style={{ '--progress-width': `${safety.safetyScore}%` } as React.CSSProperties}
            />
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Safety Score: {safety.safetyScore}/100
          </p>
        </div>

        {/* Quick Weather Stats */}
        {showDetails && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <Wind className="h-3 w-3" />
              <span>{weather.windSpeed} m/s</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="h-3 w-3" />
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-3 w-3" />
              <span>{weather.visibility} km</span>
            </div>
            <div className="flex items-center space-x-2">
              <Thermometer className="h-3 w-3" />
              <span>{weather.pressure} hPa</span>
            </div>
            {weather.uvIndex && (
              <div className="flex items-center space-x-2">
                <Sun className="h-3 w-3" />
                <span>UV: {weather.uvIndex}</span>
              </div>
            )}
            {weather.precipitationChance && (
              <div className="flex items-center space-x-2">
                <CloudRain className="h-3 w-3" />
                <span>Rain: {weather.precipitationChance}%</span>
              </div>
            )}
          </div>
        )}

        {/* Warnings */}
        {safety.warnings.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {safety.warnings.map((warning, index) => (
                  <li key={index} className="text-sm">{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Recommendations */}
        {showDetails && safety.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recommendations:</h4>
            <ul className="text-sm space-y-1">
              {safety.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Best Time to Visit */}
        <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
          <p className="text-sm font-medium text-teal-800">Best Time to Visit:</p>
          <p className="text-sm text-teal-700">{safety.bestTimeToVisit}</p>
        </div>

        {/* Recommended Activities */}
        {showDetails && safety.activitiesRecommended.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-green-700">Recommended Activities:</h4>
            <div className="flex flex-wrap gap-1">
              {safety.activitiesRecommended.map((activity, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                  {activity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Activities to Avoid */}
        {showDetails && safety.activitiesNotRecommended.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-red-700">Activities to Avoid:</h4>
            <div className="flex flex-wrap gap-1">
              {safety.activitiesNotRecommended.map((activity, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-red-100 text-red-800">
                  {activity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Last updated: {weather.timestamp.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherSafetyWidget;