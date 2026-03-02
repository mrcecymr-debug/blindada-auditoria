export interface AuditQuestion {
  code: string;
  category: string;
  categoryKey: string;
  question: string;
  weight: number;
  options: string[];
  inverted?: boolean;
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
  questionLabel?: string;
  answerText?: string;
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
    inverted: true,
  },
  {
    code: 'P05', category: 'Perimetro e Estrutura', categoryKey: 'perimetro',
    question: 'Quantidade de janelas acessiveis do solo (<2,5m)', weight: 10,
    options: ['0 janelas', '1 janela', '2 janelas', '3-4 janelas', '5-6 janelas', '7-10 janelas', '10+ janelas', 'Todas >2,5m', 'Outro (especificar)'],
    inverted: true,
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
    options: ['Nao existe', 'Madeira oca', 'Madeira semi-macica', 'Madeira macica', 'Aco/Metal', 'Blindada nivel I', 'Blindada nivel II', 'Blindada nivel III', 'Blindada nivel IV+', 'PVC reforcado', 'Vidro temperado', 'Vidro laminado+metal', 'Aluminio reforcado', 'Porta cofre', 'Outro (especificar)'],
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
    inverted: true,
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
    inverted: true,
  },
  {
    code: 'H08', category: 'Fatores Humanos', categoryKey: 'humano',
    question: 'Indice de criminalidade do bairro/regiao', weight: 10,
    options: ['Muito baixo <5/1000', 'Baixo 5-15/1000', 'Medio 15-30/1000', 'Alto 30-50/1000', 'Muito alto >50/1000', 'Dados indisponiveis', 'Consultado SSP', 'Outro (especificar)'],
    inverted: true,
  },
];

export const OPTION_HINTS: Record<string, Record<string, string>> = {
  P01: {
    'Casa terrea': 'Residencia de um unico pavimento, maior exposicao ao nivel da rua',
    'Sobrado 2 andares': 'Casa com 2 pavimentos, dormitorios geralmente no andar superior',
    'Sobrado 3+ andares': 'Casa com 3 ou mais pavimentos',
    'Apartamento terreo': 'Apartamento no nivel da rua, maior risco de acesso externo',
    'Apartamento andar baixo 1-3': 'Andares 1 a 3, ainda acessiveis por escadas/escalonamento',
    'Apartamento andar medio 4-8': 'Andares 4 a 8, acesso externo mais dificil',
    'Apartamento andar alto 9+': 'Acima do 9o andar, risco de invasao externa muito baixo',
    'Cobertura/Penthouse': 'Ultimo andar, acesso pela cobertura pode ser vulneravel',
    'Casa em condominio': 'Casa dentro de condominio com portaria e controle de acesso',
    'Triplex/Duplex': 'Apartamento de 2 ou 3 andares internos',
    'Sitio/Chacara 1000-5000m2': 'Propriedade rural de area media, perimetro extenso',
    'Fazenda >5000m2': 'Grande propriedade rural, perimetro muito extenso para monitorar',
    'Condominio fechado': 'Loteamento fechado com seguranca perimetral compartilhada',
    'Flat/Apart-hotel': 'Unidade em edificio com servicos hoteleiros e portaria 24h',
    'Loft': 'Espaco amplo sem divisorias internas, geralmente em area urbana',
    'Kitnet/Studio': 'Unidade compacta de um unico comodo, area reduzida',
    'Geminado': 'Casa que compartilha uma ou mais paredes com o vizinho',
  },
  P02: {
    '0-50m2 (sem area)': 'Sem area externa significativa, apenas a construcao',
    '51-100m2': 'Area externa pequena, quintal compacto',
    '101-200m2': 'Area externa media, espaco para jardim ou garagem',
    '201-500m2': 'Area externa grande, perimetro mais extenso para proteger',
    '501-1000m2': 'Terreno grande, exige mais pontos de vigilancia',
    'N/A (apartamento)': 'Nao se aplica a apartamentos sem area externa propria',
  },
  P03: {
    'Nenhum': 'Sem barreia fisica no perimetro, acesso livre',
    'Cerca viva/plantas': 'Barreira vegetal, nao impede fisicamente a passagem',
    'Gradil/alambrado': 'Cerca metalica vazada, permite visibilidade mas pouca resistencia',
    'Muro ate 1,5m': 'Muro baixo, facilmente escalavel por adultos',
    'Muro 1,5-2,0m': 'Muro medio, dificuldade moderada para escalar',
    'Muro 2,0-2,5m': 'Muro alto, boa barreira fisica',
    'Muro >2,5m': 'Muro muito alto, excelente barreira contra escalada',
    'Muro com concertina': 'Muro com arame farpado em espiral no topo',
    'Muro com espiculas': 'Muro com pontas metalicas cortantes no topo',
    'Muro com cacos vidro': 'Muro com fragmentos de vidro cimentados no topo',
    'Cerca eletrica ativa': 'Cerca com choque eletrico nao letal, efeito dissuasivo',
    'Cerca eletrica + alarme': 'Cerca eletrica que dispara alarme ao ser tocada/cortada',
    'Concertina dupla': 'Duas fileiras de arame farpado espiral, protecao reforçada',
    'Muro + cerca + alarme': 'Combinacao completa: barreira fisica + eletrica + alerta',
  },
  P04: {
    '0 (apenas portao)': 'Acesso somente pelo portao principal, sem portas externas',
    '1 porta': 'Uma porta de acesso externo alem do portao',
    '2 portas': 'Duas portas externas, ex: frente e fundos',
    '3 portas': 'Tres pontos de acesso externo, mais dificil de monitorar',
    '4+ portas': 'Quatro ou mais acessos, exige controle reforçado em todos',
  },
  P05: {
    '0 janelas': 'Nenhuma janela acessivel do nivel do solo',
    '1 janela': 'Uma janela vulneravel a acesso pela rua/quintal',
    '2 janelas': 'Duas janelas acessiveis, pontos de atencao',
    '3-4 janelas': 'Varias janelas expostas, recomenda-se protecao',
    '5-6 janelas': 'Muitas janelas acessiveis, perimetro vulneravel',
    '7-10 janelas': 'Alto numero de janelas expostas, protecao essencial',
    '10+ janelas': 'Perimetro muito exposto, prioridade maxima de protecao',
    'Todas >2,5m': 'Todas as janelas estao acima de 2,5m do solo, menor risco',
  },
  P06: {
    'Nao possui': 'Sem vaga ou garagem, veiculo fica na rua',
    'Vaga rua descoberta': 'Estacionamento na rua sem cobertura ou protecao',
    'Vaga rua coberta': 'Estacionamento na rua com cobertura, sem fechamento',
    'Garagem aberta': 'Garagem sem portao, acesso livre',
    'Garagem com portao manual': 'Garagem fechada com portao de abertura manual',
    'Garagem com portao automatico': 'Portao eletrico com controle remoto',
    'Portao auto biometria': 'Portao automatico com abertura por impressao digital',
    'Portao auto com app': 'Portao automatico controlado via smartphone',
    'Garagem subterranea': 'Garagem no subsolo do edificio, acesso controlado',
    'Box fechado': 'Vaga individual com paredes e portao proprio',
    '2 portoes (duplo)': 'Sistema com dois portoes sequenciais (eclusa de seguranca)',
  },
  P07: {
    'Nenhuma protecao': 'Janelas sem qualquer barreira de seguranca',
    'Apenas telas': 'Telas mosquiteiras, nao oferecem protecao contra invasao',
    'Grades decorativas': 'Grades com funcao estetica, resistencia limitada',
    'Grades com abertura': 'Grades com abertura interna para saida de emergencia',
    'Pelicula 3M': 'Filme de seguranca que segura os estilhacos se o vidro quebrar',
    'Vidro laminado': 'Vidro com camada intermediaria que resiste a impactos',
    'Vidro temperado': 'Vidro tratado termicamente, 5x mais resistente que o comum',
    'Pelicula + grades': 'Combinacao de pelicula de seguranca com grades metalicas',
    'Persianas metalicas': 'Persianas de enrolar em aco ou aluminio, barreira fisica',
  },
  I01: {
    'Nenhuma': 'Sem iluminacao externa durante a noite',
    'Manual liga/desliga': 'Acionamento manual por interruptor interno',
    'Sensor presenca basico': 'Acende automaticamente ao detectar movimento proximo',
    'Timer automatico': 'Programada para ligar/desligar em horarios fixos',
    'Smart WiFi': 'Lampada conectada a rede WiFi, controle remoto pelo celular',
    'Smart com app': 'Iluminacao controlada por aplicativo com programacao',
    'Integrada alarme': 'Iluminacao acionada junto com o sistema de alarme',
    'Colorida RGB': 'Iluminacao LED com mudanca de cor, pode simular presenca',
    'Holofotes': 'Iluminacao potente de longo alcance, efeito dissuasivo forte',
    'Solar externa': 'Lampada solar autonoma, sem custo de energia',
  },
  I02: {
    '0 pontos': 'Nenhum ponto de iluminacao no perimetro externo',
    '1 ponto (entrada)': 'Apenas a entrada principal iluminada',
    '2 pontos (frente+lateral)': 'Frente e uma lateral cobertas',
    'Frente + fundos': 'Iluminacao na frente e nos fundos da casa',
    'Perimetro completo': 'Todos os lados do imovel iluminados',
    'Postes com lampadas': 'Iluminacao elevada tipo poste, cobertura ampla',
  },
  I03: {
    'Nao possui': 'Sem qualquer recurso de iluminacao em caso de queda de energia',
    'Lanternas manuais': 'Lanternas portateis a pilha ou recarregaveis',
    'Lampada recarregavel': 'Lampada que acende automaticamente quando falta energia',
    'Nobreak basico': 'Bateria que mantem equipamentos ligados por tempo limitado',
    'Nobreak + lampadas': 'Nobreak que alimenta iluminacao de emergencia',
    'Gerador': 'Gerador eletrico a combustivel, autonomia prolongada',
  },
  I04: {
    'Visibilidade total': 'Da rua ve-se todo o interior, sem privacidade',
    'Alta (70-90%)': 'Grande parte do interior e visivel da rua',
    'Media (40-70%)': 'Visibilidade parcial do interior',
    'Baixa (10-40%)': 'Pouca visibilidade do interior para quem passa na rua',
    'Nenhuma (muros altos)': 'Interior completamente protegido visualmente',
    'Muros + vegetacao': 'Muros altos com vegetacao que bloqueiam visao',
  },
  A01: {
    'Comum padrao': 'Fechadura simples de lingueta, sem seguranca adicional',
    'Comum dupla': 'Fechadura com duas voltas de chave, seguranca basica',
    'Tetra chave': 'Fechadura com chave de 4 lados, dificil de copiar',
    'Multiponto 3pts': 'Trava em 3 pontos da porta simultaneamente',
    'Multiponto 5pts': 'Trava em 5 pontos da porta, seguranca alta',
    'Eletronica senha 4dig': 'Aberta por codigo numerico de 4 digitos',
    'Eletronica senha 6+dig': 'Aberta por codigo numerico de 6 ou mais digitos',
    'Biometrica digital': 'Aberta por impressao digital cadastrada',
    'Biometrica facial': 'Aberta por reconhecimento facial',
    'Smart Bluetooth': 'Aberta pelo celular via Bluetooth quando esta proximo',
    'Smart WiFi': 'Aberta remotamente pelo celular via internet',
    'Smart app+backup': 'Abertura por app com chave fisica de reserva',
    'Yale Doorman': 'Fechadura digital Yale com multiplos metodos de abertura',
    'Magnetica': 'Fechadura eletromagnetica, comum em predios comerciais',
    'Combo eletronica+mecanica': 'Fechadura com metodo eletronico e mecanico combinados',
  },
  A02: {
    'Madeira oca': 'Porta leve com interior oco, baixa resistencia a impactos',
    'Madeira semi-macica': 'Nucleo parcialmente solido, resistencia moderada',
    'Madeira macica': 'Porta de madeira inteirica, boa resistencia a arrombamento',
    'Aco/Metal': 'Porta de aco, alta resistencia a ferramentas manuais',
    'Blindada nivel I': 'Porta certificada contra tentativas simples de arrombamento',
    'Blindada nivel II': 'Resistente a ferramentas manuais como pe-de-cabra',
    'Blindada nivel III': 'Resistente a ferramentas eletricas como serra e furadeira',
    'Blindada nivel IV+': 'Maximo nivel de blindagem, resistente a ataques pesados',
    'PVC reforcado': 'Porta de PVC com estrutura interna reforcada em aco',
    'Vidro temperado': 'Vidro tratado termicamente, 5x mais forte que vidro comum',
    'Vidro laminado+metal': 'Vidro laminado com moldura metalica, boa seguranca',
    'Aluminio reforcado': 'Porta de aluminio com perfis reforcados',
    'Porta cofre': 'Porta com nivel de protecao equivalente a cofre blindado',
  },
  A03: {
    'Nenhuma': 'Sem travas adicionais alem da fechadura principal',
    'Ferrolho simples 1pt': 'Trava manual de ferro em um ponto da porta',
    'Ferrolho duplo': 'Duas travas manuais, uma em cima e outra embaixo',
    'Barra transversal': 'Barra de aco horizontal que bloqueia toda a largura da porta',
    'Tranca eletronica': 'Trava adicional com acionamento eletronico/remoto',
  },
  A04: {
    'Nao existe': 'Imovel nao possui porta de servico ou fundos',
    'Madeira oca': 'Porta leve com interior oco, baixa resistencia a impactos',
    'Madeira semi-macica': 'Nucleo parcialmente solido, resistencia moderada',
    'Madeira macica': 'Porta de madeira inteirica, boa resistencia a arrombamento',
    'Aco/Metal': 'Porta de aco, alta resistencia a ferramentas manuais',
    'Blindada nivel I': 'Porta certificada contra tentativas simples de arrombamento',
    'Blindada nivel II': 'Resistente a ferramentas manuais como pe-de-cabra',
    'Blindada nivel III': 'Resistente a ferramentas eletricas como serra e furadeira',
    'Blindada nivel IV+': 'Maximo nivel de blindagem, resistente a ataques pesados',
    'PVC reforcado': 'Porta de PVC com estrutura interna reforcada em aco',
    'Vidro temperado': 'Vidro tratado termicamente, 5x mais forte que vidro comum',
    'Vidro laminado+metal': 'Vidro laminado com moldura metalica, boa seguranca',
    'Aluminio reforcado': 'Porta de aluminio com perfis reforcados',
    'Porta cofre': 'Porta com nivel de protecao equivalente a cofre blindado',
  },
  A05: {
    'Nao possui': 'Sem sistema de comunicacao com visitantes',
    'Interfone audio simples': 'Comunicacao apenas por voz, sem imagem',
    'Video porteiro basico': 'Camera com tela pequena em preto e branco',
    'Video porteiro color': 'Camera com tela colorida, melhor identificacao',
    'Smart com app': 'Video porteiro com acesso remoto pelo celular',
    'Smart reconhecimento facial': 'Identifica automaticamente rostos cadastrados',
    'Integrado fechadura': 'Video porteiro conectado a fechadura eletrica',
    'Sistema completo abertura remota': 'Video + interfone + abertura de portao pelo celular',
  },
  E01: {
    'Nao possui': 'Sem qualquer sistema de alarme instalado',
    'Simulador adesivos': 'Apenas adesivos de "alarme monitorado" sem sistema real',
    'Alarme local simples': 'Sirene local que dispara ao detectar invasao, sem aviso externo',
    'Alarme com discagem': 'Alarme que liga automaticamente para numeros cadastrados',
    'Monitorado 24h central': 'Central de monitoramento profissional 24 horas',
    'Monitorado + resposta armada': 'Central 24h com envio de equipe armada ao local',
    'Smart DIY': 'Sistema inteligente montado pelo proprio usuario, ex: Ring, Alexa Guard',
    'Smart com app': 'Alarme profissional com controle total pelo celular',
    'Smart com IA': 'Sistema com inteligencia artificial que reduz alarmes falsos',
    'Hibrido local+monitorado': 'Sirene local + monitoramento remoto combinados',
    'Multiplas centrais': 'Mais de uma central de alarme, redundancia de seguranca',
    'Com cerca eletrica': 'Alarme integrado a cerca eletrica perimetral',
    'Com botao panico': 'Alarme com acionamento de emergencia manual',
  },
  E02: {
    'Nenhum': 'Sem sensores de abertura em portas ou janelas',
    '1 sensor (porta)': 'Apenas um sensor na porta principal',
    '2-3 sensores': 'Poucos sensores, cobertura parcial dos acessos',
    'Apenas portas': 'Sensores em todas as portas, janelas desprotegidas',
    'Apenas janelas': 'Sensores nas janelas, portas sem sensores',
    'Portas+janelas principais': 'Sensores nos acessos mais vulneraveis',
    'Portas+janelas+basculantes': 'Cobertura completa incluindo janelas basculantes',
    'Com fio': 'Sensores cabeados, mais confiaveis, instalacao mais complexa',
    'Sem fio wireless': 'Sensores sem fio, facil instalacao, funcionam por bateria',
  },
  E03: {
    'Nenhum': 'Sem sensores de movimento internos',
    '1 sensor (sala)': 'Apenas um sensor no comodo principal',
    '2-3 sensores': 'Poucos sensores, cobertura parcial do interior',
    'PIR pet 15kg': 'Sensor infravermelho que ignora animais ate 15kg',
    'PIR pet 25kg': 'Sensor infravermelho que ignora animais ate 25kg',
    'Microondas': 'Sensor por ondas eletromagneticas, maior precisao e alcance',
    'Duplo PIR+MW': 'Combina infravermelho + microondas, reduz alarmes falsos',
    'Sensor cortina': 'Sensor que cria uma "barreira invisivel" em portas e janelas',
    'Camera deteccao': 'Camera com analise de video que detecta movimento inteligente',
  },
  E04: {
    'Nenhuma': 'Sem cameras de vigilancia instaladas',
    '1 camera (entrada)': 'Uma camera cobrindo apenas a entrada principal',
    '2 cameras (frente+fundos)': 'Cobertura da frente e dos fundos do imovel',
    'Frente+fundos': 'Cameras na parte frontal e posterior',
    'Perimetro completo': 'Cameras cobrindo todos os lados do imovel',
    'Perimetro+interior': 'Cameras externas e internas, cobertura total',
    'Reconhecimento facial': 'Cameras com IA que identificam rostos cadastrados',
    'Leitura placas': 'Cameras que registram placas de veiculos automaticamente',
    'Cameras PTZ': 'Cameras com Pan/Tilt/Zoom, movimentam-se e ampliam a imagem',
  },
  E05: {
    'N/A': 'Nao possui cameras, nao se aplica',
    'Analogica baixa': 'Imagem de baixa qualidade, dificil identificar rostos',
    'HD 720p': 'Qualidade basica, identifica pessoas a curta distancia',
    'Full HD 1080p': 'Boa qualidade, identifica rostos ate 10-15 metros',
    '2K QHD': 'Alta definicao, detalhes claros ate 20 metros',
    '4K UHD': 'Ultra alta definicao, detalhes nitidos a longa distancia',
    'Visao noturna 20m': 'Camera enxerga no escuro ate 20 metros com infravermelho',
    'Visao noturna 40m+': 'Visao noturna de longo alcance, acima de 40 metros',
    'Colorida noturna': 'Grava em cores mesmo a noite, melhor identificacao',
    'WDR': 'Wide Dynamic Range: compensa areas muito claras e escuras na imagem',
    'HDR': 'High Dynamic Range: imagem equilibrada em qualquer condicao de luz',
  },
  E06: {
    'N/A': 'Nao possui cameras, nao se aplica',
    'Sem gravacao': 'Camera mostra imagem ao vivo mas nao grava',
    'SD card local': 'Grava no cartao de memoria da propria camera',
    'DVR local 7 dias': 'Gravador digital que armazena ate 7 dias de video',
    'DVR local 30 dias': 'Gravador digital que armazena ate 30 dias de video',
    'NVR local': 'Gravador de rede (Network Video Recorder), para cameras IP',
    'Cloud 7 dias': 'Gravacao na nuvem com historico de 7 dias',
    'Cloud 30 dias': 'Gravacao na nuvem com historico de 30 dias',
    'Cloud 90+ dias': 'Gravacao na nuvem com historico superior a 90 dias',
    'Hibrido local+nuvem': 'Grava localmente e tambem envia para a nuvem',
    'Por movimento': 'Grava apenas quando detecta movimento, economiza espaco',
    'Continua 24/7': 'Gravacao ininterrupta 24 horas por dia',
    'Com redundancia': 'Gravacao em dois ou mais locais simultaneamente',
  },
  E07: {
    'Nao possui': 'Sem botao de emergencia disponivel',
    'Fixo 1 ponto': 'Botao de panico instalado em um local fixo da casa',
    'Fixo 2+ pontos': 'Botoes de panico em dois ou mais comodos',
    'Portatil/chaveiro': 'Botao de panico portatil no formato de chaveiro',
    'No celular app': 'Botao de panico acionado pelo aplicativo no celular',
    'Integrado central': 'Botao de panico conectado a central de monitoramento',
    'Botao oculto': 'Botao de panico disfarçado/escondido para uso discreto',
    'Por voz Alexa/Google': 'Acionamento de emergencia por comando de voz',
  },
  E08: {
    'Nenhuma': 'Sem automacao residencial',
    'Lampadas smart': 'Apenas lampadas inteligentes controladas por app/voz',
    'Central unificada': 'Sistema central que controla todos os dispositivos',
    'Com cenas automacao': 'Cenas programadas, ex: "Sair de casa" desliga luzes e tranca',
    'Com geofencing': 'Ativa/desativa automaticamente baseado na localizacao do celular',
    'Com IA/aprendizado': 'Sistema que aprende seus habitos e se adapta automaticamente',
    'Controle voz completo': 'Todos os dispositivos controlados por Alexa/Google/Siri',
  },
  H01: {
    'Sempre vazia': 'Casa fica sem ninguem durante todo o horario comercial',
    'Vazia 80-90%': 'Casa vazia na maior parte do dia, alguem presente raramente',
    'Vazia 50-80%': 'Casa vazia metade ou mais do horario comercial',
    'Vazia <50%': 'Alguem presente na maior parte do dia',
    'Sempre alguem': 'Casa sempre ocupada durante o dia',
    'Empregada diarista': 'Funcionaria domestica em dias especificos da semana',
    'Empregada integral': 'Funcionaria domestica presente diariamente',
    'Turnos alternados': 'Moradores revezam presenca em casa',
    'Monitoramento remoto': 'Casa monitorada por cameras acessiveis pelo celular',
  },
  H02: {
    'Nunca viaja': 'Casa nunca fica desocupada por viagens',
    'Raramente 1x/ano': 'Uma viagem por ano, curto periodo sem presenca',
    'Moderado 2-3x/ano': 'Duas a tres viagens por ano',
    'Frequente 4-6x/ano': 'Viagens frequentes, casa fica vazia varias vezes ao ano',
    'Muito frequente mensal': 'Viagens mensais, casa frequentemente desocupada',
    'Ausencias >1 mese': 'Ausencias prolongadas de mais de um mes',
    'Casa temporada': 'Imovel usado apenas em ferias/temporadas, vazio na maior parte',
  },
  H03: {
    'Nao possui': 'Sem animal na propriedade',
    'Gato': 'Presenca de gato, efeito minimo de seguranca',
    'Cachorro pequeno': 'Cachorro de porte pequeno, alerta por latido',
    'Cachorro medio': 'Cachorro de porte medio, efeito dissuasivo moderado',
    'Cachorro grande': 'Cachorro de porte grande, bom efeito dissuasivo',
    'Raca guarda treinado': 'Cachorro de raca de guarda com treinamento basico',
    'Raca guarda profissional': 'Cachorro treinado profissionalmente para protecao',
    'Multiplos 2-3': 'Dois a tres caes, efeito dissuasivo multiplicado',
    'Multiplos 4+': 'Quatro ou mais caes, forte barreira dissuasiva',
    'Alarme som cachorro': 'Dispositivo eletronico que simula latido de cachorro grande',
  },
  H04: {
    'Inexistente': 'Sem qualquer patrulhamento ou seguranca na regiao',
    'Policiamento 1x/semana': 'Viatura passa pela regiao uma vez por semana',
    'Policiamento regular': 'Viaturas fazem rondas frequentes no bairro',
    'Ronda motorizada': 'Empresa privada de ronda com moto ou carro no bairro',
    'Ronda noturna': 'Ronda privada apenas no periodo noturno',
    'Guarita+ronda': 'Portaria com guarita mais rondas periodicas',
    'Seguranca 8h': 'Vigilante presente por 8 horas (1 turno)',
    'Seguranca 12h': 'Vigilante presente por 12 horas (noturno geralmente)',
    'Seguranca 24h': 'Vigilancia ininterrupta com revezamento de turnos',
    'Seguranca armada': 'Vigilantes armados no local',
    'Condominio vigilancia': 'Seguranca gerenciada pelo condominio',
    'Cameras comunitarias': 'Sistema de cameras compartilhado entre vizinhos/bairro',
  },
  H05: {
    'Nenhuma interacao': 'Nao conhece ou nao se comunica com vizinhos',
    'Apenas cumprimento': 'Relacao superficial, apenas cumprimentos',
    'Conversam regularmente': 'Boa relacao com conversa frequente',
    'Trocam informacoes': 'Vizinhos avisam sobre situacoes suspeitas',
    'Grupo WhatsApp ativo': 'Grupo de vizinhos para alertas em tempo real',
    'Contratacao coletiva': 'Vizinhos dividem custo de seguranca privada',
    'Troca chaves': 'Vizinho de confianca tem chave reserva da casa',
    'Observam viagens': 'Vizinhos vigiam a casa durante viagens/ausencias',
  },
  H06: {
    'Perfis publicos localizacao sempre': 'Redes abertas com localizacao em tempo real visivel',
    'Posta tempo real': 'Publica fotos e check-ins no momento em que acontecem',
    'Posta com atraso': 'Publica com leve atraso, mas ainda revela rotina',
    'Atraso 24h+': 'Publica com mais de 24h de atraso, menor risco',
    'Perfis privados': 'Perfis fechados, apenas amigos/seguidores aprovados veem',
    'Consciencia digital': 'Nao posta localizacao, viagens ou rotina nas redes',
  },
  H07: {
    'Nenhum': 'Nenhum incidente de seguranca nos ultimos 2 anos',
    'Tentativa furto carro': 'Tentativa de furto de veiculo na regiao/propriedade',
    'Tentativa invasao': 'Tentativa de entrada forcada na propriedade',
    'Furto consumado': 'Furto realizado com sucesso (sem presenca do morador)',
    'Roubo/assalto': 'Roubo com ameaca ou violencia contra morador',
    'Multiplos incidentes': 'Mais de um incidente de seguranca no periodo',
    'Incidentes vizinhos': 'Incidentes ocorreram nas casas vizinhas',
    'Area historico criminal': 'Regiao conhecida por alta incidencia de crimes',
  },
  H08: {
    'Muito baixo <5/1000': 'Menos de 5 ocorrencias por mil habitantes, area muito segura',
    'Baixo 5-15/1000': 'Area com criminalidade abaixo da media',
    'Medio 15-30/1000': 'Criminalidade na media para a regiao',
    'Alto 30-50/1000': 'Criminalidade acima da media, atencao redobrada',
    'Muito alto >50/1000': 'Area de alta criminalidade, seguranca prioritaria',
    'Dados indisponiveis': 'Nao ha dados oficiais disponiveis para a regiao',
    'Consultado SSP': 'Dados obtidos junto a Secretaria de Seguranca Publica',
  },
};

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

interface ActionRule {
  questionCode: string;
  threshold: number;
  item: ActionItem;
}

interface UpgradeTier {
  maxIndex: number;
  priority: number;
  solution: string;
  product: string;
  investment: string;
  installation: string;
}

interface DynamicUpgrade {
  vulnerability: string;
  priority: number;
  category: string;
  impact: string;
  tiers: UpgradeTier[];
}

const UPGRADE_MAP: Record<string, DynamicUpgrade> = {
  'P03': {
    vulnerability: 'Muro/cerca insuficiente',
    priority: 2, category: 'PERIMETRO', impact: '+30%',
    tiers: [
      { maxIndex: 2, priority: 1, solution: 'Instalar muro de alvenaria 2,0-2,5m', product: 'Projeto alvenaria / Gradil metalico', investment: 'R$ 3.000-6.000', installation: 'Profissional 3-5 dias' },
      { maxIndex: 5, priority: 2, solution: 'Elevar muro para 2,5m+ com concertina ou espiculas', product: 'Concertina / Espiculas metalicas', investment: 'R$ 1.500-3.000', installation: 'Profissional 1-2 dias' },
      { maxIndex: 8, priority: 2, solution: 'Adicionar cerca eletrica com alarme integrado', product: 'Cerca eletrica + Central alarme', investment: 'R$ 2.000-4.000', installation: 'Profissional 1 dia' },
      { maxIndex: 10, priority: 3, solution: 'Instalar cerca eletrica dupla com alarme e monitoramento', product: 'Cerca eletrica dupla + Monitoramento', investment: 'R$ 3.000-6.000', installation: 'Profissional 2 dias' },
      { maxIndex: 99, priority: 3, solution: 'Complementar com muro + cerca eletrica + alarme perimetral', product: 'Sistema perimetral completo', investment: 'R$ 5.000-10.000', installation: 'Profissional 3-5 dias' },
    ],
  },
  'P05': {
    vulnerability: 'Muitas janelas acessiveis',
    priority: 2, category: 'PERIMETRO', impact: '+18%',
    tiers: [
      { maxIndex: 99, priority: 2, solution: 'Instalar sensores de abertura + grades nas janelas vulneraveis', product: 'Sensor Intelbras XAS / Grades tubulares', investment: 'R$ 200-500/janela', installation: 'Profissional' },
    ],
  },
  'P07': {
    vulnerability: 'Janelas sem protecao adequada',
    priority: 2, category: 'PERIMETRO', impact: '+18%',
    tiers: [
      { maxIndex: 1, priority: 1, solution: 'Instalar grades decorativas ou tubulares', product: 'Serralheria local 25mm', investment: 'R$ 300/un', installation: 'Profissional' },
      { maxIndex: 3, priority: 2, solution: 'Aplicar pelicula de seguranca 3M ou vidro laminado', product: 'Pelicula 3M / Vidro laminado', investment: 'R$ 200-600/un', installation: 'Profissional' },
      { maxIndex: 5, priority: 2, solution: 'Instalar pelicula de seguranca + grades reforçadas', product: 'Pelicula 3M + Grades tubulares', investment: 'R$ 400-800/un', installation: 'Profissional' },
      { maxIndex: 99, priority: 3, solution: 'Instalar persianas metalicas automatizadas', product: 'Persianas metalicas / Portinholas', investment: 'R$ 800-1.500/un', installation: 'Profissional' },
    ],
  },
  'P06': {
    vulnerability: 'Garagem vulneravel',
    priority: 3, category: 'PERIMETRO', impact: '+12%',
    tiers: [
      { maxIndex: 2, priority: 1, solution: 'Instalar portao com fechamento manual seguro', product: 'Portao metalico / Cadeado reforcado', investment: 'R$ 500-1.500', installation: 'Profissional 1 dia' },
      { maxIndex: 4, priority: 2, solution: 'Instalar motor automatico com controle remoto', product: 'Motor Garen / PPA', investment: 'R$ 800-2.000', installation: 'Profissional 1 dia' },
      { maxIndex: 6, priority: 3, solution: 'Atualizar para portao com biometria ou app', product: 'Motor + Modulo WiFi/Biometria', investment: 'R$ 1.500-3.000', installation: 'Profissional 1 dia' },
      { maxIndex: 99, priority: 3, solution: 'Instalar sistema duplo portao (eclusa) com automacao', product: 'Portao duplo + Automacao', investment: 'R$ 3.000-6.000', installation: 'Profissional 2-3 dias' },
    ],
  },
  'I01': {
    vulnerability: 'Iluminacao externa deficiente',
    priority: 2, category: 'ILUMINACAO', impact: '+15%',
    tiers: [
      { maxIndex: 1, priority: 1, solution: 'Instalar sensor de presenca PIR com lampada LED', product: 'Intelbras ESP 360 A / Lampada LED 20W', investment: 'R$ 65-150', installation: 'DIY 15min' },
      { maxIndex: 3, priority: 2, solution: 'Instalar iluminacao smart WiFi com app', product: 'Lampada Smart WiFi / Intelbras', investment: 'R$ 80-200', installation: 'DIY 15min' },
      { maxIndex: 5, priority: 3, solution: 'Integrar iluminacao ao sistema de alarme', product: 'Central alarme + Modulo iluminacao', investment: 'R$ 200-500', installation: 'Profissional' },
      { maxIndex: 99, priority: 3, solution: 'Instalar holofotes LED com sensor e automacao completa', product: 'Holofote LED 100W + Smart Hub', investment: 'R$ 300-800', installation: 'Profissional' },
    ],
  },
  'I02': {
    vulnerability: 'Poucos pontos de iluminacao',
    priority: 3, category: 'ILUMINACAO', impact: '+10%',
    tiers: [
      { maxIndex: 1, priority: 1, solution: 'Adicionar iluminacao frente + laterais', product: 'Refletor LED / Arandela externa', investment: 'R$ 80-200', installation: 'DIY 30min' },
      { maxIndex: 3, priority: 2, solution: 'Completar iluminacao do perimetro todo', product: 'Kit refletores LED perimetral', investment: 'R$ 200-500', installation: 'Profissional' },
      { maxIndex: 99, priority: 3, solution: 'Instalar postes com lampadas e sensor no perimetro completo', product: 'Postes + Lampadas LED + Timer', investment: 'R$ 400-1.000', installation: 'Profissional' },
    ],
  },
  'I03': {
    vulnerability: 'Sem iluminacao de emergencia',
    priority: 3, category: 'ILUMINACAO', impact: '+5%',
    tiers: [
      { maxIndex: 1, priority: 1, solution: 'Instalar lampadas recarregaveis nos ambientes principais', product: 'Lampada emergencia LED', investment: 'R$ 30-80', installation: 'DIY 10min' },
      { maxIndex: 3, priority: 2, solution: 'Instalar nobreak para sistemas criticos de seguranca', product: 'Nobreak SMS / APC', investment: 'R$ 200-500', installation: 'DIY 30min' },
      { maxIndex: 99, priority: 3, solution: 'Instalar gerador ou nobreak completo com autonomia estendida', product: 'Gerador / Nobreak industrial', investment: 'R$ 1.500-5.000', installation: 'Profissional' },
    ],
  },
  'A01': {
    vulnerability: 'Fechadura da porta principal inadequada',
    priority: 1, category: 'ACESSO', impact: '+25%',
    tiers: [
      { maxIndex: 1, priority: 1, solution: 'Substituir por fechadura tetra chave', product: 'Papaiz 510 / Stam', investment: 'R$ 180-250', installation: 'DIY 30min' },
      { maxIndex: 2, priority: 2, solution: 'Substituir por fechadura multiponto 3 ou 5 pontos', product: 'Fechadura multiponto Stam / Pado', investment: 'R$ 300-600', installation: 'Profissional' },
      { maxIndex: 4, priority: 2, solution: 'Substituir por fechadura eletronica com senha 6+ digitos', product: 'Yale YDF40 / Samsung SHP', investment: 'R$ 500-1.200', installation: 'Profissional' },
      { maxIndex: 6, priority: 3, solution: 'Substituir por fechadura biometrica digital ou facial', product: 'Samsung SHP-DP / Yale Assure', investment: 'R$ 800-2.000', installation: 'Profissional' },
      { maxIndex: 9, priority: 3, solution: 'Substituir por fechadura smart WiFi/Bluetooth com app e backup', product: 'Yale Doorman / August Smart Lock', investment: 'R$ 1.200-3.000', installation: 'Profissional' },
      { maxIndex: 99, priority: 3, solution: 'Instalar combo eletronica + mecanica de alta seguranca', product: 'Yale Doorman + Multiponto', investment: 'R$ 2.000-4.000', installation: 'Profissional' },
    ],
  },
  'A02': {
    vulnerability: 'Porta principal fragil',
    priority: 1, category: 'ACESSO', impact: '+20%',
    tiers: [
      { maxIndex: 0, priority: 1, solution: 'Substituir por porta de madeira macica', product: 'Porta macica cedro/angelim', investment: 'R$ 800-2.000', installation: 'Profissional 1 dia' },
      { maxIndex: 2, priority: 1, solution: 'Substituir por porta de aco ou blindada nivel I', product: 'Porta aco / Blindada nivel I', investment: 'R$ 2.000-4.000', installation: 'Profissional 1 dia' },
      { maxIndex: 4, priority: 3, solution: 'Atualizar para porta blindada nivel II ou III', product: 'Porta blindada nivel II-III', investment: 'R$ 3.000-6.000', installation: 'Profissional 1 dia' },
      { maxIndex: 99, priority: 3, solution: 'Instalar porta blindada nivel IV+ ou porta cofre', product: 'Porta blindada IV+ / Porta cofre', investment: 'R$ 5.000-15.000', installation: 'Profissional 1-2 dias' },
    ],
  },
  'A03': {
    vulnerability: 'Sem trancas adicionais',
    priority: 2, category: 'ACESSO', impact: '+8%',
    tiers: [
      { maxIndex: 0, priority: 1, solution: 'Instalar ferrolho simples ou duplo', product: 'Ferrolho tetra / Ferrolho duplo', investment: 'R$ 40-80', installation: 'DIY 20min' },
      { maxIndex: 2, priority: 2, solution: 'Instalar barra transversal de seguranca', product: 'Barra transversal aco', investment: 'R$ 80-150', installation: 'DIY 30min' },
      { maxIndex: 3, priority: 3, solution: 'Instalar tranca eletronica com acionamento remoto', product: 'Tranca eletronica / Smart lock', investment: 'R$ 200-500', installation: 'Profissional' },
      { maxIndex: 99, priority: 3, solution: 'Complementar com tranca eletronica integrada ao alarme', product: 'Tranca smart + Central alarme', investment: 'R$ 300-800', installation: 'Profissional' },
    ],
  },
  'A04': {
    vulnerability: 'Porta de servico/fundos vulneravel',
    priority: 2, category: 'ACESSO', impact: '+12%',
    tiers: [
      { maxIndex: 1, priority: 1, solution: 'Instalar porta de madeira macica com fechadura tetra', product: 'Porta macica cedro/angelim + Fechadura tetra', investment: 'R$ 800-2.000', installation: 'Profissional 1 dia' },
      { maxIndex: 3, priority: 1, solution: 'Substituir por porta de aco ou blindada nivel I', product: 'Porta aco / Blindada nivel I', investment: 'R$ 2.000-4.000', installation: 'Profissional 1 dia' },
      { maxIndex: 5, priority: 3, solution: 'Atualizar para porta blindada nivel II ou III', product: 'Porta blindada nivel II-III', investment: 'R$ 3.000-6.000', installation: 'Profissional 1 dia' },
      { maxIndex: 99, priority: 3, solution: 'Instalar porta blindada nivel IV+ ou porta cofre', product: 'Porta blindada IV+ / Porta cofre', investment: 'R$ 5.000-15.000', installation: 'Profissional 1-2 dias' },
    ],
  },
  'A05': {
    vulnerability: 'Sem video porteiro',
    priority: 3, category: 'ACESSO', impact: '+10%',
    tiers: [
      { maxIndex: 0, priority: 1, solution: 'Instalar interfone audio basico', product: 'Interfone HDL / Intelbras', investment: 'R$ 80-150', installation: 'Profissional' },
      { maxIndex: 1, priority: 2, solution: 'Instalar video porteiro com tela colorida', product: 'Intelbras IV 7010 HF', investment: 'R$ 250-500', installation: 'Profissional' },
      { maxIndex: 3, priority: 2, solution: 'Instalar video porteiro smart com app', product: 'Ring Doorbell / Intelbras Allo', investment: 'R$ 500-1.000', installation: 'Profissional' },
      { maxIndex: 5, priority: 3, solution: 'Instalar sistema smart com reconhecimento facial', product: 'Doorbell AI / Hikvision Smart', investment: 'R$ 800-2.000', installation: 'Profissional' },
      { maxIndex: 99, priority: 3, solution: 'Sistema completo integrado com fechadura e abertura remota', product: 'Video porteiro + Fechadura smart', investment: 'R$ 1.500-3.000', installation: 'Profissional' },
    ],
  },
  'E01': {
    vulnerability: 'Sistema de alarme insuficiente',
    priority: 1, category: 'ELETRONICA', impact: '+40%',
    tiers: [
      { maxIndex: 1, priority: 1, solution: 'Instalar alarme local com discagem automatica', product: 'Intelbras AMT 2118 / JFL', investment: 'R$ 300-600', installation: 'Profissional' },
      { maxIndex: 3, priority: 1, solution: 'Contratar alarme monitorado 24h com resposta', product: 'Verisure / ADT', investment: 'R$ 89-200/mes', installation: 'Profissional' },
      { maxIndex: 5, priority: 2, solution: 'Atualizar para monitorado com resposta armada', product: 'Verisure Premium / Prosegur', investment: 'R$ 150-300/mes', installation: 'Profissional' },
      { maxIndex: 7, priority: 3, solution: 'Instalar alarme smart com IA e deteccao inteligente', product: 'Ajax Systems / Intelbras Cloud', investment: 'R$ 2.000-5.000', installation: 'Profissional' },
      { maxIndex: 99, priority: 3, solution: 'Sistema hibrido completo: local + monitorado + cerca + panico', product: 'Sistema completo integrado', investment: 'R$ 3.000-8.000', installation: 'Profissional' },
    ],
  },
  'E02': {
    vulnerability: 'Sensores de abertura insuficientes',
    priority: 1, category: 'ELETRONICA', impact: '+15%',
    tiers: [
      { maxIndex: 1, priority: 1, solution: 'Instalar sensores nas portas e janelas principais', product: 'Intelbras XAS 4010 / Sensor RF', investment: 'R$ 40-80/un', installation: 'DIY 10min/un' },
      { maxIndex: 4, priority: 2, solution: 'Cobrir todas as portas e janelas com sensores', product: 'Kit sensores wireless completo', investment: 'R$ 200-500', installation: 'DIY 1h' },
      { maxIndex: 6, priority: 3, solution: 'Instalar sensores em todas aberturas incluindo basculantes', product: 'Sensores porta+janela+basculante', investment: 'R$ 300-600', installation: 'DIY 2h' },
      { maxIndex: 99, priority: 3, solution: 'Atualizar para sensores wireless de ultima geracao', product: 'Sensores wireless premium', investment: 'R$ 400-800', installation: 'DIY 2h' },
    ],
  },
  'E03': {
    vulnerability: 'Sensores de movimento insuficientes',
    priority: 2, category: 'ELETRONICA', impact: '+12%',
    tiers: [
      { maxIndex: 1, priority: 1, solution: 'Instalar sensores PIR em areas internas criticas', product: 'Intelbras IVP 3000', investment: 'R$ 60-150/un', installation: 'DIY 15min' },
      { maxIndex: 3, priority: 2, solution: 'Atualizar para sensores PIR pet-friendly', product: 'PIR pet 25kg / Sensor dual', investment: 'R$ 100-200/un', installation: 'DIY 15min' },
      { maxIndex: 5, priority: 3, solution: 'Instalar sensores dual PIR + microondas', product: 'Sensor duplo PIR+MW', investment: 'R$ 150-300/un', installation: 'Profissional' },
      { maxIndex: 99, priority: 3, solution: 'Instalar sensores com camera de deteccao inteligente', product: 'Sensor camera IA / Cortina', investment: 'R$ 300-600/un', installation: 'Profissional' },
    ],
  },
  'E04': {
    vulnerability: 'Cameras de seguranca insuficientes',
    priority: 2, category: 'ELETRONICA', impact: '+20%',
    tiers: [
      { maxIndex: 0, priority: 1, solution: 'Instalar camera na entrada principal', product: 'Tapo C200 / Intelbras iM3', investment: 'R$ 150-300', installation: 'DIY 30min' },
      { maxIndex: 2, priority: 1, solution: 'Adicionar cameras cobrindo frente e fundos', product: 'Kit 2-4 cameras WiFi Full HD', investment: 'R$ 300-800', installation: 'DIY 1h' },
      { maxIndex: 4, priority: 2, solution: 'Completar cobertura do perimetro com cameras', product: 'Kit cameras perimetro completo', investment: 'R$ 800-2.000', installation: 'Profissional' },
      { maxIndex: 6, priority: 3, solution: 'Adicionar cameras com reconhecimento facial ou leitura de placas', product: 'Camera IA facial / LPR', investment: 'R$ 1.000-3.000', installation: 'Profissional' },
      { maxIndex: 99, priority: 3, solution: 'Instalar cameras PTZ com cobertura 360 graus', product: 'Camera PTZ / Dome motorizada', investment: 'R$ 1.500-4.000', installation: 'Profissional' },
    ],
  },
  'E05': {
    vulnerability: 'Qualidade de gravacao baixa',
    priority: 3, category: 'ELETRONICA', impact: '+8%',
    tiers: [
      { maxIndex: 2, priority: 2, solution: 'Atualizar para cameras Full HD 1080p', product: 'Camera Full HD / Intelbras VHD', investment: 'R$ 150-300/un', installation: 'DIY 30min' },
      { maxIndex: 4, priority: 3, solution: 'Atualizar para cameras 2K ou 4K com WDR', product: 'Camera 2K/4K com WDR', investment: 'R$ 300-600/un', installation: 'DIY 30min' },
      { maxIndex: 6, priority: 3, solution: 'Instalar cameras com visao noturna avancada 40m+', product: 'Camera IR 40m+ / Starlight', investment: 'R$ 400-800/un', installation: 'Profissional' },
      { maxIndex: 99, priority: 3, solution: 'Atualizar para cameras colorida noturna com HDR', product: 'Camera ColorVu / Starlight+HDR', investment: 'R$ 500-1.200/un', installation: 'Profissional' },
    ],
  },
  'E06': {
    vulnerability: 'Armazenamento de video inadequado',
    priority: 3, category: 'ELETRONICA', impact: '+6%',
    tiers: [
      { maxIndex: 2, priority: 2, solution: 'Instalar DVR local com armazenamento 7+ dias', product: 'DVR Intelbras / Hikvision', investment: 'R$ 300-600', installation: 'DIY 1h' },
      { maxIndex: 4, priority: 3, solution: 'Atualizar para NVR com armazenamento 30+ dias', product: 'NVR + HD 2TB', investment: 'R$ 500-1.000', installation: 'DIY 1h' },
      { maxIndex: 6, priority: 3, solution: 'Adicionar gravacao em nuvem para redundancia', product: 'Cloud 30 dias / Google Nest', investment: 'R$ 30-100/mes', installation: 'DIY 30min' },
      { maxIndex: 99, priority: 3, solution: 'Sistema hibrido local + nuvem com gravacao continua e redundancia', product: 'NVR + Cloud + Redundancia', investment: 'R$ 800-2.000', installation: 'Profissional' },
    ],
  },
  'E07': {
    vulnerability: 'Botao de panico insuficiente',
    priority: 2, category: 'ELETRONICA', impact: '+10%',
    tiers: [
      { maxIndex: 0, priority: 1, solution: 'Instalar botao de panico fixo em ponto estrategico', product: 'Botao panico fixo / Intelbras', investment: 'R$ 30-60', installation: 'DIY 10min' },
      { maxIndex: 2, priority: 2, solution: 'Adicionar botao de panico portatil/chaveiro', product: 'Botao RF chaveiro / Portatil', investment: 'R$ 50-120', installation: 'DIY 5min' },
      { maxIndex: 4, priority: 3, solution: 'Configurar panico no celular integrado a central', product: 'App alarme + Central monitorada', investment: 'R$ 50-100/mes', installation: 'DIY 10min' },
      { maxIndex: 99, priority: 3, solution: 'Integrar panico com automacao por voz (Alexa/Google)', product: 'Assistente voz + Rotina panico', investment: 'R$ 200-500', installation: 'DIY 30min' },
    ],
  },
  'E08': {
    vulnerability: 'Automacao residencial insuficiente',
    priority: 3, category: 'AUTOMACAO', impact: '+8%',
    tiers: [
      { maxIndex: 0, priority: 2, solution: 'Instalar lampadas smart WiFi basicas', product: 'Positivo Casa Inteligente / Sonoff', investment: 'R$ 45-150', installation: 'DIY 5min' },
      { maxIndex: 1, priority: 3, solution: 'Instalar central unificada de automacao', product: 'Hub Smart / Alexa Echo', investment: 'R$ 200-500', installation: 'DIY 30min' },
      { maxIndex: 3, priority: 3, solution: 'Configurar cenas de automacao e geofencing', product: 'Smart Hub + Sensores', investment: 'R$ 300-800', installation: 'DIY 1h' },
      { maxIndex: 99, priority: 3, solution: 'Implementar automacao com IA e controle de voz completo', product: 'Sistema IA completo', investment: 'R$ 1.000-3.000', installation: 'Profissional' },
    ],
  },
  'H01': {
    vulnerability: 'Residencia vazia por longos periodos',
    priority: 2, category: 'HUMANO', impact: '+15%',
    tiers: [
      { maxIndex: 2, priority: 1, solution: 'Automacao de luzes com timer para simular presenca', product: 'Timer smart / Smart plug', investment: 'R$ 45-100', installation: 'DIY 10min' },
      { maxIndex: 4, priority: 2, solution: 'Monitoramento remoto via cameras WiFi', product: 'Camera WiFi + App', investment: 'R$ 150-400', installation: 'DIY 30min' },
      { maxIndex: 99, priority: 3, solution: 'Contratar servico de vigilancia ou empregada de confianca', product: 'Servico vigilancia / Ronda', investment: 'R$ 80-200/mes', installation: 'Imediato' },
    ],
  },
  'H02': {
    vulnerability: 'Viagens frequentes sem protecao',
    priority: 3, category: 'HUMANO', impact: '+10%',
    tiers: [
      { maxIndex: 99, priority: 3, solution: 'Sistema de simulacao de presenca + monitoramento remoto', product: 'Smart plugs + Timer / Camera', investment: 'R$ 100-300', installation: 'DIY 15min' },
    ],
  },
  'H03': {
    vulnerability: 'Sem presenca animal dissuasora',
    priority: 3, category: 'HUMANO', impact: '+5%',
    tiers: [
      { maxIndex: 1, priority: 2, solution: 'Considerar cachorro medio ou grande como dissuasor', product: 'Cachorro medio/grande', investment: 'R$ 200-1.000', installation: 'Variavel' },
      { maxIndex: 4, priority: 3, solution: 'Considerar raca de guarda com treinamento profissional', product: 'Raca guarda + Treinamento', investment: 'R$ 1.000-5.000', installation: 'Variavel' },
      { maxIndex: 99, priority: 3, solution: 'Alarme simulador de som de cachorro como complemento', product: 'Alarme simulador cachorro', investment: 'R$ 80-200', installation: 'DIY 5min' },
    ],
  },
  'H04': {
    vulnerability: 'Sem seguranca/ronda no bairro',
    priority: 2, category: 'HUMANO', impact: '+20%',
    tiers: [
      { maxIndex: 1, priority: 1, solution: 'Solicitar policiamento mais frequente na regiao', product: 'Solicitacao PM / GCM', investment: 'Gratuito', installation: 'Imediato' },
      { maxIndex: 3, priority: 2, solution: 'Contratar ronda motorizada noturna', product: 'Empresa ronda motorizada', investment: 'R$ 80-150/mes', installation: 'Imediato' },
      { maxIndex: 5, priority: 2, solution: 'Contratar seguranca com guarita e ronda', product: 'Empresa seguranca + Guarita', investment: 'R$ 200-500/mes', installation: 'Imediato' },
      { maxIndex: 7, priority: 3, solution: 'Contratar seguranca 24h com vigilancia armada', product: 'Seguranca 24h armada', investment: 'R$ 500-1.500/mes', installation: 'Imediato' },
      { maxIndex: 99, priority: 3, solution: 'Instalar cameras comunitarias + vigilancia profissional', product: 'Cameras comunitarias + Vigilancia', investment: 'R$ 300-800/mes', installation: 'Profissional' },
    ],
  },
  'H05': {
    vulnerability: 'Vizinhanca sem interacao',
    priority: 3, category: 'HUMANO', impact: '+10%',
    tiers: [
      { maxIndex: 2, priority: 2, solution: 'Criar grupo WhatsApp com vizinhos proximos', product: 'Grupo WhatsApp', investment: 'Gratuito', installation: 'Imediato' },
      { maxIndex: 4, priority: 3, solution: 'Organizar rede de vigilancia com troca de informacoes', product: 'App comunitario / Vizinhanca Segura', investment: 'Gratuito', installation: 'Imediato' },
      { maxIndex: 99, priority: 3, solution: 'Organizar contratacao coletiva de seguranca e troca de chaves', product: 'Contratacao coletiva + Rede ativa', investment: 'R$ 50-100/mes cada', installation: 'Imediato' },
    ],
  },
  'H06': {
    vulnerability: 'Exposicao excessiva em redes sociais',
    priority: 2, category: 'HUMANO', impact: '+8%',
    tiers: [
      { maxIndex: 1, priority: 1, solution: 'Evitar postar em tempo real, usar atraso de 24h+', product: 'Configuracao de privacidade', investment: 'Gratuito', installation: 'Imediato' },
      { maxIndex: 3, priority: 2, solution: 'Configurar perfis como privados', product: 'Configuracao de privacidade', investment: 'Gratuito', installation: 'Imediato' },
      { maxIndex: 99, priority: 3, solution: 'Implementar consciencia digital completa na familia', product: 'Treinamento privacidade digital', investment: 'Gratuito', installation: 'Imediato' },
    ],
  },
  'H07': {
    vulnerability: 'Historico de incidentes na regiao',
    priority: 1, category: 'HUMANO', impact: '+30%',
    tiers: [
      { maxIndex: 99, priority: 1, solution: 'Reforcar seguranca geral + registrar B.O. + monitoramento 24h', product: 'Central monitorada + Cameras', investment: 'R$ 200-500/mes', installation: 'Profissional' },
    ],
  },
  'H08': {
    vulnerability: 'Bairro com alto indice de criminalidade',
    priority: 1, category: 'HUMANO', impact: '+35%',
    tiers: [
      { maxIndex: 99, priority: 1, solution: 'Investir em seguranca completa: alarme + cameras + ronda', product: 'Pacote completo seguranca', investment: 'R$ 300-800/mes', installation: 'Profissional' },
    ],
  },
};

const ACTION_RULES: ActionRule[] = [
  {
    questionCode: 'P03', threshold: 0.4,
    item: { priority: 2, category: 'PERIMETRO', vulnerability: 'Muro/cerca insuficiente', solution: '', product: '', investment: '', installation: '', impact: '+30%' },
  },
  {
    questionCode: 'P05', threshold: 0.35,
    item: { priority: 2, category: 'PERIMETRO', vulnerability: 'Muitas janelas acessiveis', solution: '', product: '', investment: '', installation: '', impact: '+18%' },
  },
  {
    questionCode: 'P07', threshold: 0.35,
    item: { priority: 2, category: 'PERIMETRO', vulnerability: 'Janelas sem protecao adequada', solution: '', product: '', investment: '', installation: '', impact: '+18%' },
  },
  {
    questionCode: 'P06', threshold: 0.3,
    item: { priority: 3, category: 'PERIMETRO', vulnerability: 'Garagem vulneravel', solution: '', product: '', investment: '', installation: '', impact: '+12%' },
  },
  {
    questionCode: 'I01', threshold: 0.35,
    item: { priority: 2, category: 'ILUMINACAO', vulnerability: 'Iluminacao externa deficiente', solution: '', product: '', investment: '', installation: '', impact: '+15%' },
  },
  {
    questionCode: 'I02', threshold: 0.35,
    item: { priority: 3, category: 'ILUMINACAO', vulnerability: 'Poucos pontos de iluminacao', solution: '', product: '', investment: '', installation: '', impact: '+10%' },
  },
  {
    questionCode: 'I03', threshold: 0.3,
    item: { priority: 3, category: 'ILUMINACAO', vulnerability: 'Sem iluminacao de emergencia', solution: '', product: '', investment: '', installation: '', impact: '+5%' },
  },
  {
    questionCode: 'A01', threshold: 0.4,
    item: { priority: 1, category: 'ACESSO', vulnerability: 'Fechadura da porta principal inadequada', solution: '', product: '', investment: '', installation: '', impact: '+25%' },
  },
  {
    questionCode: 'A02', threshold: 0.35,
    item: { priority: 1, category: 'ACESSO', vulnerability: 'Porta principal fragil', solution: '', product: '', investment: '', installation: '', impact: '+20%' },
  },
  {
    questionCode: 'A03', threshold: 0.3,
    item: { priority: 2, category: 'ACESSO', vulnerability: 'Sem trancas adicionais', solution: '', product: '', investment: '', installation: '', impact: '+8%' },
  },
  {
    questionCode: 'A04', threshold: 0.35,
    item: { priority: 2, category: 'ACESSO', vulnerability: 'Porta de servico/fundos vulneravel', solution: '', product: '', investment: '', installation: '', impact: '+12%' },
  },
  {
    questionCode: 'A05', threshold: 0.35,
    item: { priority: 3, category: 'ACESSO', vulnerability: 'Sem video porteiro', solution: '', product: '', investment: '', installation: '', impact: '+10%' },
  },
  {
    questionCode: 'E01', threshold: 0.35,
    item: { priority: 1, category: 'ELETRONICA', vulnerability: 'Sistema de alarme insuficiente', solution: '', product: '', investment: '', installation: '', impact: '+40%' },
  },
  {
    questionCode: 'E02', threshold: 0.35,
    item: { priority: 1, category: 'ELETRONICA', vulnerability: 'Sensores de abertura insuficientes', solution: '', product: '', investment: '', installation: '', impact: '+15%' },
  },
  {
    questionCode: 'E03', threshold: 0.3,
    item: { priority: 2, category: 'ELETRONICA', vulnerability: 'Sensores de movimento insuficientes', solution: '', product: '', investment: '', installation: '', impact: '+12%' },
  },
  {
    questionCode: 'E04', threshold: 0.35,
    item: { priority: 2, category: 'ELETRONICA', vulnerability: 'Cameras de seguranca insuficientes', solution: '', product: '', investment: '', installation: '', impact: '+20%' },
  },
  {
    questionCode: 'E05', threshold: 0.3,
    item: { priority: 3, category: 'ELETRONICA', vulnerability: 'Qualidade de gravacao baixa', solution: '', product: '', investment: '', installation: '', impact: '+8%' },
  },
  {
    questionCode: 'E06', threshold: 0.3,
    item: { priority: 3, category: 'ELETRONICA', vulnerability: 'Armazenamento de video inadequado', solution: '', product: '', investment: '', installation: '', impact: '+6%' },
  },
  {
    questionCode: 'E07', threshold: 0.3,
    item: { priority: 2, category: 'ELETRONICA', vulnerability: 'Botao de panico insuficiente', solution: '', product: '', investment: '', installation: '', impact: '+10%' },
  },
  {
    questionCode: 'E08', threshold: 0.3,
    item: { priority: 3, category: 'AUTOMACAO', vulnerability: 'Automacao residencial insuficiente', solution: '', product: '', investment: '', installation: '', impact: '+8%' },
  },
  {
    questionCode: 'H01', threshold: 0.35,
    item: { priority: 2, category: 'HUMANO', vulnerability: 'Residencia vazia por longos periodos', solution: '', product: '', investment: '', installation: '', impact: '+15%' },
  },
  {
    questionCode: 'H02', threshold: 0.35,
    item: { priority: 3, category: 'HUMANO', vulnerability: 'Viagens frequentes sem protecao', solution: '', product: '', investment: '', installation: '', impact: '+10%' },
  },
  {
    questionCode: 'H03', threshold: 0.25,
    item: { priority: 3, category: 'HUMANO', vulnerability: 'Sem presenca animal dissuasora', solution: '', product: '', investment: '', installation: '', impact: '+5%' },
  },
  {
    questionCode: 'H04', threshold: 0.3,
    item: { priority: 2, category: 'HUMANO', vulnerability: 'Sem seguranca/ronda no bairro', solution: '', product: '', investment: '', installation: '', impact: '+20%' },
  },
  {
    questionCode: 'H05', threshold: 0.3,
    item: { priority: 3, category: 'HUMANO', vulnerability: 'Vizinhanca sem interacao', solution: '', product: '', investment: '', installation: '', impact: '+10%' },
  },
  {
    questionCode: 'H06', threshold: 0.35,
    item: { priority: 2, category: 'HUMANO', vulnerability: 'Exposicao excessiva em redes sociais', solution: '', product: '', investment: '', installation: '', impact: '+8%' },
  },
  {
    questionCode: 'H07', threshold: 0.3,
    item: { priority: 1, category: 'HUMANO', vulnerability: 'Historico de incidentes na regiao', solution: '', product: '', investment: '', installation: '', impact: '+30%' },
  },
  {
    questionCode: 'H08', threshold: 0.4,
    item: { priority: 1, category: 'HUMANO', vulnerability: 'Bairro com alto indice de criminalidade', solution: '', product: '', investment: '', installation: '', impact: '+35%' },
  },
];

function getAnswerScore(questionCode: string, answer: string): number {
  const question = QUESTIONS.find(q => q.code === questionCode);
  if (!question || !answer) return 0;
  const optionIndex = question.options.indexOf(answer);
  const totalOptions = question.options.length;
  if (optionIndex < 0 || totalOptions <= 1) return 0;
  const rawScore = optionIndex / (totalOptions - 1);
  return question.inverted ? 1 - rawScore : rawScore;
}

function getDynamicRecommendation(questionCode: string, answerText: string): { priority: number; solution: string; product: string; investment: string; installation: string } | null {
  const upgrade = UPGRADE_MAP[questionCode];
  if (!upgrade) return null;

  const question = QUESTIONS.find(q => q.code === questionCode);
  if (!question) return null;

  const answerIndex = question.options.indexOf(answerText);
  if (answerIndex < 0) return null;

  for (const tier of upgrade.tiers) {
    if (answerIndex <= tier.maxIndex) {
      return { priority: tier.priority, solution: tier.solution, product: tier.product, investment: tier.investment, installation: tier.installation };
    }
  }

  const lastTier = upgrade.tiers[upgrade.tiers.length - 1];
  return { priority: lastTier.priority, solution: lastTier.solution, product: lastTier.product, investment: lastTier.investment, installation: lastTier.installation };
}

export function generateActionItems(answers: Record<string, AuditAnswer>): ActionItem[] {
  const items: ActionItem[] = [];
  const answeredCodes = new Set(Object.keys(answers).filter(code => answers[code]?.answer));

  if (answeredCodes.size === 0) return [];

  for (const rule of ACTION_RULES) {
    const answer = answers[rule.questionCode];
    if (!answer || !answer.answer) continue;

    const score = getAnswerScore(rule.questionCode, answer.answer);
    if (score <= rule.threshold) {
      const question = QUESTIONS.find(q => q.code === rule.questionCode);
      const dynamic = getDynamicRecommendation(rule.questionCode, answer.answer);

      items.push({
        ...rule.item,
        priority: dynamic?.priority ?? rule.item.priority,
        solution: dynamic?.solution || rule.item.solution,
        product: dynamic?.product || rule.item.product,
        investment: dynamic?.investment || rule.item.investment,
        installation: dynamic?.installation || rule.item.installation,
        questionLabel: question?.question ?? '',
        answerText: answer.answer,
      });
    }
  }

  items.sort((a, b) => a.priority - b.priority);

  return items;
}

export interface VulnerabilityItem {
  code: string;
  question: string;
  answer: string;
  category: string;
  score: number;
  maxWeight: number;
  lostPoints: number;
}

export function getTopVulnerabilities(answers: Record<string, AuditAnswer>, count: number = 5): VulnerabilityItem[] {
  const vulns: VulnerabilityItem[] = [];

  for (const q of QUESTIONS) {
    const a = answers[q.code];
    if (!a || !a.answer) continue;

    const score = getAnswerScore(q.code, a.answer);
    if (score >= 1) continue;

    const lostPoints = Math.round((1 - score) * q.weight);
    if (lostPoints <= 0) continue;

    vulns.push({
      code: q.code,
      question: q.question,
      answer: a.answer,
      category: q.category,
      score,
      maxWeight: q.weight,
      lostPoints,
    });
  }

  vulns.sort((a, b) => b.lostPoints - a.lostPoints);
  return vulns.slice(0, count);
}

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
        const rawScore = optionIndex / (totalOptions - 1);
        const adjustedScore = q.inverted ? 1 - rawScore : rawScore;
        categoryMap[q.categoryKey].earned += adjustedScore * q.weight;
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
