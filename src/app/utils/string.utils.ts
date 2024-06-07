import { NUMBERS } from "app/constants/number.constants";
import { STRING_EMPTY } from "app/constants/string.constants";

export const stringFrom = (value: string | number | undefined | null): string => {
  return value ? value.toString() : STRING_EMPTY;
}

export const cutString = (value: string, maxChars: number): string => {
  return value.length > maxChars ? `${value.slice(NUMBERS.N_0, maxChars)}...` : value;
}
