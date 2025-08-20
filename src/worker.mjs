/**
 * 代理的目标 API 地址
 * The base URL for the Google Generative AI API.
 */
const BASE_URL = "https://generativelanguage.googleapis.com";

export default {
  /**
   * Cloudflare Worker 的入口函数
   * Entry point for the Cloudflare Worker.
   * @param {Request} request 客户端发来的请求
   * @returns {Promise<Response>} 返回给客户端的响应
   */
  async fetch(request) {
    // 首先处理 CORS 预检请求 (OPTIONS)
    // Handle CORS preflight requests (OPTIONS method).
    if (request.method === "OPTIONS") {
      return handleOPTIONS();
    }

    const { pathname, search } = new URL(request.url);

    // 核心逻辑：只代理 /v1beta 开头的路径
    // Core logic: Only proxy requests for paths starting with /v1beta.
    if (pathname.startsWith("/v1beta")) {
      return handleProxy(request, pathname, search);
    }

    // 对于所有其他路径，返回 404 Not Found
    // For all other paths, return a 404 Not Found response.
    return new Response("Not Found", { status: 404 });
  }
};

/**
 * 负责将请求转发给目标 API
 * Forwards the incoming request to the target API.
 * @param {Request} request 原始请求
 * @param {string} pathname 请求路径
 * @param {string} search 查询字符串
 * @returns {Promise<Response>} 目标 API 的响应
 */
async function handleProxy(request, pathname, search) {
  const targetUrl = `${BASE_URL}${pathname}${search}`;

  // 复制请求头，以便修改
  // Create a mutable copy of the request headers.
  const forwardHeaders = new Headers(request.headers);

  // 从 "Authorization" 头中提取 API Key (例如 "Bearer <API_KEY>")
  // Extract the API key from the "Authorization" header.
  const auth = forwardHeaders.get("Authorization");
  const apiKey = auth?.split(" ")[1];

  if (apiKey) {
    // 设置 Google API 需要的 "x-goog-api-key" 头
    // Set the Google-specific API key header.
    forwardHeaders.set("x-goog-api-key", apiKey);
    // 移除原始的 "Authorization" 头，避免冲突
    // Remove the original "Authorization" header to avoid conflicts.
    forwardHeaders.delete("Authorization");
  }
  
  // 删除 "Host" 头，让 fetch 根据 targetUrl 自动设置
  // Let the fetch client set the "Host" header automatically based on the target URL.
  forwardHeaders.delete("Host");

  // 将请求转发到目标地址
  // Forward the request to the target URL.
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: forwardHeaders,
    body: request.body,
    // 对于需要流式传输请求体的场景（如 Vercel Edge），此选项是必要的
    // This is necessary for environments that handle streaming request bodies.
    duplex: 'half',
  });

  // 将目标 API 的响应返回给客户端，并附加上 CORS 头
  // Return the response from the target service, adding our own CORS headers.
  return new Response(response.body, addCorsHeaders(response));
}

/**
 * 处理 CORS 预检请求 (OPTIONS)
 * Handles OPTIONS requests for CORS preflight.
 * @returns {Response}
 */
function handleOPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    }
  });
}

/**
 * 为响应对象添加通用的 CORS 响应头
 * Adds permissive CORS headers to a Response object.
 * @param {object} responseInit 一个 Response 对象或包含 { headers, status, statusText } 的对象
 * @returns {object} 包含新头的响应初始化对象
 */
function addCorsHeaders({ headers, status, statusText }) {
  const newHeaders = new Headers(headers);
  newHeaders.set("Access-Control-Allow-Origin", "*");
  return { headers: newHeaders, status, statusText };
}
