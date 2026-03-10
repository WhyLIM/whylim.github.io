/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import MapBackground from './components/MapBackground';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import ThemeToggle from './components/ThemeToggle';
import LanguageToggle from './components/LanguageToggle';
import AnimationControl from './components/AnimationControl';
import { Language, translations } from './lib/i18n';
import { calculateDistance } from './lib/geo';
import { AnimatePresence, motion } from 'framer-motion';
import { TrainFront } from 'lucide-react';
import { config } from './config';

export default function App() {
  // State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<Language>('en');
  
  // Animation Skip State
  const [skipAnimation, setSkipAnimation] = useState(() => {
    return localStorage.getItem('skipAnimation') === 'true';
  });

  // If skipping, start at stage 3 (Overview), otherwise stage 1
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(() => skipAnimation ? 3 : 1);
  
  // Track if we are in the initial "skipped" state to force duration=0
  const [isSkippedLoad, setIsSkippedLoad] = useState(skipAnimation);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  
  // Owner location (e.g., Shanghai)
  const ownerLocation = config.ownerLocation; 

  useEffect(() => {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    // Get user location immediately but silently
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (typeof latitude === 'number' && typeof longitude === 'number' && !isNaN(latitude) && !isNaN(longitude)) {
            setUserLocation([latitude, longitude]);
            // Calculate distance
            const d = calculateDistance(ownerLocation[0], ownerLocation[1], latitude, longitude);
            setDistance(d);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          // User denied or error - userLocation remains null
        }
      );
    }
  }, []);

  // Effect to persist skipAnimation
  useEffect(() => {
    localStorage.setItem('skipAnimation', String(skipAnimation));
  }, [skipAnimation]);

  // Animation Sequence Timer
  useEffect(() => {
    if (stage === 1) {
      const timer = setTimeout(() => setStage(2), 4000);
      return () => clearTimeout(timer);
    }
    if (stage === 2) {
      const timer = setTimeout(() => setStage(3), 4000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const toggleSkip = () => {
    setSkipAnimation(prev => !prev);
  };

  const handleReplay = () => {
    setIsSkippedLoad(false); // Enable animation duration
    setStage(1); // Restart sequence
  };

  const handleExplore = () => {
    setStage(4);
  };

  const t = translations[language];

  // Determine if we should animate: true if NOT skipping load
  const shouldAnimate = !isSkippedLoad;

  return (
    <main className={`relative w-full h-screen flex flex-col transition-colors duration-700 overflow-hidden ${
      theme === 'dark' ? 'bg-[#121212]' : 'bg-[#F9F8F4]'
    }`}>
      <div className="fixed inset-0 z-0">
        <MapBackground 
          theme={theme} 
          userLocation={userLocation} 
          ownerLocation={ownerLocation}
          stage={stage === 4 ? 3 : stage} // Keep map at stage 3 view for stage 4
          shouldAnimate={shouldAnimate}
        />
        {/* Gradient overlay for text readability - Lighter blur in Stage 4 */}
        <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${
           theme === 'dark' 
             ? (stage === 4 ? 'bg-black/60 backdrop-blur-[2px]' : 'bg-gradient-to-b from-black/40 via-transparent to-black/80')
             : (stage === 4 ? 'bg-white/60 backdrop-blur-[2px]' : 'bg-gradient-to-b from-white/60 via-transparent to-white/90')
         }`} />
      </div>

      {/* Header - Controls */}
      <header className="w-full p-3 flex justify-end items-center z-50 pointer-events-auto shrink-0">
        <div className="flex items-center gap-3">
          <AnimationControl 
            onReplay={handleReplay} 
            skipAnimation={skipAnimation} 
            toggleSkip={toggleSkip} 
            theme={theme} 
          />
          <LanguageToggle language={language} toggleLanguage={toggleLanguage} theme={theme} />
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </header>

      <motion.div 
        layout
        className="relative z-20 w-full flex-1 min-h-0 flex flex-col lg:flex-row pointer-events-auto overflow-y-auto lg:overflow-hidden"
      >
        
        {/* Left Side (Hero) - Always present, adjusts layout */}
        <Hero 
          theme={theme} 
          stage={stage}
          userLocation={userLocation}
          distance={distance}
          language={language}
          onExplore={handleExplore}
        />

        {/* Right Side (Bento) - Only in Stage 4 */}
        <AnimatePresence>
          {stage === 4 && (
            <motion.div 
              key="bento-container"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:px-8 lg:py-4 lg:h-full lg:overflow-y-auto"
            >
              <BentoGrid theme={theme} language={language} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer - Only visible in Stage 3/4 */}
      <AnimatePresence>
        {stage >= 3 && (
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1, duration: 0.8 }}
            className={`w-full py-4 z-30 flex justify-center items-center text-[length:var(--text-sm)] font-sans opacity-80 hover:opacity-100 transition-opacity pointer-events-auto drop-shadow-md shrink-0 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 px-4 text-center max-w-6xl mx-auto leading-tight">
              <span>Copyright © {config.footer.startYear}-{new Date().getFullYear()} {config.footer.ownerName}</span>
              <span className="hidden sm:inline">|</span>
              <span>Made by {config.footer.ownerName}</span>
              
              {config.footer.upyun.show && (
                <>
                  <span className="hidden sm:inline">|</span>
                  <a href={config.footer.upyun.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gold-400 transition-colors">
                    <img src={theme === 'dark' ? config.footer.upyun.logo.dark : config.footer.upyun.logo.light} alt="Upyun" className="h-3 w-auto opacity-80" referrerPolicy="no-referrer" />
                    {config.footer.upyun.text}
                  </a>
                </>
              )}

              <span className="hidden sm:inline">|</span>
              <a href={config.footer.icp.link} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">{config.footer.icp.text}</a>
              
              <span className="hidden sm:inline">|</span>
              <a href={config.footer.police.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gold-400 transition-colors">
                <img src={config.footer.police.logo} alt="Beian" className="h-3 w-auto opacity-80" referrerPolicy="no-referrer" />
                {config.footer.police.text}
              </a>

              {config.footer.travellings.show && (
                <>
                  <span className="hidden sm:inline">|</span>
                  <a href={config.footer.travellings.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gold-400 transition-colors" title="开往-友链接力">
                    <TrainFront size={12} />
                    {config.footer.travellings.text}
                  </a>
                </>
              )}
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </main>
  );
}
