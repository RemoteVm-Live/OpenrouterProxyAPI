export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const headers_Origin = request.headers.get("Access-Control-Allow-Origin") || "*";

    // پاسخ به درخواست‌های Preflight مرورگر
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': headers_Origin,
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            }
        });
    }

    const targetUrl = 'https://openrouter.ai/api' + url.pathname + url.search;

    const modifiedRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
    });

    try {
        const response = await fetch(modifiedRequest);
        const modifiedResponse = new Response(response.body, response);
        modifiedResponse.headers.set('Access-Control-Allow-Origin', headers_Origin);
        return modifiedResponse;
    } catch (error) {
        // اگر اتصال به OpenRouter برقرار نشد
        return new Response(JSON.stringify({ error: error.message }), {
            status: 502,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': headers_Origin
            }
        });
    }
}
