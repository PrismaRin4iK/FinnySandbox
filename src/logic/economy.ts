import {
  ActualExpenses,
  BudgetPlan,
  GameState,
  ShopItem,
  Transaction,
} from './types';

/**
 * Валидация плана бюджета.
 * Ребенок не может распределить больше, чем доступно на балансе.
 */
export function validateBudgetPlan(
  plan: BudgetPlan,
  availableBalance: number
): {
  isValid: boolean;
  totalPlanned: number;
  remaining: number;
  errorMessage?: string;
} {
  const needs = Math.max(0, Math.floor(plan.needs || 0));
  const wants = Math.max(0, Math.floor(plan.wants || 0));
  const savings = Math.max(0, Math.floor(plan.savings || 0));
  const totalPlanned = needs + wants + savings;
  const remaining = availableBalance - totalPlanned;

  if (totalPlanned > availableBalance) {
    const overspend = totalPlanned - availableBalance;
    return {
      isValid: false,
      totalPlanned,
      remaining,
      errorMessage: `План превышает доступный баланс на ${overspend} монет. Уменьши какую-нибудь категорию!`,
    };
  }

  return {
    isValid: true,
    totalPlanned,
    remaining,
  };
}

/**
 * Проверка достаточности средств
 */
export function canAfford(balance: number, price: number): boolean {
  return balance >= price && price > 0;
}

/**
 * Расчет информации о нехватке средств для модального окна
 */
export function calculateMissingFunds(
  balance: number,
  price: number
): {
  isAffordable: boolean;
  missingAmount: number;
  advice: string;
} {
  if (balance >= price) {
    return {
      isAffordable: true,
      missingAmount: 0,
      advice: 'Монет достаточно для покупки!',
    };
  }

  const missingAmount = price - balance;
  return {
    isAffordable: false,
    missingAmount,
    advice: `Тебе не хватает ${missingAmount} монет. Ты можешь выполнить финансовое задание в разделе «Задания» или выбрать другой товар!`,
  };
}

/**
 * Расчет ожидаемого числа периодов до цели
 */
export function estimateGoalPeriods(
  currentSavings: number,
  targetCost: number,
  averageDepositPerPeriod: number
): {
  remainingCost: number;
  estimatedPeriods: number;
  description: string;
} {
  const remainingCost = Math.max(0, targetCost - currentSavings);
  if (remainingCost === 0) {
    return {
      remainingCost: 0,
      estimatedPeriods: 0,
      description: 'Цель уже достигнута! Поздравляем!',
    };
  }

  const avg = averageDepositPerPeriod > 0 ? averageDepositPerPeriod : 50;
  const estimatedPeriods = Math.ceil(remainingCost / avg);

  return {
    remainingCost,
    estimatedPeriods,
    description: `При откладывании примерно по ${avg} монет в период цель будет достигнута через ${estimatedPeriods} ${getPeriodWord(estimatedPeriods)}.`,
  };
}

function getPeriodWord(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'период';
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'периода';
  return 'периодов';
}

/**
 * Проведение покупки
 */
export function executePurchase(
  state: GameState,
  item: ShopItem
): {
  success: boolean;
  newState?: GameState;
  errorMessage?: string;
} {
  if (!canAfford(state.balance, item.price)) {
    const missing = calculateMissingFunds(state.balance, item.price);
    return {
      success: false,
      errorMessage: missing.advice,
    };
  }

  const newBalance = state.balance - item.price;
  const transactionType =
    item.category === 'mandatory' ? 'expense_needs' : 'expense_wants';

  const transaction: Transaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    timestamp: Date.now(),
    period: state.currentPeriod,
    type: transactionType,
    amount: item.price,
    description: `Куплено: ${item.name}`,
    categoryLabel: item.categoryName,
  };

  const newActual: ActualExpenses = {
    ...state.currentActual,
    needs:
      item.category === 'mandatory'
        ? state.currentActual.needs + item.price
        : state.currentActual.needs,
    wants:
      item.category === 'optional'
        ? state.currentActual.wants + item.price
        : state.currentActual.wants,
  };

  const newPet = {
    ...state.pet,
    hunger: Math.min(100, Math.max(0, state.pet.hunger + item.hungerBonus)),
    mood: Math.min(100, Math.max(0, state.pet.mood + item.moodBonus)),
    care: Math.min(100, Math.max(0, state.pet.care + item.careBonus)),
  };

  const newState: GameState = {
    ...state,
    balance: newBalance,
    pet: newPet,
    currentActual: newActual,
    purchasedItemIds: [...state.purchasedItemIds, item.id],
    transactions: [transaction, ...state.transactions],
  };

  return {
    success: true,
    newState,
  };
}

/**
 * Перевод в накопления
 */
export function depositToSavings(
  state: GameState,
  amount: number
): {
  success: boolean;
  newState?: GameState;
  errorMessage?: string;
} {
  const roundedAmount = Math.max(0, Math.floor(amount));
  if (roundedAmount <= 0) {
    return { success: false, errorMessage: 'Сумма для откладывания должна быть больше нуля.' };
  }

  if (state.balance < roundedAmount) {
    return {
      success: false,
      errorMessage: `На балансе недостаточно монет (${state.balance} монет). Нельзя отложить больше, чем есть.`,
    };
  }

  const newBalance = state.balance - roundedAmount;
  const newSavings = state.savings + roundedAmount;

  const transaction: Transaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    timestamp: Date.now(),
    period: state.currentPeriod,
    type: 'savings_deposit',
    amount: roundedAmount,
    description: `Отложено в копилку`,
    categoryLabel: 'Коплю',
  };

  const newState: GameState = {
    ...state,
    balance: newBalance,
    savings: newSavings,
    currentActual: {
      ...state.currentActual,
      savings: state.currentActual.savings + roundedAmount,
    },
    transactions: [transaction, ...state.transactions],
  };

  return { success: true, newState };
}

/**
 * Снятие средств из накоплений
 */
export function withdrawFromSavings(
  state: GameState,
  amount: number
): {
  success: boolean;
  newState?: GameState;
  errorMessage?: string;
} {
  const roundedAmount = Math.max(0, Math.floor(amount));
  if (roundedAmount <= 0) {
    return { success: false, errorMessage: 'Сумма для снятия должна быть больше нуля.' };
  }

  if (state.savings < roundedAmount) {
    return {
      success: false,
      errorMessage: `В накоплениях всего ${state.savings} монет. Нельзя снять больше.`,
    };
  }

  const newSavings = state.savings - roundedAmount;
  const newBalance = state.balance + roundedAmount;

  const transaction: Transaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    timestamp: Date.now(),
    period: state.currentPeriod,
    type: 'savings_withdraw',
    amount: roundedAmount,
    description: `Снято из копилки`,
    categoryLabel: 'Накопления',
  };

  const newState: GameState = {
    ...state,
    balance: newBalance,
    savings: newSavings,
    transactions: [transaction, ...state.transactions],
  };

  return { success: true, newState };
}
