import { TEST } from '@shared/constants/test.constant';
import { CultMember, Equipment, Skill, cultMemberTypeEnum } from '../chartacter.model';
describe('Skill', () => {
  let skill: Skill;

  beforeEach(() => {
    skill = new Skill('Test Skill', 10, 'Speciality');
  });

  it('should create an instance of Skill', () => {
    expect(skill).toBeTruthy();
  });

  it('should have the correct name', () => {
    expect(skill.name).toEqual('Test Skill');
  });

  it('should have the correct value', () => {
    expect(skill.value).toEqual(10);
  });

  it('should have the correct speciality', () => {
    expect(skill.speciality).toEqual('Speciality');
  });

  it('should have the default modifier', () => {
    expect(skill.modifier).toEqual('');
  });

  it('should have markable set to false', () => {
    expect(skill.markable).toBeFalse();
  });

  it('should have marked set to false', () => {
    expect(skill.marked).toBeFalse();
  });

  it('should not have a rune assigned', () => {
    expect(skill.rune).toBeUndefined();
  });
});

describe('CultMember', () => {
  it('should create a CultMember instance', () => {
    const cultMember = new CultMember('Deity', cultMemberTypeEnum.INITIATE);
    expect(cultMember.deity).toEqual('Deity');
    expect(cultMember.memberType).toEqual(cultMemberTypeEnum.INITIATE);
    expect(cultMember.phanteon).toEqual('');
    expect(cultMember.runePoints).toEqual(0);
    expect(cultMember.runes).toEqual([]);
  });
});

describe('Equipment', () => {
  it('should create an Equipment instance', () => {
    const equipment = new Equipment(TEST);
    expect(equipment).toBeTruthy();
  });
});
