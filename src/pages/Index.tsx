import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Package, Users, CreditCard, TrendingUp, AlertTriangle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Dashboard from "@/components/Dashboard";
import POSSystem from "@/components/POSSystem";
import InventoryManagement from "@/components/InventoryManagement";
import UtangManagement from "@/components/UtangManagement";
import CustomerManagement from "@/components/CustomerManagement";
const Index = () => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const tabs = [{
    value: "dashboard",
    label: t('nav.dashboard'),
    shortLabel: "Dash",
    icon: TrendingUp,
    color: "from-blue-500 to-blue-600"
  }, {
    value: "pos",
    label: t('nav.pos'),
    shortLabel: "POS",
    icon: ShoppingCart,
    color: "from-green-500 to-green-600"
  }, {
    value: "inventory",
    label: t('nav.inventory'),
    shortLabel: "Stock",
    icon: Package,
    color: "from-purple-500 to-purple-600"
  }, {
    value: "utang",
    label: t('nav.utang'),
    shortLabel: "Utang",
    icon: CreditCard,
    color: "from-red-500 to-red-600"
  }, {
    value: "customers",
    label: t('nav.customers'),
    shortLabel: "Customers",
    icon: Users,
    color: "from-indigo-500 to-indigo-600"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 relative overflow-x-hidden">
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
            <CardContent className="p-4 flex justify-end">
              <LanguageSwitcher />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Enhanced Mobile-First Navigation */}
          <div className="relative mb-6">
            {/* Desktop Navigation */}
            <TabsList className="hidden sm:grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm shadow-lg border-0 h-auto p-1 rounded-2xl">
              {tabs.map(tab => {
              const isActive = activeTab === tab.value;
              return <TabsTrigger key={tab.value} value={tab.value} className={`
                      flex items-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 text-sm font-medium
                      ${isActive ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105` : 'hover:bg-orange-50 text-gray-600 hover:text-orange-800'}
                    `}>
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </TabsTrigger>;
            })}
            </TabsList>

            {/* Mobile Navigation */}
            <div className="sm:hidden">
              {/* Active Tab Display */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 mb-3">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {(() => {
                      const currentTab = tabs.find(t => t.value === activeTab);
                      return currentTab ? <>
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${currentTab.color}`}>
                              <currentTab.icon className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-semibold text-gray-800">{currentTab.label}</span>
                          </> : null;
                    })()}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Menu Overlay */}
              {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in">
                  <div className="absolute inset-x-0 top-0 bg-white rounded-b-3xl shadow-2xl animate-slide-in-right">
                    <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-800">{t('nav.navigation')}</h3>
                        <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                      
                      <div className="grid gap-3">
                        {tabs.map(tab => {
                      const isActive = activeTab === tab.value;
                      return <button key={tab.value} onClick={() => {
                        setActiveTab(tab.value);
                        setIsMobileMenuOpen(false);
                      }} className={`
                                w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left
                                ${isActive ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105` : 'bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-800'}
                              `}>
                              <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white'}`}>
                                <tab.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                              </div>
                              <div>
                                <div className="font-medium">{tab.label}</div>
                                <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                                  {tab.value === 'dashboard' && t('nav.description.dashboard')}
                                  {tab.value === 'pos' && t('nav.description.pos')}
                                  {tab.value === 'inventory' && t('nav.description.inventory')}
                                  {tab.value === 'utang' && t('nav.description.utang')}
                                  {tab.value === 'customers' && t('nav.description.customers')}
                                </div>
                              </div>
                            </button>;
                    })}
                      </div>
                    </div>
                  </div>
                </div>}
            </div>
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
    </div>;
};
export default Index;