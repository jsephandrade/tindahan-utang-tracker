import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import RealTimeClock from "@/components/RealTimeClock";
import Sidebar from "@/components/Sidebar";
import UtangManagement from "@/components/UtangManagement";
import CustomerManagement from "@/components/CustomerManagement";
import TransactionManagement from "@/components/TransactionManagement";
import Reports from "@/components/Reports";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";
import PWAInstallButton from "@/components/PWAInstallButton";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("utang");
  const { t } = useTranslation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Mobile Navigation */}
      <div className="md:hidden p-4">
        <Card className="shadow-md">
          <CardContent className="flex items-center justify-between">
            <button onClick={toggleMobileMenu}>
              <Menu className="h-6 w-6" />
            </button>
            <RealTimeClock />
            <LanguageSwitcher />
          </CardContent>
        </Card>
        {isMobileMenuOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-white z-50">
            <Sidebar
              isMobile={true}
              onClose={toggleMobileMenu}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 ml-64">
          {/* Header with Language Switcher, Clock, and PWA Install */}
          <div className="mb-6 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-20"></div>
            <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-4 flex justify-end items-center gap-3">
                <PWAInstallButton />
                <RealTimeClock />
                <LanguageSwitcher />
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          {activeTab === "utang" && <UtangManagement />}
          {activeTab === "customers" && <CustomerManagement />}
          {activeTab === "transactions" && <TransactionManagement />}
          {activeTab === "reports" && <Reports />}
        </div>
      </div>
    </div>
  );
};

export default Index;
