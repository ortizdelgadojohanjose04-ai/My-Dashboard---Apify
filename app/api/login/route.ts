import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (token === 'JohanAdmin2026') {
    // Creamos la respuesta que redirige a la página principal
    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Adjuntamos la cookie directamente a la respuesta
    response.cookies.set({
      name: 'isAdmin',
      value: 'true',
      httpOnly: true,
      secure: false, // false porque estamos en localhost
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
}