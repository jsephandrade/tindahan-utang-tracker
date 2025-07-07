
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Search, Plus, Eye } from "lucide-react";

const TransactionManagement = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock transaction data
  const transactions = [
    {
      id: "TXN001",
      date: "2024-01-07",
      customer: "Juan Dela Cruz",
      type: "purchase",
      amount: 250.00,
      status: "completed"
    },
    {
      id: "TXN002", 
      date: "2024-01-07",
      customer: "Maria Santos",
      type: "payment",
      amount: 150.00,
      status: "pending"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Transaction Management
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium">{transaction.id}</span>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{transaction.customer}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        ₱{transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {transaction.type}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionManagement;
