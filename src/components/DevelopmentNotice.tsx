import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useImmersiveMode } from "../contexts/ImmersiveModeContext";

const DevelopmentNotice = () => {
  const { isImmersiveMode, immersiveModeType } = useImmersiveMode();

  // Update body margin and CSS custom property to push entire website down
  useEffect(() => {
    if (!isImmersiveMode) {
      document.body.style.marginTop = '40px';
      document.body.style.transition = 'margin-top 0.3s ease-in-out';
      // Set CSS custom property for other components to use
      document.documentElement.style.setProperty('--dev-notice-height', '40px');
    } else {
      // Remove margin when in immersive mode
      document.body.style.marginTop = '0px';
      document.documentElement.style.setProperty('--dev-notice-height', '0px');
    }
    
    return () => {
      // Cleanup on unmount
      document.body.style.marginTop = '0px';
      document.documentElement.style.setProperty('--dev-notice-height', '0px');
    };
  }, [isImmersiveMode]);

  // Don't render the banner when in immersive mode (VR/AR)
  if (isImmersiveMode) {
    console.log(`🎮 Development notice hidden during ${immersiveModeType?.toUpperCase()} mode`);
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-forest-600 to-autumn-600 dark:from-forest-700 dark:to-autumn-700 text-white py-2 px-4 fixed top-0 left-0 right-0 z-[60] h-[40px]">
      <div className="max-w-7xl mx-auto flex items-center justify-center h-full">
        <div className="flex items-center gap-2 justify-center">
          <Sparkles className="w-4 h-4 flex-shrink-0 animate-pulse text-autumn-200" />
          <p className="text-xs md:text-sm font-medium text-center">
            <span className="font-semibold text-white">🎯 Demo Implementation</span> <span className="text-forest-100">This project is implemented as a demonstration - Experience Jharkhand's digital tourism platform</span> <span className="text-autumn-200">✨</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentNotice;