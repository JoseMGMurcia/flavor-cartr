import { FumbleRangue, succesLevelEnum, succesLevelType } from '@shared/models/dices.model';
import { DICE_SEPARATOR, NUMBERS } from '../constants/number.constants';
import { cutDicesRolls } from './message.utils';
import { TranslateService } from '@ngx-translate/core';

export const getTotal = (rolls: string[]): number => {
  let total = NUMBERS.N_0;
  rolls.forEach(roll => {
    const upRoll = roll.toUpperCase();
    if(upRoll.indexOf(DICE_SEPARATOR) === - NUMBERS.N_1) {
      // Not a dice
      total += Number(roll);
    } else {
      // Is a dice
      const dice = upRoll.split(DICE_SEPARATOR);

      let diceNumber = dice[NUMBERS.N_0].length === NUMBERS.N_0 ? NUMBERS.N_1 : Number(dice[NUMBERS.N_0]);
      const diceType = Number(dice[NUMBERS.N_1]);
      const negative = diceNumber < NUMBERS.N_0 ? true: false;
      diceNumber = negative ? diceNumber * - NUMBERS.N_1 : diceNumber;
      for (let i = NUMBERS.N_0; i < diceNumber; i++) {
        if (negative) {
          total -= Math.floor(Math.random() * diceType) + NUMBERS.N_1;
        }
        else {
          total += Math.floor(Math.random() * diceType) + NUMBERS.N_1;
        }
      }
    }
  });
  return total;
};

export const manageRolls = (rollsText: string): number => {
  const rolls = cutDicesRolls(rollsText);
  return getTotal(rolls);
};

export const getFumbleTarget = (target: number): number => {
  const fumbleTarget = NUMBERS.N_100 - (NUMBERS.N_3 - Math.floor((target - NUMBERS.N_11)/NUMBERS.N_20));
  return fumbleTarget > NUMBERS.N_100 ? NUMBERS.N_100 : fumbleTarget;
};

export const getSucceslevel = (target: number, result: number): succesLevelType => {
  if( (result <= Math.ceil(target / NUMBERS.N_20)) || result === NUMBERS.N_1) {
    return succesLevelEnum.CRITICAL;
  } else if ( result <= Math.ceil(target / NUMBERS.N_5)) {
    return succesLevelEnum.SPECIAL;
  } else if ( (result <= target && result <= NUMBERS.N_95) || (result < NUMBERS.N_6)) {
    return succesLevelEnum.SUCCESS;
  } else if ( result > target && result < getFumbleTarget(target)) {
    return succesLevelEnum.FAILURE;
  } else {
    return succesLevelEnum.FUMBLE;
  }
};

export const getFumbles = (translate: TranslateService): FumbleRangue[] => {
  const texts = translate.instant('RULES.FUMBLES');
  return [
  { minRange: 1,  maxRange: 5, text: texts.F1_5 },
  { minRange: 6,  maxRange: 10, text: texts.F6_10 },
  { minRange: 11,  maxRange: 15, text: texts.F11_15 },
  { minRange: 16,  maxRange: 20, text: texts.F16_20 },
  { minRange: 21,  maxRange: 25, text: texts.F21_25 },
  { minRange: 26,  maxRange: 30, text: texts.F26_30 },
  { minRange: 31,  maxRange: 35, text: texts.F31_35 },
  { minRange: 36,  maxRange: 40, text: texts.F36_40 },
  { minRange: 41,  maxRange: 45, text: texts.F41_45 },
  { minRange: 46,  maxRange: 50, text: texts.F46_50 },
  { minRange: 51,  maxRange: 55, text: texts.F51_55 },
  { minRange: 56,  maxRange: 60, text: texts.F56_60 },
  { minRange: 61,  maxRange: 63, text: texts.F61_63 },
  { minRange: 64,  maxRange: 67, text: texts.F64_67 },
  { minRange: 68,  maxRange: 70, text: texts.F68_70 },
  { minRange: 71,  maxRange: 72, text: texts.F71_72 },
  { minRange: 73,  maxRange: 74, text: texts.F73_74 },
  { minRange: 75,  maxRange: 78, text: texts.F75_78 },
  { minRange: 79,  maxRange: 82, text: texts.F79_82 },
  { minRange: 83,  maxRange: 86, text: texts.F83_86 },
  { minRange: 87,  maxRange: 89, text: texts.F87_89 },
  { minRange: 90,  maxRange: 91, text: texts.F90_91 },
  { minRange: 92,  maxRange: 92, text: texts.F92_92 },
  { minRange: 93,  maxRange: 95, text: texts.F93_95 },
  { minRange: 96,  maxRange: 97, text: texts.F96_97 },
  { minRange: 98,  maxRange: 98, text: texts.F98_98 },
  { minRange: 99,  maxRange: 99, text: texts.F99_99 },
  { minRange: 100,  maxRange: 100, text: texts.F100_100 },
]};

export const getFumbleText = (fumbleTarget: number, fumbles:  FumbleRangue[]): string => {
  const  text = fumbles.find(fumble => fumble.minRange <= fumbleTarget && fumbleTarget <= fumble.maxRange)?.text;
  return text || '';
};
