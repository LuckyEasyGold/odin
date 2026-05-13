import { NextRequest, NextResponse } from 'next/server';
import app from '../../../../../../api/index'; // This imports the express app

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handle(request);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handle(request);
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handle(request);
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handle(request);
}

async function handle(request: NextRequest) {
  // Simple bridge to Express
  // Since we want to avoid complex integration, we can just redirect or 
  // better, use the Express app directly as a handler if possible.
  // But App Router handlers are different from Express.
  
  // For now, let's use a simpler approach: 
  // If we are here, it means the vercel.json rewrite failed.
  // We can try to fetch from the actual API function if it's deployed.
  
  return NextResponse.json({ 
    error: "API Bridge Active", 
    message: "If you see this, the Next.js route is working but the Express integration is pending. Please check vercel.json rewrites."
  }, { status: 500 });
}
