import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { locale } = await request.json();

  if (locale && ['en', 'bn'].includes(locale)) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('locale', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return response;
  }

  return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const cookieStore = request.cookies;
  const locale = cookieStore.get('locale')?.value as string | undefined;
  return new NextResponse(locale || 'en', {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

export const config = {
  runtime: 'nodejs',
};