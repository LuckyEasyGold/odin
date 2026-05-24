-- AlterTable
ALTER TABLE "users" ADD COLUMN     "canCurate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "communityLevel" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "communityScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "communityTitle" TEXT NOT NULL DEFAULT 'Aprendiz de Curadoria',
ADD COLUMN     "specialistValidatedByCommunity" BOOLEAN NOT NULL DEFAULT false;

