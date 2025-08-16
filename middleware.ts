// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

//   const isProd = process.env.NODE_ENV === "production";

//   const csp = [
//     // mặc định chỉ cùng nguồn
//     `default-src 'self'`,
//     // script: dùng nonce + strict-dynamic; dev cho unsafe-eval; wasm cho decoder
//     `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${
//       isProd ? "" : "'unsafe-eval'"
//     } 'wasm-unsafe-eval' https: http:`,
//     // style: dùng nonce (hoặc thêm 'unsafe-inline' nếu cần, nhưng nonce là sạch nhất)
//     `style-src 'self' 'nonce-${nonce}'`,
//     // ảnh + textures
//     `img-src 'self' blob: data:`,
//     // fetch/XHR/websocket/eventsource
//     `connect-src 'self' blob: data:`,
//     // fonts nếu có CDN thì thêm domain
//     `font-src 'self'`,
//     // audio/video nếu app có
//     `media-src 'self' blob: data:`,
//     // web workers (draco/ktx2 thường chạy worker + wasm)
//     `worker-src 'self' blob:`,
//     // không nhúng object
//     `object-src 'none'`,
//     `base-uri 'self'`,
//     `form-action 'self'`,
//     // chặn clickjacking
//     `frame-ancestors 'none'`,
//     // nâng cấp http->https nếu prod
//     `upgrade-insecure-requests`,
//   ]
//     .filter(Boolean)
//     .join("; ");

//   const requestHeaders = new Headers(request.headers);
//   requestHeaders.set("x-nonce", nonce);
//   requestHeaders.set("Content-Security-Policy", csp);

//   const response = NextResponse.next({
//     request: { headers: requestHeaders },
//   });
//   response.headers.set("Content-Security-Policy", csp);
//   response.headers.set("Content-Security-Policy-Report-Only", csp);
//   return response;
// }

// export const config = {
//   matcher: [
//     // giữ nguyên như bro đã làm
//     {
//       source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
//       missing: [
//         { type: "header", key: "next-router-prefetch" },
//         { type: "header", key: "purpose", value: "prefetch" },
//       ],
//     },
//   ],
// };

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next();
}
