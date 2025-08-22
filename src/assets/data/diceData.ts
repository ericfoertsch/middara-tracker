import type { DiceSet } from "@/types/dice";

export const dice: DiceSet = {
  purple: [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 5, symbols: ["shield"] },
    { value: 6, symbols: ["burst"] },
    { value: 7, symbols: ["book"] }
  ],
  white: [
    { value: 2 },
    { value: 3 },
    { value: 4, symbols: ["shield"] },
    { value: 5, symbols: ["shield"] },
    { value: 6, symbols: ["shield"] },
    { value: 7, symbols: ["burst"] }
  ],
  orange: [
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 6, symbols: ["shield"] },
    { value: 7, symbols: ["burst"] },
    { value: 8, symbols: ["book"] }
  ],
  teal: [
    { value: 3 },
    { value: 4 },
    { value: 5 },
    { value: 6, symbols: ["shield"] },
    { value: 7 },
    { value: 8, symbols: ["burst"] }
  ],
  red: [
    { value: 3 },
    { value: 4 },
    { value: 5 },
    { value: 7, symbols: ["shield"] },
    { value: 8 },
    { value: 9, symbols: ["burst"] }
  ],
  green: [
    { value: 4 },
    { value: 5 },
    { value: 6 },
    { value: 7, symbols: ["shield"] },
    { value: 8 },
    { value: 9, symbols: ["burst"] }
  ],
  grey: [
    { value: 4 },
    { value: 5 },
    { value: 6 },
    { value: 8, symbols: ["shield"] },
    { value: 9 },
    { value: 10, symbols: ["burst"] }
  ],
  blue: [
    { value: 5 },
    { value: 6 },
    { value: 7 },
    { value: 8, symbols: ["shield"] },
    { value: 9 },
    { value: 10, symbols: ["burst"] }
  ],
  black: [
    { symbols: ["shield", "shield"] },
    { symbols: ["shield", "shield"] },
    { symbols: ["shield", "shield", "shield"] },
    { symbols: ["shield", "shield", "shield", "shield"] },
    { symbols: ["skull"] }
  ]
};
