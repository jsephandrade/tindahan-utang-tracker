
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, ShoppingCart, AlertTriangle } from "lucide-react";
import { UtangRecord, Transaction } from "@/types/store";

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

interface ConsolidatedUtangCardProps {
  consolidated: ConsolidatedUtangRecord;
  transactions: Transaction[];
  onOpenPaymentDialog: (consolidated: ConsolidatedUtangRecord) => void;
}

const ConsolidatedUtangCard = ({ consolidated, transactions, onOpenPaymentDialog }: ConsolidatedUtangCardProps) => {
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

  const getAllTransactionItems = (consolidated: ConsolidatedUtangRecord) => {
    const allItems: any[] = [];
    consolidated.records.forEach(record => {
      const transaction = transactions.find(t => t.id === record.transactionId);
      if (transaction?.items) {
        transaction.items.forEach(item => {
          allItems.push({
            ...item,
            transactionId: record.transactionId,
            date: new Date(record.createdAt as any),
          });
        });
      }
    });
    return allItems;
  };

  const getDaysOverdue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const allItems = getAllTransactionItems(consolidated);
  const allPayments = consolidated.records.flatMap(r => r.payments);
  const dueDate = consolidated.earliestDueDate
    ? new Date(consolidated.earliestDueDate as any)
    : undefined;

  return (
    <Card className={`hover:shadow-md transition-shadow ${consolidated.isOverdue ? 'border-red-300 bg-red-50/30' : ''}`}>
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold truncate">{consolidated.customerName}</h3>
              <Badge className={getStatusColor(consolidated.status)}>
                {consolidated.status.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {consolidated.records.length} transaction{consolidated.records.length > 1 ? 's' : ''}
              </Badge>
              {consolidated.isOverdue && (
                <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  OVERDUE
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Latest: {consolidated.latestDate.toLocaleDateString()}</span>
              </div>
              {dueDate && (
                <div
                  className={`flex items-center gap-1 ${
                    consolidated.isOverdue ? 'text-red-600 font-medium' : ''
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>
                    Due: {dueDate.toLocaleDateString()}
                    {consolidated.isOverdue && (
                      <span className="ml-1">
                        ({getDaysOverdue(dueDate)} days overdue)
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Consolidated Receipt-style Product List */}
            {allItems.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="h-4 w-4 text-orange-500" />
                  <span className="font-medium text-sm">All Items Purchased</span>
                </div>
                <div className="space-y-1 font-mono text-sm">
                  <div className="border-b border-dashed border-gray-300 pb-1 mb-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>ITEM</span>
                      <span>QTY × PRICE = TOTAL</span>
                    </div>
                  </div>
                  {allItems.map((item, index) => (
                    <div
                      key={`${item.transactionId}-${item.productId}-${index}`}
                      className="flex justify-between items-start"
                    >
                      <div className="flex-1 pr-2">
                        <span className="text-xs">{item.productName}</span>
                        <div className="text-xs text-muted-foreground">
                          {item.date.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right text-xs whitespace-nowrap">
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
          
          <div className="text-right space-y-2 flex-shrink-0">
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
                onClick={() => onOpenPaymentDialog(consolidated)} 
                className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto" 
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
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payment History
            </h4>
            <div className="space-y-2">
              {allPayments
                .sort((a, b) =>
                  new Date(b.date as any).getTime() -
                  new Date(a.date as any).getTime(),
                )
                .map((payment, idx) => (
                <div
                  key={`${payment.id}-${idx}`}
                  className="flex justify-between items-center text-sm bg-green-50 p-2 rounded"
                >
                  <div>
                    <span className="font-medium">P{payment.amount.toFixed(2)}</span>
                    {payment.note && <span className="text-muted-foreground ml-2">- {payment.note}</span>}
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {new Date(payment.date as any).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsolidatedUtangCard;
