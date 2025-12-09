import { ImageSourcePropType } from 'react-native';

// --- Type Definitions ---

export type RankID =
  | 'R_PURPLE' // 6
  | 'R_RED'    // 5
  | 'R_YELLOW' // 4
  | 'R_GREEN'  // 3
  | 'R_CYAN'   // 2
  | 'R_WHITE'  // 1
  | 'R_FOLD';  // 0

export type PositionID = 'UTG' | 'EP' | 'LJ' | 'HJ' | 'CO' | 'BTN';

export type ActionType = 'Fold' | 'Call' | 'Open' | 'Raise';

export interface RangeEntry {
  hand: string;
  rank: RankID;
}

// --- Data Dataset (ALL 169 Hands) ---

export const ALL_HAND_RANGES: RangeEntry[] = [
  // --- PAIRS (13 hands) ---
  { hand: 'AA', rank: 'R_PURPLE' },
  { hand: 'KK', rank: 'R_PURPLE' },
  { hand: 'QQ', rank: 'R_PURPLE' },
  { hand: 'JJ', rank: 'R_RED' },
  { hand: 'TT', rank: 'R_RED' },
  { hand: '99', rank: 'R_YELLOW' },
  { hand: '88', rank: 'R_YELLOW' },
  { hand: '77', rank: 'R_GREEN' },
  { hand: '66', rank: 'R_GREEN' },
  { hand: '55', rank: 'R_CYAN' },
  { hand: '44', rank: 'R_CYAN' },
  { hand: '33', rank: 'R_CYAN' },
  { hand: '22', rank: 'R_WHITE' },

  // --- SUITED HANDS (78 hands) ---
  // Aces Suited
  { hand: 'AKs', rank: 'R_PURPLE' },
  { hand: 'AQs', rank: 'R_RED' },
  { hand: 'AJs', rank: 'R_RED' },
  { hand: 'ATs', rank: 'R_YELLOW' },
  { hand: 'A9s', rank: 'R_GREEN' },
  { hand: 'A8s', rank: 'R_GREEN' },
  { hand: 'A7s', rank: 'R_GREEN' },
  { hand: 'A6s', rank: 'R_GREEN' },
  { hand: 'A5s', rank: 'R_CYAN' },
  { hand: 'A4s', rank: 'R_CYAN' },
  { hand: 'A3s', rank: 'R_CYAN' },
  { hand: 'A2s', rank: 'R_CYAN' },

  // Kings Suited
  { hand: 'KQs', rank: 'R_RED' },
  { hand: 'KJs', rank: 'R_YELLOW' },
  { hand: 'KTs', rank: 'R_WHITE' }, // Not explicitly top tier, mapped to White/Fold based on elimination, but commonly White
  { hand: 'K9s', rank: 'R_CYAN' },
  { hand: 'K8s', rank: 'R_WHITE' },
  { hand: 'K7s', rank: 'R_WHITE' },
  { hand: 'K6s', rank: 'R_WHITE' },
  { hand: 'K5s', rank: 'R_WHITE' },
  { hand: 'K4s', rank: 'R_WHITE' },
  { hand: 'K3s', rank: 'R_WHITE' },
  { hand: 'K2s', rank: 'R_WHITE' },

  // Queens Suited
  { hand: 'QJs', rank: 'R_YELLOW' },
  { hand: 'QTs', rank: 'R_WHITE' }, // Default to White if not in Cyan
  { hand: 'Q9s', rank: 'R_CYAN' },
  { hand: 'Q8s', rank: 'R_WHITE' },
  { hand: 'Q7s', rank: 'R_WHITE' },
  { hand: 'Q6s', rank: 'R_WHITE' },
  { hand: 'Q5s', rank: 'R_WHITE' },
  { hand: 'Q4s', rank: 'R_WHITE' },
  { hand: 'Q3s', rank: 'R_WHITE' },
  { hand: 'Q2s', rank: 'R_WHITE' },

  // Jacks Suited
  { hand: 'JTs', rank: 'R_YELLOW' },
  { hand: 'J9s', rank: 'R_CYAN' },
  { hand: 'J8s', rank: 'R_WHITE' },
  { hand: 'J7s', rank: 'R_WHITE' },
  { hand: 'J6s', rank: 'R_WHITE' },
  { hand: 'J5s', rank: 'R_WHITE' },
  { hand: 'J4s', rank: 'R_WHITE' },
  { hand: 'J3s', rank: 'R_WHITE' },
  { hand: 'J2s', rank: 'R_WHITE' },

  // Tens Suited
  { hand: 'T9s', rank: 'R_GREEN' },
  { hand: 'T8s', rank: 'R_CYAN' },
  { hand: 'T7s', rank: 'R_FOLD' },
  { hand: 'T6s', rank: 'R_FOLD' },
  { hand: 'T5s', rank: 'R_FOLD' },
  { hand: 'T4s', rank: 'R_FOLD' },
  { hand: 'T3s', rank: 'R_FOLD' },
  { hand: 'T2s', rank: 'R_FOLD' },

  // 9s Suited
  { hand: '98s', rank: 'R_GREEN' },
  { hand: '97s', rank: 'R_CYAN' },
  { hand: '96s', rank: 'R_FOLD' },
  { hand: '95s', rank: 'R_FOLD' },
  { hand: '94s', rank: 'R_FOLD' },
  { hand: '93s', rank: 'R_FOLD' },
  { hand: '92s', rank: 'R_FOLD' },

  // 8s Suited
  { hand: '87s', rank: 'R_CYAN' },
  { hand: '86s', rank: 'R_FOLD' },
  { hand: '85s', rank: 'R_FOLD' },
  { hand: '84s', rank: 'R_FOLD' },
  { hand: '83s', rank: 'R_FOLD' },
  { hand: '82s', rank: 'R_FOLD' },

  // 7s Suited
  { hand: '76s', rank: 'R_CYAN' },
  { hand: '75s', rank: 'R_FOLD' },
  { hand: '74s', rank: 'R_FOLD' },
  { hand: '73s', rank: 'R_FOLD' },
  { hand: '72s', rank: 'R_FOLD' },

  // 6s Suited
  { hand: '65s', rank: 'R_CYAN' },
  { hand: '64s', rank: 'R_FOLD' },
  { hand: '63s', rank: 'R_FOLD' },
  { hand: '62s', rank: 'R_FOLD' },

  // 5s Suited
  { hand: '54s', rank: 'R_WHITE' },
  { hand: '53s', rank: 'R_FOLD' },
  { hand: '52s', rank: 'R_FOLD' },

  // 4s Suited
  { hand: '43s', rank: 'R_WHITE' },
  { hand: '42s', rank: 'R_FOLD' },

  // 3s Suited
  { hand: '32s', rank: 'R_FOLD' },

  // --- OFFSUIT HANDS (78 hands) ---
  // Aces Offsuit
  { hand: 'AKo', rank: 'R_PURPLE' },
  { hand: 'AQo', rank: 'R_RED' },
  { hand: 'AJo', rank: 'R_GREEN' },
  { hand: 'ATo', rank: 'R_CYAN' },
  { hand: 'A9o', rank: 'R_FOLD' },
  { hand: 'A8o', rank: 'R_FOLD' },
  { hand: 'A7o', rank: 'R_FOLD' },
  { hand: 'A6o', rank: 'R_FOLD' },
  { hand: 'A5o', rank: 'R_FOLD' },
  { hand: 'A4o', rank: 'R_FOLD' },
  { hand: 'A3o', rank: 'R_FOLD' },
  { hand: 'A2o', rank: 'R_FOLD' },

  // Kings Offsuit
  { hand: 'KQo', rank: 'R_YELLOW' },
  { hand: 'KJo', rank: 'R_GREEN' },
  { hand: 'KTo', rank: 'R_CYAN' },
  { hand: 'K9o', rank: 'R_FOLD' },
  { hand: 'K8o', rank: 'R_FOLD' },
  { hand: 'K7o', rank: 'R_FOLD' },
  { hand: 'K6o', rank: 'R_FOLD' },
  { hand: 'K5o', rank: 'R_FOLD' },
  { hand: 'K4o', rank: 'R_FOLD' },
  { hand: 'K3o', rank: 'R_FOLD' },
  { hand: 'K2o', rank: 'R_FOLD' },

  // Queens Offsuit
  { hand: 'QJo', rank: 'R_CYAN' },
  { hand: 'QTo', rank: 'R_WHITE' },
  { hand: 'Q9o', rank: 'R_FOLD' },
  { hand: 'Q8o', rank: 'R_FOLD' },
  { hand: 'Q7o', rank: 'R_FOLD' },
  { hand: 'Q6o', rank: 'R_FOLD' },
  { hand: 'Q5o', rank: 'R_FOLD' },
  { hand: 'Q4o', rank: 'R_FOLD' },
  { hand: 'Q3o', rank: 'R_FOLD' },
  { hand: 'Q2o', rank: 'R_FOLD' },

  // Jacks Offsuit
  { hand: 'JTo', rank: 'R_WHITE' }, // As per user req, JTo is White/Cyan border, putting in White per "QTo, JTo" in White list
  { hand: 'J9o', rank: 'R_FOLD' },
  { hand: 'J8o', rank: 'R_FOLD' },
  { hand: 'J7o', rank: 'R_FOLD' },
  { hand: 'J6o', rank: 'R_FOLD' },
  { hand: 'J5o', rank: 'R_FOLD' },
  { hand: 'J4o', rank: 'R_FOLD' },
  { hand: 'J3o', rank: 'R_FOLD' },
  { hand: 'J2o', rank: 'R_FOLD' },

  // Tens Offsuit
  { hand: 'T9o', rank: 'R_FOLD' },
  { hand: 'T8o', rank: 'R_FOLD' },
  { hand: 'T7o', rank: 'R_FOLD' },
  { hand: 'T6o', rank: 'R_FOLD' },
  { hand: 'T5o', rank: 'R_FOLD' },
  { hand: 'T4o', rank: 'R_FOLD' },
  { hand: 'T3o', rank: 'R_FOLD' },
  { hand: 'T2o', rank: 'R_FOLD' },

  // 9s Offsuit
  { hand: '98o', rank: 'R_FOLD' },
  { hand: '97o', rank: 'R_FOLD' },
  { hand: '96o', rank: 'R_FOLD' },
  { hand: '95o', rank: 'R_FOLD' },
  { hand: '94o', rank: 'R_FOLD' },
  { hand: '93o', rank: 'R_FOLD' },
  { hand: '92o', rank: 'R_FOLD' },

  // 8s Offsuit
  { hand: '87o', rank: 'R_FOLD' },
  { hand: '86o', rank: 'R_FOLD' },
  { hand: '85o', rank: 'R_FOLD' },
  { hand: '84o', rank: 'R_FOLD' },
  { hand: '83o', rank: 'R_FOLD' },
  { hand: '82o', rank: 'R_FOLD' },

  // 7s Offsuit
  { hand: '76o', rank: 'R_FOLD' },
  { hand: '75o', rank: 'R_FOLD' },
  { hand: '74o', rank: 'R_FOLD' },
  { hand: '73o', rank: 'R_FOLD' },
  { hand: '72o', rank: 'R_FOLD' },

  // 6s Offsuit
  { hand: '65o', rank: 'R_FOLD' },
  { hand: '64o', rank: 'R_FOLD' },
  { hand: '63o', rank: 'R_FOLD' },
  { hand: '62o', rank: 'R_FOLD' },

  // 5s Offsuit
  { hand: '54o', rank: 'R_FOLD' },
  { hand: '53o', rank: 'R_FOLD' },
  { hand: '52o', rank: 'R_FOLD' },

  // 4s Offsuit
  { hand: '43o', rank: 'R_FOLD' },
  { hand: '42o', rank: 'R_FOLD' },

  // 3s Offsuit
  { hand: '32o', rank: 'R_FOLD' },
];