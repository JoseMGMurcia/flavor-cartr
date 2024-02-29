import { Character } from '@shared/models/chartacter.model';
import { cloneCharacter } from '../character.utils';

describe('cloneCharacter', () => {
  it('should create a deep clone of the character object', () => {
    const character = {
      id: 1,
      name: 'John Doe',
    } as Character;

    const clonedCharacter = cloneCharacter(character);

    expect(clonedCharacter).not.toEqual(character);
  });

  it('should assign a unique ID to the cloned character', () => {
    const character = {
      id: 1,
      name: 'John Doe',
    } as Character;

    const clonedCharacter = cloneCharacter(character);

    expect(clonedCharacter.id).toBeDefined();
    expect(clonedCharacter.id).not.toBe(character.id);
  });

  it('should set the cloned character name to its unique ID', () => {
    const character = {
      id: 1,
      name: 'John Doe',
    } as Character;

    const clonedCharacter = cloneCharacter(character);

    expect(clonedCharacter.name.toString()).toBe(clonedCharacter.id.toString());
  });
});
