import {
  ActualExpenses,
  BudgetPlan,
  GameState,
  PeriodSummary,
  PetEmotion,
  PetStage,
  PetState,
} from './types';

/**
 * Определение текущей эмоции питомца по его показателям
 */
export function getPetEmotion(pet: PetState): PetEmotion {
  if (pet.hunger < 30 || pet.mood < 30) {
    return 'sad';
  }
  if (pet.hunger >= 60 && pet.mood >= 60) {
    return 'happy';
  }
  return 'neutral';
}

/**
 * Короткий понятный статус для главного экрана
 */
export function getPetStatusText(pet: PetState): string {
  const emotion = getPetEmotion(pet);
  if (emotion === 'happy') {
    return `${pet.name} полон сил, сыт и счастлив!`;
  }
  if (emotion === 'neutral') {
    return `${pet.name} чувствует себя хорошо и ждёт новых приключений.`;
  }
  if (pet.hunger < 30) {
    return `${pet.name} проголодался. Самое время запланировать покупку корма!`;
  }
  return `${pet.name} немного заскучал. Порадуй его игрой или новой игрушкой!`;
}

export function getStageName(stage: PetStage): string {
  switch (stage) {
    case 1:
      return 'Малыш';
    case 2:
      return 'Юниор';
    case 3:
      return 'Мастер';
    default:
      return 'Малыш';
  }
}

/**
 * Расчет итогов игрового периода и эволюции питомца
 */
export function evaluatePeriodEnd(
  state: GameState
): {
  summary: PeriodSummary;
  newPet: PetState;
  nextPeriod: number;
  newBalance: number;
  evolutionOccurred: boolean;
  evolutionExplanation?: string;
} {
  const plan: BudgetPlan = state.currentPlan || {
    needs: 0,
    wants: 0,
    savings: 0,
  };
  const fact: ActualExpenses = state.currentActual;

  // Оценка качества финансового периода
  // 1. Были ли покрыты обязательные траты или сытость питомца в норме
  const needsSatisfied = fact.needs > 0 || state.pet.hunger >= 50;
  // 2. Отложил ли ребенок что-то в накопления
  const savedSomething = fact.savings > 0;
  // 3. Не превысил ли траты на желания больше, чем на необходимое
  const balancedSpending = fact.wants <= fact.needs + 100;

  const isGoodPeriod = needsSatisfied && (savedSomething || balancedSpending);

  const consecutiveGood = isGoodPeriod
    ? state.pet.consecutiveGoodPeriods + 1
    : Math.max(0, state.pet.consecutiveGoodPeriods - 1); // Мягкий спад без обнуления

  let newStage: PetStage = state.pet.stage;
  let evolutionOccurred = false;
  let evolutionExplanation: string | undefined = undefined;

  // Проверка перехода стадий развития
  if (state.pet.stage === 1 && consecutiveGood >= 2) {
    newStage = 2;
    evolutionOccurred = true;
    evolutionExplanation =
      'Ты два периода подряд заботился о питомце, обеспечивал его кормом и откладывал монеты в копилку. Финни подрос и стал Юниором!';
  } else if (state.pet.stage === 2 && consecutiveGood >= 4 && state.savings >= 100) {
    newStage = 3;
    evolutionOccurred = true;
    evolutionExplanation =
      'Ты проявил настоящую финансовую грамотность: накопил солидную сумму и держал баланс под контролем. Финни достиг высшей стадии Мастера!';
  }

  // Деградация параметров от времени (естественный жизненный цикл без жестокости)
  const hungerAfter = Math.max(20, state.pet.hunger - 15);
  const moodAfter = Math.max(25, state.pet.mood - 10);
  const careAfter = Math.max(30, state.pet.care - 10);

  const newPet: PetState = {
    ...state.pet,
    stage: newStage,
    hunger: hungerAfter,
    mood: moodAfter,
    care: careAfter,
    consecutiveGoodPeriods: consecutiveGood,
  };

  // Начисление периодического дохода на новый период (например, карманные деньги +120 монет)
  const periodicIncome = 120;
  const newBalance = state.balance + periodicIncome;

  // Формирование обратной связи
  let feedbackMessage = '';
  if (needsSatisfied && savedSomething) {
    feedbackMessage =
      'Великолепный период! Ты позаботился о базовых потребностях питомца и пополнил копилку. План выполнен на отлично!';
  } else if (needsSatisfied && !savedSomething) {
    feedbackMessage =
      'Питомец сыт и доволен, но в этом периоде в копилку ничего не попало. В следующем периоде попробуй отложить хотя бы 20–30 монет на цель!';
  } else {
    feedbackMessage =
      'Обязательные расходы не были обеспечены вовремя, и Финни немного проголодался. Ничего страшного — в новом периоде начни с покупки питательного корма!';
  }

  const summary: PeriodSummary = {
    periodNumber: state.currentPeriod,
    startingBalance: state.balance,
    plan,
    fact,
    endingBalance: state.balance,
    savingsDeposited: fact.savings,
    petMoodResult: getPetStatusText(newPet),
    feedbackMessage,
    stageReached: evolutionOccurred ? newStage : undefined,
    evolutionExplanation,
  };

  return {
    summary,
    newPet,
    nextPeriod: state.currentPeriod + 1,
    newBalance,
    evolutionOccurred,
    evolutionExplanation,
  };
}
