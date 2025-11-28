import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle, Clock, Shield, Zap, Globe } from 'lucide-react';

interface BlockchainStatusProps {
  isIntegrated?: boolean;
  showDetails?: boolean;
}

const BlockchainStatus: React.FC<BlockchainStatusProps> = ({ 
  isIntegrated = false, 
  showDetails = false 
}) => {
  const integrationStatus = [
    {
      feature: 'Smart Contract Foundation',
      status: 'completed',
      description: 'Basic smart contract structure implemented'
    },
    {
      feature: 'Payment Interface',
      status: 'completed',
      description: 'Blockchain payment UI components created'
    },
    {
      feature: 'Web3 Service Layer',
      status: 'in-progress',
      description: 'Web3.js integration with wallet connectivity'
    },
    {
      feature: 'Live Blockchain Integration',
      status: 'pending',
      description: 'Full mainnet deployment and testing'
    },
    {
      feature: 'Multi-Currency Support',
      status: 'pending',
      description: 'ETH, MATIC, and stablecoin support'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Complete</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline">Planned</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!showDetails) {
    return (
      <Card className="border-emerald-200 dark:border-emerald-800">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold">Blockchain Integration</h3>
                <p className="text-sm text-muted-foreground">
                  {isIntegrated ? 'Fully integrated and secure' : 'Foundation ready, integration in progress'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isIntegrated ? (
                <Badge className="bg-green-100 text-green-800">Live</Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">Development</Badge>
              )}
              <Globe className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-600" />
          Blockchain Integration Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {integrationStatus.map((item, index) => (
            <div key={index} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                {getStatusIcon(item.status)}
                <div>
                  <h4 className="font-medium">{item.feature}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              {getStatusBadge(item.status)}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Overall Progress</span>
            <span className="text-sm font-mono">60%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1">
            <Zap className="h-4 w-4 mr-2" />
            Test Payment
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Globe className="h-4 w-4 mr-2" />
            View Roadmap
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainStatus;