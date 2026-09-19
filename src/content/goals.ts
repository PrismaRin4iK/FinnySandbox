import { FinancialGoal } from '../logic/types';

export const FINANCIAL_GOALS: FinancialGoal[] = [
  {
    id: 'goal_house',
    title: 'Уютный домик для Финни',
    targetCost: 250,
    icon: '🏠',
    description: 'Собственный теплый домик с мягкой крышей и окошком, где Финни будет в полной безопасности.',
  },
  {
    id: 'goal_scooter',
    title: 'Трюковой городской самокат',
    targetCost: 500,
    icon: '🛴',
    description: 'Надежный двухколесный самокат для быстрых прогулок по парку вместе с питомцем.',
  },
  {
    id: 'goal_explorer',
    title: 'Набор юного исследователя',
    targetCost: 750,
    icon: '🔬',
    description: 'Бинокль, лупа, компас и походная сумка для увлекательных экспедиций на природе.',
  },
  {
    id: 'goal_bicycle',
    title: 'Спортивный велосипед',
    targetCost: 1000,
    icon: '🚲',
    description: 'Большая и желанная мечта: скоростной велосипед с сигналом и шлемом для долгих путешествий.',
  },
];
