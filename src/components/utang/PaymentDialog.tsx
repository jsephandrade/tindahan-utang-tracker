
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UtangRecord } from "@/types/store";
import { parseNonNegativeNumber } from "@/utils/number";

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

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCustomer: ConsolidatedUtangRecord | null;
  paymentAmount: number;
  setPaymentAmount: (amount: number) => void;
  paymentNote: string;
  setPaymentNote: (note: string) => void;
  onAddPayment: () => void;
}

const PaymentDialog = ({
  isOpen,
  onOpenChange,
  selectedCustomer,
  paymentAmount,
  setPaymentAmount,
  paymentNote,
  setPaymentNote,
  onAddPayment
}: PaymentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
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
                onChange={e => {
                  const value = parseNonNegativeNumber(e.target.value);
                  if (value !== null) {
                    setPaymentAmount(value);
                  }
                }}
                placeholder="0.00"
                max={selectedCustomer.remainingBalance} 
              />
            </div>
            
            <div>
              <Label htmlFor="payment-note">Note (Optional)</Label>
              <Input 
                id="payment-note" 
                value={paymentNote} 
                onChange={e => setPaymentNote(e.target.value)} 
                placeholder="Add a note for this payment" 
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={onAddPayment} className="bg-orange-600 hover:bg-orange-700">
                Record Payment
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
