
export const config = {
  // Basic Information
  name: "WhyLIM",
  ownerLocation: [22.2675, 114.1280] as [number, number], // HKU Li Ka Shing Faculty of Medicine

  // Social Links
  social: {
    github: "https://github.com/WhyLIM",
    email: "mailto:mli.bio@outlook.com",
    bilibili: "https://space.bilibili.com/393445454",
  },

  // Footer Information
  footer: {
    startYear: 2021,
    upyun: {
      show: true,
      text: "又拍云提供 CDN 加速",
      link: "https://www.upyun.com/"
    },
    icp: {
      text: "苏 ICP 备 2021008103 号 - 2",
      link: "https://beian.miit.gov.cn/"
    },
    police: {
      text: "苏公网安备 32062302000380",
      link: "https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32062302000380"
    },
    travellings: {
      show: true,
      link: "https://www.travellings.cn/go.html",
      text: "开往"
    }
  },

  // Bento Grid Configuration
  bento: {
    mbti: {
      image: "https://img.limina.top/temp/infj.svg",
      link: {
        en: "https://www.16personalities.com/infj-personality",
        zh: "https://www.16personalities.com/ch/infj-%E4%BA%BA%E6%A0%BC"
      },
      type: "INFJ",
      desc: {
        en: "The Advocate",
        zh: "提倡者人格"
      },
      tags: {
        en: ["Idealist", "Empathetic", "Creative"],
        zh: ["理想主义", "共情者", "创造力"]
      }
    },
    hometown: {
      image: "https://img.limina.top/temp/nantong.jpg",
      name: {
        en: "Nantong",
        zh: "江苏南通"
      }
    },
    school: {
      logo: "https://img.limina.top/temp/hku_mb.jpg",
      name: {
        en: "The University\nof Hong Kong",
        zh: "香港大学"
      },
      link: "https://www.hku.hk/"
    },
    undergrad: {
      image: "https://img.limina.top/temp/东吴门.jpg",
      name: {
        en: "Soochow Univ.",
        zh: "苏州大学"
      },
      link: "https://www.suda.edu.cn/"
    },
    codingCat: {
      image: "https://img.limina.top/temp/codingcat.gif"
    },
    cards: {
      cv: {
        link: "https://cv.limina.top/"
      },
      blog: {
        link: "https://log.whylim.cn/"
      },
      gallery: {
        link: "https://photo.limina.top/"
      }
    },
    techStack: [
      { name: 'Python', icon: 'python', color: '#3776AB' },
      { name: 'R', icon: 'r', color: '#276DC3' },
      { name: 'HTML', icon: 'html5', color: '#E34F26' },
      { name: 'CSS', icon: 'css', color: '#663399' },
      { name: 'JavaScript', icon: 'javascript', color: '#F7DF1E' },
      { name: 'PHP', icon: 'php', color: '#777BB4' },
      { name: 'Vue.js', icon: 'vuedotjs', color: '#4FC08D' },
      { name: 'SQL', icon: 'postgresql', color: '#4169E1' },
      { name: 'Git', icon: 'git', color: '#F05032' },
      { name: 'Shell', icon: 'gnubash', color: '#4EAA25' },
    ]
  }
};
