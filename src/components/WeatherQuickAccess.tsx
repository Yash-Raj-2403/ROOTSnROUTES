import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cloud, MapPin, Thermometer, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const WeatherQuickAccess: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-teal-50 to-emerald-100 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <Cloud className="h-8 w-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
              🌤️ Live Weather Dashboard
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
              Check real-time weather conditions and travel safety for all 24 districts of Jharkhand
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
            <div className="flex flex-col items-center space-y-1">
              <Thermometer className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800 dark:text-blue-200">Temperature</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800 dark:text-blue-200">Visibility</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800 dark:text-blue-200">Safety Tips</span>
            </div>
          </div>

          <Link to="/weather">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white">
              <Cloud className="h-4 w-4 mr-2" />
              View Weather Dashboard
            </Button>
          </Link>

          <p className="text-xs text-blue-600 dark:text-blue-400">
            Powered by Weatherbit • Updated every 30 minutes
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherQuickAccess;