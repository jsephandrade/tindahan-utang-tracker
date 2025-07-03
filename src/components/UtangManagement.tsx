import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/contexts/StoreContext";
import { UtangRecord } from "@/types/store";
import { CreditCard, DollarSign, Calendar, User, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UtangManagement = () => {
  const { utangRecords, customers, addPayment } = useStore();
  const { toast } = useToast();
  
  const [selectedRecord, setSelectedRecord] = useState<UtangRecord | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentNote, setPaymentNote] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'unpaid' | 'partial' | 'paid'>('all');

  const handleAddPayment = () => {
    if (!selectedRecord) return;
    
    if (paymentAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive",
      });
      return;
    }

    const totalPaid = selectedRecord.payments.reduce((sum, p) => sum + p.amount, 0);
    const remainingBalance = selectedRecord.amount - totalPaid;
    
    if (paymentAmount > remainingBalance) {
      toast({
        title: "Overpayment",
        description: `Payment amount exceeds remaining balance of ₱${remainingBalance.toFixed(2)}.`,
        variant: "destructive",
      });
      return;
    }

    addPayment(selectedRecord.id, paymentAmount, paymentNote);
    
    setPaymentAmount(0);
    setPaymentNote("");
    setIsPaymentDialogOpen(false);
    setSelectedRecord(null);
    
    toast({
      title: "Payment Recorded",
      description: `Payment of ₱${paymentAmount.toFixed(2)} has been recorded.`,
    });
  };

  const openPaymentDialog = (record: UtangRecord) => {
    setSelectedRecord(record);
    setIsPaymentDialogOpen(true);
  };

  const filteredRecords = utangRecords.filter(record => {
    if (filterStatus === 'all') return true;
    return record.status === filterStatus;
  });

  const totalUnpaidUtang = utangRecords
    .filter(r => r.status !== 'paid')
    .reduce((sum, r) => {
      const totalPaid = r.payments.reduce((pSum, p) => pSum + p.amount, 0);
      return sum + (r.amount - totalPaid);
    }, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRemainingBalance = (record: UtangRecord) => {
    const totalPaid = record.payments.reduce((sum, p) => sum + p.amount, 0);
    return record.amount - totalPaid;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-orange-900">Utang Management</h2>
          <p className="text-orange-700">Track and manage customer debt records</p>
        </div>
        
        <Card className="w-64">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Unpaid Utang</p>
              <p className="text-2xl font-bold text-red-600">₱{totalUnpaidUtang.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('all')}
          className={`flex-shrink-0 min-w-0 px-3 py-2 ${filterStatus === 'all' ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
        >
          <span className="whitespace-nowrap">All ({utangRecords.length})</span>
        </Button>
        <Button
          variant={filterStatus === 'unpaid' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('unpaid')}
          className={`flex-shrink-0 min-w-0 px-3 py-2 ${filterStatus === 'unpaid' ? 'bg-red-600 hover:bg-red-700' : ''}`}
        >
          <span className="whitespace-nowrap">Unpaid ({utangRecords.filter(r => r.status === 'unpaid').length})</span>
        </Button>
        <Button
          variant={filterStatus === 'partial' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('partial')}
          className={`flex-shrink-0 min-w-0 px-3 py-2 ${filterStatus === 'partial' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
        >
          <span className="whitespace-nowrap">Partial ({utangRecords.filter(r => r.status === 'partial').length})</span>
        </Button>
        <Button
          variant={filterStatus === 'paid' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('paid')}
          className={`flex-shrink-0 min-w-0 px-3 py-2 ${filterStatus === 'paid' ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          <span className="whitespace-nowrap">Paid ({utangRecords.filter(r => r.status === 'paid').length})</span>
        </Button>
      </div>

      {/* Utang Records */}
      <div className="grid gap-4">
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No utang records found for the selected filter.</p>
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => {
            const remainingBalance = getRemainingBalance(record);
            const totalPayments = record.payments.reduce((sum, p) => sum + p.amount, 0);
            
            return (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-5 w-5 text-orange-500" />
                        <h3 className="text-lg font-semibold">{record.customerName}</h3>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{record.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {record.createdAt.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Receipt className="h-4 w-4" />
                          Transaction ID: {record.transactionId.slice(-6)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="mb-2">
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-xl font-bold">₱{record.amount.toFixed(2)}</p>
                      </div>
                      
                      {totalPayments > 0 && (
                        <div className="mb-2">
                          <p className="text-sm text-muted-foreground">Paid</p>
                          <p className="text-lg font-semibold text-green-600">₱{totalPayments.toFixed(2)}</p>
                        </div>
                      )}
                      
                      {remainingBalance > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground">Balance</p>
                          <p className="text-lg font-semibold text-red-600">₱{remainingBalance.toFixed(2)}</p>
                        </div>
                      )}
                      
                      {record.status !== 'paid' && (
                        <Button
                          onClick={() => openPaymentDialog(record)}
                          className="bg-orange-600 hover:bg-orange-700"
                          size="sm"
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Add Payment
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Payment History */}
                  {record.payments.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2 text-sm">Payment History</h4>
                      <div className="space-y-2">
                        {record.payments.map((payment) => (
                          <div key={payment.id} className="flex justify-between items-center text-sm bg-green-50 p-2 rounded">
                            <div>
                              <span className="font-medium">₱{payment.amount.toFixed(2)}</span>
                              {payment.note && (
                                <span className="text-muted-foreground ml-2">- {payment.note}</span>
                              )}
                            </div>
                            <span className="text-muted-foreground">
                              {payment.date.toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold">{selectedRecord.customerName}</h3>
                <p className="text-sm text-muted-foreground">{selectedRecord.description}</p>
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground">Remaining Balance: </span>
                  <span className="font-bold text-red-600">₱{getRemainingBalance(selectedRecord).toFixed(2)}</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="payment-amount">Payment Amount *</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  placeholder="0.00"
                  max={getRemainingBalance(selectedRecord)}
                />
              </div>
              
              <div>
                <Label htmlFor="payment-note">Note (Optional)</Label>
                <Input
                  id="payment-note"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="Add a note for this payment"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleAddPayment} className="bg-orange-600 hover:bg-orange-700">
                  Record Payment
                </Button>
                <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UtangManagement;
