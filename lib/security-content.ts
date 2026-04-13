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
  {
    id: 1,
    category: 'Chegada',
    tip: 'Nunca entre direto na garagem sem verificar o ambiente ao redor. Olhe para ambos os lados antes de abrir o portao — criminosos esperam exatamente o momento da abertura para agir.',
  },
  {
    id: 2,
    category: 'Alerta',
    tip: 'Se perceber que esta sendo seguido, nao va para casa. Dirija ate uma delegacia, hospital ou posto de gasolina movimentado. Nunca pare em local ermo.',
  },
  {
    id: 3,
    category: 'Golpe',
    tip: 'Desconfie de qualquer pessoa que se apresente como funcionario de concessionaria, banco ou governo sem aviso previo. Ligue para a empresa antes de abrir a porta ou portao.',
  },
  {
    id: 4,
    category: 'Rotina',
    tip: 'Evite horarios fixos e previsíveis para entrar e sair de casa. Criminosos fazem monitoramento previo da rotina das vitimas por dias ou ate semanas antes de agir.',
  },
  {
    id: 5,
    category: 'Chegada',
    tip: 'Ao chegar em casa a noite, tenha a chave ou controle remoto em maos antes de sair do carro. Evite ficar mexendo na bolsa ou mochila em frente ao portao.',
  },
  {
    id: 6,
    category: 'Golpe',
    tip: 'Assaltantes frequentemente se disfarçam de entregadores ou motoboys. Confirme qualquer pedido pelo aplicativo antes de atender e nunca abra o portao completamente.',
  },
  {
    id: 7,
    category: 'Golpe',
    tip: '"Filho em apuros": nunca transfira dinheiro ao receber ligacao de familiar em situacao de emergencia. Desligue e ligue diretamente para o familiar pelo numero que voce ja tem salvo.',
  },
  {
    id: 8,
    category: 'Chegada',
    tip: 'Nao fique olhando para o celular enquanto caminha ate a porta de casa. Atencao dividida e uma oportunidade para abordagem — guarde o celular antes de sair do carro.',
  },
  {
    id: 9,
    category: 'Chegada',
    tip: 'O momento de abrir a garagem e o mais vulneravel. Nao abra o portao de longe com o controle — espere estar perto o suficiente para ver o interior antes de entrar.',
  },
  {
    id: 10,
    category: 'Alerta',
    tip: 'Se reparar no mesmo veiculo ou pessoa por mais de um trajeto, mude de rota. Nao va direto para casa enquanto nao tiver certeza de que nao esta sendo seguido.',
  },
  {
    id: 11,
    category: 'Rotina',
    tip: 'Evite mostrar o exterior da sua casa, numero, placa do carro ou nome da rua nas redes sociais. Criminosos mapeiam alvos por fotos e stories publicos.',
  },
  {
    id: 12,
    category: 'Golpe',
    tip: 'Nunca assine documentos ou receba objetos de entregadores nao esperados sem verificar antes. Golpistas usam essa tatica para forcar abertura de portao e invadir o imovel.',
  },
  {
    id: 13,
    category: 'Alerta',
    tip: 'Apos sacar dinheiro no banco ou caixa eletronico, fique atento ao sair. Criminosos monitoram agencias e seguem vitimas para aborda-las em locais mais isolados.',
  },
  {
    id: 14,
    category: 'Golpe',
    tip: '"Crianca perdida": se uma crianca desconhecida pedir para entrar na sua casa, acione a portaria ou vizinhos — nao abra a porta. Essa tatica e usada como isca para invasao por adultos proximos.',
  },
  {
    id: 15,
    category: 'Rotina',
    tip: 'Nunca confirme pelo interfone que esta sozinho em casa. Se alguem perguntar quantas pessoas estao, responda que esta aguardando familiares ou amigos.',
  },
  {
    id: 16,
    category: 'Chegada',
    tip: 'Portao ou grade entreaberta e um convite. Nunca deixe entradas parcialmente abertas enquanto descarrega o carro ou recebe uma entrega — use o botao de pausa do portao automatico.',
  },
  {
    id: 17,
    category: 'Golpe',
    tip: '"Boa noite Cinderela": sedativos em bebidas sao usados em festas e bares para roubo. Em eventos fora de casa, nunca deixe seu copo sem atencao e recuse bebidas de desconhecidos.',
  },
  {
    id: 18,
    category: 'Chegada',
    tip: 'Ao sair do carro, escaneie visualmente o ambiente antes de virar as costas para fechar o veiculo. Assaltantes esperam esse momento de inatenção para se aproximar.',
  },
  {
    id: 19,
    category: 'Alerta',
    tip: 'Se houver pessoas desconhecidas paradas sem motivo aparente na entrada do seu predio, casa ou rua, nao entre. Espere em local seguro ou acione a portaria e as autoridades.',
  },
  {
    id: 20,
    category: 'Rotina',
    tip: 'Antes de entrar em carro de aplicativo, confirme placa, modelo e nome do motorista pelo app. Golpes com motoristas falsos cresceram significativamente nos ultimos anos.',
  },
  {
    id: 21,
    category: 'Chegada',
    tip: 'Ao chegar em casa a noite, acione o farol alto do carro antes de parar em frente ao portao. A luz ilumina a area e incomoda quem estiver escondido proximos ao acesso.',
  },
  {
    id: 22,
    category: 'Alerta',
    tip: 'Objeto misterioso em frente ao portao (capacete, caixa, sacola) pode ser isca para forçar o morador a sair do carro. Nao desça para investigar — acione a policia.',
  },
  {
    id: 23,
    category: 'Golpe',
    tip: '"Achado" de celular ou carteira no chao pode ser isca para distrair voce enquanto um cúmplice age. Fique atento ao ambiente quando alguem chamar sua atencao de forma inesperada.',
  },
  {
    id: 24,
    category: 'Alerta',
    tip: 'A maioria dos roubos a residencia e planejada com antecedencia. Pessoas fazendo perguntas, servicos nao solicitados e olheiros disfarçados sao sinais de reconhecimento do imovel.',
  },
  {
    id: 25,
    category: 'Rotina',
    tip: 'Nunca autorize entrada de visitantes em condominio ou portaria sem confirmar visualmente pelo interfone — mesmo que o visitante mencione seu nome ou o de algum morador.',
  },
  {
    id: 26,
    category: 'Rotina',
    tip: 'Nunca instrua criancas a abrir o portao ou a porta para estranhos, mesmo que o visitante pareça inofensivo ou diga ser parente. Adultos devem sempre fazer esse controle.',
  },
  {
    id: 27,
    category: 'Golpe',
    tip: '"WhatsApp clonado": desconfie de cobranças ou pedidos urgentes por mensagem, mesmo que o numero pareça familiar. Sempre ligue para a pessoa por outro meio antes de tomar qualquer acao.',
  },
  {
    id: 28,
    category: 'Rotina',
    tip: 'Entre 22h e 5h o risco de abordagem e maior. Se precisar sair nesse horario, avise alguem de confiança do trajeto e horario previsto de retorno, e mantenha o celular carregado.',
  },
  {
    id: 29,
    category: 'Rotina',
    tip: 'Em datas de grande movimentacao (Reveillon, Carnaval, feriados), invasoes a residencias aumentam. Antes de sair, cheque portas, janelas e ative o alarme mesmo em ausencias curtas.',
  },
  {
    id: 30,
    category: 'Alerta',
    tip: 'Confie na sua intuição. Se algo parecer errado ao se aproximar de casa — veiculo diferente, pessoas sem razao, luz apagada que estava acesa — nao entre. Avalie de local seguro.',
  },
  {
    id: 31,
    category: 'Golpe',
    tip: 'Criminosos usam criancas ou idosos para pedir ajuda e distrair a vitima para furto ou roubo. Aja com cautela ao ser abordado por estranhos em via publica, especialmente em grupo.',
  },
  {
    id: 32,
    category: 'Alerta',
    tip: 'Fita, adesivo ou marcacao estranha na maçaneta ou no portao pode sinalizar a cumplices que o imovel esta desocupado. Reporte qualquer marcacao suspeita na sua porta ou muro.',
  },
  {
    id: 33,
    category: 'Chegada',
    tip: 'Se for abordado enquanto entra no carro, feche as portas, trave e acione a buzina para chamar atencao. O veiculo fechado e um escudo — nao negocie com a janela aberta ou a porta aberta.',
  },
  {
    id: 34,
    category: 'Rotina',
    tip: 'Em caso de assalto, avalie antes de reagir. A maioria dos especialistas em segurança recomenda entregar os bens materiais e colaborar sem resistencia — a vida e insubstituivel.',
  },
  {
    id: 35,
    category: 'Rotina',
    tip: 'Todos os moradores devem saber o que fazer em caso de invasao ou abordagem: numero da delegacia local, ponto de encontro seguro e como acionar o botao de panico do alarme.',
  },
  {
    id: 36,
    category: 'Alerta',
    tip: 'Vitimas que saem de agencias bancarias com dinheiro sao alvos frequentes de sequestro relampago. Use PIX, transferencia ou drive-thru sempre que possivel e evite saques em especie.',
  },
  {
    id: 37,
    category: 'Rotina',
    tip: 'Nao comente rotinas, viagens ou ausencias com pessoas fora do circulo de confianca — incluindo redes sociais, grupos de bairro e ate prestadores de serviço que circulam na sua residencia.',
  },
  {
    id: 38,
    category: 'Golpe',
    tip: 'Tecnicos de TV, gas, agua ou internet que aparecem sem agendamento sao vetor frequente de invasao. Sempre ligue para a empresa e confirme o nome do profissional antes de abrir.',
  },
  {
    id: 39,
    category: 'Chegada',
    tip: 'Ao usar elevador no predio, se entrar um estranho que te deixe desconfortavel, saia no proximo andar e espere o proximo elevador. Nao se sinta obrigado a continuar no mesmo.',
  },
  {
    id: 40,
    category: 'Alerta',
    tip: '5 segundos de observacao consciente antes de qualquer acao — fechar o carro, abrir o portao, atender a porta — podem ser o fator decisivo entre seguranca e risco. Desenvolva esse habito.',
  },
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
    definition: 'Barreira formada por plantas com espinhos (ex: buganvilia). Reforco perimetral natural, esteticamente agradavel e de baixo custo.',
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
    definition: 'Cameras que usam luz branca para capturar imagens noturnas coloridas. Entregam mais detalhes que o infravermelho tradicional em areas com iluminacao minima.',
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
