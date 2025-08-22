export type DiceColor = "black" | "purple" | "white" | "orange" | "teal" | "red" | "green" | "grey" | "blue";
export type DiceSymbol = "book" | "shield" | "burst" | "skull";

export const convictionRatings: ConvictionRating = {
  black: 0,
  purple: 1,
  white: 2,
  orange: 3,
  teal: 4,
  red: 5,
  green: 6,
  grey: 7,
  blue: 8
};

export interface DiceFace {
    value?: number;
    symbols?: DiceSymbol[];
}

export type DiceSet = {
    [color in DiceColor]: DiceFace[];
};

export type ConvictionRating = {
    [color in DiceColor]: number;
}