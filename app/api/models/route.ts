import { NextResponse } from "next/server";

// optional: chỉ allow 1 domain
const ALLOW_HOSTS = new Set(["static.poly.pizza"]);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const src = searchParams.get("url");
    if (!src)
      return NextResponse.json({ error: "Missing url" }, { status: 400 });

    const u = new URL(src);
    if (ALLOW_HOSTS.size && !ALLOW_HOSTS.has(u.host)) {
      return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
    }

    // fetch upstream; revalidate mỗi 1 giờ
    const upstream = await fetch(src, { next: { revalidate: 3600 } });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream ${upstream.status}` },
        { status: 502 }
      );
    }

    const buf = await upstream.arrayBuffer();
    const ct = upstream.headers.get("content-type") || "model/gltf-binary"; // .glb

    return new NextResponse(buf, {
      headers: {
        "Content-Type": ct,
        "Cache-Control":
          "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        "Content-Disposition": `inline; filename="${
          u.pathname.split("/").pop() || "model.glb"
        }"`,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
