import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
    const { id } = params;
    try {
        const menuItem = await prisma.menuItem.findUnique({
            where: { id: parseInt(id) },
        });
        if (!menuItem) {
            return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
        }
        return NextResponse.json(menuItem);
    } catch (error) {
        console.error('Error fetching menu item:', error);
        return NextResponse.json({ error: 'Failed to fetch menu item' }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    const { id } = params;
    try {
        const contentType = request.headers.get('content-type') || '';
        let data = {};
        let imageUrl = null;
        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            data.description = formData.get('description');
            data.price = formData.get('price');
            data.category = formData.get('category');
            // Tidak update name!
            // Handle file upload jika ada
            const file = formData.get('image');
            if (file && typeof file === 'object' && file.size > 0) {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const filename = `${Date.now()}_${file.name}`;
                const uploadPath = path.join(process.cwd(), 'public', 'menu-images', filename);
                fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
                fs.writeFileSync(uploadPath, buffer);
                imageUrl = `/menu-images/${filename}`;
            }
        } else {
            data = await request.json();
            imageUrl = data.imageUrl || null;
        }
        // Ambil menu lama
        const menuItem = await prisma.menuItem.findUnique({ where: { id: parseInt(id) } });
        if (!menuItem) {
            return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
        }
        const updatedMenuItem = await prisma.menuItem.update({
            where: { id: parseInt(id) },
            data: {
                // name tidak diubah
                description: data.description !== undefined ? data.description : menuItem.description,
                price: data.price !== undefined ? parseFloat(data.price) : menuItem.price,
                imageUrl: imageUrl || menuItem.imageUrl,
                category: data.category !== undefined ? data.category : menuItem.category,
                isAvailable: data.isAvailable !== undefined ? data.isAvailable : menuItem.isAvailable
            }
        });
        return NextResponse.json(updatedMenuItem);
    } catch (error) {
        console.error('Error updating menu item:', error);
        return NextResponse.json({ error: error.message || 'Failed to update menu item' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    // PATCH dan PUT sama, arahkan ke PATCH
    return PATCH(request, { params });
}

export async function DELETE(request, { params }) {
    const { id } = params;
    try {
        await prisma.menuItem.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ message: 'Menu item deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
    }
}



