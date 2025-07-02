
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
      <div className="container mx-auto px-3 py-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-900 mb-2">
            Sari-Sari Store Management
          </h1>
          <p className="text-sm sm:text-base text-orange-700">
            Comprehensive solution for managing your store operations
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-4 sm:mb-6 bg-white shadow-sm h-auto p-1">
            <TabsTrigger 
              value="dashboard" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900 text-xs sm:text-sm py-2 sm:py-2.5"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden text-xs">Dash</span>
            </TabsTrigger>
            <TabsTrigger 
              value="pos" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900 text-xs sm:text-sm py-2 sm:py-2.5"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>POS</span>
            </TabsTrigger>
            <TabsTrigger 
              value="inventory" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900 text-xs sm:text-sm py-2 sm:py-2.5"
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Inventory</span>
              <span className="sm:hidden text-xs">Stock</span>
            </TabsTrigger>
            <TabsTrigger 
              value="utang" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900 text-xs sm:text-sm py-2 sm:py-2.5"
            >
              <CreditCard className="h-4 w-4" />
              <span>Utang</span>
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900 text-xs sm:text-sm py-2 sm:py-2.5 col-span-2 sm:col-span-1"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Customers</span>
              <span className="sm:hidden text-xs">Customers</span>
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
