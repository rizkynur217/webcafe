import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Login route
export async function POST(request) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({ error: 'Email dan password wajib diisi.' }, { status: 400 });
        }
        // Cari user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: 'Email tidak ditemukan.' }, { status: 400 });
        }
        // Cek password
        let valid = false;
        if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
            // Password sudah di-hash, gunakan bcrypt
            valid = await bcrypt.compare(password, user.password);
        } else {
            // Password plain text, bandingkan langsung
            valid = password === user.password;
        }
        if (!valid) {
            return NextResponse.json({ error: 'Password salah.' }, { status: 400 });
        }
        // Set cookie userId
        const res = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        res.cookies.set('userId', String(user.id), {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 hari
        });
        return res;
    } catch (err) {
        return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
    }
}

