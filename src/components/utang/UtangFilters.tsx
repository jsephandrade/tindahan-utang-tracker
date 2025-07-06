
import { Button } from "@/components/ui/button";

interface ConsolidatedUtangRecord {
  customerId: string;
  customerName: string;
  records: any[];
  totalAmount: number;
  totalPaid: number;
  remainingBalance: number;
  status: 'unpaid' | 'partial' | 'paid';
  latestDate: Date;
  earliestDueDate?: Date;
  isOverdue: boolean;
}

interface UtangFiltersProps {
  filterStatus: 'all' | 'unpaid' | 'partial' | 'paid';
  setFilterStatus: (status: 'all' | 'unpaid' | 'partial' | 'paid') => void;
  consolidatedRecords: ConsolidatedUtangRecord[];
}

const UtangFilters = ({ filterStatus, setFilterStatus, consolidatedRecords }: UtangFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2">
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
  );
};

export default UtangFilters;
