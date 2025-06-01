import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    console.log('GET /api/destinations: Attempting to fetch all destinations');
    const destinations = await prisma.destination.findMany();
    console.log(`GET /api/destinations: Successfully fetched ${destinations.length} destinations`);
    return NextResponse.json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json({ error: 'Failed to fetch destinations', details: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/destinations: Processing request');
    let body;
    try {
      body = await request.json();
      console.log('Request body:', body);
    } catch (e) {
      console.error('Invalid JSON in request body:', e);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'image', 'rating', 'price'];
    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    console.log('Validation passed, creating destination...');
    // Create new destination
    const destination = await prisma.destination.create({
      data: {
        name: body.name,
        description: body.description,
        image: body.image,
        rating: parseFloat(body.rating),
        price: parseFloat(body.price),
      },
    });
    
    console.log('Destination created successfully:', destination);
    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.error("Error creating destination:", error);
    return NextResponse.json({ 
      error: 'Failed to create destination', 
      details: String(error) 
    }, { status: 500 });
  }
}
