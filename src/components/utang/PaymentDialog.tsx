
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from '@/contexts/LanguageContext';

interface ConsolidatedUtangRecord {
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  records: any[];
  totalAmount: number;
  totalPaid: number;
  remainingBalance: number;
  status: 'unpaid' | 'partial' | 'paid';
  latestDate: Date;
  earliestDueDate?: Date;
  isOverdue: boolean;
}

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: ConsolidatedUtangRecord;
  onPayment: (customerId: string, amount: number, note?: string) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onOpenChange,
  customer,
  onPayment,
}) => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentAmount = parseFloat(amount);
    
    if (paymentAmount > 0 && paymentAmount <= customer.remainingBalance) {
      onPayment(customer.customerId, paymentAmount, note);
      setAmount('');
      setNote('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('utang.recordPayment')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{t('customer.name')}</p>
            <p className="font-medium">{customer.customerName}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">{t('utang.remainingBalance')}</p>
            <p className="text-lg font-bold text-red-600">₱{customer.remainingBalance.toFixed(2)}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="amount">{t('utang.paymentAmount')}</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={customer.remainingBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="note">{t('utang.paymentNote')} ({t('common.optional')})</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t('utang.paymentNotePlaceholder')}
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > customer.remainingBalance}
              >
                {t('utang.recordPayment')}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
