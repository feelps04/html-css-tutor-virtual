import { Badge } from '../types';

// Define all available badges in the system
export const availableBadges: Badge[] = [
  // Achievement badges
  {
    id: 'first-lesson',
    name: 'Primeiros Passos',
    description: 'Completou sua primeira lição de HTML',
    imageUrl: '/badges/first-lesson.png',
    category: 'achievement'
  },
  {
    id: 'css-master',
    name: 'Mestre do CSS',
    description: 'Completou todas as lições de CSS',
    imageUrl: '/badges/css-master.png',
    category: 'achievement'
  },
  {
    id: 'html-guru',
    name: 'Guru do HTML',
    description: 'Completou todas as lições de HTML',
    imageUrl: '/badges/html-guru.png',
    category: 'achievement'
  },
  {
    id: 'responsive-designer',
    name: 'Designer Responsivo',
    description: 'Criou seu primeiro layout responsivo',
    imageUrl: '/badges/responsive-designer.png',
    category: 'skill'
  },
  
  // Skill badges
  {
    id: 'flexbox-master',
    name: 'Mestre do Flexbox',
    description: 'Dominou os conceitos de Flexbox',
    imageUrl: '/badges/flexbox-master.png',
    category: 'skill'
  },
  {
    id: 'grid-wizard',
    name: 'Mago do Grid',
    description: 'Dominou os conceitos de CSS Grid',
    imageUrl: '/badges/grid-wizard.png',
    category: 'skill'
  },
  {
    id: 'form-expert',
    name: 'Especialista em Formulários',
    description: 'Criou formulários avançados com validação',
    imageUrl: '/badges/form-expert.png',
    category: 'skill'
  },
  
  // Participation badges
  {
    id: 'seven-day-streak',
    name: '7 Dias Seguidos',
    description: 'Acessou o tutor por 7 dias consecutivos',
    imageUrl: '/badges/seven-day-streak.png',
    category: 'participation'
  },
  {
    id: 'thirty-day-streak',
    name: '30 Dias Seguidos',
    description: 'Acessou o tutor por 30 dias consecutivos',
    imageUrl: '/badges/thirty-day-streak.png',
    category: 'participation'
  },
  {
    id: 'first-share',
    name: 'Compartilhador',
    description: 'Compartilhou seu primeiro projeto com a comunidade',
    imageUrl: '/badges/first-share.png',
    category: 'participation'
  },
  
  // Challenge badges
  {
    id: 'challenge-champion',
    name: 'Campeão de Desafios',
    description: 'Completou 10 desafios',
    imageUrl: '/badges/challenge-champion.png',
    category: 'challenge'
  },
  {
    id: 'speed-coder',
    name: 'Programador Veloz',
    description: 'Completou um desafio em menos de 5 minutos',
    imageUrl: '/badges/speed-coder.png',
    category: 'challenge'
  },
  {
    id: 'debugging-hero',
    name: 'Herói da Depuração',
    description: 'Encontrou e corrigiu 10 bugs em desafios',
    imageUrl: '/badges/debugging-hero.png',
    category: 'challenge'
  }
];

