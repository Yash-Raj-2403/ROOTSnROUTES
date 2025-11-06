import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe, Languages, ChevronDown, User, LogOut, Menu, X, Settings, Heart, Flag, Mountain, TreePine, BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { useState, useRef, useCallback } from "react";

const Header = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavClick = (path: string, label: string) => {
    console.log(`Navigation clicked: ${label} -> ${path}`);
    console.log(`Current location: ${location.pathname}`);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as 'en' | 'hi' | 'snt');
  };

  const getLanguageDisplay = (lang: string) => {
    switch (lang) {
      case 'en':
        return { 
          name: 'English', 
          flag: '🇺🇸',
          icon: Flag,
          color: 'text-primary'
        };
      case 'hi':
        return { 
          name: 'हिंदी (Hindi)', 
          flag: '🇮🇳',
          icon: Flag,
          color: 'text-orange-500'
        };
      case 'snt':
        return { 
          name: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)', 
          flag: '🏔️',
          icon: Mountain,
          color: 'text-accent'
        };
      case 'ho':
        return { 
          name: 'हो (Ho)', 
          flag: '🌲',
          icon: TreePine,
          color: 'text-emerald-600'
        };
      case 'mun':
        return { 
          name: 'मुंडारी (Mundari)', 
          flag: '🌿',
          icon: TreePine,
          color: 'text-forest-600'
        };
      case 'kur':
        return { 
          name: 'कुरुख (Kurukh)', 
          flag: '⛰️',
          icon: Mountain,
          color: 'text-amber-600'
        };
      case 'kha':
        return { 
          name: 'खड़िया (Kharia)', 
          flag: '🌳',
          icon: TreePine,
          color: 'text-teal-600'
        };
      default:
        return { 
          name: 'English', 
          flag: '🇺🇸',
          icon: Flag,
          color: 'text-primary'
        };
    }
  };

  return (
    <>
      {/* Skip Links for Accessibility */}
      <div className="skip-links">
        <a 
          href="#main-content" 
          className="skip-nav sr-only-focusable"
          onClick={(e) => {
            e.preventDefault();
            const mainContent = document.getElementById('main-content') || document.querySelector('main');
            if (mainContent) {
              (mainContent as HTMLElement).focus();
              (mainContent as HTMLElement).scrollIntoView();
            }
          }}
        >
          Skip to main content
        </a>
        <a 
          href="#navigation" 
          className="skip-nav sr-only-focusable"
          onClick={(e) => {
            e.preventDefault();
            const navigation = document.getElementById('navigation') || document.querySelector('nav');
            if (navigation) {
              (navigation as HTMLElement).focus();
              (navigation as HTMLElement).scrollIntoView();
            }
          }}
        >
          Skip to navigation
        </a>
      </div>

      <header 
        className="fixed left-0 right-0 z-40 nav-brand border-b border-border/50 transition-all duration-300 min-h-[64px] md:min-h-[72px]"
        style={{ top: 'var(--dev-notice-height, 0px)' }}
        role="banner"
        aria-label="Main navigation"
      >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-4 h-10 md:h-12">
          {/* Logo */}
          <Link 
            to="/" 
            className="logo-enhanced flex-shrink-0 hover:opacity-80 transition-opacity"
            aria-label="ROOTSnROUTES - Go to homepage"
          >
            <Logo size={40} showText={true} />
          </Link>

          {/* Navigation */}
          <nav 
            id="navigation"
            className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6"
            role="navigation"
            aria-label="Primary navigation"
          >
            <Link 
              to="/" 
              className={`nav-brand-item text-sm ${
                isActive('/') ? 'active' : ''
              }`}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              {t('header.home')}
            </Link>
            <Link 
              to="/explore" 
              className={`nav-brand-item text-sm ${
                isActive('/explore') ? 'active' : ''
              }`}
              onClick={() => handleNavClick('/explore', 'Explore')}
              aria-current={isActive('/explore') ? 'page' : undefined}
              aria-label="Explore destinations, hotels, restaurants and more in Jharkhand"
            >
              {t('header.explore')}
            </Link>

            {/* AI Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`nav-brand-item text-sm flex items-center gap-1 ${
                    (isActive('/ai-trip-planner') || isActive('/smart-weather') || isActive('/predictive-booking')) ? 'active' : ''
                  }`}
                  aria-label="AI Services menu"
                >
                  {t('header.aiServices')}
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link 
                    to="/ai-trip-planner" 
                    className="flex items-center w-full"
                    onClick={() => handleNavClick('/ai-trip-planner', 'AI Trip Planner')}
                  >
                    <span className="mr-3">🧭</span>
                    <div>
                      <div className="font-medium">{t('header.aiTripPlanner')}</div>
                      <div className="text-xs text-muted-foreground">{t('header.aiTripPlannerDesc')}</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/smart-weather" 
                    className="flex items-center w-full"
                    onClick={() => handleNavClick('/smart-weather', 'Smart Weather')}
                  >
                    <span className="mr-3">🌤️</span>
                    <div>
                      <div className="font-medium">{t('header.smartWeather')}</div>
                      <div className="text-xs text-muted-foreground">{t('header.smartWeatherDesc')}</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/predictive-booking" 
                    className="flex items-center w-full"
                    onClick={() => handleNavClick('/predictive-booking', 'Smart Booking')}
                  >
                    <span className="mr-3">🎯</span>
                    <div>
                      <div className="font-medium">{t('header.smartBooking')}</div>
                      <div className="text-xs text-muted-foreground">{t('header.smartBookingDesc')}</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/analytics-dashboard" 
                    className="flex items-center w-full"
                    onClick={() => handleNavClick('/analytics-dashboard', 'Tourism Insights')}
                  >
                    <span className="mr-3">📊</span>
                    <div>
                      <div className="font-medium">Tourism Insights</div>
                      <div className="text-xs text-muted-foreground">Data analytics</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link 
              to="/about" 
              className={`nav-brand-item text-sm ${
                isActive('/about') ? 'active' : ''
              }`}
              aria-current={isActive('/about') ? 'page' : undefined}
              aria-label="About ROOTSnROUTES platform and mission"
            >
              {t('header.about')}
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0 min-w-0">
            {/* Mobile Menu Button - Only on small screens */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden p-2 w-9 h-9 flex-shrink-0"
                  aria-label="Open mobile menu"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <Logo size={32} showText={true} />
                  </div>
                  
                  {/* Mobile Navigation Links */}
                  <nav 
                    className="flex flex-col space-y-0 p-4"
                    role="navigation"
                    aria-label="Mobile navigation"
                  >
                    <Link 
                      to="/" 
                      className={`p-3 rounded-lg transition-colors ${
                        isActive('/') ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-accent'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive('/') ? 'page' : undefined}
                      aria-label="Home - ROOTSnROUTES main page"
                    >
                      {t('header.home')}
                    </Link>
                    <Link 
                      to="/explore" 
                      className={`p-3 rounded-lg transition-colors ${
                        isActive('/explore') ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-accent'
                      }`}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleNavClick('/explore', 'Explore');
                      }}
                    >
                      {t('header.explore')}
                    </Link>
                    
                    {/* AI Services Section */}
                    <div className="border-t pt-2 mt-2">
                      <div className="text-xs font-medium text-muted-foreground px-3 py-2">{t('header.aiServices').toUpperCase()}</div>
                      
                      <Link 
                        to="/ai-trip-planner" 
                        className={`p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                          isActive('/ai-trip-planner') ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-accent'
                        }`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleNavClick('/ai-trip-planner', 'AI Trip Planner');
                        }}
                      >
                        <span>🧭</span>
                        <div>
                          <div className="font-medium">{t('header.aiTripPlanner')}</div>
                          <div className="text-xs text-muted-foreground">{t('header.aiTripPlannerDesc')}</div>
                        </div>
                      </Link>
                      
                      <Link 
                        to="/smart-weather" 
                        className={`p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                          isActive('/smart-weather') ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-accent'
                        }`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleNavClick('/smart-weather', 'Smart Weather');
                        }}
                      >
                        <span>🌤️</span>
                        <div>
                          <div className="font-medium">{t('header.smartWeather')}</div>
                          <div className="text-xs text-muted-foreground">{t('header.smartWeatherDesc')}</div>
                        </div>
                      </Link>
                      
                      <Link 
                        to="/predictive-booking" 
                        className={`p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                          isActive('/predictive-booking') ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-accent'
                        }`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleNavClick('/predictive-booking', 'Smart Booking');
                        }}
                      >
                        <span>🎯</span>
                        <div>
                          <div className="font-medium">{t('header.smartBooking')}</div>
                          <div className="text-xs text-muted-foreground">{t('header.smartBookingDesc')}</div>
                        </div>
                      </Link>
                      
                      <Link 
                        to="/analytics-dashboard" 
                        className={`p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                          isActive('/analytics-dashboard') ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-accent'
                        }`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleNavClick('/analytics-dashboard', 'Tourism Insights');
                        }}
                      >
                        <span>📊</span>
                        <div>
                          <div className="font-medium">Tourism Insights</div>
                          <div className="text-xs text-muted-foreground">Data analytics</div>
                        </div>
                      </Link>
                    </div>
                    
                    <Link 
                      to="/about" 
                      className={`p-3 rounded-lg transition-colors ${
                        isActive('/about') ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-accent'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('header.about')}
                    </Link>
                  </nav>
                  
                  {/* Mobile Actions */}
                  <div className="mt-auto p-4 border-t space-y-3">
                    {/* Mobile Login/Profile Section */}
                    {user ? (
                      <div className="space-y-3">
                        {/* User Profile Button */}
                        <Link
                          to="/profile"
                          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.user_metadata?.avatar_url || user.user_metadata?.picture} />
                            <AvatarFallback className="bg-gradient-to-br from-forest-600 to-autumn-600 text-white text-xs">
                              {(user.user_metadata?.name || user.email || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-sm">{user.user_metadata?.name || 'User'}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </Link>
                        
                        {/* Sign Out Button */}
                        <Button
                          onClick={async () => {
                            await signOut();
                            setMobileMenuOpen(false);
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          setShowLoginModal(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                        size="lg"
                      >
                        <User className="w-5 h-5" />
                        <span>Login</span>
                      </Button>
                    )}
                    
                    {/* Mobile Language Selector */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <span className="mr-1 text-sm">{getLanguageDisplay(language).flag}</span>
                          <Globe className="w-4 h-4 mr-2" />
                          <span>{getLanguageDisplay(language).name}</span>
                          <ChevronDown className="w-3 h-3 ml-auto" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                          <span className="mr-2 text-sm">{getLanguageDisplay('en').flag}</span>
                          <span>English</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLanguageChange('hi')}>
                          <span className="mr-2 text-sm">{getLanguageDisplay('hi').flag}</span>
                          <span>हिंदी (Hindi)</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLanguageChange('snt')}>
                          <span className="mr-2 text-sm">{getLanguageDisplay('snt').flag}</span>
                          <span>ᱥᱟᱱᱛᱟᱲᱤ (Santali)</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLanguageChange('ho')}>
                          <span className="mr-2 text-sm">{getLanguageDisplay('ho').flag}</span>
                          <span>हो (Ho)</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLanguageChange('mun')}>
                          <span className="mr-2 text-sm">{getLanguageDisplay('mun').flag}</span>
                          <span>मुंडारी (Mundari)</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLanguageChange('kur')}>
                          <span className="mr-2 text-sm">{getLanguageDisplay('kur').flag}</span>
                          <span>कुरुख (Kurukh)</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLanguageChange('kha')}>
                          <span className="mr-2 text-sm">{getLanguageDisplay('kha').flag}</span>
                          <span>खड़िया (Kharia)</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {/* Mobile Theme Toggle */}
                    <div className="flex items-center justify-center pt-2">
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Language Dropdown - Compact on medium, full on large */}
            <div className="hidden sm:block flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="
                      flex items-center gap-1 lg:gap-2 
                      border-border/60 dark:border-border
                      bg-background/80 dark:bg-forest-900
                      hover:bg-accent/20 dark:hover:bg-autumn-800
                      text-foreground dark:text-foreground
                      min-w-[50px] sm:min-w-[60px] md:min-w-[70px] lg:min-w-[120px] 
                      h-8 lg:h-9
                      transition-all duration-300 ease-smooth
                      backdrop-blur-sm
                      shadow-lg shadow-primary/10 dark:shadow-organic
                      hover:shadow-xl hover:shadow-primary/20 dark:hover:shadow-organic
                      px-1.5 sm:px-2 lg:px-3
                      flex-shrink-0
                      text-xs lg:text-sm
                      hover:scale-105
                    "
                  >
                    <span className="mr-1 text-sm">{getLanguageDisplay(language).flag}</span>
                    <Globe className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="text-xs lg:text-sm font-medium">
                      <span>{getLanguageDisplay(language).name}</span>
                    </span>
                    <ChevronDown className="w-2 h-2 lg:w-3 lg:h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="
                    w-40 
                    bg-popover/95 dark:bg-card/95
                    border-border/60 dark:border-border
                    backdrop-blur-md
                    shadow-xl shadow-primary/15 dark:shadow-organic
                  "
                >
                  <DropdownMenuItem 
                    onClick={() => handleLanguageChange('en')}
                    className={`
                      flex items-center cursor-pointer 
                      hover:bg-accent/20 dark:hover:bg-forest-800
                      text-foreground dark:text-foreground
                      ${language === 'en' ? 'bg-primary/10 dark:bg-autumn-800' : ''}
                    `}
                  >
                    <span className="mr-2 text-sm">{getLanguageDisplay('en').flag}</span>
                    <span>English</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleLanguageChange('hi')}
                    className={`
                      flex items-center cursor-pointer 
                      hover:bg-accent/20 dark:hover:bg-forest-800
                      text-foreground dark:text-foreground
                      ${language === 'hi' ? 'bg-primary/10 dark:bg-autumn-800' : ''}
                    `}
                  >
                    <span className="mr-2 text-sm">{getLanguageDisplay('hi').flag}</span>
                    <span>हिंदी (Hindi)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleLanguageChange('snt')}
                    className={`
                      flex items-center cursor-pointer 
                      hover:bg-accent/20 dark:hover:bg-forest-800
                      text-foreground dark:text-foreground
                      ${language === 'snt' ? 'bg-primary/10 dark:bg-autumn-800' : ''}
                    `}
                  >
                    <span className="mr-2 text-sm">{getLanguageDisplay('snt').flag}</span>
                    <span>ᱥᱟᱱᱛᱟᱲᱤ (Santali)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleLanguageChange('ho')}
                    className={`
                      flex items-center cursor-pointer 
                      hover:bg-accent/20 dark:hover:bg-forest-800
                      text-foreground dark:text-foreground
                      ${language === 'ho' ? 'bg-primary/10 dark:bg-autumn-800' : ''}
                    `}
                  >
                    <span className="mr-2 text-sm">{getLanguageDisplay('ho').flag}</span>
                    <span>हो (Ho)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleLanguageChange('mun')}
                    className={`
                      flex items-center cursor-pointer 
                      hover:bg-accent/20 dark:hover:bg-forest-800
                      text-foreground dark:text-foreground
                      ${language === 'mun' ? 'bg-primary/10 dark:bg-autumn-800' : ''}
                    `}
                  >
                    <span className="mr-2 text-sm">{getLanguageDisplay('mun').flag}</span>
                    <span>मुंडारी (Mundari)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleLanguageChange('kur')}
                    className={`
                      flex items-center cursor-pointer 
                      hover:bg-forest-800
                      ${language === 'kur' ? 'bg-autumn-800' : ''}
                    `}
                  >
                    <span className="mr-2 text-sm">{getLanguageDisplay('kur').flag}</span>
                    <span>कुरुख (Kurukh)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleLanguageChange('kha')}
                    className={`
                      flex items-center cursor-pointer 
                      hover:bg-forest-800
                      ${language === 'kha' ? 'bg-autumn-800' : ''}
                    `}
                  >
                    <span className="mr-2 text-sm">{getLanguageDisplay('kha').flag}</span>
                    <span>खड़िया (Kharia)</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Theme Toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            
            {/* Login/Profile Section - Rightmost */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1 lg:gap-2 hover:bg-accent p-1 lg:p-2 flex-shrink-0 h-8 lg:h-9">
                    <Avatar className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url || user.user_metadata?.picture} />
                      <AvatarFallback className="bg-gradient-to-br from-forest-600 to-autumn-600 text-white text-xs lg:text-sm">
                        {(user.user_metadata?.name || user.email || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs lg:text-sm font-medium hidden md:inline max-w-[80px] truncate">{user.user_metadata?.name || 'User'}</span>
                    <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="flex items-center space-x-2">
                      <Heart className="h-4 w-4" />
                      <span>Favorites</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-bookings" className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>My Bookings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              ) : (
                <div className="flex-shrink-0 pr-1">
                  <Button
                    onClick={() => {
                      console.log("Header Login clicked!");
                      setShowLoginModal(true);
                    }}
                    variant="default"
                    size="default"
                    className="
                      flex items-center justify-center
                      bg-gradient-to-r from-forest-600 to-autumn-600 
                      hover:from-forest-500 hover:to-autumn-500
                      text-white font-semibold
                      shadow-lg hover:shadow-xl
                      transition-all duration-300
                      hover:scale-105
                      w-10 h-10 sm:w-11 sm:h-11
                      p-0
                      rounded-full
                    "
                    aria-label="Login to your account"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                </div>
              )}
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </header>
    </>
  );
};

export default Header;