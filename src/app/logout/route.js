import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Hapus cookie userId
  cookies().set('userId', '', { path: '/', expires: new Date(0) });
  return NextResponse.redirect('/login'); // Ganti ke '/' jika ingin ke landing
} 