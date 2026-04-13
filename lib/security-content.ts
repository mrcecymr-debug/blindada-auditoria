export type SecurityTip = {
  id: number;
  category: string;
  tip: string;
};

export type GlossaryTerm = {
  term: string;
  definition: string;
};

export const SECURITY_TIPS: SecurityTip[] = [
  { id: 1, category: 'Acesso', tip: 'Nunca deixe a chave reserva embaixo do tapete, vaso de planta ou dentro do carro. Sao os primeiros lugares verificados por invasores.' },
  { id: 2, category: 'Iluminacao', tip: 'Ilumine o perimetro externo do imovel. Mais de 70% das tentativas de invasao ocorrem em areas mal iluminadas durante a noite.' },
  { id: 3, category: 'Eletronica', tip: 'Cameras visiveis na entrada sao mais eficazes como deterrente do que cameras escondidas. Use a visibilidade a seu favor.' },
  { id: 4, category: 'Acesso', tip: 'Troque a combinacao do portao eletronico e das fechaduras sempre que receber, comprar ou alugar um imovel.' },
  { id: 5, category: 'Perimetro', tip: 'Cercas vivas com plantas de espinhos como buganvilia refor¸cam muros de forma natural, esteticamente agradavel e de baixo custo.' },
  { id: 6, category: 'Humano', tip: 'Nunca poste localizacao em tempo real nas redes sociais durante viagens. Evite mostrar que sua casa esta vazia.' },
  { id: 7, category: 'Acesso', tip: 'Verifique se a fechadura da porta de servico tem o mesmo nivel de seguranca da entrada principal. Portas secundarias sao vetores comuns de invasao.' },
  { id: 8, category: 'Humano', tip: 'Um cachorro, mesmo de pequeno porte, e um dos melhores alertas de presenca estranha. O latido disuade e alerta moradores.' },
  { id: 9, category: 'Iluminacao', tip: 'Portoes sem iluminacao noturna sao altamente vulneraveis. Instale ao menos uma luminaria com sensor de presenca na area de acesso.' },
  { id: 10, category: 'Humano', tip: 'Vizinhos atentos fazem parte do sistema de seguranca. Mantenha uma relacao de confianca e comunicacao com quem mora ao redor.' },
  { id: 11, category: 'Perimetro', tip: 'Mantenha arbustos e arvores podados proximo a janelas e muros. Vegetacao densa cria pontos cegos que facilitam a acao de invasores.' },
  { id: 12, category: 'Eletronica', tip: 'Alarmes sem monitoramento sao menos eficazes. Considere contratar um plano de monitoramento 24h com acionamento da policia.' },
  { id: 13, category: 'Eletronica', tip: 'DVRs e NVRs de cameras devem ter senha personalizada. A senha padrao de fabrica e amplamente conhecida e explorada por invasores.' },
  { id: 14, category: 'Eletronica', tip: 'Cameras com resolucao minima de 2MP permitem reconhecimento facial nas imagens gravadas — essencial para identificacao pos-ocorrencia.' },
  { id: 15, category: 'Humano', tip: 'Nao discuta rotinas de viagem ou ausencia com desconhecidos, em grupos de bairro publicos ou nas redes sociais.' },
  { id: 16, category: 'Perimetro', tip: 'A maioria das invasoes acontece pela porta da frente. Invista primeiro nesse ponto com fechaduras de alta seguranca e reforco de marco.' },
  { id: 17, category: 'Perimetro', tip: 'Uma janela com vidro trincado ou marcos fracos, sem sinalizacao de alarme, convida arrombamentos. Nunca deixe reparos estruturais pendentes.' },
  { id: 18, category: 'Acesso', tip: 'Interfones com camera permitem verificar visitantes antes de abrir o portao — uma das medidas preventivas de maior impacto e menor custo.' },
  { id: 19, category: 'Acesso', tip: 'Troque as fechaduras imediatamente ao perder chaves ou ao mudar de residencia. O custo e minimo comparado ao risco.' },
  { id: 20, category: 'Perimetro', tip: 'Evite deixar escadas, ferramentas ou objetos que facilitem acesso ao segundo andar do lado externo. Remova apos o uso.' },
  { id: 21, category: 'Eletronica', tip: 'Sensores de abertura em janelas e portas sao baratos (a partir de R$30) e altamente eficazes quando integrados a uma central de alarme.' },
  { id: 22, category: 'Eletronica', tip: 'Configure o alarme para disparar tambem em caso de queda de energia — cortar energia e uma tatica comum usada antes de invasoes.' },
  { id: 23, category: 'Humano', tip: 'Anote os numeros de serie de equipamentos eletronicos em local seguro. Facilita a recuperacao e o registro de boletim de ocorrencia.' },
  { id: 24, category: 'Eletronica', tip: 'A cerca eletrica deve ser instalada com aterramento adequado. Sem aterramento correto ela perde eficacia e pode gerar interferencias.' },
  { id: 25, category: 'Humano', tip: 'Iluminacao com timer simula presenca durante viagens. Um investimento de R$50 a R$150 com alto impacto preventivo.' },
  { id: 26, category: 'Perimetro', tip: 'Portas com painel de vidro devem ter pelicula de seguranca. Ela impede o estilhacamento facil e dificulta o acesso manual ao trinco.' },
  { id: 27, category: 'Acesso', tip: 'Um cofre fixado a parede ou piso protege documentos, joias e dinheiro mesmo que a casa seja invadida. E um seguro que voce controla.' },
  { id: 28, category: 'Humano', tip: 'Verificar o documento e CPF de prestadores de servico antes do acesso e uma medida simples e eficaz contra golpes e reconhecimento de alvos.' },
  { id: 29, category: 'Eletronica', tip: 'Cameras com visao noturna colorida (full-color) entregam imagens muito superiores as cameras com infravermelho tradicional em areas com baixa luz.' },
  { id: 30, category: 'Humano', tip: 'Tenha um plano de emergencia familiar. Todos os moradores devem saber o que fazer — e o que NAO fazer — em caso de invasao ou tentativa.' },
  { id: 31, category: 'Perimetro', tip: 'Telas de protecao em janelas dificultam acesso e sao pratica e esteticamente invisiveis ao olhar externo. Instalacao simples e eficaz.' },
  { id: 32, category: 'Humano', tip: 'O horario de maior incidencia de invasoes residenciais e entre 14h e 17h — quando a maioria das pessoas esta fora trabalhando.' },
  { id: 33, category: 'Acesso', tip: 'Instale travas secundarias em portoes de jardim e area de servico. Portoes laterais sao frequentemente negligenciados e por isso explorados.' },
  { id: 34, category: 'Eletronica', tip: 'Etiquetas de empresas de alarme na entrada sao deterrentes mesmo sem sistema ativo. Mas nao substitua o sistema real por adesivos.' },
  { id: 35, category: 'Eletronica', tip: 'Cameras em angulos cruzados de 90° eliminam pontos cegos em corredores, entradas e areas de acesso lateral.' },
  { id: 36, category: 'Humano', tip: 'Salve o numero da delegacia mais proxima no celular — nao apenas o 190. Em emergencias, contato direto com a delegacia e mais rapido.' },
  { id: 37, category: 'Perimetro', tip: 'Grades embutidas ou chumbadas nas paredes sao significativamente mais resistentes do que grades parafusadas em marcos externos.' },
  { id: 38, category: 'Perimetro', tip: 'O ponto mais vulneravel de uma residencia e geralmente o fundo — fora do campo visual da rua e dos vizinhos. Audit essa area com prioridade.' },
  { id: 39, category: 'Eletronica', tip: 'Sistemas de monitoramento via aplicativo permitem visualizar cameras em tempo real de qualquer lugar. Essencial para quem viaja frequentemente.' },
  { id: 40, category: 'Humano', tip: 'Realize uma auditoria de seguranca completa ao menos uma vez por ano. Seu imovel muda, sua rotina muda — as vulnerabilidades tambem.' },
];

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'Aterramento',
    definition: 'Ligacao eletrica que conduz descargas para a terra. Essencial em cercas eletricas e sistemas de alarme para funcionamento seguro e eficaz.',
  },
  {
    term: 'Biometria',
    definition: 'Controle de acesso por caracteristicas fisicas unicas, como impressao digital ou reconhecimento facial. Alta seguranca e comodidade — sem chaves fisicas.',
  },
  {
    term: 'Camera Bullet',
    definition: 'Camera tubular com formato cilindrico. Visivel e direcional — ideal para monitorar entradas e ruas. Seu formato ja e um fator de disuasao.',
  },
  {
    term: 'Camera Dome',
    definition: 'Camera com carcaca semiesferica. Discreta e mais dificil de saber para onde aponta. Recomendada para areas internas e cobertas.',
  },
  {
    term: 'Camera PTZ',
    definition: 'Pan-Tilt-Zoom: camera que gira horizontalmente (pan), inclina verticalmente (tilt) e tem zoom optico. Controlada remotamente para monitorar grandes areas.',
  },
  {
    term: 'Central de Alarme',
    definition: 'Componente que processa os sinais de todos os sensores e aciona sirenes, monitoramento e notificacoes. O cerebro do sistema de alarme.',
  },
  {
    term: 'Cerca Eletrica',
    definition: 'Barreira com fios eletrificados que aplica descarga de baixa amperagem ao contato. Funciona como deterrente e alerta. Deve ter aterramento adequado.',
  },
  {
    term: 'Cerca Viva',
    definition: 'Barreira formada por plantas com espinhos (ex: buganvilia, pingo-de-ouro com espinhos). Reforco perimetral natural, esteticamente agradavel e de baixo custo.',
  },
  {
    term: 'CFTV',
    definition: 'Circuito Fechado de Televisao. Sistema de cameras e gravadores que monitoram e registram imagens em um circuito privado — nao transmitido publicamente.',
  },
  {
    term: 'DVR',
    definition: 'Digital Video Recorder. Gravador que recebe sinal de cameras analogicas (cabo coaxial) e converte em digital para armazenamento. Exige senha personalizada.',
  },
  {
    term: 'Full HD / 4K',
    definition: 'Resolucao de imagem das cameras. Full HD = 1080p (2MP). 4K = 8MP. Quanto maior a resolucao, mais detalhes capturados — essencial para identificacao de pessoas.',
  },
  {
    term: 'Infravermelho (IR)',
    definition: 'Tecnologia que permite visao noturna em cameras. LEDs IR iluminam a cena sem luz visivel. Cameras full-color usam luz branca e entregam imagens coloridas noturnas.',
  },
  {
    term: 'Interfone',
    definition: 'Sistema de comunicacao entre a entrada e o interior do imovel. Modelos com camera permitem ver o visitante antes de abrir — recomendado em toda residencia.',
  },
  {
    term: 'IP (Grau de Protecao)',
    definition: 'Indice que indica resistencia do equipamento a poeira e agua. IP65: protegido contra jatos de agua. IP67: suporta imersao. Use IP65+ em cameras externas.',
  },
  {
    term: 'Monitoramento 24h',
    definition: 'Servico contratado em empresa especializada que recebe alertas do alarme e aciona autoridades. Aumenta significativamente a eficacia do sistema de seguranca.',
  },
  {
    term: 'NVR',
    definition: 'Network Video Recorder. Gravador para cameras IP (rede). Recebe video ja digitalizado via cabo de rede (Ethernet). Maior qualidade e flexibilidade que DVR.',
  },
  {
    term: 'Pelicula de Seguranca',
    definition: 'Filme transparente aplicado em vidros. Impede estilhacamento em caso de impacto, dificultando o acesso manual ao trinco e retardando a invasao.',
  },
  {
    term: 'PIR (Sensor)',
    definition: 'Passive Infrared Sensor. Detecta variacao de calor corporal em movimento. Usado em sensores de presenca para alarmes e iluminacao automatica.',
  },
  {
    term: 'PoE',
    definition: 'Power over Ethernet. Tecnologia que transmite energia eletrica pelo cabo de rede. Elimina a necessidade de tomada proxima a camera — facilita a instalacao.',
  },
  {
    term: 'Redundancia',
    definition: 'Sistema backup que entra em operacao em caso de falha do principal. Ex: bateria de backup no alarme para funcionar sem energia, chip 4G no NVR.',
  },
  {
    term: 'Sensor de Abertura',
    definition: 'Sensor magnetico instalado em portas e janelas que dispara o alarme quando aberto sem autorizacao. Barato e altamente eficaz quando bem instalado.',
  },
  {
    term: 'Sensor de Vidro',
    definition: 'Detecta vibracoes especificas de quebra de vidro. Complementa sensores de abertura em janelas — aciona o alarme antes da invasao consumada.',
  },
  {
    term: 'Sirene de Alarme',
    definition: 'Dispositivo sonoro (80-120dB) acionado pela central em caso de intruso. A sirene externa visivel tem funcao tambem de deterrente visual.',
  },
  {
    term: 'Temporizador (Timer)',
    definition: 'Dispositivo que liga e desliga equipamentos eletricos em horarios programados. Usado em luminarias para simular presenca durante ausencias prolongadas.',
  },
  {
    term: 'Visao Noturna Colorida',
    definition: 'Cameras que usam luz branca (e nao IR) para capturar imagens noturnas coloridas. Entregam mais detalhes que o infravermelho tradicional em areas com iluminacao minima.',
  },
];

export function getDailyTip(): SecurityTip {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = dayOfYear % SECURITY_TIPS.length;
  return SECURITY_TIPS[index];
}
