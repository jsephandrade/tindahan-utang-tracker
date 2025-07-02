
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Package, 
  Users, 
  CreditCard,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import Dashboard from "@/components/Dashboard";
import POSSystem from "@/components/POSSystem";
import InventoryManagement from "@/components/InventoryManagement";
import UtangManagement from "@/components/UtangManagement";
import CustomerManagement from "@/components/CustomerManagement";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-900 mb-2">
            Sari-Sari Store Management System
          </h1>
          <p className="text-orange-700">
            Comprehensive solution for managing your store operations
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-white shadow-sm">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900"
            >
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="pos" 
              className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900"
            >
              <ShoppingCart className="h-4 w-4" />
              POS
            </TabsTrigger>
            <TabsTrigger 
              value="inventory" 
              className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900"
            >
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger 
              value="utang" 
              className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900"
            >
              <CreditCard className="h-4 w-4" />
              Utang
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900"
            >
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="pos">
            <POSSystem />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManagement />
          </TabsContent>

          <TabsContent value="utang">
            <UtangManagement />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
