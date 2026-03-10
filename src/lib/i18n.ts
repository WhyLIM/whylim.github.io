import { config } from '../config';

export type Language = 'en' | 'zh';

export const translations = {
  en: {
    greeting: `Hello👋, I'm ${config.name}. I'm now here.`,
    foundUser: "And you are here.",
    void: "You seem to be in the void...",
    distance: "Distance: ",
    unknownLocation: "Unknown Location",
    km: "km",
    explore: "Explore",
    footer: "All rights reserved.",
    bento: {
      hometownDesc: "My Hometown",
      tech: "Tech Stack",
      blog: "Blog",
      learnMore: "Learn More",
      schoolDesc: "Current Unit",
      undergradDesc: "Undergraduate",
      timeTitle: "Time is Ticking",
      calendar: "Calendar",
      day: "Day",
      week: "Week",
      month: "Month",
      year: "Year",
      cv: "CV",
      cvDesc: "Academic Resume",
      photo: "Photography",
      photoDesc: "Portfolio",
      back: "Back to Overview",
      viewMore: "View More",
    }
  },
  zh: {
    greeting: `你好👋，我是 ${config.name}。我现在在这里。`,
    foundUser: "而你在这里。",
    void: "您似乎在虚空之中...",
    distance: "相距 ",
    unknownLocation: "位置未知",
    km: "公里",
    explore: "探索",
    footer: "保留所有权利。",
    bento: {
      hometownDesc: "我的故乡",
      tech: "技术栈",
      blog: "博客",
      learnMore: "了解更多",
      schoolDesc: "当前单位",
      undergradDesc: "本科院校",
      timeTitle: "时间差不多咯",
      calendar: "单向历",
      day: "今日",
      week: "本周",
      month: "本月",
      year: "本年",
      cv: "学术简历",
      cvDesc: "我的经历",
      photo: "摄影集",
      photoDesc: "光影瞬间",
      back: "返回概览",
      viewMore: "查看更多",
    }
  }
};
