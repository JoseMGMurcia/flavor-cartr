import { Character } from "@shared/models/chartacter.model";

export const getUniqueID = (name: string): number => {
  return Number(new Date().getTime()) + Math.floor(Math.random() * 1000);
};

export const cloneCharacter = (pj: Character ): Character => {
  const clone = JSON.parse(JSON.stringify(pj));
  clone.id = getUniqueID(clone.name);
  clone.name = clone.id;
  return clone;
};
