import { RankID, PositionID, ActionType } from '../constants/pokerData';

// --- Configuration ---

const RANK_VALUES: Record<RankID, number> = {
  R_PURPLE: 6,
  R_RED: 5,
  R_YELLOW: 4,
  R_GREEN: 3,
  R_CYAN: 2,
  R_WHITE: 1,
  R_FOLD: 0,
};

const POSITION_BASE_RANKS: Record<PositionID, number> = {
  UTG: 5, // Red
  EP: 4,  // Yellow
  LJ: 3,  // Green
  HJ: 3,  // Green
  CO: 2,  // Cyan
  BTN: 1, // White
};

// --- Evaluation Logic ---

interface EvaluationResult {
  isCorrect: boolean;
  message: string;
  correctAction: ActionType;
}

export function evaluateAction(
  position: PositionID,
  handRankId: RankID,
  userAction: ActionType
): EvaluationResult {
  
  const H = RANK_VALUES[handRankId];
  const P = POSITION_BASE_RANKS[position];
  const diff = H - P;

  let correctAction: ActionType;

  // Logic: 
  if (position === 'UTG') {
    // --- UTG Special Case ---
    // UTG is the first to act. They can ONLY 'Open' or 'Fold'.
    // Concepts of 'Call' (Limping is ignored/bad) or 'Raise' (3-Bet) do not apply to RFI.
    // Therefore, if the hand meets or exceeds the Base Rank, it is an Open.
    if (H >= P && H > 0) {
      correctAction = 'Open';
    } else {
      correctAction = 'Fold';
    }
  } else {
    // --- Other Positions (Standard Relative Logic) ---
    // Based on difference (H - P) as defined in the original spec
    if (H === 0) {
      correctAction = 'Fold';
    } else if (H < P) {
      // Case 4: Weaker than base
      correctAction = 'Fold';
    } else if (diff === 0) {
      // Case 1: H == P (Same Color)
      correctAction = 'Open';
    } else if (diff === 1) {
      // Case 2: H == P + 1 (1 Rank Stronger)
      correctAction = 'Call';
    } else if (diff >= 2) {
      // Case 3: H >= P + 2 (2+ Ranks Stronger)
      correctAction = 'Raise';
    } else {
      correctAction = 'Fold';
    }
  }

  const isCorrect = userAction === correctAction;
  
  let message = '';
  if (isCorrect) {
    message = 'Correct!';
  } else {
    message = `Wrong! Correct was ${correctAction}`;
  }

  return {
    isCorrect,
    message,
    correctAction,
  };
}