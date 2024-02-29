import { DiceRoll, FumbleRangue } from '../dices.model';

describe('DiceRoll', () => {
  it('should create a DiceRoll instance', () => {
    const diceRoll = new DiceRoll(2, 6);
    expect(diceRoll.dice).toBe(2);
    expect(diceRoll.sides).toBe(6);
    expect(diceRoll.modifier).toBe(0);
  });

  it('should roll the dice and return the correct result', () => {
    const diceRoll = new DiceRoll(2, 6);
    const result = diceRoll.roll();
    expect(result).toBeGreaterThanOrEqual(2); // Minimum possible value
    expect(result).toBeLessThanOrEqual(12); // Maximum possible value
  });

  it('should convert the DiceRoll to string representation', () => {
    const diceRoll1 = new DiceRoll(0, 0, 5);
    const diceRoll2 = new DiceRoll(3, 8, -2);
    const diceRoll3 = new DiceRoll(1, 4, 0);
    expect(DiceRoll.toString(diceRoll1)).toBe('5');
    expect(DiceRoll.toString(diceRoll2)).toBe('3D8-2');
    expect(DiceRoll.toString(diceRoll3)).toBe('1D4');
    expect(DiceRoll.toString(undefined)).toBe('');
  });

});

describe('FumbleRangue', () => {
  it('should create a FumbleRangue instance', () => {
    const fumbleRangue = new FumbleRangue(1, 10, 'Fumble Range 1-10');
    expect(fumbleRangue.minRange).toBe(1);
    expect(fumbleRangue.maxRange).toBe(10);
    expect(fumbleRangue.text).toBe('Fumble Range 1-10');
  });
});
