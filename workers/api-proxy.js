/**
 * Cloudflare Worker · 热搜 / 天气跨域代理
 * --------------------------------------------------------------------------
 * GitHub Pages 等静态站不能直连 api.vsaa.cn（无 CORS）。
 * 部署本 Worker 后，把返回的地址填进 assets/data/site-config.json 的 apiProxy。
 *
 * 部署步骤（免费）：
 * 1. 打开 https://dash.cloudflare.com → Workers & Pages → Create
 * 2. 选 "Create Worker"，把本文件内容粘进编辑器
 * 3. Deploy → 得到类似 https://fanshuo-api-proxy.你的子域.workers.dev
 * 4. site-config.json 写入：
 *      "apiProxy": "https://fanshuo-api-proxy.你的子域.workers.dev"
 * 5. 把站点推到 GitHub Pages / 任意静态托管即可
 *
 * 调用方式：
 *   GET {apiProxy}?url=https%3A%2F%2Fapi.vsaa.cn%2F...
 */
const ALLOWED_HOSTS = new Set(["api.vsaa.cn"]);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400"
};

function jsonError(status, message) {
  return new Response(JSON.stringify({ code: 0, success: false, msg: message }), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS
    }
  });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return jsonError(405, "只支持 GET");
    }

    const reqUrl = new URL(request.url);
    const target = reqUrl.searchParams.get("url");
    if (!target) {
      return jsonError(400, "缺少 url 参数");
    }

    let upstream;
    try {
      upstream = new URL(target);
    } catch (error) {
      return jsonError(400, "url 无效");
    }

    if (upstream.protocol !== "https:") {
      return jsonError(400, "只允许 https");
    }

    if (!ALLOWED_HOSTS.has(upstream.hostname)) {
      return jsonError(403, "不允许代理该域名");
    }

    try {
      const upstreamRes = await fetch(upstream.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "FanshuoApiProxy/1.0"
        },
        cf: { cacheTtl: 60, cacheEverything: true }
      });

      const body = await upstreamRes.arrayBuffer();
      const headers = new Headers(CORS);
      headers.set(
        "Content-Type",
        upstreamRes.headers.get("Content-Type") || "application/json; charset=utf-8"
      );
      headers.set("Cache-Control", "public, max-age=60");

      return new Response(body, {
        status: upstreamRes.status,
        headers
      });
    } catch (error) {
      return jsonError(502, "上游请求失败");
    }
  }
};
