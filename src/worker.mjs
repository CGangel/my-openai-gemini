export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 检查URL路径是否以 /v1beta 开头
    if (url.pathname.startsWith('/v1beta')) {
      // 如果是，则修改主机名并代理请求
      url.host = 'generativelanguage.googleapis.com';
      return fetch(new Request(url, request));
    } else {
      // 如果不是，则返回 426 状态码
      // HTTP 426 Upgrade Required 表示客户端应该切换到不同的协议。
      // 在这里我们用它来表示该路径不被支持，并暗示只有特定路径（如/v1beta）是有效的。
      return new Response('Falie', {
        status: 426,
        statusText: 'Upgrade Required'
      });
    }
  }
}
