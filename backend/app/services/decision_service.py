import os
from typing import Tuple, List

# Defines the sequential order of interview rounds
ROUND_SEQUENCE = ["Introduction", "Technical", "Behavioral", "Scenario"]

# Determines how many questions are in each round before transitioning
# Note: Introduction typically has 1. We default others to 3.
QUESTIONS_PER_ROUND = {
    "Introduction": 1,
    "Technical": 3,
    "Behavioral": 3,
    "Scenario": 3
}

def process_adaptive_difficulty(current_difficulty: str, score: int) -> str:
    """
    Adjusts the difficulty deterministically based on the last score.
    Rules: >=80 increase, <=50 decrease.
    """
    levels = ["Easy", "Medium", "Hard"]
    try:
        current_idx = levels.index(current_difficulty)
    except ValueError:
        current_idx = 1 # Default to Medium if invalid
        
    if score >= 80:
        next_idx = min(len(levels) - 1, current_idx + 1)
    elif score <= 50:
        next_idx = max(0, current_idx - 1)
    else:
        next_idx = current_idx
        
    return levels[next_idx]

def check_early_termination(score_history: List[int]) -> bool:
    """
    Terminates early if after 5 questions the average score is below the threshold.
    """
    threshold = int(os.getenv("EARLY_TERMINATION_THRESHOLD", 35))
    if len(score_history) >= 5:
        avg_score = sum(score_history) / len(score_history)
        if avg_score < threshold:
            return True
    return False

def manage_rounds(current_round_name: str, questions_in_current_round: int) -> str:
    """
    Progresses to the next round if the current round's question threshold is met.
    """
    max_questions = QUESTIONS_PER_ROUND.get(current_round_name, 3)
    
    if questions_in_current_round >= max_questions:
        try:
            current_idx = ROUND_SEQUENCE.index(current_round_name)
            if current_idx + 1 < len(ROUND_SEQUENCE):
                return ROUND_SEQUENCE[current_idx + 1]
            else:
                return "Completed" # All rounds finished
        except ValueError:
            return ROUND_SEQUENCE[0]
            
    return current_round_name
