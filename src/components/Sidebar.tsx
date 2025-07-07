
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { X, Calculator, Users, Receipt, BarChart3 } from "lucide-react";

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ isMobile = false, onClose, activeTab, setActiveTab }: SidebarProps) => {
  const { t } = useTranslation();

  const menuItems = [
    { id: "utang", label: "Utang Management", icon: Calculator },
    { id: "customers", label: "Customer Management", icon: Users },
    { id: "transactions", label: "Transaction Management", icon: Receipt },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ];

  const handleMenuClick = (tabId: string) => {
    setActiveTab(tabId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className={`${isMobile ? 'w-full h-full' : 'w-64 h-screen'} bg-white border-r border-gray-200 fixed left-0 top-0 z-40`}>
      <Card className="h-full rounded-none border-0">
        <CardContent className="p-4 h-full flex flex-col">
          {isMobile && (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
          
          <div className="flex-1">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleMenuClick(item.id)}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
