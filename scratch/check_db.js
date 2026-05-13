const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkModels() {
  try {
    const count = await prisma.model.count();
    console.log(`Total de modelos: ${count}`);
    
    const activePublicCount = await prisma.model.count({
      where: { isActive: true, isPublic: true }
    });
    console.log(`Modelos ativos e públicos: ${activePublicCount}`);
    
    const sample = await prisma.model.findMany({
      take: 5,
      select: { name: true, slug: true, isActive: true, isPublic: true }
    });
    console.log('Amostra de modelos:', JSON.stringify(sample, null, 2));
    
  } catch (error) {
    console.error('Erro ao consultar banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkModels();
