import { Challenge } from '../types';

// Define daily challenges
export const dailyChallenges: Omit<Challenge, 'startDate' | 'endDate'>[] = [
  {
    id: 'daily-html-elements',
    title: 'Mestres dos Elementos',
    description: 'Utilize pelo menos 5 elementos HTML diferentes em um único projeto',
    type: 'daily',
    difficulty: 'easy',
    experienceReward: 50,
    requirements: ['Usar 5 elementos HTML diferentes']
  },
  {
    id: 'daily-css-selectors',
    title: 'Seletor Preciso',
    description: 'Use 3 tipos diferentes de seletores CSS em seu código',
    type: 'daily',
    difficulty: 'medium',
    experienceReward: 75,
    requirements: ['Usar seletor de classe', 'Usar seletor de ID', 'Usar seletor de atributo ou pseudo-classe']
  },
  {
    id: 'daily-responsive',
    title: 'Adaptação Diária',
    description: 'Crie um componente que se adapte a diferentes tamanhos de tela',
    type: 'daily',
    difficulty: 'medium',
    experienceReward: 100,
    requirements: ['Usar media queries', 'Testar em pelo menos 2 tamanhos de tela']
  }
];

// Define weekly challenges
export const weeklyChallenges: Omit<Challenge, 'startDate' | 'endDate'>[] = [
  {
    id: 'weekly-landing-page',
    title: 'Construtor de Landing Page',
    description: 'Crie uma landing page completa para um produto ou serviço fictício',
    type: 'weekly',
    difficulty: 'hard',
    experienceReward: 300,
    requirements: [
      'Incluir cabeçalho e rodapé', 
      'Ter pelo menos 3 seções', 
      'Ser responsivo', 
      'Incluir um formulário de contato'
    ],
    badgeReward: {
      id: 'landing-page-creator',
      name: 'Criador de Landing Pages',
      description: 'Criou uma landing page completa e responsiva',
      imageUrl: '/badges/landing-page-creator.png',
      category: 'challenge'
    }
  },
  {
    id: 'weekly-flexbox-layout',
    title: 'Desafio Flexbox',
    description: 'Recrie um layout complexo usando apenas Flexbox',
    type: 'weekly',
    difficulty: 'medium',
    experienceReward: 200,
    requirements: [
      'Usar apenas Flexbox para posicionamento', 
      'Incluir um menu de navegação', 
      'Criar um layout de cards'
    ]
  },
  {
    id: 'weekly-accessibility',
    title: 'Campeão da Acessibilidade',
    description: 'Melhore a acessibilidade de um projeto existente',
    type: 'weekly',
    difficulty: 'hard',
    experienceReward: 250,
    requirements: [
      'Adicionar atributos ARIA apropriados', 
      'Garantir contraste adequado', 
      'Implementar navegação por teclado',
      'Usar HTML semântico'
    ],
    badgeReward: {
      id: 'accessibility-champion',
      name: 'Campeão da Acessibilidade',
      description: 'Tornou um projeto completamente acessível',
      imageUrl: '/badges/accessibility-champion.png',
      category: 'challenge'
    }
  }
];

