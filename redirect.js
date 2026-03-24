// 需要处理的中间跳转页规则
// 每条规则包含：匹配当前页面 URL 的 pattern，以及 target 参数名
const WEIXIN110_REDIRECT_PATTERN =
  /^https:\/\/weixin110\.qq\.com\/cgi-bin\/mmspamsupport-bin\/newredirectconfirmcgi\b/;
const WEIXIN110_OBSERVER_TIMEOUT_MS = 10000;

const RULES = [
  {
    // 飞书安全跳转链接
    // https://security.feishu.cn/link/safety?target=<url>
    pattern: /^https:\/\/security\.feishu\.cn\/link\/safety\b/,
    param: "target",
  },
  {
    // 知乎外链跳转
    // https://link.zhihu.com/?target=<url>
    pattern: /^https:\/\/link\.zhihu\.com\//,
    param: "target",
  },
  {
    // 掘金外链跳转
    // https://link.juejin.cn/?target=<url>
    pattern: /^https:\/\/link\.juejin\.cn\//,
    param: "target",
  },
  {
    // 微信 110 安全提示跳转页
    // https://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi?...
    pattern: WEIXIN110_REDIRECT_PATTERN,
  },
];

(function () {
  const url = new URL(location.href);
  const isWeixin110RedirectPage = WEIXIN110_REDIRECT_PATTERN.test(url.href);

  const normalizeTarget = (value) => {
    if (!value) return null;
    try {
      const targetUrl = new URL(value, url.href);
      if (!/^https?:$/.test(targetUrl.protocol)) return null;
      if (targetUrl.origin === url.origin) return null;
      return targetUrl.href;
    } catch {
      return null;
    }
  };

  const redirectIfValid = (target) => {
    const normalizedTarget = normalizeTarget(target);
    if (!normalizedTarget) return false;
    location.replace(normalizedTarget);
    return true;
  };

  if (isWeixin110RedirectPage) {
    const tryWeixin110Redirect = () => {
      const links = document.querySelectorAll("p a[href]");
      for (const link of links) {
        if (redirectIfValid(link.getAttribute("href"))) return true;
      }
      return false;
    };

    if (tryWeixin110Redirect()) return;

    let observer = null;
    const onReady = () => {
      if (tryWeixin110Redirect() && observer) observer.disconnect();
    };
    document.addEventListener("DOMContentLoaded", onReady, { once: true });
    window.addEventListener("load", onReady, { once: true });
    if (document.readyState !== "loading") onReady();

    observer = new MutationObserver(() => {
      if (tryWeixin110Redirect()) observer.disconnect();
    });
    if (document.documentElement) {
      observer.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), WEIXIN110_OBSERVER_TIMEOUT_MS);
    }
    return;
  }

  for (const rule of RULES) {
    if (!rule.param) continue;
    if (!rule.pattern.test(url.href)) continue;

    const target = url.searchParams.get(rule.param);
    if (!target) continue;

    // 阻止页面继续加载，直接跳转
    location.replace(target);
    return;
  }
})();
