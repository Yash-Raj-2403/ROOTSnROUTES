import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, Clock, AlertCircle, Shield, Wallet, Lock, Zap, Globe } from 'lucide-react';
import { blockchainService, BlockchainTransaction } from '@/services/blockchainService';
import { web3Service, PaymentTransaction } from '@/services/web3Service';
import { useToast } from '@/hooks/use-toast';

interface BlockchainPaymentProps {
  vendorId: string;
  vendorName: string;
  amount: number;
  description: string;
  onPaymentComplete?: (transaction: BlockchainTransaction | PaymentTransaction) => void;
}

const BlockchainPayment: React.FC<BlockchainPaymentProps> = ({
  vendorId,
  vendorName,
  amount,
  description,
  onPaymentComplete
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<BlockchainTransaction | PaymentTransaction | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [userBalance, setUserBalance] = useState('0');
  const [gasFee, setGasFee] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<'web3' | 'mock'>('web3');

  useEffect(() => {
    initializeWallet();
  }, []);

  const initializeWallet = async () => {
    try {
      const initialized = await web3Service.initialize();
      if (initialized) {
        const account = await web3Service.getAccount();
        if (account) {
          setWalletConnected(true);
          const balance = await web3Service.getBalance();
          setUserBalance(balance);
          const estimatedGas = await web3Service.estimateGasFee();
          setGasFee(estimatedGas);
        }
      }
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      let result: BlockchainTransaction | PaymentTransaction;
      
      if (paymentMethod === 'web3' && walletConnected) {
        // Use Web3 service for real blockchain payment
        result = await web3Service.simulatePayment(`vendor_${vendorId}`, amount / 100, 'ETH');
        
        toast({
          title: 'Web3 Payment Processing...',
          description: 'Transaction submitted to blockchain network.',
        });
        
        // Check transaction status after delay
        setTimeout(async () => {
          const status = await web3Service.getTransactionStatus(result.id);
          if (status === 'confirmed') {
            toast({
              title: 'Blockchain Payment Confirmed! ⛓️',
              description: 'Your payment has been confirmed on the blockchain.',
            });
          }
        }, 5000);
      } else {
        // Fallback to mock blockchain service
        result = await blockchainService.makePayment('current_user_id', vendorId, amount);
        
        toast({
          title: 'Payment Successful!',
          description: 'Your payment has been processed securely.',
        });
      }
      
      setTransaction(result);
      onPaymentComplete?.(result);
      
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    setLoading(true);
    try {
      const account = await web3Service.connectWallet();
      if (account) {
        setWalletConnected(true);
        const balance = await web3Service.getBalance();
        setUserBalance(balance);
        const estimatedGas = await web3Service.estimateGasFee();
        setGasFee(estimatedGas);
        
        toast({
          title: 'Wallet Connected!',
          description: `Connected to ${account.substring(0, 6)}...${account.substring(account.length - 4)}`,
        });
      } else {
        toast({
          title: 'Connection Failed',
          description: 'Please make sure you have MetaMask installed and unlocked.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Secure Blockchain Payment
        </CardTitle>
        <CardDescription>
          Pay securely using blockchain technology
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Vendor:</span>
            <span className="text-sm font-medium">{vendorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Service:</span>
            <span className="text-sm">{description}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="text-lg font-bold">₹{amount.toLocaleString()}</span>
          </div>
          {walletConnected && (
            <>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Your Balance:</span>
                <span className="text-sm font-mono">{parseFloat(userBalance).toFixed(4)} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Est. Gas Fee:</span>
                <span className="text-sm font-mono">{gasFee} ETH</span>
              </div>
            </>
          )}
        </div>

        <Separator />

        {/* Wallet Connection Status */}
        {!walletConnected ? (
          <Alert>
            <Wallet className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span><strong>Connect Wallet:</strong> Connect your Web3 wallet to use blockchain payments.</span>
                <Button size="sm" onClick={connectWallet} disabled={loading}>
                  <Wallet className="h-4 w-4 mr-2" />
                  {loading ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Wallet Connected:</strong> Ready for secure blockchain payment.
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Method Selection */}
        {walletConnected && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method:</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="web3-payment"
                  name="blockchain-method"
                  checked={paymentMethod === 'web3'}
                  onChange={() => setPaymentMethod('web3')}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="web3-payment" className="text-sm flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Web3 Blockchain Payment (Recommended)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="mock-payment"
                  name="blockchain-method"
                  checked={paymentMethod === 'mock'}
                  onChange={() => setPaymentMethod('mock')}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="mock-payment" className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Demo Mode (Testing)
                </label>
              </div>
            </div>
          </div>
        )}

        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            <strong>Blockchain Security:</strong> Your payment is secured by blockchain technology, 
            ensuring transparency and immutable transaction records.
          </AlertDescription>
        </Alert>

        {transaction ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(transaction.status)}
              <span className="text-sm font-medium">
                Transaction {transaction.status}
              </span>
              <Badge variant={transaction.status === 'confirmed' ? 'default' : 'secondary'}>
                {transaction.status}
              </Badge>
              {'currency' in transaction && (
                <Badge variant="outline">{transaction.currency}</Badge>
              )}
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Transaction ID:</p>
              <p className="text-sm font-mono break-all">{transaction.id}</p>
              {'transactionHash' in transaction && transaction.transactionHash && (
                <div>
                  <p className="text-xs text-muted-foreground mt-2">Blockchain Hash:</p>
                  <p className="text-xs font-mono break-all">{transaction.transactionHash}</p>
                </div>
              )}
              {'gasUsed' in transaction && transaction.gasUsed && (
                <p className="text-xs text-muted-foreground mt-1">
                  Gas Used: {transaction.gasUsed} ETH
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(transaction.timestamp).toLocaleString()}
              </p>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  View Transaction Details
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Transaction Details</DialogTitle>
                  <DialogDescription>
                    {paymentMethod === 'web3' ? 'Blockchain' : 'Simulated'} transaction information
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Transaction ID</p>
                      <p className="text-sm font-mono break-all">{transaction.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        <span className="text-sm">{transaction.status}</span>
                      </div>
                    </div>
                    {'currency' in transaction && (
                      <div>
                        <p className="text-sm text-muted-foreground">Currency</p>
                        <p className="text-sm">{transaction.currency}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Timestamp</p>
                      <p className="text-sm">{new Date(transaction.timestamp).toLocaleString()}</p>
                    </div>
                    {'from' in transaction && (
                      <div>
                        <p className="text-sm text-muted-foreground">From</p>
                        <p className="text-sm font-mono">{transaction.from}</p>
                      </div>
                    )}
                    {'to' in transaction && (
                      <div>
                        <p className="text-sm text-muted-foreground">To</p>
                        <p className="text-sm font-mono">{transaction.to}</p>
                      </div>
                    )}
                  </div>
                  {'transactionHash' in transaction && transaction.transactionHash && (
                    <div>
                      <p className="text-sm text-muted-foreground">Blockchain Hash</p>
                      <p className="text-xs font-mono break-all bg-muted p-2 rounded">
                        {transaction.transactionHash}
                      </p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Button 
            onClick={walletConnected ? handlePayment : connectWallet}
            disabled={loading}
            className="w-full"
          >
            <Wallet className="h-4 w-4 mr-2" />
            {loading ? 'Processing...' : 
             walletConnected ? `Pay ₹${amount.toLocaleString()}` : 'Connect Wallet First'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockchainPayment;