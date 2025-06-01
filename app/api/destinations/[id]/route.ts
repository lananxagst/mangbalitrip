import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/destinations/[id] - Mendapatkan satu destination berdasarkan ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const destination = await prisma.destination.findUnique({
      where: { id },
    });
    
    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }
    
    return NextResponse.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destination' },
      { status: 500 }
    );
  }
}

// PUT /api/destinations/[id] - Update destination berdasarkan ID
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const body = await request.json();
    const { name, description, image, rating, price } = body;
    
    // Periksa apakah destination ada
    const existingDestination = await prisma.destination.findUnique({
      where: { id },
    });
    
    if (!existingDestination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }
    
    // Update destination
    const updatedDestination = await prisma.destination.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingDestination.name,
        description: description !== undefined ? description : existingDestination.description,
        image: image !== undefined ? image : existingDestination.image,
        rating: rating !== undefined ? rating : existingDestination.rating,
        price: price !== undefined ? price : existingDestination.price,
      },
    });
    
    return NextResponse.json(updatedDestination);
  } catch (error) {
    console.error('Error updating destination:', error);
    return NextResponse.json(
      { error: 'Failed to update destination' },
      { status: 500 }
    );
  }
}

// DELETE /api/destinations/[id] - Menghapus destination berdasarkan ID
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    // Periksa apakah destination ada
    const existingDestination = await prisma.destination.findUnique({
      where: { id },
    });
    
    if (!existingDestination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }
    
    // Hapus destination
    await prisma.destination.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Error deleting destination:', error);
    return NextResponse.json(
      { error: 'Failed to delete destination' },
      { status: 500 }
    );
  }
}
