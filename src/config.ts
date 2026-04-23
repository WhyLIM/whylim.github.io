
export const config = {
  // Basic Information
  name: "WhyLIM",
  ownerLocation: [22.597245, 113.986707] as [number, number], // [Latitude, Longitude]

  // Social Links
  social: {
    github: "https://github.com/WhyLIM",
    email: "mailto:mli.bio@outlook.com",
    bilibili: "https://space.bilibili.com/393445454",
  },

  // Footer Information
  footer: {
    startYear: 2021,
    ownerName: "WhyLIM",
    upyun: {
      show: true,
      text: "又拍云提供 CDN 加速",
      logo: {
        light: "https://img.limina.top/temp/又拍云_logo4.png",
        dark: "https://img.limina.top/temp/又拍云_logo7.png"
      },
      link: "https://www.upyun.com/"
    },
    icp: {
      text: "苏 ICP 备 2021008103 号 - 2",
      link: "https://beian.miit.gov.cn/"
    },
    police: {
      text: "苏公网安备 32062302000380",
      logo: "https://img.limina.top/temp/备案图标.png",
      link: "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32062302000380"
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
      logo: "https://img.limina.top/temp/SIAT-small.jpg",
      name: {
        en: "SIAT",
        zh: "中国科学院\n深圳先进技术研究院"
      },
      link: "https://www.siat.ac.cn/"
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
        link: "https://cv.limina.top/",
        text: "View CV"
      },
      blog: {
        link: "https://log.whylim.cn/",
        text: "Read"
      },
      gallery: {
        link: "https://photo.limina.top/",
        text: "Gallery"
      }
    },
    techStack: [
      { name: 'Python', icon: 'python' },
      { name: 'R', icon: 'r' },
      { name: 'HTML', icon: 'html5' },
      { name: 'CSS', icon: 'css' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'PHP', icon: 'php' },
      { name: 'Vue.js', icon: 'vuedotjs' },
      { name: 'SQL', icon: 'postgresql' },
      { name: 'Git', icon: 'git' },
      { name: 'Shell', icon: 'gnubash' },
    ]
  }
};
