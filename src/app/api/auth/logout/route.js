import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST() {
    const res = NextResponse.json({ success: true });
    res.cookies.set('userId', '', {
            httpOnly: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 0, // hapus cookie
    });
    return res;
}
