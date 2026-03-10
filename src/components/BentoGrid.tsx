import { motion, AnimatePresence } from 'framer-motion';
import { Code, Home, BookOpen, ExternalLink, Terminal, School, ArrowRight, Clock, Image as ImageIcon, FileText, Aperture } from 'lucide-react';
import { Language, translations } from '../lib/i18n';
import { useState, useEffect } from 'react';
import { config } from '../config';

interface BentoGridProps {
  theme: 'light' | 'dark';
  language: Language;
}

export default function BentoGrid({ theme, language }: BentoGridProps) {
  const isDark = theme === 'dark';
  const t = translations[language].bento;
  const [page, setPage] = useState<'main' | 'more'>('main');

  // Reset page when language changes
  useEffect(() => {
    // setPage('main'); 
  }, [language]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { opacity: 0, scale: 0.9, y: 20 }
  };

  const cardClass = `relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl group ${
    isDark 
      ? 'bg-white/5 border border-white/10 hover:bg-white/10' 
      : 'bg-white/70 border border-white/60 hover:bg-white/80 shadow-xl'
  } backdrop-blur-md`;

  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';

  // Helper for corner labels
  const CornerLabel = ({ 
    icon: Icon, 
    text, 
    isImage = false,
    position = 'left'
  }: { 
    icon: any, 
    text: string, 
    isImage?: boolean,
    position?: 'left' | 'right'
  }) => (
    <div className={`absolute top-6 flex items-center gap-2 ${
      position === 'right' ? 'right-6' : 'left-6'
    } ${
      isImage 
        ? 'text-white/90 drop-shadow-md' 
        : (isDark ? 'text-gray-400' : 'text-gray-500')
    } z-20`}>
      <Icon size={14} />
      <span className="text-xs font-sans font-bold tracking-wider uppercase">{text}</span>
    </div>
  );

  // Helper for background image overlay cards
  const ImageOverlay = ({ src, alt }: { src: string, alt: string }) => (
    <div className="absolute inset-0 z-0">
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${alt}/400/400?grayscale`;
        }}
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
    </div>
  );

  // Helper for consistent card links
  const CardLink = ({ href, text, isImage = false }: { href: string, text: string, isImage?: boolean }) => (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`absolute bottom-6 right-6 flex items-center gap-1.5 text-xs font-sans font-medium transition-colors z-20 ${
        isImage 
          ? 'text-white/80 hover:text-white drop-shadow-md' 
          : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black')
      }`}
    >
      <span>{text}</span>
      <ExternalLink size={14} />
    </a>
  );

  // Time Calculation Helper
  const getTimeProgress = () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const dayProgress = ((Date.now() - startOfDay.getTime()) / (24 * 60 * 60 * 1000)) * 100;
    const weekProgress = ((Date.now() - startOfWeek.getTime()) / (7 * 24 * 60 * 60 * 1000)) * 100;
    const monthProgress = (now.getDate() / new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()) * 100;
    const yearProgress = ((Date.now() - startOfYear.getTime()) / (365 * 24 * 60 * 60 * 1000)) * 100;

    return { dayProgress, weekProgress, monthProgress, yearProgress };
  };

  const { dayProgress, weekProgress, monthProgress, yearProgress } = getTimeProgress();

  // Tech Stack Icons (using simple-icons CDN)
  const techStack = config.bento.techStack;

  return (
    <div className="w-full h-full flex items-center justify-center p-5 lg:p-0 relative overflow-y-auto lg:overflow-visible">
      <AnimatePresence mode="wait">
        {page === 'main' ? (
          <motion.div
            key="main-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[minmax(11.5rem,1fr)_minmax(11.5rem,1fr)_minmax(11.5rem,1fr)_auto] gap-4 w-full max-w-2xl lg:h-full lg:max-h-full"
          >
            {/* 1. MBTI Card (2x1) - Top Left */}
            <motion.div variants={itemVariants} className={`${cardClass} col-span-1 md:col-span-2 lg:col-span-2 row-span-1 flex items-center !overflow-visible min-h-[200px] lg:min-h-0`}>
              <CornerLabel icon={Terminal} text="Personality" position="right" />
              <div className="absolute left-[-20px] top-[-20px] w-48 h-48 z-0">
                 <img 
                   src={config.bento.mbti.image} 
                   alt="INFJ" 
                   className="w-full h-full object-contain drop-shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform duration-500"
                   referrerPolicy="no-referrer"
                 />
              </div>
              <div className="relative z-10 ml-auto flex flex-col justify-center h-full text-right items-end w-full">
                <h3 className="text-4xl font-serif font-bold text-[#5B8A72] mb-1">{config.bento.mbti.type}</h3>
                <p className={`text-sm font-sans ${textSecondary} mb-1`}>{config.bento.mbti.desc[language]}</p>
                <div className="flex gap-2 justify-end flex-wrap">
                  {config.bento.mbti.tags[language].map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-gradient-to-br from-[#8FB39A] to-[#5B8A72] text-white text-[10px] font-sans rounded-full font-medium tracking-wide shadow-sm backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <CardLink 
                href={config.bento.mbti.link[language]} 
                text={t.learnMore} 
              />
            </motion.div>

            {/* 2. Hometown (1x1) - Top Right */}
            <motion.div variants={itemVariants} className={`${cardClass} col-span-1 row-span-1 flex flex-col justify-center items-center text-center !p-0 min-h-[200px] lg:min-h-0`}>
              <ImageOverlay src={config.bento.hometown.image} alt="Nantong" />
              <CornerLabel icon={Home} text={t.hometownDesc} isImage={true} />
              <div className="relative z-10 flex flex-col items-center gap-2">
                <h3 className="text-2xl font-serif font-bold text-white drop-shadow-md">{config.bento.hometown.name[language]}</h3>
              </div>
            </motion.div>

            {/* 3. School (1x2) - Left Vertical Column */}
            <motion.div variants={itemVariants} className={`${cardClass} col-span-1 lg:row-span-2 flex flex-col justify-center items-center text-center !p-0 min-h-[200px] lg:min-h-0`}>
              <ImageOverlay src={config.bento.school.logo} alt="SIAT" />
              <CornerLabel icon={School} text={t.schoolDesc} isImage={true} />
              <div className="relative z-10 flex flex-col items-center gap-2">
                <h3 className="text-3xl font-bold text-white drop-shadow-md lg:writing-vertical-rl tracking-widest font-serif whitespace-pre-wrap">
                  {config.bento.school.name[language]}
                </h3>
              </div>
              <CardLink href={config.bento.school.link} text="Visit" isImage={true} />
            </motion.div>

            {/* 4. Tech Stack (2x1) - Middle Row Right */}
            <motion.div variants={itemVariants} className={`${cardClass} col-span-1 md:col-span-2 lg:col-span-2 row-span-1 flex flex-col justify-center overflow-hidden min-h-[160px] lg:min-h-0`}>
              <CornerLabel icon={Code} text={t.tech} />
              <div className="relative w-full overflow-hidden mt-4">
                <div className="flex gap-8 animate-marquee whitespace-nowrap">
                  {[...techStack, ...techStack].map((tech, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
                      <img 
                        src={`https://cdn.simpleicons.org/${tech.icon}/${isDark ? 'white' : 'black'}`} 
                        alt={tech.name}
                        className="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity"
                      />
                      <span className={`text-[10px] font-mono ${textSecondary}`}>{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 5. Undergraduate School (1x1) - Bottom Row Middle */}
            <motion.div variants={itemVariants} className={`${cardClass} col-span-1 row-span-1 flex flex-col justify-center items-center text-center !p-0 min-h-[200px] lg:min-h-0`}>
              <ImageOverlay src={config.bento.undergrad.image} alt="Soochow University" />
              <CornerLabel icon={School} text={t.undergradDesc} isImage={true} />
              <div className="relative z-10 flex flex-col items-center gap-2">
                <h3 className="text-2xl font-serif font-bold text-white drop-shadow-md">{config.bento.undergrad.name[language]}</h3>
              </div>
              <CardLink href={config.bento.undergrad.link} text="Visit" isImage={true} />
            </motion.div>

            {/* 6. Coding Cat (1x1) - Bottom Row Right */}
            <motion.div variants={itemVariants} className={`${cardClass} col-span-1 row-span-1 !p-0 flex items-center justify-center !overflow-visible z-30 min-h-[200px] lg:min-h-0`}>
               <div className="absolute -top-4 -left-4 z-20">
                 <h3 className={`text-4xl font-serif font-bold leading-tight drop-shadow-md transform -rotate-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                   Coding<br/>the World.
                 </h3>
               </div>
              <img 
                src={config.bento.codingCat.image} 
                alt="Coding Cat" 
                className="absolute -bottom-4 -right-4 object-cover opacity-100 transition-opacity"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* View More Button (Grid Item) */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end items-center relative h-12">
              <button 
                onClick={() => setPage('more')}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
              >
                {t.viewMore}
                <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="more-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[minmax(11.5rem,1fr)_minmax(11.5rem,1fr)_minmax(11.5rem,1fr)_auto] gap-4 w-full max-w-2xl lg:h-full lg:max-h-full"
          >
            {/* 1. Time Section (3x2) - Top Rows */}
            <motion.div variants={itemVariants} className={`${cardClass} col-span-1 md:col-span-2 lg:col-span-3 lg:row-span-2 flex flex-col lg:flex-row !p-0`}>
              {/* Left 1/3: Calendar */}
              <div className={`w-full lg:w-1/3 h-auto lg:h-full border-b lg:border-b-0 lg:border-r ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/5'} flex flex-col items-center justify-center p-6 lg:p-4`}>
                <span className="text-xs font-serif italic opacity-60">{new Date().getFullYear()}</span>
                <span className={`text-6xl font-serif font-bold my-2 ${textPrimary}`}>{new Date().getDate()}</span>
                <span className={`text-sm font-sans uppercase tracking-widest ${textSecondary}`}>
                  {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN', { weekday: 'long' })}
                </span>
                <div className="mt-2 w-8 h-px bg-current opacity-20" />
                <span className="mt-2 text-xs font-sans opacity-60">{t.calendar}</span>
              </div>

              {/* Right 2/3: Progress */}
              <div className="w-full lg:w-2/3 h-full p-6 flex flex-col justify-center gap-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-serif font-bold ${textPrimary}`}>{t.timeTitle}</h3>
                  <Clock size={16} className={textSecondary} />
                </div>
                <div className="grid grid-cols-1 gap-y-6">
                  <ProgressBar label={t.day} progress={dayProgress} isDark={isDark} textSecondary={textSecondary} />
                  <ProgressBar label={t.week} progress={weekProgress} isDark={isDark} textSecondary={textSecondary} />
                  <ProgressBar label={t.month} progress={monthProgress} isDark={isDark} textSecondary={textSecondary} />
                  <ProgressBar label={t.year} progress={yearProgress} isDark={isDark} textSecondary={textSecondary} />
                </div>
              </div>
            </motion.div>

            {/* 2. Websites Section - Row 3 */}
            
            {/* CV (1x1) */}
            <motion.div 
              variants={itemVariants} 
              className={`${cardClass} col-span-1 row-span-1 flex flex-col justify-center items-center text-center cursor-pointer group hover:ring-2 hover:ring-blue-500/20 min-h-[200px] lg:min-h-0`}
              onClick={() => window.open(config.bento.cards.cv.link, '_blank')}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <CornerLabel icon={FileText} text={t.cvDesc} />
              <div className={`absolute -right-8 -bottom-8 opacity-[0.05] group-hover:opacity-10 transition-opacity duration-500 transform rotate-12 ${isDark ? 'text-white' : 'text-blue-900'}`}>
                <FileText size={160} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <h3 className={`text-2xl font-serif font-bold ${textPrimary}`}>{t.cv}</h3>
              </div>
              <CardLink href={config.bento.cards.cv.link} text={config.bento.cards.cv.text} />
            </motion.div>

            {/* Blog (1x1) */}
            <motion.div 
              variants={itemVariants} 
              className={`${cardClass} col-span-1 row-span-1 flex flex-col justify-center items-center text-center cursor-pointer group hover:ring-2 hover:ring-orange-500/20 min-h-[200px] lg:min-h-0`}
              onClick={() => window.open(config.bento.cards.blog.link, '_blank')}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <CornerLabel icon={BookOpen} text="Blog" />
              <div className={`absolute -right-8 -top-8 opacity-[0.05] group-hover:opacity-10 transition-opacity duration-500 transform -rotate-12 ${isDark ? 'text-white' : 'text-orange-900'}`}>
                <BookOpen size={160} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <h3 className={`text-2xl font-serif font-bold ${textPrimary}`}>{t.blog}</h3>
              </div>
              <CardLink href={config.bento.cards.blog.link} text={config.bento.cards.blog.text} />
            </motion.div>

            {/* Photo (1x1) */}
            <motion.div 
              variants={itemVariants} 
              className={`${cardClass} col-span-1 md:col-span-2 lg:col-span-1 row-span-1 flex flex-col justify-center items-center text-center cursor-pointer group hover:ring-2 hover:ring-purple-500/20 min-h-[200px] lg:min-h-0`}
              onClick={() => window.open(config.bento.cards.gallery.link, '_blank')}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <CornerLabel icon={ImageIcon} text={t.photoDesc} />
              <div className={`absolute -right-8 -bottom-8 opacity-[0.05] group-hover:opacity-10 transition-opacity duration-500 transform rotate-12 ${isDark ? 'text-white' : 'text-purple-900'}`}>
                <Aperture size={160} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <h3 className={`text-2xl font-serif font-bold ${textPrimary}`}>{t.photo}</h3>
              </div>
              <CardLink href={config.bento.cards.gallery.link} text={config.bento.cards.gallery.text} />
            </motion.div>

            {/* Back Button (Grid Item) */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end items-center h-12">
              <button 
                onClick={() => setPage('main')}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
              >
                <ArrowRight className="rotate-180" size={16} />
                {t.back}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ProgressBar = ({ label, progress, isDark, textSecondary }: { label: string, progress: number, isDark: boolean, textSecondary: string }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-xs font-sans">
      <span className={textSecondary}>{label}</span>
      <span className="font-mono opacity-80">{Math.round(progress)}%</span>
    </div>
    <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
      <div 
        className={`h-full rounded-full ${isDark ? 'bg-gold-400' : 'bg-gold-500'}`} 
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);
