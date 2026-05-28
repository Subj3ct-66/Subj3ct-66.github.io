export default {
  site: {
    title: "$ubJ3C7のBlog",
    subtitle: "Welcome to my blog!",
    description: "记录学习过程与逆向、MCP 等技术笔记。",
    keywords: "blog, astro, reverse, mcp, security",
    author: "$ubJ3C7",
    language: "zh-CN",
  },

  sidebar: {
    avatar: "/images/avatar-main.jpg",
    position: "right",
  },

  widgets: ["recent_posts", "category", "tag", "tagcloud"],

  menu: [
    { name: "home", url: "/", icon: "/images/afa6-ipzreiv9099819.jpg" },
    { name: "archives", url: "/archives", icon: "/images/60865838_p0.webp" },
    { name: "about", url: "/about", icon: "/images/a868875dd498a43d86c00ceecaf69fc4c66dedd213df30-VZsHvS_fw658.webp" },
  ],

  banner: "/images/banner-main.png",
  banner_srcset: {
    enable: false,
    srcset: [
      { src: "/images/banner-main.png", media: "(min-width: 800px)" },
    ],
  },

  footer: {
    since: 2026,
    powered: true,
    count: true,
    busuanzi: false,
    icp: {
      icpnumber: "",
      beian: "",
      recordcode: "",
    },
    moe_icp: {
      icpnumber: "",
    },
  },

  analytics: {
    baidu_analytics: false,
    google_analytics: false,
    clarity: false,
  },

  social: {
    email: "mailto:2025125156@stu.cuit.edu.cn",
    github: "https://github.com/Subj3ct-66",
  },

  valine: { enable: false },
  waline: { enable: false },
  gitalk: { enable: false },
  giscus: { enable: false },
  utterances: { enable: false },
  // Beaudar：Utterances 中文版，同样使用 GitHub Issues（需安装 beaudar 应用）
  beaudar: {
    enable: true,
    repo: "Subj3ct-66/Subj3ct-66.github.io",
    issue_term: "pathname",
    theme: "auto",
  },
  twikoo: { enable: false },
  disqus: { enable: false },

  friend: [],

  copyright: {
    enable: true,
    content: {
      author: true,
      link: true,
      title: true,
      date: false,
      updated: false,
      license: true,
      license_type: "by-nc-sa",
    },
  },

  preloader: {
    enable: true,
    text: "加载中...",
    rotate: true,
  },

  firework: {
    enable: true,
    disable_on_mobile: false,
    options: {
      excludeElements: ["a", "button"],
      particles: [
        {
          shape: "circle",
          move: ["emit"],
          easing: "easeOutExpo",
          colors: ["#c9ae6d", "#d4bc82", "#e2cfa0", "#eee0c0"],
          number: 24,
          duration: [1200, 1800],
          shapeOptions: { radius: [16, 32], alpha: [0.3, 0.5] },
        },
        {
          shape: "circle",
          move: ["diffuse"],
          easing: "easeOutExpo",
          colors: ["#a8893a"],
          number: 1,
          duration: [1200, 1800],
          shapeOptions: {
            radius: 20,
            alpha: [0.2, 0.5],
            lineWidth: 6,
          },
        },
      ],
    },
  },

  home_categories: { enable: false, content: [{ categories: "" }] },
  triangle_badge: { enable: false, type: "github", link: "" },
  outdate: { enable: false, daysAgo: 180 },

  share: ["weibo", "qq", "weixin"],
  sponsor: { enable: false, qr: [] },

  // 文章点赞（bttn.love，免费、无需注册）。也可换成自托管的 Love Button API。
  like: {
    enable: true,
    apiURL: "https://bttn.love/api/love",
  },

  player: {
    enable: true,
    position: "after_widget",
    aplayer: {
      enable: true,
      options: {
        fixed: true,
        autoplay: false,
        loop: "all",
        order: "list",
        preload: "auto",
        volume: 0.7,
        mutex: true,
        listFolded: true,
        lrcType: 0,
        theme: "#c9ae6d",
        audio: [
          {
            name: "EXEC_COSMOFLIPS",
            artist: "KOKIA",
            url: "/music/KOKIA%20-%20EXEC_COSMOFLIPS.mp3",
            cover: "/images/cover-1.jpg",
          },
        ],
      },
    },
    meting: {
      enable: false,
      meting_api: "",
      options: {
        server: "netease",
        type: "playlist",
        id: "",
        auto: "false",
      },
    },
  },
};
