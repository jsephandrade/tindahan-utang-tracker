import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Calendar, User, Phone, MapPin, AlertTriangle, CheckCircle } from "lucide-react";
import { useStore } from '@/contexts/StoreContext';
import { useLanguage } from '@/contexts/LanguageContext';
import PaymentDialog from '@/components/utang/PaymentDialog';
import ConsolidatedUtangCard from '@/components/utang/ConsolidatedUtangCard';
import UtangFilters from '@/components/utang/UtangFilters';
import { parseDate } from '@/utils/date';

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

const UtangManagement = () => {
  const { utangRecords, transactions, customers, addPayment } = useStore();
  const { t } = useLanguage();
  const [selectedCustomer, setSelectedCustomer] = useState<ConsolidatedUtangRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('amount');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const consolidatedRecords = useMemo(() => {
    const grouped = utangRecords.reduce((acc, record) => {
      const key = record.customerId;
      if (!acc[key]) {
        const customer = customers.find(c => c.id === record.customerId);
        acc[key] = {
          customerId: record.customerId,
          customerName: record.customerName || customer?.name || 'Unknown',
          customerPhone: customer?.phone || '',
          customerAddress: customer?.address || '',
          records: [],
          totalAmount: 0,
          totalPaid: 0,
          remainingBalance: 0,
          status: 'unpaid' as const,
          latestDate: new Date(0),
          earliestDueDate: undefined,
          isOverdue: false,
        };
      }
      
      acc[key].records.push(record);
      acc[key].totalAmount += record.amount;
      
      const recordPaid = (record.payments ?? []).reduce((sum, p) => sum + p.amount, 0);
      acc[key].totalPaid += recordPaid;
      
      const recordDate = parseDate(record.createdAt) || new Date();
      if (recordDate > acc[key].latestDate) {
        acc[key].latestDate = recordDate;
      }
      
      const dueDate = parseDate(record.dueDate);
      if (dueDate && (!acc[key].earliestDueDate || dueDate < acc[key].earliestDueDate)) {
        acc[key].earliestDueDate = dueDate;
      }
      
      return acc;
    }, {} as Record<string, ConsolidatedUtangRecord>);

    return Object.values(grouped).map(record => {
      record.remainingBalance = record.totalAmount - record.totalPaid;
      record.status = record.remainingBalance <= 0 ? 'paid' : 
                    record.totalPaid > 0 ? 'partial' : 'unpaid';
      record.isOverdue = record.earliestDueDate ? record.earliestDueDate < new Date() : false;
      return record;
    });
  }, [utangRecords, customers]);

  const filteredRecords = useMemo(() => {
    return consolidatedRecords
      .filter(record => {
        const matchesSearch = record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            record.customerPhone.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'amount':
            return b.remainingBalance - a.remainingBalance;
          case 'date':
            return b.latestDate.getTime() - a.latestDate.getTime();
          case 'name':
            return a.customerName.localeCompare(b.customerName);
          default:
            return 0;
        }
      });
  }, [consolidatedRecords, searchTerm, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const total = consolidatedRecords.reduce((sum, r) => sum + r.remainingBalance, 0);
    const overdue = consolidatedRecords.filter(r => r.isOverdue && r.remainingBalance > 0).length;
    const paid = consolidatedRecords.filter(r => r.status === 'paid').length;
    const partial = consolidatedRecords.filter(r => r.status === 'partial').length;
    
    return { total, overdue, paid, partial };
  }, [consolidatedRecords]);

  const handlePayment = async (customerId: string, amount: number, note?: string) => {
    const customer = consolidatedRecords.find(c => c.customerId === customerId);
    if (!customer) return;

    // Ensure records are processed from oldest to newest by creation date
    const recordsByDate = [...customer.records].sort(
      (a, b) =>
        (parseDate(a.createdAt)?.getTime() || 0) -
        (parseDate(b.createdAt)?.getTime() || 0)
    );
    let remainingPayment = amount;
    for (const record of recordsByDate) {
      if (remainingPayment <= 0) break;
      const recordPaid = (record.payments ?? []).reduce(
        (sum, p) => sum + p.amount,
        0
      );
      const recordBalance = record.amount - recordPaid;
      if (recordBalance > 0) {
        const paymentForThisRecord = Math.min(remainingPayment, recordBalance);
        await addPayment(record.id, paymentForThisRecord, note);
        remainingPayment -= paymentForThisRecord;
      }
    }

    setIsPaymentDialogOpen(false);
    setSelectedCustomer(null);
  };

  const openPaymentDialog = (customer: ConsolidatedUtangRecord) => {
    setSelectedCustomer(customer);
    setIsPaymentDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t('utang.totalOutstanding')}</p>
                <p className="text-xl font-bold text-red-600">₱{stats.total.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t('utang.overdue')}</p>
                <p className="text-xl font-bold text-orange-600">{stats.overdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t('utang.paid')}</p>
                <p className="text-xl font-bold text-green-600">{stats.paid}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t('utang.partialPayment')}</p>
                <p className="text-xl font-bold text-blue-600">{stats.partial}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <UtangFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Records List */}
      <div className="grid gap-4">
        {filteredRecords.map((record) => (
          <ConsolidatedUtangCard
            key={record.customerId}
            record={record}
            onPayment={openPaymentDialog}
          />
        ))}
        
        {filteredRecords.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('utang.noRecords')}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Payment Dialog */}
      {selectedCustomer && (
        <PaymentDialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          customer={selectedCustomer}
          onPayment={handlePayment}
        />
      )}
    </div>
  );
};

export default UtangManagement;
