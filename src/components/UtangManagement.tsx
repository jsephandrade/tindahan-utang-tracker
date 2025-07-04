
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/contexts/StoreContext";
import { UtangRecord } from "@/types/store";
import { CreditCard, DollarSign, Calendar, User, Receipt, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConsolidatedUtangRecord {
  customerId: string;
  customerName: string;
  records: UtangRecord[];
  totalAmount: number;
  totalPaid: number;
  remainingBalance: number;
  status: 'unpaid' | 'partial' | 'paid';
  latestDate: Date;
}

const UtangManagement = () => {
  const { utangRecords, customers, transactions, addPayment } = useStore();
  const { toast } = useToast();
  
  const [selectedCustomer, setSelectedCustomer] = useState<ConsolidatedUtangRecord | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentNote, setPaymentNote] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'unpaid' | 'partial' | 'paid'>('all');

  // Group utang records by customer
  const consolidatedRecords: ConsolidatedUtangRecord[] = utangRecords.reduce((acc, record) => {
    const existingCustomer = acc.find(c => c.customerId === record.customerId);
    
    if (existingCustomer) {
      existingCustomer.records.push(record);
      existingCustomer.totalAmount += record.amount;
      const recordPaid = record.payments.reduce((sum, p) => sum + p.amount, 0);
      existingCustomer.totalPaid += recordPaid;
      if (record.createdAt > existingCustomer.latestDate) {
        existingCustomer.latestDate = record.createdAt;
      }
    } else {
      const recordPaid = record.payments.reduce((sum, p) => sum + p.amount, 0);
      acc.push({
        customerId: record.customerId,
        customerName: record.customerName,
        records: [record],
        totalAmount: record.amount,
        totalPaid: recordPaid,
        remainingBalance: 0, // Will be calculated below
        status: 'unpaid', // Will be calculated below
        latestDate: record.createdAt,
      });
    }
    
    return acc;
  }, [] as ConsolidatedUtangRecord[]);

  // Calculate remaining balance and status for each consolidated record
  consolidatedRecords.forEach(consolidated => {
    consolidated.remainingBalance = consolidated.totalAmount - consolidated.totalPaid;
    
    if (consolidated.remainingBalance <= 0) {
      consolidated.status = 'paid';
    } else if (consolidated.totalPaid > 0) {
      consolidated.status = 'partial';
    } else {
      consolidated.status = 'unpaid';
    }
  });

  const handleAddPayment = () => {
    if (!selectedCustomer) return;
    
    if (paymentAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive",
      });
      return;
    }

    if (paymentAmount > selectedCustomer.remainingBalance) {
      toast({
        title: "Overpayment",
        description: `Payment amount exceeds remaining balance of P${selectedCustomer.remainingBalance.toFixed(2)}.`,
        variant: "destructive",
      });
      return;
    }

    // Apply payment to the oldest unpaid record first
    let remainingPayment = paymentAmount;
    
    for (const record of selectedCustomer.records) {
      if (remainingPayment <= 0) break;
      
      const recordPaid = record.payments.reduce((sum, p) => sum + p.amount, 0);
      const recordBalance = record.amount - recordPaid;
      
      if (recordBalance > 0) {
        const paymentForThisRecord = Math.min(remainingPayment, recordBalance);
        addPayment(record.id, paymentForThisRecord, paymentNote);
        remainingPayment -= paymentForThisRecord;
      }
    }
    
    setPaymentAmount(0);
    setPaymentNote("");
    setIsPaymentDialogOpen(false);
    setSelectedCustomer(null);
    
    toast({
      title: "Payment Recorded",
      description: `Payment of P${paymentAmount.toFixed(2)} has been recorded.`,
    });
  };

  const openPaymentDialog = (consolidated: ConsolidatedUtangRecord) => {
    setSelectedCustomer(consolidated);
    setIsPaymentDialogOpen(true);
  };

  const filteredRecords = consolidatedRecords.filter(consolidated => {
    if (filterStatus === 'all') return true;
    return consolidated.status === filterStatus;
  });

  const totalUnpaidUtang = consolidatedRecords
    .filter(r => r.status !== 'paid')
    .reduce((sum, r) => sum + r.remainingBalance, 0);

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

  // Get all transaction items for a consolidated record
  const getAllTransactionItems = (consolidated: ConsolidatedUtangRecord) => {
    const allItems: any[] = [];
    
    consolidated.records.forEach(record => {
      const transaction = transactions.find(t => t.id === record.transactionId);
      if (transaction?.items) {
        transaction.items.forEach(item => {
          allItems.push({
            ...item,
            transactionId: record.transactionId,
            date: record.createdAt
          });
        });
      }
    });
    
    return allItems;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header with Total Unpaid */}
      <div className="flex justify-center sm:justify-end">
        <Card className="w-full max-w-sm">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Unpaid Utang</p>
              <p className="text-2xl font-bold text-red-600">P{totalUnpaidUtang.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('all')}
          className={`flex-shrink-0 min-w-0 px-3 py-2 ${filterStatus === 'all' ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
        >
          <span className="whitespace-nowrap">All ({consolidatedRecords.length})</span>
        </Button>
        <Button
          variant={filterStatus === 'unpaid' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('unpaid')}
          className={`flex-shrink-0 min-w-0 px-3 py-2 ${filterStatus === 'unpaid' ? 'bg-red-600 hover:bg-red-700' : ''}`}
        >
          <span className="whitespace-nowrap">Unpaid ({consolidatedRecords.filter(r => r.status === 'unpaid').length})</span>
        </Button>
        <Button
          variant={filterStatus === 'partial' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('partial')}
          className={`flex-shrink-0 min-w-0 px-3 py-2 ${filterStatus === 'partial' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
        >
          <span className="whitespace-nowrap">Partial ({consolidatedRecords.filter(r => r.status === 'partial').length})</span>
        </Button>
        <Button
          variant={filterStatus === 'paid' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('paid')}
          className={`flex-shrink-0 min-w-0 px-3 py-2 ${filterStatus === 'paid' ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          <span className="whitespace-nowrap">Paid ({consolidatedRecords.filter(r => r.status === 'paid').length})</span>
        </Button>
      </div>

      {/* Consolidated Utang Records */}
      <div className="w-full space-y-4">
        {filteredRecords.length === 0 ? (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No utang records found for the selected filter.</p>
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((consolidated) => {
            const allItems = getAllTransactionItems(consolidated);
            const allPayments = consolidated.records.flatMap(r => r.payments);
            
            return (
              <Card key={consolidated.customerId} className="w-full max-w-4xl mx-auto hover:shadow-md transition-shadow">
                <CardContent className="w-full p-4 sm:p-6 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 w-full">
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <User className="h-5 w-5 text-orange-500 flex-shrink-0" />
                        <h3 className="text-lg font-semibold truncate flex-1 min-w-0">{consolidated.customerName}</h3>
                        <Badge className={getStatusColor(consolidated.status)}>
                          {consolidated.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {consolidated.records.length} transaction{consolidated.records.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Latest: {consolidated.latestDate.toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Consolidated Receipt-style Product List */}
                      {allItems.length > 0 && (
                        <div className="bg-gray-50 p-3 rounded-lg border w-full">
                          <div className="flex items-center gap-2 mb-2">
                            <ShoppingCart className="h-4 w-4 text-orange-500" />
                            <span className="font-medium text-sm">All Items Purchased</span>
                          </div>
                          <div className="space-y-1 font-mono text-sm w-full overflow-x-auto">
                            <div className="border-b border-dashed border-gray-300 pb-1 mb-2">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>ITEM</span>
                                <span>QTY × PRICE = TOTAL</span>
                              </div>
                            </div>
                            {allItems.map((item, index) => (
                              <div key={`${item.transactionId}-${index}`} className="flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0">
                                  <span className="text-xs truncate block">{item.productName}</span>
                                  <div className="text-xs text-muted-foreground">
                                    {item.date.toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="text-right text-xs whitespace-nowrap flex-shrink-0">
                                  {item.quantity} × P{item.price.toFixed(2)} = P{item.total.toFixed(2)}
                                </div>
                              </div>
                            ))}
                            <div className="border-t border-dashed border-gray-300 pt-1 mt-2">
                              <div className="flex justify-between font-bold text-sm">
                                <span>TOTAL</span>
                                <span>P{consolidated.totalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="lg:text-right space-y-2 flex-shrink-0 w-full lg:w-auto lg:max-w-xs">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-xl font-bold">P{consolidated.totalAmount.toFixed(2)}</p>
                      </div>
                      
                      {consolidated.totalPaid > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground">Paid</p>
                          <p className="text-lg font-semibold text-green-600">P{consolidated.totalPaid.toFixed(2)}</p>
                        </div>
                      )}
                      
                      {consolidated.remainingBalance > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground">Balance</p>
                          <p className="text-lg font-semibold text-red-600">P{consolidated.remainingBalance.toFixed(2)}</p>
                        </div>
                      )}
                      
                      {consolidated.status !== 'paid' && (
                        <Button
                          onClick={() => openPaymentDialog(consolidated)}
                          className="bg-orange-600 hover:bg-orange-700 w-full"
                          size="sm"
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Add Payment
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Payment History */}
                  {allPayments.length > 0 && (
                    <div className="border-t pt-4 space-y-2 w-full">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Payment History
                      </h4>
                      <div className="space-y-2">
                        {allPayments
                          .sort((a, b) => b.date.getTime() - a.date.getTime())
                          .map((payment) => (
                          <div key={payment.id} className="flex justify-between items-center text-sm bg-green-50 p-2 rounded">
                            <div className="flex-1 min-w-0">
                              <span className="font-medium">P{payment.amount.toFixed(2)}</span>
                              {payment.note && (
                                <span className="text-muted-foreground ml-2 truncate">- {payment.note}</span>
                              )}
                            </div>
                            <span className="text-muted-foreground text-xs flex-shrink-0">
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
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold">{selectedCustomer.customerName}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedCustomer.records.length} transaction{selectedCustomer.records.length > 1 ? 's' : ''}
                </p>
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground">Remaining Balance: </span>
                  <span className="font-bold text-red-600">P{selectedCustomer.remainingBalance.toFixed(2)}</span>
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
                  max={selectedCustomer.remainingBalance}
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
