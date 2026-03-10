import { motion, AnimatePresence } from 'framer-motion';
import { Github, Mail, ArrowRight, Tv } from 'lucide-react';
import { ReactNode, useState, useEffect } from 'react';
import { Language, translations } from '../lib/i18n';
import { config } from '../config';

interface HeroProps {
  theme: 'light' | 'dark';
  stage: 1 | 2 | 3 | 4;
  userLocation: [number, number] | null;
  distance: number | null;
  language: Language;
  onExplore: () => void;
}

export default function Hero({ theme, stage, userLocation, distance, language, onExplore }: HeroProps) {
  const isDark = theme === 'dark';
  const t = translations[language];
  const isSplit = stage === 4;

  // Determine Main Title Text based on Stage
  let mainTitle = "";
  let titleKey = ""; // Stable key for animation

  if (stage === 1) {
    mainTitle = t.greeting;
    titleKey = `greeting-${language}`;
  } else if (stage === 2) {
    mainTitle = userLocation ? t.foundUser : t.void;
    titleKey = `found-${language}-${!!userLocation}`;
  } else {
    // Stage 3 and 4 share the same title "WhyLIM"
    mainTitle = config.name;
    titleKey = "whylim-static"; 
  }

  const [hitokoto, setHitokoto] = useState<{ text: string, from: string } | null>(null);

  useEffect(() => {
    fetch('https://v1.hitokoto.cn')
      .then(response => response.json())
      .then(data => {
        const author = data.from_who || data.from;
        setHitokoto({ text: data.hitokoto, from: author });
      })
      .catch(error => {
        console.error('Error fetching hitokoto:', error);
        setHitokoto({ text: "Life is what happens when you're busy making other plans.", from: "John Lennon" });
      });
  }, []);

  return (
    <motion.div
      layout
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={`relative z-10 flex flex-col min-h-full lg:min-h-0 lg:h-full px-6 md:px-12 transition-colors duration-700 ${
        isSplit ? 'items-center lg:items-start justify-center w-full lg:w-1/2 px-6 lg:pl-32 lg:pr-12 pt-20 lg:pt-0' : 'items-center justify-center w-full text-center'
      } ${isDark ? 'text-white' : 'text-gray-900'}`}
    >
      {/* Decorative Line - Removed */}
      
      {/* Dynamic Main Title */}
      <motion.div 
        layout
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className={`flex flex-col ${isSplit ? 'items-center lg:items-start text-center lg:text-left w-full max-w-xl' : 'items-center text-center max-w-4xl'}`}
      >
        <AnimatePresence mode="wait">
          <motion.h1 
            key={titleKey}
            layout="position"
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className={`font-serif font-medium tracking-tight leading-tight mb-6 ${
              isSplit 
                ? 'text-5xl md:text-7xl lg:text-8xl' 
                : 'text-5xl md:text-7xl lg:text-9xl'
            }`}
          >
            {mainTitle}
          </motion.h1>
        </AnimatePresence>
        
        {/* Hitokoto Quote with Blur Background */}
        {hitokoto && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: stage >= 3 ? 1 : 0, y: stage >= 3 ? 0 : 10 }}
            transition={{ delay: 1, duration: 0.8 }}
            className={`mb-8 p-5 rounded-3xl backdrop-blur-md border w-full transition-colors duration-500 ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/70 border-white/60 shadow-xl'
            }`}
          >
            <p className={`font-serif italic opacity-90 leading-relaxed ${isSplit ? 'text-center lg:text-left text-base' : 'text-center text-lg md:text-xl'}`}>
              "{hitokoto.text}"
            </p>
            <div className={`mt-3 text-xs font-sans font-medium tracking-wide opacity-60 flex items-center gap-2 ${isSplit ? 'justify-center lg:justify-start' : 'justify-center'}`}>
              <span className="w-4 h-px bg-current opacity-50"></span>
              <span>{hitokoto.from}</span>
            </div>
          </motion.div>
        )}

        {/* Distance Indicator & Actions */}
        <AnimatePresence>
          {(stage === 3 || stage === 4) && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className={`flex flex-col gap-6 w-full ${isSplit ? 'items-center lg:items-start' : 'items-center'}`}
            >
              <div className={`flex items-center gap-4 ${isSplit ? 'justify-center lg:justify-start' : 'justify-center'}`}>
                {/* Distance Capsule */}
                <div className={`inline-flex items-center gap-2.5 px-5 h-12 rounded-full backdrop-blur-md border transition-colors ${
                   isDark 
                     ? 'bg-white/5 border-white/10 text-gray-300' 
                     : 'bg-white/70 border-white/60 shadow-xl text-gray-600'
                }`}>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${distance !== null ? 'bg-gold-400' : 'bg-gray-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${distance !== null ? 'bg-gold-500' : 'bg-gray-500'}`}></span>
                  </span>
                  <span className="font-mono text-xs md:text-sm tracking-wide font-medium">
                    {distance !== null ? (
                      <>
                        {t.distance} <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{distance.toLocaleString()}</span> {t.km}
                      </>
                    ) : (
                      <span>{t.unknownLocation}</span>
                    )}
                  </span>
                </div>

                {/* Explore Button (Stage 3 only) */}
                {stage === 3 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onExplore}
                    className={`group flex items-center gap-3 px-6 h-12 rounded-full text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                      isDark 
                        ? 'bg-gold-400 text-black hover:bg-gold-500' 
                        : 'bg-gold-500 text-white hover:bg-gold-600'
                    }`}
                  >
                    {t.explore}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                )}
              </div>

              {/* Social Icons (Stage 4 only) */}
              {stage === 4 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`flex items-center gap-3 ${isSplit ? 'justify-center lg:justify-start' : 'justify-center'}`}
                >
                  <SocialIcon href={config.social.github} icon={<Github size={20} />} isDark={isDark} />
                  <SocialIcon href={config.social.email} icon={<Mail size={20} />} isDark={isDark} />
                  <SocialIcon href={config.social.bilibili} icon={<Tv size={20} />} isDark={isDark} />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Indicator for Mobile (Stage 4 only) */}
        {stage === 4 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 1, 
              duration: 1, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
            className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 lg:hidden ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <ArrowRight className="rotate-90" size={24} />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function SocialIcon({ href, icon, isDark }: { href: string; icon: ReactNode; isDark: boolean }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`p-2 rounded-full transition-colors ${
        isDark 
          ? 'hover:bg-white/10 text-gray-400 hover:text-gold-400' 
          : 'hover:bg-black/5 text-gray-500 hover:text-gold-400'
      }`}
    >
      {icon}
    </a>
  );
}
