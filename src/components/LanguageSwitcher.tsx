import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bis' : 'en');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-orange-200 hover:bg-orange-50 hover:border-orange-300"
    >
      <Languages className="h-4 w-4" />
      <span className="text-sm font-medium">
        {language === 'en' ? 'EN' : 'BIS'}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;