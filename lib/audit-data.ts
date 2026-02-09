export interface AuditQuestion {
  code: string;
  category: string;
  categoryKey: string;
  question: string;
  weight: number;
  options: string[];
}

export interface AuditAnswer {
  code: string;
  answer: string;
  observation: string;
}

export interface ActionItem {
  priority: number;
  category: string;
  vulnerability: string;
  solution: string;
  product: string;
  investment: string;
  installation: string;
  impact: string;
}

export interface CategoryScore {
  category: string;
  categoryKey: string;
  maxPoints: number;
  earnedPoints: number;
  percentage: number;
  status: string;
}

export const CATEGORIES = [
  { key: 'perimetro', label: 'Perimetro e Estrutura', icon: 'shield-outline' as const },
  { key: 'iluminacao', label: 'Iluminacao e Visibilidade', icon: 'bulb-outline' as const },
  { key: 'acesso', label: 'Controle de Acesso', icon: 'key-outline' as const },
  { key: 'eletronica', label: 'Sistemas Eletronicos', icon: 'hardware-chip-outline' as const },
  { key: 'humano', label: 'Fatores Humanos', icon: 'people-outline' as const },
];

export const QUESTIONS: AuditQuestion[] = [
  {
    code: 'P01', category: 'Perimetro e Estrutura', categoryKey: 'perimetro',
    question: 'Tipo de imovel', weight: 15,
    options: ['Casa terrea', 'Sobrado 2 andares', 'Sobrado 3+ andares', 'Apartamento terreo', 'Apartamento andar baixo 1-3', 'Apartamento andar medio 4-8', 'Apartamento andar alto 9+', 'Cobertura/Penthouse', 'Casa em condominio', 'Triplex/Duplex', 'Sitio/Chacara 1000-5000m2', 'Fazenda >5000m2', 'Condominio fechado', 'Flat/Apart-hotel', 'Loft', 'Kitnet/Studio', 'Geminado', 'Outro (especificar)'],
  },
  {
    code: 'P02', category: 'Perimetro e Estrutura', categoryKey: 'perimetro',
    question: 'Metragem do terreno/area externa', weight: 5,
    options: ['0-50m2 (sem area)', '51-100m2', '101-200m2', '201-500m2', '501-1000m2', 'N/A (apartamento)', 'Outro (especificar)'],
  },
  {
    code: 'P03', category: 'Perimetro e Estrutura', categoryKey: 'perimetro',
    question: 'Tipo de muro/cerca', weight: 15,
    options: ['Nenhum', 'Cerca viva/plantas', 'Gradil/alambrado', 'Muro ate 1,5m', 'Muro 1,5-2,0m', 'Muro 2,0-2,5m', 'Muro >2,5m', 'Muro com concertina', 'Muro com espiculas', 'Muro com cacos vidro', 'Cerca eletrica ativa', 'Cerca eletrica + alarme', 'Concertina dupla', 'Muro + cerca + alarme', 'Outro (especificar)'],
  },
  {
    code: 'P04', category: 'Perimetro e Estrutura', categoryKey: 'perimetro',
    question: 'Quantidade de portas externas', weight: 8,
    options: ['0 (apenas portao)', '1 porta', '2 portas', '3 portas', '4+ portas'],
  },
  {
    code: 'P05', category: 'Perimetro e Estrutura', categoryKey: 'perimetro',
    question: 'Quantidade de janelas acessiveis do solo (<2,5m)', weight: 10,
    options: ['0 janelas', '1 janela', '2 janelas', '3-4 janelas', '5-6 janelas', '7-10 janelas', '10+ janelas', 'Todas >2,5m', 'Outro (especificar)'],
  },
  {
    code: 'P06', category: 'Perimetro e Estrutura', categoryKey: 'perimetro',
    question: 'Tipo de garagem/estacionamento', weight: 5,
    options: ['Nao possui', 'Vaga rua descoberta', 'Vaga rua coberta', 'Garagem aberta', 'Garagem com portao manual', 'Garagem com portao automatico', 'Portao auto biometria', 'Portao auto com app', 'Garagem subterranea', 'Box fechado', '2 portoes (duplo)', 'Outro (especificar)'],
  },
  {
    code: 'P07', category: 'Perimetro e Estrutura', categoryKey: 'perimetro',
    question: 'Gradil/protecao em janelas', weight: 10,
    options: ['Nenhuma protecao', 'Apenas telas', 'Grades decorativas', 'Grades com abertura', 'Pelicula 3M', 'Vidro laminado', 'Vidro temperado', 'Pelicula + grades', 'Persianas metalicas', 'Outro (especificar)'],
  },
  {
    code: 'I01', category: 'Iluminacao e Visibilidade', categoryKey: 'iluminacao',
    question: 'Iluminacao externa noturna principal', weight: 8,
    options: ['Nenhuma', 'Manual liga/desliga', 'Sensor presenca basico', 'Timer automatico', 'Smart WiFi', 'Smart com app', 'Integrada alarme', 'Colorida RGB', 'Holofotes', 'Solar externa', 'Outro (especificar)'],
  },
  {
    code: 'I02', category: 'Iluminacao e Visibilidade', categoryKey: 'iluminacao',
    question: 'Pontos de iluminacao no perimetro', weight: 5,
    options: ['0 pontos', '1 ponto (entrada)', '2 pontos (frente+lateral)', 'Frente + fundos', 'Perimetro completo', 'Postes com lampadas', 'Outro (especificar)'],
  },
  {
    code: 'I03', category: 'Iluminacao e Visibilidade', categoryKey: 'iluminacao',
    question: 'Iluminacao de emergencia (falta de energia)', weight: 3,
    options: ['Nao possui', 'Lanternas manuais', 'Lampada recarregavel', 'Nobreak basico', 'Nobreak + lampadas', 'Gerador', 'Outro (especificar)'],
  },
  {
    code: 'I04', category: 'Iluminacao e Visibilidade', categoryKey: 'iluminacao',
    question: 'Visibilidade da rua para o interior', weight: 5,
    options: ['Visibilidade total', 'Alta (70-90%)', 'Media (40-70%)', 'Baixa (10-40%)', 'Nenhuma (muros altos)', 'Muros + vegetacao', 'Outro (especificar)'],
  },
  {
    code: 'A01', category: 'Controle de Acesso', categoryKey: 'acesso',
    question: 'Tipo de fechadura porta principal', weight: 10,
    options: ['Comum padrao', 'Comum dupla', 'Tetra chave', 'Multiponto 3pts', 'Multiponto 5pts', 'Eletronica senha 4dig', 'Eletronica senha 6+dig', 'Biometrica digital', 'Biometrica facial', 'Smart Bluetooth', 'Smart WiFi', 'Smart app+backup', 'Yale Doorman', 'Magnetica', 'Combo eletronica+mecanica', 'Outro (especificar)'],
  },
  {
    code: 'A02', category: 'Controle de Acesso', categoryKey: 'acesso',
    question: 'Material da porta principal', weight: 8,
    options: ['Madeira oca', 'Madeira semi-macica', 'Madeira macica', 'Aco/Metal', 'Blindada nivel I', 'Blindada nivel II', 'Blindada nivel III', 'Blindada nivel IV+', 'PVC reforcado', 'Vidro temperado', 'Vidro laminado+metal', 'Aluminio reforcado', 'Porta cofre', 'Outro (especificar)'],
  },
  {
    code: 'A03', category: 'Controle de Acesso', categoryKey: 'acesso',
    question: 'Trancas adicionais (catenaria, ferrolho)', weight: 5,
    options: ['Nenhuma', 'Ferrolho simples 1pt', 'Ferrolho duplo', 'Barra transversal', 'Tranca eletronica', 'Outro (especificar)'],
  },
  {
    code: 'A04', category: 'Controle de Acesso', categoryKey: 'acesso',
    question: 'Porta de servico/fundos', weight: 7,
    options: ['Nao existe', 'Madeira basica', 'Metal simples', 'Gradeada', 'Gradeada + porta', 'Outro (especificar)'],
  },
  {
    code: 'A05', category: 'Controle de Acesso', categoryKey: 'acesso',
    question: 'Sistema de interfone/video porteiro', weight: 6,
    options: ['Nao possui', 'Interfone audio simples', 'Video porteiro basico', 'Video porteiro color', 'Smart com app', 'Smart reconhecimento facial', 'Integrado fechadura', 'Sistema completo abertura remota', 'Outro (especificar)'],
  },
  {
    code: 'E01', category: 'Sistemas Eletronicos', categoryKey: 'eletronica',
    question: 'Sistema de alarme', weight: 15,
    options: ['Nao possui', 'Simulador adesivos', 'Alarme local simples', 'Alarme com discagem', 'Monitorado 24h central', 'Monitorado + resposta armada', 'Smart DIY', 'Smart com app', 'Smart com IA', 'Hibrido local+monitorado', 'Multiplas centrais', 'Com cerca eletrica', 'Com botao panico', 'Outro (especificar)'],
  },
  {
    code: 'E02', category: 'Sistemas Eletronicos', categoryKey: 'eletronica',
    question: 'Sensores de abertura (portas/janelas)', weight: 8,
    options: ['Nenhum', '1 sensor (porta)', '2-3 sensores', 'Apenas portas', 'Apenas janelas', 'Portas+janelas principais', 'Portas+janelas+basculantes', 'Com fio', 'Sem fio wireless', 'Outro (especificar)'],
  },
  {
    code: 'E03', category: 'Sistemas Eletronicos', categoryKey: 'eletronica',
    question: 'Sensores volumetricos/movimento internos', weight: 7,
    options: ['Nenhum', '1 sensor (sala)', '2-3 sensores', 'PIR pet 15kg', 'PIR pet 25kg', 'Microondas', 'Duplo PIR+MW', 'Sensor cortina', 'Camera deteccao', 'Outro (especificar)'],
  },
  {
    code: 'E04', category: 'Sistemas Eletronicos', categoryKey: 'eletronica',
    question: 'Cameras CFTV quantidade e cobertura', weight: 8,
    options: ['Nenhuma', '1 camera (entrada)', '2 cameras (frente+fundos)', 'Frente+fundos', 'Perimetro completo', 'Perimetro+interior', 'Reconhecimento facial', 'Leitura placas', 'Cameras PTZ', 'Outro (especificar)'],
  },
  {
    code: 'E05', category: 'Sistemas Eletronicos', categoryKey: 'eletronica',
    question: 'Qualidade de gravacao CFTV', weight: 4,
    options: ['N/A', 'Analogica baixa', 'HD 720p', 'Full HD 1080p', '2K QHD', '4K UHD', 'Visao noturna 20m', 'Visao noturna 40m+', 'Colorida noturna', 'WDR', 'HDR', 'Outro (especificar)'],
  },
  {
    code: 'E06', category: 'Sistemas Eletronicos', categoryKey: 'eletronica',
    question: 'Armazenamento/gravacao CFTV', weight: 3,
    options: ['N/A', 'Sem gravacao', 'SD card local', 'DVR local 7 dias', 'DVR local 30 dias', 'NVR local', 'Cloud 7 dias', 'Cloud 30 dias', 'Cloud 90+ dias', 'Hibrido local+nuvem', 'Por movimento', 'Continua 24/7', 'Com redundancia', 'Outro (especificar)'],
  },
  {
    code: 'E07', category: 'Sistemas Eletronicos', categoryKey: 'eletronica',
    question: 'Botao de panico/emergencia', weight: 5,
    options: ['Nao possui', 'Fixo 1 ponto', 'Fixo 2+ pontos', 'Portatil/chaveiro', 'No celular app', 'Integrado central', 'Botao oculto', 'Por voz Alexa/Google', 'Outro (especificar)'],
  },
  {
    code: 'E08', category: 'Sistemas Eletronicos', categoryKey: 'eletronica',
    question: 'Automacao residencial integrada', weight: 6,
    options: ['Nenhuma', 'Lampadas smart', 'Central unificada', 'Com cenas automacao', 'Com geofencing', 'Com IA/aprendizado', 'Controle voz completo', 'Outro (especificar)'],
  },
  {
    code: 'H01', category: 'Fatores Humanos', categoryKey: 'humano',
    question: 'Presenca diurna (seg-sex 8h-18h)', weight: 7,
    options: ['Sempre vazia', 'Vazia 80-90%', 'Vazia 50-80%', 'Vazia <50%', 'Sempre alguem', 'Empregada diarista', 'Empregada integral', 'Turnos alternados', 'Monitoramento remoto', 'Outro (especificar)'],
  },
  {
    code: 'H02', category: 'Fatores Humanos', categoryKey: 'humano',
    question: 'Frequencia de viagens/ausencias longas', weight: 6,
    options: ['Nunca viaja', 'Raramente 1x/ano', 'Moderado 2-3x/ano', 'Frequente 4-6x/ano', 'Muito frequente mensal', 'Ausencias >1 mese', 'Casa temporada', 'Outro (especificar)'],
  },
  {
    code: 'H03', category: 'Fatores Humanos', categoryKey: 'humano',
    question: 'Animal de guarda na propriedade', weight: 6,
    options: ['Nao possui', 'Gato', 'Cachorro pequeno', 'Cachorro medio', 'Cachorro grande', 'Raca guarda treinado', 'Raca guarda profissional', 'Multiplos 2-3', 'Multiplos 4+', 'Alarme som cachorro', 'Outro (especificar)'],
  },
  {
    code: 'H04', category: 'Fatores Humanos', categoryKey: 'humano',
    question: 'Ronda/seguranca externa no bairro', weight: 10,
    options: ['Inexistente', 'Policiamento 1x/semana', 'Policiamento regular', 'Ronda motorizada', 'Ronda noturna', 'Guarita+ronda', 'Seguranca 8h', 'Seguranca 12h', 'Seguranca 24h', 'Seguranca armada', 'Condominio vigilancia', 'Cameras comunitarias', 'Outro (especificar)'],
  },
  {
    code: 'H05', category: 'Fatores Humanos', categoryKey: 'humano',
    question: 'Vizinhanca ativa/rede de vigilancia', weight: 5,
    options: ['Nenhuma interacao', 'Apenas cumprimento', 'Conversam regularmente', 'Trocam informacoes', 'Grupo WhatsApp ativo', 'Contratacao coletiva', 'Troca chaves', 'Observam viagens', 'Outro (especificar)'],
  },
  {
    code: 'H06', category: 'Fatores Humanos', categoryKey: 'humano',
    question: 'Exposicao em redes sociais (privacidade)', weight: 5,
    options: ['Perfis publicos localizacao sempre', 'Posta tempo real', 'Posta com atraso', 'Atraso 24h+', 'Perfis privados', 'Consciencia digital', 'Outro (especificar)'],
  },
  {
    code: 'H07', category: 'Fatores Humanos', categoryKey: 'humano',
    question: 'Historico de incidentes nos ultimos 24 meses', weight: 8,
    options: ['Nenhum', 'Tentativa furto carro', 'Tentativa invasao', 'Furto consumado', 'Roubo/assalto', 'Multiplos incidentes', 'Incidentes vizinhos', 'Area historico criminal', 'Outro (especificar)'],
  },
  {
    code: 'H08', category: 'Fatores Humanos', categoryKey: 'humano',
    question: 'Indice de criminalidade do bairro/regiao', weight: 10,
    options: ['Muito baixo <5/1000', 'Baixo 5-15/1000', 'Medio 15-30/1000', 'Alto 30-50/1000', 'Muito alto >50/1000', 'Dados indisponiveis', 'Consultado SSP', 'Outro (especificar)'],
  },
];

export const ACTION_ITEMS: ActionItem[] = [
  {
    priority: 1, category: 'ACESSO', vulnerability: 'Fechadura inadequada',
    solution: 'Substituir por deadbolt tetra', product: 'Papaiz 510 / Yale 500',
    investment: 'R$ 180-250', installation: 'DIY 30min', impact: '+25%',
  },
  {
    priority: 1, category: 'ELETRONICA', vulnerability: 'Sem sistema de alarme',
    solution: 'Instalar central monitorada', product: 'Verisure Starter',
    investment: 'R$ 89/mes', installation: 'Profissional', impact: '+40%',
  },
  {
    priority: 2, category: 'ILUMINACAO', vulnerability: 'Iluminacao insuficiente',
    solution: 'Sensor PIR 180 graus externo', product: 'Intelbras ESP 360 A',
    investment: 'R$ 65', installation: 'DIY 15min', impact: '+15%',
  },
  {
    priority: 2, category: 'ELETRONICA', vulnerability: 'Sem cameras CFTV',
    solution: 'Kit 2 cameras WiFi Full HD', product: 'Tapo C200 / Intelbras',
    investment: 'R$ 320', installation: 'DIY 1h', impact: '+20%',
  },
  {
    priority: 2, category: 'PERIMETRO', vulnerability: 'Janelas sem protecao',
    solution: 'Instalar grades tubulares', product: 'Serralheria local 25mm',
    investment: 'R$ 300/un', installation: 'Profissional', impact: '+18%',
  },
  {
    priority: 3, category: 'PERIMETRO', vulnerability: 'Muro baixo (<1,8m)',
    solution: 'Elevar para 2,2m + espiculas', product: 'Projeto customizado',
    investment: 'R$ 8.000+', installation: '5 dias', impact: '+35%',
  },
  {
    priority: 3, category: 'AUTOMACAO', vulnerability: 'Ausencias prolongadas',
    solution: 'Timer smart para luzes', product: 'Positivo Casa Inteligente',
    investment: 'R$ 45', installation: 'DIY 5min', impact: '+8%',
  },
];

export function calculateScore(answers: Record<string, AuditAnswer>): {
  totalScore: number;
  maxScore: number;
  percentage: number;
  classification: string;
  categories: CategoryScore[];
} {
  const categoryMap: Record<string, { earned: number; max: number }> = {};

  for (const q of QUESTIONS) {
    if (!categoryMap[q.categoryKey]) {
      categoryMap[q.categoryKey] = { earned: 0, max: 0 };
    }
    categoryMap[q.categoryKey].max += q.weight;

    const answer = answers[q.code];
    if (answer && answer.answer) {
      const optionIndex = q.options.indexOf(answer.answer);
      const totalOptions = q.options.length;
      if (optionIndex >= 0 && totalOptions > 1) {
        const score = ((optionIndex) / (totalOptions - 1)) * q.weight;
        categoryMap[q.categoryKey].earned += score;
      }
    }
  }

  const categories: CategoryScore[] = CATEGORIES.map(cat => {
    const data = categoryMap[cat.key] || { earned: 0, max: 0 };
    const percentage = data.max > 0 ? Math.round((data.earned / data.max) * 100) : 0;
    let status = 'CRITICO';
    if (percentage >= 80) status = 'EXCELENTE';
    else if (percentage >= 60) status = 'BOM';
    else if (percentage >= 40) status = 'MODERADO';
    else if (percentage >= 20) status = 'ATENCAO';

    return {
      category: cat.label,
      categoryKey: cat.key,
      maxPoints: data.max,
      earnedPoints: Math.round(data.earned),
      percentage,
      status,
    };
  });

  const totalEarned = categories.reduce((sum, c) => sum + c.earnedPoints, 0);
  const totalMax = categories.reduce((sum, c) => sum + c.maxPoints, 0);
  const percentage = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;

  let classification = 'VULNERABILIDADE EXTREMA';
  if (percentage >= 80) classification = 'SEGURANCA EXCELENTE';
  else if (percentage >= 60) classification = 'SEGURANCA BOA';
  else if (percentage >= 40) classification = 'SEGURANCA MODERADA';
  else if (percentage >= 20) classification = 'ATENCAO NECESSARIA';

  return { totalScore: totalEarned, maxScore: totalMax, percentage, classification, categories };
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'EXCELENTE': return '#00C6AE';
    case 'BOM': return '#2ED573';
    case 'MODERADO': return '#FFD93D';
    case 'ATENCAO': return '#FF9F43';
    case 'CRITICO': return '#FF4757';
    default: return '#FF4757';
  }
}

export function getCategoryColor(key: string): string {
  const colors: Record<string, string> = {
    perimetro: '#FF6B6B',
    iluminacao: '#FFD93D',
    acesso: '#6BCB77',
    eletronica: '#4D96FF',
    humano: '#9B59B6',
  };
  return colors[key] || '#00C6AE';
}
