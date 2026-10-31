export default {
  async fetch(request, env, ctx) {
    // آدرس مقصد (OpenRouter)
    const TELEGRAPH_URL = 'openrouter.ai';
    
    const url = new URL(request.url);
    const headers_Origin = request.headers.get("Access-Control-Allow-Origin") || "*";

    // ۱. تغییر هاست به OpenRouter
    url.host = TELEGRAPH_URL;

    // ۲. اضافه کردن /api به ابتدای مسیر
    // این کار باعث می‌شود /v1/chat/completions به /api/v1/chat/completions تبدیل شود
    if (!url.pathname.startsWith('/api')) {
      url.pathname = `/api${url.pathname}`;
    }

    // ساخت درخواست جدید
    const modifiedRequest = new Request(url.toString(), {
      headers: request.headers,
      method: request.method,
      body: request.body,
      redirect: 'follow'
    });

    try {
      // ارسال درخواست به OpenRouter
      const response = await fetch(modifiedRequest);
      const modifiedResponse = new Response(response.body, response);

      // اضافه کردن هدرهای CORS برای دسترسی از مرورگر
      modifiedResponse.headers.set('Access-Control-Allow-Origin', headers_Origin);
      
      // مدیریت درخواست‌های Preflight (OPTIONS)
      if (request.method === 'OPTIONS') {
        modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        modifiedResponse.headers.set('Access-Control-Allow-Headers', '*');
      }

      return modifiedResponse;
    } catch (error) {
      // در صورت بروز خطا در اتصال به OpenRouter
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}
