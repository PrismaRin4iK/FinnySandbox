import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateBudgetPlan,
  canAfford,
  calculateMissingFunds,
  executePurchase,
  depositToSavings,
  withdrawFromSavings,
  estimateGoalPeriods,
} from '../economy.js';
import { evaluatePeriodEnd, getPetEmotion, getStageName } from '../petEngine.js';
import { getInitialGameState } from '../storage.js';
import { ShopItem } from '../types.js';

test('1. validateBudgetPlan: validates within balance and detects overspend', () => {
  const balance = 200;

  // Корректный план
  const validResult = validateBudgetPlan({ needs: 100, wants: 50, savings: 50 }, balance);
  assert.equal(validResult.isValid, true);
  assert.equal(validResult.totalPlanned, 200);
  assert.equal(validResult.remaining, 0);

  // Корректный план с остатком
  const partialResult = validateBudgetPlan({ needs: 80, wants: 40, savings: 30 }, balance);
  assert.equal(partialResult.isValid, true);
  assert.equal(partialResult.totalPlanned, 150);
  assert.equal(partialResult.remaining, 50);

  // Превышение бюджета
  const invalidResult = validateBudgetPlan({ needs: 120, wants: 60, savings: 50 }, balance);
  assert.equal(invalidResult.isValid, false);
  assert.equal(invalidResult.totalPlanned, 230);
  assert.equal(invalidResult.remaining, -30);
  assert.match(invalidResult.errorMessage!, /превышает доступный баланс на 30 монет/);
});

test('2. canAfford and calculateMissingFunds: educational feedback on lack of funds', () => {
  const balance = 70;
  const expensivePrice = 120;

  assert.equal(canAfford(balance, 50), true);
  assert.equal(canAfford(balance, 100), false);

  const missingInfo = calculateMissingFunds(balance, expensivePrice);
  assert.equal(missingInfo.isAffordable, false);
  assert.equal(missingInfo.missingAmount, 50);
  assert.match(missingInfo.advice, /не хватает 50 монет/);
});

test('3. executePurchase: handles mandatory and optional purchases, updates state & history', () => {
  const state = getInitialGameState();
  state.balance = 200;

  const foodItem: ShopItem = {
    id: 'food_nutritious',
    name: 'Питательный сухой корм',
    price: 80,
    category: 'mandatory',
    categoryName: 'Нужно',
    description: 'Корм',
    icon: '🥣',
    hungerBonus: 30,
    moodBonus: 10,
    careBonus: 10,
  };

  const purchaseRes = executePurchase(state, foodItem);
  assert.equal(purchaseRes.success, true);
  assert.ok(purchaseRes.newState);

  // Баланс уменьшился
  assert.equal(purchaseRes.newState!.balance, 120);
  // Факт обязательных расходов увеличился
  assert.equal(purchaseRes.newState!.currentActual.needs, 80);
  // Сытость питомца возросла
  assert.equal(purchaseRes.newState!.pet.hunger, 100);
  // Транзакция записана в историю
  assert.equal(purchaseRes.newState!.transactions[0].type, 'expense_needs');
  assert.equal(purchaseRes.newState!.transactions[0].amount, 80);

  // Попытка купить товар при нехватке средств
  const expensiveItem: ShopItem = {
    id: 'super_item',
    name: 'Золотой замок',
    price: 999,
    category: 'optional',
    categoryName: 'Хочу',
    description: 'Дорого',
    icon: '🏰',
    hungerBonus: 0,
    moodBonus: 10,
    careBonus: 0,
  };
  const failRes = executePurchase(purchaseRes.newState!, expensiveItem);
  assert.equal(failRes.success, false);
  assert.match(failRes.errorMessage!, /не хватает/);
});

test('4. depositToSavings and withdrawFromSavings: handles transfers cleanly', () => {
  const state = getInitialGameState();
  state.balance = 150;
  state.savings = 20;

  // Успешное пополнение
  const depositRes = depositToSavings(state, 50);
  assert.equal(depositRes.success, true);
  assert.equal(depositRes.newState!.balance, 100);
  assert.equal(depositRes.newState!.savings, 70);
  assert.equal(depositRes.newState!.currentActual.savings, 50);

  // Попытка отложить больше доступного
  const overDepositRes = depositToSavings(depositRes.newState!, 200);
  assert.equal(overDepositRes.success, false);

  // Успешное снятие
  const withdrawRes = withdrawFromSavings(depositRes.newState!, 30);
  assert.equal(withdrawRes.success, true);
  assert.equal(withdrawRes.newState!.savings, 40);
  assert.equal(withdrawRes.newState!.balance, 130);

  // Попытка снять больше, чем накоплено
  const overWithdrawRes = withdrawFromSavings(withdrawRes.newState!, 100);
  assert.equal(overWithdrawRes.success, false);
});

test('5. estimateGoalPeriods: calculates accurate timelines', () => {
  const targetCost = 500;
  const currentSavings = 200;
  const avgDeposit = 50;

  const result = estimateGoalPeriods(currentSavings, targetCost, avgDeposit);
  assert.equal(result.remainingCost, 300);
  assert.equal(result.estimatedPeriods, 6); // 300 / 50 = 6 периодов

  // Цель достигнута
  const completed = estimateGoalPeriods(500, targetCost, avgDeposit);
  assert.equal(completed.remainingCost, 0);
  assert.equal(completed.estimatedPeriods, 0);
});

test('6. evaluatePeriodEnd and pet evolution: 3 stages and safe recovery', () => {
  const state = getInitialGameState();
  state.currentPeriod = 1;
  state.balance = 100;
  state.currentPlan = { needs: 80, wants: 20, savings: 20 };
  state.currentActual = { needs: 80, wants: 10, savings: 20 };
  state.pet.hunger = 80;
  state.pet.stage = 1;
  state.pet.consecutiveGoodPeriods = 1; // Был 1 успешный период

  // Завершение периода 1 -> должно перевести питомца со стадии 1 (Малыш) на стадию 2 (Юниор)!
  const result1 = evaluatePeriodEnd(state);
  assert.equal(result1.evolutionOccurred, true);
  assert.equal(result1.newPet.stage, 2);
  assert.equal(getStageName(result1.newPet.stage), 'Юниор');
  assert.match(result1.evolutionExplanation!, /Юниором/);
  assert.equal(result1.nextPeriod, 2);
  assert.equal(result1.newBalance, 100 + 120); // Баланс + периодический доход

  // Проверка реакции питомца
  assert.equal(getPetEmotion(result1.newPet), 'happy');

  // Проверка безопасной ошибки: если в периоде нет ухода, питомец не умирает, а только грустит
  const poorState = getInitialGameState();
  poorState.pet.hunger = 20;
  poorState.pet.mood = 20;
  assert.equal(getPetEmotion(poorState.pet), 'sad');
  // Показатели ограничены безопасным минимумом
  poorState.currentActual = { needs: 0, wants: 0, savings: 0 };
  const poorResult = evaluatePeriodEnd(poorState);
  assert.ok(poorResult.newPet.hunger >= 20); // Защита от смерти/болезни
});
