import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/contexts/StoreContext";
import { UtangRecord } from "@/types/store";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UtangFilters from "./utang/UtangFilters";
import ConsolidatedUtangCard from "./utang/ConsolidatedUtangCard";
import PaymentDialog from "./utang/PaymentDialog";

interface ConsolidatedUtangRecord {
  customerId: string;
  customerName: string;
  records: UtangRecord[];
  totalAmount: number;
  totalPaid: number;
  remainingBalance: number;
  status: 'unpaid' | 'partial' | 'paid';
  latestDate: Date;
  earliestDueDate?: Date;
  isOverdue: boolean;
}

const UtangManagement = () => {
  const { utangRecords, transactions, addPayment } = useStore();
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
      if (new Date(record.createdAt as any) > existingCustomer.latestDate) {
        existingCustomer.latestDate = new Date(record.createdAt as any);
      }
      // Update earliest due date
      if (record.dueDate && (!existingCustomer.earliestDueDate || record.dueDate < existingCustomer.earliestDueDate)) {
        existingCustomer.earliestDueDate = record.dueDate;
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
        latestDate: new Date(record.createdAt as any),
        earliestDueDate: record.dueDate,
        isOverdue: false // Will be calculated below
      });
    }
    return acc;
  }, [] as ConsolidatedUtangRecord[]);

  // Calculate remaining balance, status, and overdue status for each consolidated record
  consolidatedRecords.forEach(consolidated => {
    consolidated.remainingBalance = consolidated.totalAmount - consolidated.totalPaid;
    if (consolidated.remainingBalance <= 0) {
      consolidated.status = 'paid';
    } else if (consolidated.totalPaid > 0) {
      consolidated.status = 'partial';
    } else {
      consolidated.status = 'unpaid';
    }
    
    // Check if overdue (only for unpaid records)
    if (consolidated.status !== 'paid' && consolidated.earliestDueDate) {
      consolidated.isOverdue = new Date() > consolidated.earliestDueDate;
    }
  });

  const handleAddPayment = () => {
    if (!selectedCustomer) return;
    if (paymentAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive"
      });
      return;
    }
    if (paymentAmount > selectedCustomer.remainingBalance) {
      toast({
        title: "Overpayment",
        description: `Payment amount exceeds remaining balance of P${selectedCustomer.remainingBalance.toFixed(2)}.`,
        variant: "destructive"
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
      description: `Payment of P${paymentAmount.toFixed(2)} has been recorded.`
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

  const totalUnpaidUtang = consolidatedRecords.filter(r => r.status !== 'paid').reduce((sum, r) => sum + r.remainingBalance, 0);

  return (
    <div className="space-y-6">
      {/* Total Unpaid Utang Card */}
      <div className="flex justify-end">
        <Card className="w-64">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Unpaid Utang</p>
              <p className="text-2xl font-bold text-red-600">P{totalUnpaidUtang.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <UtangFilters 
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        consolidatedRecords={consolidatedRecords}
      />

      {/* Consolidated Utang Records */}
      <div className="grid gap-4">
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No utang records found for the selected filter.</p>
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map(consolidated => (
            <ConsolidatedUtangCard
              key={consolidated.customerId}
              consolidated={consolidated}
              transactions={transactions}
              onOpenPaymentDialog={openPaymentDialog}
            />
          ))
        )}
      </div>

      {/* Payment Dialog */}
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        selectedCustomer={selectedCustomer}
        paymentAmount={paymentAmount}
        setPaymentAmount={setPaymentAmount}
        paymentNote={paymentNote}
        setPaymentNote={setPaymentNote}
        onAddPayment={handleAddPayment}
      />
    </div>
  );
};

export default UtangManagement;
