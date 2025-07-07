
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/usePWA";

const PWAInstallButton = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();

  if (!isInstallable || isInstalled) {
    return null;
  }

  return (
    <Button
      onClick={installApp}
      variant="outline"
      size="sm"
      className="bg-white/80 backdrop-blur-sm border-orange-200 text-orange-700 hover:bg-orange-50"
    >
      <Download className="h-4 w-4 mr-2" />
      Install App
    </Button>
  );
};

export default PWAInstallButton;
