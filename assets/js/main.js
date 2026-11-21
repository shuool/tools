/* ==========================================================================
   饭烁的小玩具 · Vue 3 小站
   --------------------------------------------------------------------------
   部署：GitHub Pages 子路径 https://shuool.github.io/tools/
     site-config.json 里配置 siteUrl / base（当前 base: "/tools/"）
   外联 / 工具只改 assets/data/site-config.json：
   工具树状结构：
     tools: [{ tag: '实用', items: [{ title, desc, avatar, tone, type, link, modal }] }]
   工具 type：
     external — 外部链接（link: 'https://...'）
     internal — 内部链接（link: 'page.html' 或 '#color'）
     modal    — 弹框（modal: { title, text, hint }）
   未写 type 时会按 link / modal 自动推断。
   音乐：
     music: [{ title, artist, url }]
   ========================================================================== */
const SITE_CONFIG_URL = "assets/data/site-config.json";
const QUICK_LINK_VISIBLE = 4;

function normalizeSiteBase(base) {
  let value = String(base || "").trim();
  if (!value) return "";
  if (!value.startsWith("/")) value = "/" + value;
  if (!value.endsWith("/")) value += "/";
  return value;
}

function detectSiteBase() {
  const path = String((window.location && window.location.pathname) || "/");
  if (path.endsWith("/")) return path || "/";
  if (/\.html?$/i.test(path)) return path.replace(/\/[^/]+$/, "/") || "/";
  return path.replace(/\/?$/, "/") || "/";
}

function joinSitePath(base, path) {
  const raw = String(path || "").trim();
  if (!raw) return base || "/";
  if (/^https?:\/\//i.test(raw) || raw.charAt(0) === "#" || raw.charAt(0) === "/") return raw;
  const cleaned = raw.replace(/^\.\//, "");
  return (base || "/") + cleaned;
}

const site = {
  name: "饭烁的小玩具",
  intro: "写一些小工具，也收集一点可爱的东西。没做完的想法和能点开的小东西，都在这里。",
  about: "一个人的工具抽屉。还没写完的代码、反复听的歌、偶尔冒出来的怪点子，都放在这里。",
  author: {
    name: "饭烁",
    wechat: "Fanys0507",
    huiwanId: "bieqiangwodebabiwawa",
    huiwanRoom: "503123"
  }
};

/* 搜索引擎：url 里的 {q} 会被替换成关键词；本站无 url */
const engines = [
  {
    id: "local",
    label: "本站",
    placeholder: "搜索本站外联或工具…",
    url: "",
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#C96F84" d="M12 3.2 4.4 9.2V20a1 1 0 0 0 1 1h4.3v-5.2h4.6V21h4.3a1 1 0 0 0 1-1V9.2z"/></svg>'
  },
  {
    id: "baidu",
    label: "百度",
    placeholder: "用百度搜索…",
    url: "https://www.baidu.com/s?wd={q}",
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#2932E1" d="M5.2 9.1c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4.5-1.5c1.3 0 2.3-1.2 2.3-2.6S11 2.4 9.7 2.4 7.4 3.6 7.4 5s1 2.6 2.3 2.6zm4.6 0c1.3 0 2.3-1.2 2.3-2.6S15.6 2.4 14.3 2.4 12 3.6 12 5s1 2.6 2.3 2.6zm4.6 1.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM7.2 11.3c-1.7.6-2.9 2.1-2.7 4 .3 2.3 2.5 3.2 4.2 2.6 1.8-.6 2.6-2.7 2.3-4.5-.3-1.7-2.1-2.6-3.8-2.1zm9.7 0c-1.7-.5-3.5.4-3.8 2.1-.3 1.8.5 3.9 2.3 4.5 1.7.6 3.9-.3 4.2-2.6.2-1.9-1-3.4-2.7-4zM12 13.2c-1.4 0-3.1 1.7-3.1 4.1 0 2.2 1.6 3.7 3.1 3.7s3.1-1.5 3.1-3.7c0-2.4-1.7-4.1-3.1-4.1z"/></svg>'
  },
  {
    id: "bing",
    label: "必应",
    placeholder: "用必应搜索…",
    url: "https://www.bing.com/search?q={q}",
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#00809D" d="M5.5 3.2 9.1 4.6v11.3l3.4-2 4.2 2.1L9.1 21.8 5.5 19.8z"/><path fill="#00809D" d="m12.5 13.9 6 3.1v-3.8l-2.5-1.1z"/></svg>'
  },
  {
    id: "google",
    label: "谷歌",
    placeholder: "用谷歌搜索…",
    url: "https://www.google.com/search?q={q}",
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h5.9c-.3 1.4-1 2.5-2.1 3.3v2.7h3.4c2-1.8 3.4-4.6 3.4-8.1z"/><path fill="#34A853" d="M12 23c2.8 0 5.2-.9 7-2.5l-3.4-2.7c-1 .6-2.2 1-3.6 1-2.8 0-5.1-1.9-6-4.4H2.6v2.8C4.3 20.8 7.9 23 12 23z"/><path fill="#FBBC05" d="M6 14.4c-.2-.7-.4-1.4-.4-2.1s.1-1.5.4-2.1V7.4H2.6C1.9 8.7 1.5 10.3 1.5 12s.4 3.3 1.1 4.6z"/><path fill="#EA4335" d="M12 5.8c1.5 0 2.9.5 4 1.6l3-3C17.2 2.6 14.8 1.5 12 1.5 7.9 1.5 4.3 3.8 2.6 7.4l3.4 2.8c.9-2.5 3.2-4.4 6-4.4z"/></svg>'
  },
  {
    id: "sogou",
    label: "搜狗",
    placeholder: "用搜狗搜索…",
    url: "https://www.sogou.com/web?query={q}",
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#FB6022"/><path fill="#fff" d="M7.4 9.2c0-1.4 1.5-2.4 3.4-2.4 1.3 0 2.4.4 3.1 1.1l-1.1 1.2c-.5-.4-1.2-.7-2-.7-1.1 0-1.8.5-1.8 1.1 0 .6.5 1 1.7 1.3l1 .3c2 .5 3 1.4 3 3 0 1.8-1.6 3.1-4.1 3.1-1.6 0-3-.5-3.8-1.4l1.2-1.2c.6.6 1.5 1 2.6 1 1.2 0 2-.5 2-1.3 0-.6-.5-1-1.8-1.3l-1-.3c-1.8-.5-2.8-1.4-2.8-2.9z"/></svg>'
  },
  {
    id: "bilibili",
    label: "B站",
    placeholder: "在 B 站搜索…",
    url: "https://search.bilibili.com/all?keyword={q}",
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#FB7299" d="M5.4 6.2 3.7 4.5l1.1-1.1 2.1 2.1h10.2l2.1-2.1 1.1 1.1-1.7 1.7H21a1 1 0 0 1 1 1v11.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7.2a1 1 0 0 1 1-1zm2.8 3.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm7.6 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM7.3 14.2c1.1 1.5 2.7 2.3 4.7 2.3s3.6-.8 4.7-2.3l-1.2-.9c-.8 1.1-2 1.7-3.5 1.7s-2.7-.6-3.5-1.7z"/></svg>'
  },
  {
    id: "github",
    label: "GitHub",
    placeholder: "在 GitHub 搜索…",
    url: "https://github.com/search?q={q}&type=repositories",
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#24292F" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>'
  },
  {
    id: "zhihu",
    label: "知乎",
    placeholder: "在知乎搜索…",
    url: "https://www.zhihu.com/search?type=content&q={q}",
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="5" fill="#0084FF"/><path fill="#fff" d="M7.2 6.2h2.1l.4 1.6H7.2zm.6 3h3.4l-.5 1.7H10l-1.1 5.4H7.2l1.1-5.4H6.4zm5.3-1.5h4.4v1.5h-1.4l-.8 6.7h-1.7l.5-4.1c-.5.7-1.2 1.4-2.1 1.9l-.7-1.4c1.1-.6 1.9-1.5 2.3-2.6h-1.5z"/></svg>'
  },
  {
    id: "csdn",
    label: "CSDN",
    placeholder: "在 CSDN 搜索…",
    url: "https://so.csdn.net/so/search?q={q}",
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="5" fill="#FC5531"/><path fill="#fff" d="M6.2 8.2h3.1c1.8 0 2.9 1 2.9 2.5 0 1-.5 1.8-1.4 2.2l1.8 2.9h-1.9l-1.6-2.7H7.8v2.7H6.2zm1.6 1.4v2.1h1.3c.8 0 1.3-.4 1.3-1.1s-.5-1-1.3-1zm6.2-1.4h1.7l1.7 6.2h-1.6l-.3-1.2h-1.9l-.3 1.2h-1.6zm.6 3.7h1.3l-.6-2.5zm3.7-3.7h1.6v6.2h-1.6z"/></svg>'
  }
];

const sections = [
  { id: "author", label: "饭烁", action: "author" }
];

const hotTabs = [
  { id: "weibo", label: "微博" },
  { id: "baidu", label: "百度" },
  { id: "douyin", label: "抖音" },
  { id: "toutiao", label: "头条" },
  { id: "bilibili", label: "B站" }
];

/* 热搜 / 天气：优先直连；浏览器跨域失败时走 apiProxy / 公共网关。
   GitHub Pages 请部署 workers/api-proxy.js，并写入 site-config.json 的 apiProxy。 */
const HOT_UPSTREAM = "https://api.vsaa.cn/api/toolbox/hot/hot.php";
const WEATHER_UPSTREAM = "https://api.vsaa.cn/api/weather/index.php";

function normalizeProxyBase(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return raw.replace(/\/+$/, "");
}

function buildRequestUrls(upstream, apiProxy) {
  const encoded = encodeURIComponent(upstream);
  const urls = [];
  urls.push(upstream);
  const proxy = normalizeProxyBase(apiProxy);
  if (proxy) urls.push(proxy + "?url=" + encoded);
  urls.push(
    "https://api.allorigins.win/raw?url=" + encoded,
    "https://api.allorigins.win/get?url=" + encoded,
    "https://corsproxy.io/?" + encoded
  );
  return urls;
}

function unwrapProxyJson(raw) {
  let payload = raw;
  if (typeof raw === "string") {
    payload = JSON.parse(raw);
  }
  if (payload && typeof payload.contents === "string") {
    payload = JSON.parse(payload.contents);
  }
  return payload;
}

async function fetchJsonCandidates(urls, validate) {
  let lastError = null;
  for (let i = 0; i < urls.length; i++) {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), 12000) : null;
    try {
      const response = await fetch(urls[i], {
        method: "GET",
        cache: "no-store",
        signal: controller ? controller.signal : undefined
      });
      if (timer) clearTimeout(timer);
      if (!response.ok) throw new Error("HTTP " + response.status);
      const payload = unwrapProxyJson(await response.json());
      const checked = validate ? validate(payload) : payload;
      if (checked) return checked;
      throw new Error("接口返回异常");
    } catch (error) {
      if (timer) clearTimeout(timer);
      lastError = error;
    }
  }
  throw lastError || new Error("请求失败");
}

const WEATHER_LABELS = {
  CLEAR_DAY: "晴",
  CLEAR_NIGHT: "晴夜",
  PARTLY_CLOUDY_DAY: "多云",
  PARTLY_CLOUDY_NIGHT: "多云",
  CLOUDY: "阴",
  LIGHT_HAZE: "轻度雾霾",
  MODERATE_HAZE: "中度雾霾",
  HEAVY_HAZE: "重度雾霾",
  LIGHT_RAIN: "小雨",
  MODERATE_RAIN: "中雨",
  HEAVY_RAIN: "大雨",
  STORM_RAIN: "暴雨",
  FOG: "雾",
  LIGHT_SNOW: "小雪",
  MODERATE_SNOW: "中雪",
  HEAVY_SNOW: "大雪",
  STORM_SNOW: "暴雪",
  DUST: "浮尘",
  SAND: "沙尘",
  WIND: "大风"
};

const COLOR_PRESETS = ["#c96f84", "#a94e63", "#6b9bd1", "#5aa889", "#d4a017", "#8b6bb5", "#3b2933", "#fff9f3"];

const app = Vue.createApp({
  data() {
    return {
      site,
      tools: [],
      toolGroups: [],
      quickLinks: [],
      quickLinkVisible: QUICK_LINK_VISIBLE,
      author: site.author,
      apiProxy: "",
      siteUrl: "",
      siteBase: detectSiteBase(),
      configReady: false,
      engines,
      sections,
      hotTabs,
      colorPresets: COLOR_PRESETS,
      mode: "local",
      query: "",
      searchOpen: false,
      activeIndex: 0,
      activeSection: "",
      navOpen: false,
      notice: null,
      toolModal: null,
      authorOpen: false,
      linksOpen: false,
      activeToolTag: "全部",
      petalFrame: 0,
      hotSource: "baidu",
      hotSources: {},
      hotUpdated: "",
      hotLoading: false,
      hotError: "",
      hotLimit: 10,
      hotLimitOptions: [5, 10, 15, 20],
      weatherCity: "北京",
      weatherDays: 7,
      weatherLoading: false,
      weatherError: "",
      weatherData: null,
      pickColor: "#c96f84",
      colorCopied: false,
      nowClock: "",
      nowIso: "",
      showBackTop: false,
      playlist: [],
      musicIndex: 0,
      musicPlaying: false,
      musicCurrent: 0,
      musicDuration: 0,
      musicOffset: { x: 0, y: 0 },
      musicDragging: false,
      musicListOpen: false,
      musicVolume: 0.7,
      musicMuted: false,
      musicVolumeBeforeMute: 0.7
    };
  },

  computed: {
    currentEngine() {
      return this.engines.find((item) => item.id === this.mode) || this.engines[0];
    },

    hasQuery() {
      return this.query.trim().length > 0;
    },

    modalLocked() {
      return Boolean(this.notice) || Boolean(this.toolModal) || this.authorOpen || this.linksOpen;
    },

    visibleQuickLinks() {
      const limit = Math.max(0, Number(this.quickLinkVisible) || QUICK_LINK_VISIBLE);
      return this.quickLinks.slice(0, limit);
    },

    hasMoreQuickLinks() {
      return this.quickLinks.length > this.visibleQuickLinks.length;
    },

    toolTags() {
      return this.toolGroups.map((group) => group.tag);
    },

    toolTagTabs() {
      return ["全部"].concat(this.toolTags);
    },

    filteredTools() {
      if (this.activeToolTag === "全部") return this.tools;
      const group = this.toolGroups.find((item) => item.tag === this.activeToolTag);
      return group ? group.items : [];
    },

    currentHotSource() {
      return this.hotSources[this.hotSource] || null;
    },

    hotItems() {
      const source = this.currentHotSource;
      return source && Array.isArray(source.items) ? source.items : [];
    },

    weatherCurrent() {
      return this.weatherData && this.weatherData.current ? this.weatherData.current : null;
    },

    weatherForecast() {
      const list = this.weatherData && Array.isArray(this.weatherData.forecast)
        ? this.weatherData.forecast
        : [];
      return list.slice(0, this.weatherDays);
    },

    pickColorRgb() {
      const hex = this.normalizeHex(this.pickColor);
      if (!hex) return "";
      const n = parseInt(hex.slice(1), 16);
      return "rgb(" + ((n >> 16) & 255) + ", " + ((n >> 8) & 255) + ", " + (n & 255) + ")";
    },

    linkSuggestions() {
      const q = this.query.trim().toLowerCase();
      if (!q) return [];
      return this.quickLinks
        .map((link) => ({
          kind: "link",
          icon: link.icon,
          title: link.name,
          desc: "",
          action: "link",
          payload: link
        }))
        .filter((item) => item.title.toLowerCase().includes(q));
    },

    toolSuggestions() {
      const q = this.query.trim().toLowerCase();
      if (!q) return [];
      return this.tools
        .map((tool) => ({
          kind: "tool",
          icon: this.toolAvatar(tool),
          title: tool.title,
          desc: tool.desc || "",
          meta: [tool.tag].filter(Boolean).join(" "),
          action: "tool",
          payload: tool
        }))
        .filter((item) => (item.title + " " + item.desc + " " + item.meta).toLowerCase().includes(q));
    },

    flatSuggestions() {
      return this.linkSuggestions.concat(this.toolSuggestions);
    },

    currentTrack() {
      return this.playlist[this.musicIndex] || { title: "暂无音乐", artist: "", url: "" };
    },

    musicProgress() {
      if (!this.musicDuration) return 0;
      return Math.max(0, Math.min(1000, Math.round((this.musicCurrent / this.musicDuration) * 1000)));
    },

    musicPlayerStyle() {
      if (!this.canDragMusic()) return {};
      return {
        transform: "translate(" + this.musicOffset.x + "px, " + this.musicOffset.y + "px)"
      };
    }
  },

  watch: {
    playlist: {
      immediate: true,
      handler(list) {
        document.documentElement.classList.toggle("has-music", Array.isArray(list) && list.length > 0);
      }
    },

    modalLocked(value) {
      document.body.classList.toggle("modal-open", value);
    },

    notice(value) {
      if (value) {
        window.setTimeout(() => {
          if (this.$refs.noticeClose) this.$refs.noticeClose.focus();
        }, 60);
      }
    },

    toolModal(value) {
      if (value) {
        window.setTimeout(() => {
          if (this.$refs.toolModalClose) this.$refs.toolModalClose.focus();
        }, 60);
      }
    },

    authorOpen(value) {
      if (value) {
        window.setTimeout(() => {
          if (this.$refs.authorClose) this.$refs.authorClose.focus();
        }, 60);
      }
    },

    linksOpen(value) {
      if (value) {
        window.setTimeout(() => {
          if (this.$refs.linksClose) this.$refs.linksClose.focus();
        }, 60);
      }
    },

    activeIndex() {
      if (!this.searchOpen) return;
      this.$nextTick(() => {
        const row = document.querySelector(".suggestion.is-active");
        if (row) row.scrollIntoView({ block: "nearest" });
      });
    }
  },

  mounted() {
    this.loadSiteConfig();
    this.setupPetals();
    this.setupCursorTrail();
    this.setupSectionSpy();
    this.loadHot();
    this.loadWeather();
    this.startClock();
    this.setupBackTop();

    this.onKeydown = (event) => {
      const target = event.target;
      const typing = target && (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      );

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        this.focusSearch();
      } else if (event.key === "/" && !typing && !this.modalLocked) {
        event.preventDefault();
        this.focusSearch();
      } else if (event.key === "Escape") {
        if (this.notice) this.closeNotice();
        else if (this.toolModal) this.closeToolModal();
        else if (this.linksOpen) this.closeLinks();
        else if (this.authorOpen) this.closeAuthor();
        else this.closeSearch();
      }
    };

    this.onPointerDown = (event) => {
      if (!event.target.closest(".site-search") && this.searchOpen) this.closeSearch();
      if (this.navOpen && !event.target.closest(".site-header")) this.navOpen = false;
    };

    window.addEventListener("keydown", this.onKeydown);
    document.addEventListener("pointerdown", this.onPointerDown);
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.onKeydown);
    document.removeEventListener("pointerdown", this.onPointerDown);
    window.cancelAnimationFrame(this.petalFrame);
    window.removeEventListener("resize", this.resizePetals);
    if (this.spyObserver) this.spyObserver.disconnect();
    if (this._clockTimer) clearInterval(this._clockTimer);
    if (this._colorCopyTimer) clearTimeout(this._colorCopyTimer);
    if (this._mainEl && this.onMainScroll) {
      this._mainEl.removeEventListener("scroll", this.onMainScroll);
    }
    const audio = this.$refs.audio;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
    }
    if (this.onMusicDragEnd) this.onMusicDragEnd();
    if (this.teardownCursorTrail) this.teardownCursorTrail();
    document.documentElement.classList.remove("has-music");
  },

  methods: {
    /* ---------- 搜索 ---------- */
    onSearchFocus() {
      this.searchOpen = true;
      this.activeIndex = 0;
    },

    onSearchInput() {
      this.searchOpen = true;
      this.activeIndex = 0;
    },

    onSearchEsc() {
      if (this.query) this.resetQuery();
      else this.closeSearch();
    },

    openSearch() {
      this.searchOpen = true;
    },

    closeSearch() {
      this.searchOpen = false;
      const input = this.$refs.searchInput;
      if (input) input.blur();
    },

    resetQuery() {
      this.query = "";
      this.activeIndex = 0;
      this.openSearch();
      if (this.$refs.searchInput) this.$refs.searchInput.focus();
    },

    setMode(id) {
      this.mode = id;
      this.openSearch();
      if (this.$refs.searchInput) this.$refs.searchInput.focus();
    },

    move(direction) {
      if (!this.searchOpen) this.openSearch();
      const total = this.flatSuggestions.length;
      if (!total) return;
      this.activeIndex = (this.activeIndex + direction + total) % total;
    },

    onFindKeydown() {
      this.runSearch();
    },

    runSearch() {
      if (!this.hasQuery) {
        this.openSearch();
        return;
      }
      if (this.mode === "local") {
        const target = this.flatSuggestions[this.activeIndex] || this.flatSuggestions[0];
        if (target) this.pick(target);
        return;
      }
      this.searchExternal(this.mode);
    },

    searchExternal(id) {
      const q = this.query.trim();
      if (!q) {
        this.focusSearch();
        return;
      }
      const engine = this.engines.find((item) => item.id === id) || this.currentEngine;
      if (!engine || !engine.url) return;
      this.closeSearch();
      window.open(engine.url.replace("{q}", encodeURIComponent(q)), "_blank", "noopener,noreferrer");
    },

    pick(item) {
      if (!item) return;
      this.closeSearch();
      if (item.action === "link") {
        window.open(item.payload.url, "_blank", "noopener,noreferrer");
        return;
      }
      this.openTool(item.payload);
    },

    focusSearch() {
      const input = this.$refs.searchInput;
      if (!input) return;
      input.focus({ preventScroll: true });
      input.select();
      this.openSearch();
    },

    /* ---------- 导航 ---------- */
    onNavClick(item, event) {
      if (item.action === "author") {
        event.preventDefault();
        this.openAuthor();
        return;
      }
      this.goSection(item.id);
    },

    goSection(id) {
      this.navOpen = false;
      this.closeAuthor();
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    },

    openAuthor() {
      this.navOpen = false;
      this.closeSearch();
      this.closeNotice();
      this.authorOpen = true;
    },

    closeAuthor() {
      this.authorOpen = false;
    },

    openLinks() {
      this.closeSearch();
      this.navOpen = false;
      this.linksOpen = true;
    },

    closeLinks() {
      this.linksOpen = false;
    },

    async loadSiteConfig() {
      try {
        const response = await fetch(SITE_CONFIG_URL + "?t=" + Date.now(), {
          cache: "no-store"
        });
        if (!response.ok) throw new Error("config HTTP " + response.status);
        const payload = await response.json();
        this.applySiteConfig(payload);
      } catch (error) {
        console.warn("site-config load failed", error);
        this.applySiteConfig({});
      } finally {
        this.configReady = true;
      }
    },

    applySiteConfig(payload) {
      const next = payload && typeof payload === "object" ? payload : {};
      const configuredBase = normalizeSiteBase(next.base);
      const detectedBase = detectSiteBase();
      const configuredUrl = String(next.siteUrl || "").trim().replace(/\/$/, "");
      const onConfiguredHost = Boolean(
        configuredUrl &&
        window.location.href.replace(/\/$/, "").indexOf(configuredUrl) === 0
      );
      if (configuredBase && (onConfiguredHost || detectedBase.indexOf(configuredBase) === 0)) {
        this.siteBase = configuredBase;
      } else {
        this.siteBase = detectedBase || configuredBase || "/";
      }
      this.siteUrl = configuredUrl ||
        (window.location.origin + this.siteBase.replace(/\/$/, ""));
      this.toolGroups = this.normalizeToolTree(next.tools);
      this.tools = this.flattenToolTree(this.toolGroups);
      this.quickLinks = Array.isArray(next.quickLinks) ? next.quickLinks : [];
      this.apiProxy = normalizeProxyBase(next.apiProxy);
      this.quickLinkVisible = QUICK_LINK_VISIBLE;
      this.playlist = this.normalizePlaylist(next.music);
      this.musicOffset = { x: 0, y: 0 };
      if (this.toolTagTabs.indexOf(this.activeToolTag) === -1) {
        this.activeToolTag = "全部";
      }
      this.$nextTick(() => this.setupMusicPlayer());
    },

    normalizePlaylist(raw) {
      if (!Array.isArray(raw)) return [];
      return raw
        .map((item) => ({
          title: String((item && item.title) || "未命名").trim() || "未命名",
          artist: String((item && (item.artist || item.singer)) || "").trim(),
          url: String((item && (item.url || item.src)) || "").trim()
        }))
        .filter((item) => item.url);
    },

    setupMusicPlayer() {
      const audio = this.$refs.audio;
      if (!audio || !this.playlist.length) return;
      if (this.musicIndex >= this.playlist.length) this.musicIndex = 0;
      const track = this.playlist[this.musicIndex];
      if (!track) return;
      const wasPlaying = this.musicPlaying;
      if (audio.src !== track.url) {
        audio.src = track.url;
        audio.load();
      }
      this.applyMusicVolume();
      if (wasPlaying) {
        audio.play().catch(() => {
          this.musicPlaying = false;
        });
      }
    },

    applyMusicVolume() {
      const audio = this.$refs.audio;
      if (!audio) return;
      audio.volume = this.musicMuted ? 0 : Math.max(0, Math.min(1, this.musicVolume));
    },

    setMusicVolume(event) {
      const value = Math.max(0, Math.min(100, Number(event.target.value) || 0));
      this.musicVolume = value / 100;
      this.musicMuted = value === 0;
      if (value > 0) this.musicVolumeBeforeMute = this.musicVolume;
      this.applyMusicVolume();
    },

    toggleMute() {
      if (this.musicMuted || this.musicVolume === 0) {
        this.musicMuted = false;
        this.musicVolume = this.musicVolumeBeforeMute > 0 ? this.musicVolumeBeforeMute : 0.7;
      } else {
        this.musicVolumeBeforeMute = this.musicVolume;
        this.musicMuted = true;
      }
      this.applyMusicVolume();
    },

    toggleMusic() {
      const audio = this.$refs.audio;
      if (!audio || !this.playlist.length) return;
      if (!audio.src) this.setupMusicPlayer();
      if (audio.paused) {
        audio.play().then(() => {
          this.musicPlaying = true;
        }).catch(() => {
          this.musicPlaying = false;
        });
      } else {
        audio.pause();
        this.musicPlaying = false;
      }
    },

    playTrack(index, autoPlay) {
      if (!this.playlist.length) return;
      const total = this.playlist.length;
      this.musicIndex = ((index % total) + total) % total;
      this.musicCurrent = 0;
      this.musicDuration = 0;
      this.$nextTick(() => {
        const audio = this.$refs.audio;
        if (!audio) return;
        const track = this.playlist[this.musicIndex];
        audio.src = track.url;
        audio.load();
        if (autoPlay) {
          audio.play().then(() => {
            this.musicPlaying = true;
          }).catch(() => {
            this.musicPlaying = false;
          });
        }
      });
    },

    selectTrack(index) {
      if (index === this.musicIndex) {
        this.toggleMusic();
        return;
      }
      this.playTrack(index, true);
    },

    nextTrack() {
      this.playTrack(this.musicIndex + 1, true);
    },

    prevTrack() {
      const audio = this.$refs.audio;
      if (audio && audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
      }
      this.playTrack(this.musicIndex - 1, true);
    },

    onMusicEnded() {
      /* 列表循环 */
      this.playTrack(this.musicIndex + 1, true);
    },

    onMusicTime() {
      const audio = this.$refs.audio;
      if (!audio) return;
      this.musicCurrent = audio.currentTime || 0;
      if (audio.duration) this.musicDuration = audio.duration;
    },

    onMusicMeta() {
      const audio = this.$refs.audio;
      if (!audio) return;
      this.musicDuration = audio.duration || 0;
    },

    seekMusic(event) {
      const audio = this.$refs.audio;
      if (!audio || !this.musicDuration) return;
      const value = Number(event.target.value) || 0;
      audio.currentTime = (value / 1000) * this.musicDuration;
      this.musicCurrent = audio.currentTime;
    },

    canDragMusic() {
      return !window.matchMedia || window.matchMedia("(pointer: fine)").matches;
    },

    onMusicDragStart(event) {
      if (!this.canDragMusic() || event.button !== 0) return;
      if (event.target.closest("button, input, a, .music-controls, .music-progress, .music-disc, .music-list")) return;

      this.musicDragging = true;
      this._musicDrag = {
        startX: event.clientX,
        startY: event.clientY,
        originX: this.musicOffset.x,
        originY: this.musicOffset.y
      };

      this.onMusicDragMove = (ev) => {
        if (!this._musicDrag) return;
        this.musicOffset = {
          x: this._musicDrag.originX + (ev.clientX - this._musicDrag.startX),
          y: this._musicDrag.originY + (ev.clientY - this._musicDrag.startY)
        };
      };

      this.onMusicDragEnd = () => {
        this.musicDragging = false;
        this._musicDrag = null;
        window.removeEventListener("pointermove", this.onMusicDragMove);
        window.removeEventListener("pointerup", this.onMusicDragEnd);
        window.removeEventListener("pointercancel", this.onMusicDragEnd);
      };

      window.addEventListener("pointermove", this.onMusicDragMove);
      window.addEventListener("pointerup", this.onMusicDragEnd);
      window.addEventListener("pointercancel", this.onMusicDragEnd);
      event.preventDefault();
    },

    normalizeToolType(rawType) {
      const value = String(rawType || "").trim().toLowerCase();
      if (value === "external" || value === "外链" || value === "外部" || value === "link") return "external";
      if (value === "internal" || value === "内链" || value === "内部" || value === "page") return "internal";
      if (value === "modal" || value === "弹框" || value === "对话框" || value === "dialog") return "modal";
      return "";
    },

    normalizeToolItem(item, tag) {
      const tool = Object.assign({}, item || {}, { tag: tag });
      const modalRaw = tool.modal && typeof tool.modal === "object" ? tool.modal : null;
      let type = this.normalizeToolType(tool.type);

      if (!type) {
        if (modalRaw && (modalRaw.text || modalRaw.content || modalRaw.title || modalRaw.hint)) type = "modal";
        else if (this.isExternal(tool.link)) type = "external";
        else if (tool.link) type = "internal";
        else type = "modal";
      }

      tool.type = type;
      tool.link = tool.link == null ? "" : String(tool.link).trim();

      if (type === "modal") {
        const text = modalRaw
          ? (modalRaw.text || modalRaw.content || "")
          : "";
        tool.modal = {
          title: (modalRaw && modalRaw.title) || tool.title || "工具",
          text: String(text || tool.desc || "暂无更多说明。"),
          hint: String((modalRaw && modalRaw.hint) || "")
        };
      } else {
        tool.modal = null;
      }

      return tool;
    },

    normalizeToolTree(raw) {
      if (!Array.isArray(raw) || !raw.length) return [];

      /* 树状：[{ tag, items: [...] }] */
      if (Array.isArray(raw[0] && raw[0].items)) {
        return raw.map((group) => {
          const tag = String((group && (group.tag || group.name)) || "未分类").trim() || "未分类";
          const items = Array.isArray(group.items) ? group.items : [];
          return {
            tag: tag,
            items: items.map((item) => this.normalizeToolItem(item, tag))
          };
        }).filter((group) => group.items.length);
      }

      /* 兼容旧扁平：[{ title, category/tag, ... }] */
      const map = {};
      const order = [];
      raw.forEach((item) => {
        if (!item || typeof item !== "object") return;
        const tag = String(item.tag || item.category || "未分类").trim() || "未分类";
        if (!map[tag]) {
          map[tag] = [];
          order.push(tag);
        }
        map[tag].push(this.normalizeToolItem(item, tag));
      });
      return order.map((tag) => ({ tag: tag, items: map[tag] }));
    },

    flattenToolTree(groups) {
      const list = [];
      (groups || []).forEach((group) => {
        (group.items || []).forEach((item) => {
          list.push(Object.assign({}, item, { tag: group.tag }));
        });
      });
      return list;
    },

    toolAvatar(tool) {
      const avatar = tool && (tool.avatar || tool.icon);
      if (avatar) return String(avatar).slice(0, 1);
      const title = tool && tool.title ? String(tool.title).trim() : "";
      return title ? title.slice(0, 1) : "工";
    },

    setupSectionSpy() {
      if (!("IntersectionObserver" in window)) return;
      const root = document.getElementById("top");
      this.spyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) this.activeSection = entry.target.id;
        });
      }, {
        root: root || null,
        rootMargin: "-35% 0px -50% 0px"
      });

      this.$nextTick(() => {
        ["quick", "hot", "tools", "weather", "color"].forEach((id) => {
          const el = document.getElementById(id);
          if (el) this.spyObserver.observe(el);
        });
      });
    },

    /* ---------- 热搜 ---------- */
    buildHotQuery(forceRefresh) {
      const limit = Math.max(1, Math.min(50, Number(this.hotLimit) || 10));
      this.hotLimit = limit;
      const source = String(this.hotSource || "baidu").trim() || "baidu";
      const params = new URLSearchParams({
        source: source,
        limit: String(limit)
      });
      if (forceRefresh) params.set("refresh", "1");
      return params.toString();
    },

    changeHotLimit(value) {
      const next = Math.max(1, Math.min(50, Number(value) || 10));
      if (next === this.hotLimit && this.hotItems.length) return;
      this.hotLimit = next;
      this.loadHot(true);
    },

    selectHotSource(id) {
      const next = String(id || "").trim() || "baidu";
      if (this.hotSource === next && this.hotSources[next] && !this.hotError) return;
      this.hotSource = next;
      this.loadHot(false);
    },

    async loadHot(forceRefresh) {
      if (this.hotLoading) return;
      this.hotLoading = true;
      this.hotError = "";
      try {
        const upstream = HOT_UPSTREAM + "?" + this.buildHotQuery(forceRefresh);
        const payload = await fetchJsonCandidates(
          buildRequestUrls(upstream, this.apiProxy),
          (data) => {
            if (!data || Number(data.code) !== 1 || !data.data) {
              throw new Error((data && data.msg) || "热榜数据暂时不可用");
            }
            return data;
          }
        );
        const incoming = payload.data.sources || {};
        this.hotSources = Object.assign({}, this.hotSources, incoming);
        this.hotUpdated = payload.data.updated || "";
        if (!this.hotSources[this.hotSource]) {
          const first = this.hotTabs.find((tab) => this.hotSources[tab.id]);
          if (first) this.hotSource = first.id;
        }
      } catch (error) {
        const msg = error && error.message ? error.message : "";
        if (/Failed to fetch|NetworkError|CORS|abort/i.test(msg)) {
          this.hotError = this.apiProxy
            ? "热榜请求失败，请检查 apiProxy"
            : "热榜跨域失败：请在 site-config.json 配置 apiProxy（见 workers/api-proxy.js）";
        } else {
          this.hotError = msg || "热榜数据暂时不可用，稍后再试";
        }
      } finally {
        this.hotLoading = false;
      }
    },

    /* ---------- 天气 ---------- */
    weatherLabel(code) {
      return WEATHER_LABELS[code] || code || "未知";
    },

    formatTemp(value) {
      const n = Number(value);
      if (!Number.isFinite(n)) return "--";
      return Math.round(n) + "°";
    },

    formatForecastDate(value) {
      if (!value) return "";
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return String(value).slice(5, 10);
      return (d.getMonth() + 1) + "/" + d.getDate();
    },

    buildWeatherQuery() {
      const city = String(this.weatherCity || "").trim() || "北京";
      this.weatherCity = city;
      return new URLSearchParams({
        city: city,
        days: String(this.weatherDays || 7),
        type: "cytq"
      }).toString();
    },

    async loadWeather() {
      if (this.weatherLoading) return;
      this.weatherLoading = true;
      this.weatherError = "";
      try {
        const upstream = WEATHER_UPSTREAM + "?" + this.buildWeatherQuery();
        const payload = await fetchJsonCandidates(
          buildRequestUrls(upstream, this.apiProxy),
          (data) => {
            if (!data || !(data.success === true || Number(data.code) === 200) || !data.current) {
              throw new Error((data && (data.msg || data.message)) || "天气数据暂时不可用");
            }
            return data;
          }
        );
        this.weatherData = payload;
      } catch (error) {
        const msg = error && error.message ? error.message : "";
        if (/Failed to fetch|NetworkError|CORS|abort/i.test(msg)) {
          this.weatherError = this.apiProxy
            ? "天气请求失败，请检查 apiProxy"
            : "天气跨域失败：请在 site-config.json 配置 apiProxy（见 workers/api-proxy.js）";
        } else {
          this.weatherError = msg || "天气数据暂时不可用，稍后再试";
        }
      } finally {
        this.weatherLoading = false;
      }
    },

    submitWeatherCity() {
      this.loadWeather();
    },

    /* ---------- 顶部时间 ---------- */
    padTime(value) {
      return String(value).padStart(2, "0");
    },

    chineseYearLabel(date) {
      const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
      const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
      const animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
      /* 以立春近似分界：2 月 4 日前仍算上一年生肖 */
      let year = date.getFullYear();
      if (date.getMonth() < 1 || (date.getMonth() === 1 && date.getDate() < 4)) {
        year -= 1;
      }
      const offset = year - 4;
      const ganZhi = stems[((offset % 10) + 10) % 10] + branches[((offset % 12) + 12) % 12];
      const animal = animals[((offset % 12) + 12) % 12];
      return ganZhi + "年 · " + animal + "年";
    },

    tickClock() {
      const now = new Date();
      const weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      this.nowIso = now.toISOString();
      this.nowClock =
        now.getFullYear() + "年" +
        this.padTime(now.getMonth() + 1) + "月" +
        this.padTime(now.getDate()) + "日 " +
        this.padTime(now.getHours()) + ":" +
        this.padTime(now.getMinutes()) + ":" +
        this.padTime(now.getSeconds()) + " " +
        weeks[now.getDay()] + " " +
        this.chineseYearLabel(now);
    },

    startClock() {
      this.tickClock();
      if (this._clockTimer) clearInterval(this._clockTimer);
      this._clockTimer = setInterval(() => this.tickClock(), 1000);
    },

    /* ---------- 返回顶部 ---------- */
    setupBackTop() {
      this._mainEl = document.getElementById("top");
      if (!this._mainEl) return;
      this.onMainScroll = () => {
        this.showBackTop = this._mainEl.scrollTop > 240;
      };
      this.onMainScroll();
      this._mainEl.addEventListener("scroll", this.onMainScroll, { passive: true });
    },

    scrollToTop() {
      const main = this._mainEl || document.getElementById("top");
      if (!main) return;
      if (typeof main.scrollTo === "function") {
        main.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        main.scrollTop = 0;
      }
    },

    /* ---------- 颜色选择器 ---------- */
    normalizeHex(value) {
      let hex = String(value || "").trim();
      if (!hex) return "";
      if (hex.charAt(0) !== "#") hex = "#" + hex;
      if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
        hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
      }
      return /^#[0-9a-fA-F]{6}$/.test(hex) ? hex.toLowerCase() : "";
    },

    setPickColor(value) {
      const hex = this.normalizeHex(value);
      if (hex) this.pickColor = hex;
    },

    onColorHexInput(event) {
      const hex = this.normalizeHex(event.target.value);
      if (hex) this.pickColor = hex;
    },

    async copyPickColor() {
      const hex = this.normalizeHex(this.pickColor) || this.pickColor;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(hex);
        } else {
          const input = document.createElement("input");
          input.value = hex;
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          document.body.removeChild(input);
        }
        this.colorCopied = true;
        clearTimeout(this._colorCopyTimer);
        this._colorCopyTimer = setTimeout(() => {
          this.colorCopied = false;
        }, 1400);
      } catch (error) {
        this.showNotice("颜色", "复制失败，请手动选择");
      }
    },

    /* ---------- 链接 ---------- */
    isExternal(link) {
      return /^https?:\/\//i.test(String(link || ""));
    },

    linkLabel(link) {
      if (!link) return "暂无链接";
      if (this.isExternal(link)) return "外部链接";
      if (link.charAt(0) === "#") return "页内跳转";
      return "本地页面";
    },

    toolHref(tool) {
      if (!tool) return "#";
      if (tool.type === "external") return tool.link || "#";
      if (tool.type === "internal") {
        if (!tool.link) return "#";
        if (tool.link.charAt(0) === "#") return tool.link;
        return joinSitePath(this.siteBase, tool.link);
      }
      return "#";
    },

    toolIsEmpty(tool) {
      if (!tool) return true;
      if (tool.type === "modal") return false;
      return !tool.link;
    },

    toolArrow(tool) {
      if (!tool) return "·";
      if (tool.type === "external") return "↗";
      if (tool.type === "internal") return "→";
      return "◈";
    },

    toolTypeLabel(tool) {
      if (!tool) return "";
      if (tool.type === "external") return "外部链接";
      if (tool.type === "internal") return "内部链接";
      return "弹框";
    },

    goTo(link) {
      if (!link) return;
      if (this.isExternal(link)) {
        window.open(link, "_blank", "noopener,noreferrer");
      } else if (link.charAt(0) === "#") {
        const id = link.slice(1);
        const target = document.getElementById(id) || document.querySelector(link);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.href = joinSitePath(this.siteBase, link);
      }
    },

    openTool(tool) {
      if (!tool) return;
      if (tool.type === "modal") {
        this.openToolModal(tool);
        return;
      }
      if (!tool.link) {
        this.showNotice("工具", tool.title);
        return;
      }
      if (tool.type === "external") {
        window.open(tool.link, "_blank", "noopener,noreferrer");
        return;
      }
      this.goTo(tool.link);
    },

    handleToolClick(event, tool) {
      if (!tool) return;
      if (tool.type === "modal" || this.toolIsEmpty(tool) || (tool.type === "internal" && String(tool.link || "").charAt(0) === "#")) {
        event.preventDefault();
        this.openTool(tool);
      }
    },

    openToolModal(tool) {
      const modal = (tool && tool.modal) || {};
      this.toolModal = {
        title: modal.title || (tool && tool.title) || "工具",
        text: modal.text || (tool && tool.desc) || "暂无更多说明。",
        hint: modal.hint || ""
      };
    },

    closeToolModal() {
      this.toolModal = null;
    },

    /* ---------- 提示框 ---------- */
    showNotice(type, title) {
      this.notice = {
        title: type + "还没有链接",
        text: "「" + title + "」还没有可以跳转的地址。你可以先去看看别的，或者给它补上一个。"
      };
    },

    closeNotice() {
      this.notice = null;
    },

    /* ---------- 樱花 ---------- */
    setupPetals() {
      const canvas = this.$refs.petals;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let width = 0;
      let height = 0;
      let dpr = 1;
      let petals = [];
      let sprites = [];
      let last = 0;
      let active = true;

      const makeSprite = (light, dark) => {
        const sprite = document.createElement("canvas");
        sprite.width = 56;
        sprite.height = 56;
        const c = sprite.getContext("2d");
        const gradient = c.createLinearGradient(16, 10, 40, 46);
        gradient.addColorStop(0, light);
        gradient.addColorStop(1, dark);
        c.save();
        c.translate(28, 28);
        c.fillStyle = gradient;
        c.beginPath();
        c.moveTo(0, -21);
        c.bezierCurveTo(15, -12, 19, 8, 0, 21);
        c.bezierCurveTo(-19, 8, -15, -12, 0, -21);
        c.closePath();
        c.fill();
        c.strokeStyle = "rgba(176, 87, 111, 0.16)";
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(0, -13);
        c.quadraticCurveTo(-2, 3, 0, 15);
        c.stroke();
        c.restore();
        return sprite;
      };

      const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const populate = () => {
        const count = width < 720 ? 10 : Math.min(20, Math.round(width / 80));
        petals = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 5 + Math.random() * 7,
          speed: 12 + Math.random() * 18,
          sway: 14 + Math.random() * 30,
          phase: Math.random() * Math.PI * 2,
          rot: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.7,
          alpha: 0.28 + Math.random() * 0.32,
          sprite: Math.floor(Math.random() * sprites.length)
        }));
      };

      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        petals.forEach((petal) => {
          ctx.save();
          ctx.globalAlpha = petal.alpha;
          ctx.translate(petal.x, petal.y);
          ctx.rotate(petal.rot);
          ctx.drawImage(sprites[petal.sprite], -petal.size, -petal.size, petal.size * 2, petal.size * 2);
          ctx.restore();
        });
      };

      const frame = (now) => {
        if (!active) return;
        const delta = Math.min((now - last) / 1000 || 0, 0.05);
        last = now;
        ctx.clearRect(0, 0, width, height);
        petals.forEach((petal) => {
          petal.phase += delta * 0.8;
          petal.rot += petal.spin * delta;
          petal.x += Math.sin(petal.phase) * petal.sway * delta;
          petal.y += petal.speed * delta;
          if (petal.y > height + 24) {
            petal.y = -24;
            petal.x = Math.random() * width;
          }
          if (petal.x < -30) petal.x = width + 20;
          if (petal.x > width + 30) petal.x = -20;
          ctx.save();
          ctx.globalAlpha = petal.alpha;
          ctx.translate(petal.x, petal.y);
          ctx.rotate(petal.rot);
          ctx.drawImage(sprites[petal.sprite], -petal.size, -petal.size, petal.size * 2, petal.size * 2);
          ctx.restore();
        });
        this.petalFrame = window.requestAnimationFrame(frame);
      };

      sprites = [
        makeSprite("#fff7fa", "#f7b9ca"),
        makeSprite("#fffaf4", "#efa9bf"),
        makeSprite("#ffeef4", "#e99ab4")
      ];
      resize();
      populate();

      if (reduced) {
        draw();
        return;
      }

      last = performance.now();
      this.petalFrame = window.requestAnimationFrame(frame);

      this.resizePetals = () => {
        resize();
        populate();
      };
      window.addEventListener("resize", this.resizePetals);

      document.addEventListener("visibilitychange", () => {
        active = !document.hidden;
        if (active) {
          last = performance.now();
          this.petalFrame = window.requestAnimationFrame(frame);
        } else {
          window.cancelAnimationFrame(this.petalFrame);
        }
      });
    },

    setupCursorTrail() {
      if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const layer = document.createElement("div");
      layer.className = "cursor-trail";
      layer.setAttribute("aria-hidden", "true");
      document.body.appendChild(layer);
      this._trailLayer = layer;
      this._trailParts = [];
      this._trailLast = 0;

      this.onCursorTrailMove = (event) => {
        const now = performance.now();
        if (now - this._trailLast < 28) return;
        this._trailLast = now;

        const petal = document.createElement("span");
        petal.className = "cursor-trail-petal";
        const size = 8 + Math.random() * 10;
        petal.style.left = event.clientX + "px";
        petal.style.top = event.clientY + "px";
        petal.style.width = size + "px";
        petal.style.height = size + "px";
        petal.style.setProperty("--dx", (Math.random() * 24 - 12).toFixed(1) + "px");
        petal.style.setProperty("--rot", (Math.random() * 80 - 40).toFixed(1) + "deg");
        layer.appendChild(petal);
        this._trailParts.push(petal);

        window.setTimeout(() => {
          if (petal.parentNode) petal.parentNode.removeChild(petal);
          const idx = this._trailParts.indexOf(petal);
          if (idx > -1) this._trailParts.splice(idx, 1);
        }, 780);

        while (this._trailParts.length > 28) {
          const old = this._trailParts.shift();
          if (old && old.parentNode) old.parentNode.removeChild(old);
        }
      };

      window.addEventListener("pointermove", this.onCursorTrailMove, { passive: true });
    },

    teardownCursorTrail() {
      if (this.onCursorTrailMove) {
        window.removeEventListener("pointermove", this.onCursorTrailMove);
        this.onCursorTrailMove = null;
      }
      if (this._trailLayer && this._trailLayer.parentNode) {
        this._trailLayer.parentNode.removeChild(this._trailLayer);
      }
      this._trailLayer = null;
      this._trailParts = [];
    }
  }
});

app.mount("#app");
