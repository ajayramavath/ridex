import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const z = searchParams.get('z');
  const x = searchParams.get('x');
  const y = searchParams.get('y');
  const styleId = searchParams.get('style');

  const tileUrl = `https://api.mapbox.com/styles/v1/mapbox/${styleId}/tiles/${z}/${x}/${y}?access_token=${process.env.MAPBOX_API_KEY}`;

  try {
    const res = await fetch(tileUrl);
    return new NextResponse(res.body, {
      headers: { 'Cache-Control': 'public, max-age=86400' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Tile fetch failed' }, { status: 500 });
  }
}