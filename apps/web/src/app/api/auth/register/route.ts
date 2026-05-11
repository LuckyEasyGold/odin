import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, fullName, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Usuário ou email já cadastrado" }, { status: 400 });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        fullName,
        email,
        password, // In production, we MUST hash this!
      },
    });

    return NextResponse.json({ message: "Usuário criado com sucesso", userId: user.id }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
