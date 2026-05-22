export type CommunityLevelInfo = {
  level: number;
  minScore: number;
  title: string;
  canCurate: boolean;
};

const LEVELS: CommunityLevelInfo[] = [
  { level: 1, minScore: 0, title: "Aprendiz de Curadoria I", canCurate: false },
  {
    level: 5,
    minScore: 120,
    title: "Aprendiz de Curadoria V",
    canCurate: false,
  },
  {
    level: 10,
    minScore: 300,
    title: "Operador de Modelos X",
    canCurate: false,
  },
  { level: 15, minScore: 600, title: "Revisor Técnico XV", canCurate: true },
  { level: 20, minScore: 950, title: "Curador Associado XX", canCurate: true },
  { level: 25, minScore: 1400, title: "Curador Sênior XXV", canCurate: true },
  {
    level: 30,
    minScore: 2000,
    title: "Guardião de Compliance XXX",
    canCurate: true,
  },
  {
    level: 33,
    minScore: 2600,
    title: "Mestre da Comunidade XXXIII",
    canCurate: true,
  },
];

export function resolveCommunityProgress(score: number): CommunityLevelInfo {
  const safeScore = Number.isFinite(score) ? Math.max(0, Math.floor(score)) : 0;
  let current = LEVELS[0];

  for (const info of LEVELS) {
    if (safeScore >= info.minScore) current = info;
  }

  return current;
}
