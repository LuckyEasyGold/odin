/**
 * ODIN Legal Linter v1.0
 * Analisador automático de conformidade para documentos profissionais.
 */

export interface LinterResult {
  score: number;
  missingClauses: string[];
  foundClauses: string[];
  suggestions: string[];
}

const CRITICAL_CLAUSES = [
  { name: "Identificação das Partes", keywords: ["contratante", "contratada", "partes", "cpf", "cnpj", "endereço"], weight: 15 },
  { name: "Objeto", keywords: ["objeto", "objetivo", "descrição dos serviços", "prestação de"], weight: 15 },
  { name: "Preço e Pagamento", keywords: ["preço", "valor", "pagamento", "remuneração", "honorários"], weight: 15 },
  { name: "Prazo", keywords: ["prazo", "vigência", "duração", "período"], weight: 10 },
  { name: "Rescisão", keywords: ["rescisão", "distrato", "extinção", "cancelamento", "multa"], weight: 15 },
  { name: "Obrigações", keywords: ["obrigações", "deveres", "responsabilidades"], weight: 10 },
  { name: "Confidencialidade", keywords: ["confidencialidade", "sigilo", "informações confidenciais"], weight: 10 },
  { name: "Foro", keywords: ["foro", "comarca", "jurisdição", "dirimir"], weight: 10 },
];

export function analyzeModelCompliance(template: string): LinterResult {
  const content = template.toLowerCase();
  const foundClauses: string[] = [];
  const missingClauses: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  for (const clause of CRITICAL_CLAUSES) {
    const isPresent = clause.keywords.some(k => content.includes(k));
    
    if (isPresent) {
      score += clause.weight;
      foundClauses.push(clause.name);
    } else {
      missingClauses.push(clause.name);
      suggestions.push(`Considere adicionar uma seção de "${clause.name}" para maior segurança jurídica.`);
    }
  }

  // Bonus for variable usage (flexibility)
  const variableMatches = template.match(/{{([^{}]+)}}/g) || [];
  if (variableMatches.length > 5) {
    score = Math.min(100, score + 5);
  }

  return {
    score,
    missingClauses,
    foundClauses,
    suggestions
  };
}
