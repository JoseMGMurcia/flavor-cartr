import { getFumbleTarget, getSucceslevel, getTotal, manageRolls } from '../dices.utils';

describe('getTotal', () => {
  it('should return the correct total for rolls without dice', () => {
    const rolls = ['1', '2', '3'];
    const total = getTotal(rolls);
    expect(total).toBe(6);
  });

  it('should return the correct total for rolls with dice', () => {
    const rolls = ['1d6', '2d10', '3d4'];
    const total = getTotal(rolls);
    expect(total).toBeGreaterThanOrEqual(6);
    expect(total).toBeLessThanOrEqual(36);
  });

  it('should return 0 for an empty rolls array', () => {
    const rolls: string[] = [];
    const total = getTotal(rolls);
    expect(total).toBe(0);
  });

  it('should handle negative dice numbers correctly', () => {
    const rolls = ['-1d6', '-2d10', '-3d4'];
    const total = getTotal(rolls);
    expect(total).toBeLessThanOrEqual(-6);
    expect(total).toBeGreaterThanOrEqual(-36);
  });
});

describe('manageRolls', () => {
  it('should get total from componses roll', () => {
    const total = manageRolls('1d6+2d10+3d4');

    expect(total).toBeGreaterThanOrEqual(6);
    expect(total).toBeLessThanOrEqual(38);
  });
});

describe('getFumbleTarget', () => {
  it('should return the correct fumble target for a given target number', () => {
    const target = 50;
    const fumbleTarget = getFumbleTarget(target);
    expect(fumbleTarget).toBeLessThanOrEqual(100);
    expect(fumbleTarget).toBeGreaterThanOrEqual(0);
  });

  it('should return 100 if the calculated fumble target is greater than 100', () => {
    const target = 110;
    const fumbleTarget = getFumbleTarget(target);
    expect(fumbleTarget).toBe(100);
  });
});

describe('getSucceslevel', () => {
  it('should return CRITICAL when result is 1 or less than or equal to target divided by 20', () => {
    const target = 100;
    const result = 1;
    const level = getSucceslevel(target, result);
    expect(level).toBe('CRITICAL');
  });

  it('should return CRITICAL when result is equal to 1', () => {
    const target = 100;
    const result = 1;
    const level = getSucceslevel(target, result);
    expect(level).toBe('CRITICAL');
  });

  it('should return SPECIAL when result is less than or equal to target divided by 5', () => {
    const target = 100;
    const result = 20;
    const level = getSucceslevel(target, result);
    expect(level).toBe('SPECIAL');
  });

  it('should return SUCCESS when result is less than or equal to target and less than or equal to 95', () => {
    const target = 100;
    const result = 80;
    const level = getSucceslevel(target, result);
    expect(level).toBe('SUCCESS');
  });

  it('should return FAILURE when result is greater than target and less than fumble target', () => {
    const target = 94;
    const result = 95;
    const level = getSucceslevel(target, result);
    expect(level).toBe('FAILURE');
  });

  it('should return FUMBLE when result is greater than or equal to fumble target', () => {
    const target = 100;
    const result = 150;
    const level = getSucceslevel(target, result);
    expect(level).toBe('FUMBLE');
  });
});
