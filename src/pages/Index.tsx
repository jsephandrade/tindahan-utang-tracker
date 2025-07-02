
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
import { Button } from "@/components/ui/button";
import Dashboard from "@/components/Dashboard";
import POSSystem from "@/components/POSSystem";
import InventoryManagement from "@/components/InventoryManagement";
import UtangManagement from "@/components/UtangManagement";
import CustomerManagement from "@/components/CustomerManagement";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { value: "dashboard", label: "Dashboard", shortLabel: "Dash", icon: TrendingUp, color: "from-blue-500 to-blue-600" },
    { value: "pos", label: "POS", shortLabel: "POS", icon: ShoppingCart, color: "from-green-500 to-green-600" },
    { value: "inventory", label: "Inventory", shortLabel: "Stock", icon: Package, color: "from-purple-500 to-purple-600" },
    { value: "utang", label: "Utang", shortLabel: "Utang", icon: CreditCard, color: "from-red-500 to-red-600" },
    { value: "customers", label: "Customers", shortLabel: "Customers", icon: Users, color: "from-indigo-500 to-indigo-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 relative overflow-x-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, orange 2px, transparent 0), radial-gradient(circle at 75px 75px, red 2px, transparent 0)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="container mx-auto px-3 py-4 max-w-7xl relative z-10">
        {/* Enhanced Header */}
        <div className="mb-6 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-20"></div>
          <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-800 to-red-800 bg-clip-text text-transparent mb-2">
                    🏪 Tindahan Manager
                  </h1>
                  <p className="text-xs sm:text-sm text-orange-700/80">
                    Your complete sari-sari store solution
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Navigation */}
          <div className="relative mb-6">
            <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm shadow-lg border-0 h-auto p-1 rounded-2xl">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value}
                    className={`
                      flex items-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 text-sm font-medium
                      ${isActive 
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105` 
                        : 'hover:bg-orange-50 text-gray-600 hover:text-orange-800'
                      }
                    `}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Enhanced Tab Content with Animations */}
          <div className="relative">
            <TabsContent value="dashboard" className="mt-0 animate-fade-in">
              <Dashboard />
            </TabsContent>

            <TabsContent value="pos" className="mt-0 animate-fade-in">
              <POSSystem />
            </TabsContent>

            <TabsContent value="inventory" className="mt-0 animate-fade-in">
              <InventoryManagement />
            </TabsContent>

            <TabsContent value="utang" className="mt-0 animate-fade-in">
              <UtangManagement />
            </TabsContent>

            <TabsContent value="customers" className="mt-0 animate-fade-in">
              <CustomerManagement />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
