/**
 * 目标 API 的主机名
 */
const PROXY_HOST = "generativelanguage.googleapis.com";

export default {
  /**
   * @param {Request} request 传入的请求
   * @returns {Promise<Response>} 返回的响应
   */
  async fetch(request) {
    const url = new URL(request.url);

    // 预检请求（Preflight requests），用于处理浏览器的 CORS 策略
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*", // 允许所有方法
          "Access-Control-Allow-Headers": "*", // 允许所有请求头
        },
      });
    }

    // 检查请求路径是否以 /v1beta/ 开头
    if (url.pathname.startsWith('/v1beta/')) {
      // 如果是，则将主机名修改为目标 API 的主机名
      url.hostname = PROXY_HOST;

      // 创建一个新请求，使用修改后的 URL 和原始请求的所有信息（方法、请求头、请求体等）
      // 然后将其转发到目标 API，并直接返回其响应
      return fetch(new Request(url, request));
    }

    // 如果路径不匹配，则返回 404 Not Found
    return new Response('Not Found', { status: 404 });
  }
};
