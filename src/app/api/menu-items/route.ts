import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust import path

export async function GET() {
  try {
    const menuItems = await prisma.menuItems.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(menuItems);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price } = body;

    const menuItem = await prisma.menuItems.create({
      data: {
        name,
        description,
        price: 0, // Always 0 as per requirement
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}