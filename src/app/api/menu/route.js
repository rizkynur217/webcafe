import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
    try {
        const menu = await prisma.menuItem.findMany();
        return NextResponse.json(menu);
    } catch (error) {
        console.error('Error fetching menu:', error);
        return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        // Cek content-type
        const contentType = request.headers.get('content-type') || '';
        let data = {};
        let imageUrl = null;
        if (contentType.includes('multipart/form-data')) {
            // Parse FormData
            const formData = await request.formData();
            data.name = formData.get('name');
            data.description = formData.get('description');
            data.price = formData.get('price');
            data.category = formData.get('category');
            // Handle file upload (jika ada)
            const file = formData.get('image');
            if (file && typeof file === 'object' && file.size > 0) {
                // Simpan file ke public/menu-images (jika resource memungkinkan)
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const fs = require('fs');
                const path = require('path');
                const filename = `${Date.now()}_${file.name}`;
                const uploadPath = path.join(process.cwd(), 'public', 'menu-images', filename);
                // Pastikan folder ada
                fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
                fs.writeFileSync(uploadPath, buffer);
                imageUrl = `/menu-images/${filename}`;
            }
        } else {
            // Fallback: JSON
            data = await request.json();
            imageUrl = data.imageUrl || null;
        }

        // Validate required fields
        if (!data.name || !data.price || !data.category) {
            return NextResponse.json(
                { error: 'Name, price, and category are required' },
                { status: 400 }
            );
        }

        // Ensure the category value is valid for the enum
        const validCategories = ['MAINCOURSE', 'COFFEE', 'NONCOFFEE', 'SNACK', 'DESSERT'];
        if (!validCategories.includes(data.category)) {
            return NextResponse.json(
                { error: 'Invalid category. Must be one of: MAINCOURSE, COFFEE, NONCOFFEE, SNACK, DESSERT' },
                { status: 400 }
            );
        }

        const newMenuItem = await prisma.menuItem.create({
            data: {
                name: data.name,
                description: data.description || null,
                price: parseFloat(data.price),
                imageUrl: imageUrl,
                category: data.category,
                isAvailable: data.isAvailable !== undefined ? data.isAvailable : true
            }
        });

        return NextResponse.json(newMenuItem, { status: 201 });
    } catch (error) {
        console.error('Error creating menu item:', error);
        return NextResponse.json(
            { error: `Error creating menu item: ${error.message}` },
            { status: 500 }
        );
    }
} 