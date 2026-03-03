// 需要处理的中间跳转页规则
// 每条规则包含：匹配当前页面 URL 的 pattern，以及 target 参数名
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
];

(function () {
  const url = new URL(location.href);

  for (const rule of RULES) {
    if (!rule.pattern.test(url.href)) continue;

    const target = url.searchParams.get(rule.param);
    if (!target) continue;

    // 阻止页面继续加载，直接跳转
    location.replace(target);
    return;
  }
})();
