import type { DeepPartial } from '../i18n/types';
import type { Content } from './en';

/**
 * Português europeu. Chaves em falta recorrem ao inglês (ver i18n/locales.ts).
 * Regras editoriais: não acrescentar nomes de clientes, contratos, certificações, licenças, estatísticas
 * nem anos de experiência, a menos que sejam reais e documentados.
 * Os campos técnicos dos serviços (slug, path, photo, serviceArea) herdam-se do inglês.
 */
export const pt: DeepPartial<Content> = {
  site: {
    name: 'Jelson & Wilson Cunha',
    short: 'J&W Cunha',
    descriptor: 'Gestão integrada de espaços',
    skip: 'Saltar para o conteúdo',
    metaDescription:
      'Jelson & Wilson Cunha — gestão de instalações, gestão de propriedades, gestão de resíduos e produtos e fornecimentos para operadores de petróleo e gás, empreiteiros, bases logísticas e projectos industriais.',
  },
  nav: {
    home: 'Início',
    about: 'Sobre nós',
    services: 'Serviços',
    sectors: 'Sectores',
    hse: 'HSE e Qualidade',
    mobilisation: 'Mobilização',
    contact: 'Contactos',
    cta: 'Pedir proposta',
    open: 'Abrir menu',
    close: 'Fechar menu',
    primary: 'Navegação principal',
    language: 'Idioma',
  },
  photoAlt: {
    'home-hero': 'Dois técnicos de capacete e farda a consultar um tablet junto a um edifício moderno',
    about: 'Equipa de seis técnicos de capacete a analisar plantas e tablets à porta de um centro empresarial',
    'facility-management': 'Técnico com um tablet a inspeccionar equipamento e tubagens pintadas de verde numa casa das máquinas',
    'property-management': 'Técnica com um tablet a inspeccionar os jardins de um edifício residencial',
    'waste-management': 'Equipa a separar plástico, papel, metal e vidro em contentores de cores diferentes numa zona de triagem',
    'supplies-procurement': 'Técnica com um tablet a conferir stock num corredor de armazém, com prateleiras identificadas e empilhadores',
    sectors: 'Trabalhador de capacete a observar uma baía com navios, uma avenida marginal e a cidade ao fundo',
    hse: 'Supervisor a dar instruções à equipa junto de um painel de segurança com a frase "Trabalho seguro é trabalho bem feito"',
    mobilisation: 'Equipa e viatura a chegar a um parque portuário, com navios ao fundo',
  },
  home: {
    title: 'Gestão integrada de espaços',
    kicker: 'Gestão integrada de espaços',
    headline: 'Cuidamos dos espaços. Valorizamos o património.',
    lead:
      'A Jelson & Wilson Cunha presta serviços de gestão de instalações, gestão de propriedades, gestão de resíduos e produtos e fornecimentos a operadores de petróleo e gás, empreiteiros, bases logísticas e projectos industriais, bem como a edifícios comerciais, condomínios, hotelaria e instituições.',
    primaryCta: 'Pedir proposta',
    secondaryCta: 'Ver como mobilizamos',
    photoBrief: 'Vista ampla de uma base ou parque industrial ao nascer do dia, com equipamento e edifícios à vista.',
    servicesTitle: 'Quatro linhas de serviço, uma equipa responsável',
    servicesLead:
      'Operadores e empreiteiros não deviam ter de coordenar vários fornecedores para o essencial de um local de trabalho. Combinamos os serviços abaixo sob um único ponto de contacto, ou prestamos cada um com o seu âmbito próprio.',
    serviceMore: 'Ver serviço',
    audienceTitle: 'Com quem trabalhamos',
    audienceText:
      'Os nossos serviços destinam-se a organizações que operam, constroem ou abastecem operações industriais e de energia, onde a continuidade, a segurança e a clareza de responsabilidades pesam mais do que promessas de campanha.',
    audienceLink: 'Sectores que apoiamos',
    engageTitle: 'Do pedido ao local de trabalho, numa sequência controlada',
    engageText:
      'Cada projecto segue um percurso de mobilização definido: definição do âmbito, avaliação do local, proposta, plano de mobilização e arranque. Sabe o que vem a seguir e quem é responsável por isso.',
    engageLink: 'Ler a abordagem de mobilização',
    hseTitle: 'A segurança e a qualidade são condições do trabalho, não um anexo.',
    hseText:
      'Planeamos cada serviço de acordo com os requisitos de HSE do cliente, as regras do local e os sistemas de permissões de trabalho. As nossas propostas explicam como o trabalho será controlado antes de indicarem quanto custa.',
    hseLink: 'HSE e Qualidade',
  },
  about: {
    title: 'Sobre a empresa',
    kicker: 'Sobre nós',
    headline: 'Um parceiro prático para os serviços que sustentam as operações industriais.',
    intro: [
      'A Jelson & Wilson Cunha presta os serviços de apoio que permitem a operações de petróleo e gás, bases logísticas e projectos industriais concentrarem-se na sua actividade principal.',
      'Organizamo-nos em quatro linhas de serviço — gestão de instalações, gestão de propriedades, gestão de resíduos, e produtos e fornecimentos — prestadas com uma abordagem de gestão consistente e uma linha clara de responsabilidade.',
    ],
    photoBrief: 'Elementos da equipa com EPI da empresa a analisar uma planta no local (usar pessoas reais, com consentimento).',
    principlesTitle: 'Como trabalhamos',
    principles: [
      {
        title: 'Âmbito definido',
        text: 'Acordamos o que está incluído, o que não está e como será avaliado o desempenho, antes de o trabalho começar.',
      },
      {
        title: 'Responsabilidade única',
        text: 'Cada projecto tem um responsável identificado, que responde perante o cliente pela execução, pelos relatórios e pela escalada de problemas.',
      },
      {
        title: 'Primeiro, as regras do cliente',
        text: 'Trabalhamos dentro do sistema de gestão de HSE do cliente, da sua indução no local e dos seus procedimentos de permissão de trabalho e de acessos.',
      },
      {
        title: 'Registos que se podem auditar',
        text: 'Inspecções, entregas, movimentos de resíduos e acções correctivas ficam documentados e disponíveis para consulta.',
      },
    ],
    scopeTitle: 'O que fazemos',
    scopeText:
      'Não operamos poços, unidades de processo nem oleodutos. Prestamos os serviços de apoio que os rodeiam: os edifícios, o alojamento, os espaços exteriores e as utilidades, as correntes de resíduos, e os materiais e consumíveis de que os locais dependem.',
    ctaTitle: 'Fale-nos da sua necessidade',
    ctaText: 'Descreva-nos o seu local ou projecto e responderemos com uma proposta de abordagem.',
  },
  services: {
    index: 'Serviços',
    deliverablesLabel: 'Entregáveis:',
    whatTitle: 'Âmbito dos serviços',
    approachLabel: 'Como executamos',
    relatedTitle: 'Outros serviços',
    ctaTitle: 'Peça uma proposta para este serviço',
    ctaText: 'Descreva o local, o âmbito e o prazo. Indicaremos o que precisamos para preparar uma proposta.',
    facility: {
      navLabel: 'Facility Management',
      title: 'Facility Management',
      kicker: 'Serviço 01',
      summary:
        'Manutenção preventiva e correctiva, limpeza, higiene, jardinagem e coordenação dos serviços de apoio.',
      deliverables: 'plano, ordens de trabalho e relatório.',
      intro: [
        'Gerimos a operação diária das instalações do local: escritórios, oficinas, armazéns, alojamento e os serviços que os apoiam.',
        'O âmbito constrói-se em função do local. Alguns clientes precisam de um contrato integrado completo; outros, de um pacote definido, como limpeza, espaços exteriores ou manutenção planeada.',
      ],
      photoBrief: 'Técnico de manutenção a inspeccionar serviços de um edifício ou o interior de uma oficina num local industrial.',
      scopeTitle: 'Âmbito habitual',
      scope: [
        { title: 'Manutenção planeada e correctiva', text: 'Rotinas de inspecção, reparações e resposta registada a avarias em edifícios e utilidades.' },
        { title: 'Limpeza e higiene', text: 'Escritórios, alojamento, instalações sanitárias e zonas de refeição, de acordo com o padrão definido para o local.' },
        { title: 'Espaços exteriores e conservação geral do local', text: 'Acessos, drenagem, jardinagem e áreas exteriores mantidos seguros e transitáveis.' },
        { title: 'Alojamento e serviços de acampamento', text: 'Arrumação, lavandaria e conservação de alojamento permanente e temporário.' },
        { title: 'Apoio e relatórios', text: 'Um canal único para pedidos, com estado registado e relatórios periódicos de desempenho.' },
      ],
      approachTitle: 'Como executamos',
      approach: [
        'Levantamento inicial do estado, dos riscos e dos registos de manutenção existentes.',
        'Plano de serviço e metas de resposta acordados com o cliente.',
        'Equipas supervisionadas, a trabalhar sob as regras de permissão e de indução do cliente.',
        'Revisão regular do desempenho e das acções correctivas.',
      ],
    },
    property: {
      navLabel: 'Property Management',
      title: 'Property Management',
      kicker: 'Serviço 02',
      summary:
        'Vistorias, conservação, gestão de ocorrências, fornecedores e despesas de imóveis e condomínios.',
      deliverables: 'inventário, mapa de ocorrências e contas.',
      intro: [
        'Os projectos industriais dependem muitas vezes de terrenos, edifícios e habitação arrendados. Administramos estes activos em nome do cliente, para que as obrigações sejam acompanhadas e o estado dos imóveis fique documentado.',
        'O nosso papel é administrativo e de supervisão; as obras especializadas são contratadas e geridas através do mesmo processo controlado que usamos nos fornecimentos.',
      ],
      photoBrief: 'Exterior de um edifício de escritórios ou de alojamento numa base, arrumado e bem conservado.',
      scopeTitle: 'Âmbito habitual',
      scope: [
        { title: 'Registo de activos e do seu estado', text: 'Um registo actualizado dos imóveis, do seu estado e da respectiva documentação.' },
        { title: 'Administração de contratos de arrendamento e de ocupação', text: 'Acompanhamento de condições, datas de renovação, pagamentos devidos e distribuição de espaços.' },
        { title: 'Inspecções e entregas', text: 'Inspecções documentadas na entrada e na saída dos imóveis que são tomados ou devolvidos.' },
        { title: 'Coordenação com proprietários e ocupantes', text: 'Um ponto de contacto único para proprietários, ocupantes e utilizadores vizinhos.' },
        { title: 'Coordenação de obras', text: 'Definição de âmbito, consulta e supervisão de reparações e melhorias através de empreiteiros aprovados.' },
      ],
      approachTitle: 'Como executamos',
      approach: [
        'Recolher e verificar a documentação de cada activo.',
        'Inspeccionar, fotografar e registar o estado no início do projecto.',
        'Manter um calendário de obrigações e de inspecções.',
        'Reportar ao cliente com periodicidade fixa e perante qualquer excepção.',
      ],
    },
    waste: {
      navLabel: 'Waste Management',
      title: 'Waste Management',
      kicker: 'Serviço 03',
      summary:
        'Diagnóstico, segregação, acondicionamento e encaminhamento documentado com operadores habilitados.',
      deliverables: 'mapa de resíduos e comprovativos de destino.',
      intro: [
        'Os locais industriais produzem vários tipos de resíduos, cada um com requisitos próprios de manuseamento e destino. Organizamos a recolha e a separação na origem e guardamos os documentos que provam para onde os resíduos foram.',
        'O tratamento e o destino final são assegurados por instalações de terceiros devidamente autorizadas, escolhidas com o cliente e por ele aprovadas.',
      ],
      photoBrief: 'Zona de armazenamento de resíduos separados e identificados num local, com os contentores claramente rotulados.',
      scopeTitle: 'Âmbito habitual',
      scope: [
        { title: 'Auditoria de resíduos e plano de separação', text: 'Identificação das correntes de resíduos no local e esquema de separação com contentores rotulados.' },
        { title: 'Recolha e manuseamento interno', text: 'Recolha programada e transferência segura para uma zona de armazenamento temporário controlada.' },
        { title: 'Gestão da zona de armazenamento', text: 'Arrumação, inspecção e inventário da zona de armazenamento temporário.' },
        { title: 'Coordenação de transporte e destino final', text: 'Contratação de transportadores e instalações autorizados, com guias e certificados guardados.' },
        { title: 'Registos e relatórios de resíduos', text: 'Um registo de quantidades por corrente e destino, disponível para auditorias do cliente.' },
      ],
      approachTitle: 'Como executamos',
      approach: [
        'Caracterizar as correntes de resíduos e confirmar com o cliente os requisitos aplicáveis.',
        'Formar o pessoal do local sobre separação e utilização dos contentores.',
        'Rastrear cada movimento, da origem ao destino final.',
        'Rever volumes e propor oportunidades de redução e reutilização.',
      ],
    },
    supplies: {
      navLabel: 'Produtos e Fornecimentos',
      title: 'Produtos e Fornecimentos',
      kicker: 'Serviço 04',
      summary:
        'Limpeza, consumíveis, EPI, contentores, ferramentas e peças, conforme especificação e disponibilidade.',
      deliverables: 'fornecimento conferido e documentação técnica.',
      intro: [
        'Um fornecimento fiável depende de especificação, de disciplina na escolha de fornecedores e de acompanhamento. Atuamos como um balcão de aprovisionamento do cliente, do pedido à recepção no local.',
        'Compramos com base em requisitos escritos e reportamos o estado, para que o cliente saiba o que foi encomendado, o que já seguiu e o que está atrasado.',
      ],
      photoBrief: 'Armazém ou parque de materiais com mercadoria arrumada, estantes e uma verificação de recepção em curso.',
      scopeTitle: 'Âmbito habitual',
      scope: [
        { title: 'Tratamento de requisições', text: 'Esclarecimento de especificações e quantidades com o departamento requisitante.' },
        { title: 'Consulta e comparação de ofertas', text: 'Pedidos de preço a fornecedores adequados e comparação das ofertas numa base consistente.' },
        { title: 'Compra e aceleração', text: 'Emissão de encomendas e acompanhamento dos fornecedores até à entrega.' },
        { title: 'Recepção e inspecção', text: 'Verificações à chegada, face à encomenda e à especificação, com registo das discrepâncias.' },
        { title: 'Reposição de stocks e consumíveis', text: 'Níveis mínimos acordados com o cliente e reposição em ciclos regulares.' },
      ],
      approachTitle: 'Como executamos',
      approach: [
        'Acordar com o cliente os limites de aprovação e a documentação.',
        'Manter um registo do pedido à entrega, visível para o cliente.',
        'Aplicar os requisitos de qualificação de fornecedores do cliente, quando existirem.',
        'Reportar o desempenho das entregas e os pontos em aberto.',
      ],
    },
  },
  sectors: {
    title: 'Sectores de actividade',
    kicker: 'Sectores',
    headline: 'Pensado para os ambientes onde a continuidade e o controlo contam.',
    intro:
      'Apoiamos organizações ao longo da cadeia de valor do petróleo e gás e os projectos industriais que a rodeiam. Cada ambiente tem as suas regras; adaptamos os nossos serviços a elas e não o contrário.',
    photoBrief: 'Perfil industrial ou parque: tanques, tubagens e gruas, captado a uma distância respeitosa.',
    list: [
      {
        title: 'Operadores de petróleo e gás',
        text: 'Os operadores precisam de apoio fiável às suas bases, escritórios e alojamento, executado segundo as suas próprias normas de HSE e de contratação.',
      },
      {
        title: 'Empreiteiros e subempreiteiros',
        text: 'Os empreiteiros de construção, manutenção e paragens precisam de instalações, fornecimentos e soluções de resíduos prontos antes de as equipas chegarem.',
      },
      {
        title: 'Bases logísticas e de abastecimento',
        text: 'As bases que movimentam materiais, equipamento e pessoas exigem parques e edifícios bem conservados e um fluxo constante de consumíveis.',
      },
      {
        title: 'Projectos industriais',
        text: 'Os locais de projecto, temporários ou de longa duração, ganham com uma única entidade a coordenar os serviços que rodeiam a obra principal.',
      },
      {
        title: 'Edifícios comerciais, condomínios, hotelaria e instituições',
        text: 'A mesma abordagem integrada aplica-se a escritórios, edifícios comerciais, condomínios, hotéis e instituições que precisam de ter as instalações, os activos e os fornecimentos geridos num único plano.',
      },
    ],
    noteTitle: 'Onde não operamos',
    note:
      'Não realizamos perfuração, serviços de poço, operação de processo nem engenharia especializada. Quando uma necessidade ficar fora do nosso âmbito, di-lo-emos com clareza.',
  },
  hse: {
    title: 'HSE e Qualidade',
    kicker: 'HSE e Qualidade',
    headline: 'O trabalho é planeado e controlado antes de começar.',
    intro:
      'No petróleo e gás, a forma como uma tarefa é controlada importa tanto como a própria tarefa. A nossa abordagem de saúde, segurança, ambiente e qualidade descreve-se abaixo como a forma como planeamos trabalhar; os planos específicos de cada projecto são emitidos com cada proposta.',
    photoBrief: 'Trabalhador com EPI completo num local de trabalho com permissão; sem imagens encenadas ou genéricas de capacete.',
    pillarsTitle: 'A nossa abordagem',
    pillars: [
      {
        title: 'Alinhar com o sistema do cliente',
        text: 'Adoptamos, em cada local, o sistema de gestão de HSE do cliente, a indução, a permissão de trabalho e as regras de içamento e de acessos.',
      },
      {
        title: 'Planear a tarefa',
        text: 'Cada serviço é apoiado por métodos de trabalho e avaliações de risco documentados para as suas principais actividades.',
      },
      {
        title: 'Pessoas competentes',
        text: 'O pessoal é atribuído em função da tarefa e recebe as induções e instruções necessárias antes de começar.',
      },
      {
        title: 'Reportar e corrigir',
        text: 'Incidentes, quase-acidentes e observações são reportados de imediato, investigados de forma proporcional e encerrados com acções.',
      },
      {
        title: 'Proteger o ambiente',
        text: 'Prevenimos derrames, separamos os resíduos e guardamos registos para que as obrigações ambientais possam ser demonstradas.',
      },
      {
        title: 'Verificar a qualidade',
        text: 'Os níveis de serviço são acordados à partida, inspeccionados com regularidade e revistos com o cliente.',
      },
    ],
    docsTitle: 'Documentação',
    docsText:
      'Os planos de HSE, os métodos de trabalho e a documentação exigida na pré-qualificação do cliente são preparados para cada oportunidade. Indique-nos o que o seu processo de pré-qualificação exige quando pedir uma proposta.',
    ctaTitle: 'Partilhe os seus requisitos de HSE',
    ctaText: 'Inclua as suas normas e necessidades de pré-qualificação no seu pedido.',
  },
  mobilisation: {
    title: 'Mobilização',
    kicker: 'Mobilização',
    headline: 'Um percurso definido, do primeiro contacto a um local a funcionar.',
    intro:
      'A rapidez importa, mas só se for controlada. A nossa sequência de mobilização foi concebida para colocar pessoas, materiais e procedimentos no local sem saltar os passos que protegem o cliente.',
    photoBrief: 'Viaturas e equipa a chegar à entrada de um local de obra, ou um parque de materiais a ser preparado.',
    stepsTitle: 'Sequência de mobilização',
    steps: [
      { title: 'Pedido e definição do âmbito', text: 'Confirmamos o local, os serviços, a duração, as normas aplicáveis e as restrições.' },
      { title: 'Avaliação do local', text: 'Sempre que necessário, visitamos o local ou analisamos a sua documentação para identificar riscos e requisitos.' },
      { title: 'Proposta', text: 'Recebe uma proposta escrita com o âmbito, os recursos, a abordagem de HSE, os pressupostos e as condições comerciais.' },
      { title: 'Plano de mobilização', text: 'Após a aceitação, acordamos o calendário, o pessoal, o equipamento, as induções e as linhas de comunicação.' },
      { title: 'Arranque e verificação', text: 'Os serviços arrancam sob supervisão e o desempenho inicial é verificado face ao que foi acordado.' },
      { title: 'Rotina e revisão', text: 'Reportamos com um ciclo fixo e revemos o âmbito e o desempenho com o cliente.' },
    ],
    inputsTitle: 'O que nos ajuda a mobilizar mais depressa',
    inputs: [
      'Localização e condições de acesso',
      'Serviços necessários e duração prevista',
      'Normas de HSE e de contratação aplicáveis',
      'Requisitos de pré-qualificação e de documentação',
      'Data de início pretendida e contactos principais',
    ],
    ctaTitle: 'Comece por um pedido',
    ctaText: 'Quanto mais rigorosamente descrever a necessidade, mais depressa poderemos propor como a satisfazer.',
  },
  contact: {
    title: 'Contactos e pedido de proposta',
    kicker: 'Contactos',
    headline: 'Fale-nos do seu local ou projecto.',
    intro:
      'Use o formulário para pedir uma proposta ou colocar uma questão. O seu pedido é guardado em segurança e analisado pela nossa equipa. Não inclua neste formulário documentos comerciais confidenciais.',
    detailsTitle: 'Dados da empresa',
    email: 'Email',
    address: 'Morada',
    form: {
      title: 'Pedido de proposta',
      fullName: 'Nome completo',
      company: 'Empresa',
      email: 'Email profissional',
      phone: 'Telefone (opcional)',
      serviceArea: 'Serviço de interesse',
      serviceAreaPlaceholder: 'Seleccione um serviço',
      projectLocation: 'Local ou localização do projecto (opcional)',
      message: 'Descreva a necessidade',
      messageHint: 'Âmbito, duração, normas e data de início pretendida, se conhecidos. Mínimo de 20 caracteres.',
      consent:
        'Autorizo a Jelson & Wilson Cunha a guardar e utilizar estes dados para responder ao meu pedido.',
      submit: 'Enviar pedido',
      sending: 'A enviar…',
      successTitle: 'Pedido recebido',
      successText: 'O seu pedido foi guardado. Indique esta referência se nos contactar:',
      another: 'Enviar outro pedido',
      errorSummary: 'Corrija os campos assinalados.',
      errorServer: 'Não foi possível guardar o seu pedido. Nada foi enviado; tente novamente dentro de alguns minutos.',
      errorRate: 'Demasiados envios a partir da sua ligação. Tente novamente mais tarde.',
      errorNetwork: 'Não foi possível contactar o servidor. Nada foi enviado; verifique a ligação e tente novamente.',
      services: {
        FACILITY_MANAGEMENT: 'Facility Management',
        PROPERTY_MANAGEMENT: 'Property Management',
        WASTE_MANAGEMENT: 'Waste Management',
        SUPPLIES_PROCUREMENT: 'Produtos e Fornecimentos',
        MOBILISATION: 'Mobilização',
        OTHER: 'Outro / não tenho a certeza',
      },
      errors: {
        fullName: 'Indique o seu nome completo.',
        company: 'Indique o nome da empresa.',
        email: 'Indique um endereço de email válido.',
        phone: 'O telefone só pode conter dígitos, espaços e + ( ) - .',
        serviceArea: 'Seleccione um serviço.',
        message: 'Descreva a sua necessidade (mínimo de 20 caracteres).',
        consent: 'É necessário o seu consentimento para tratarmos o pedido.',
      },
    },
  },
  notFound: {
    title: 'Página não encontrada',
    headline: 'Esta página não existe.',
    text: 'O endereço pode estar errado ou a página pode ter sido movida.',
    home: 'Voltar à página inicial',
  },
  footer: {
    tagline: 'Gestão integrada de espaços.',
    scopeNote: 'Âmbito especializado sujeito às habilitações aplicáveis. Visitas mediante agendamento.',
    servicesTitle: 'Serviços',
    companyTitle: 'Empresa',
    contactTitle: 'Contactos',
    rights: 'Todos os direitos reservados.',
    privacy:
      'A informação enviada através do formulário de contacto é usada apenas para responder ao seu pedido.',
  },
};
