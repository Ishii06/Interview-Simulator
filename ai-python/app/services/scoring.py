def calculate_score(submitted_answers):

    total = len(submitted_answers)
    correct = 0

    for q in submitted_answers:
        if q["user_answer"] == q["correct_answer"]:
            correct += 1

    percentage = (correct / total) * 100 if total > 0 else 0

    return {
        "score": correct,
        "total": total,
        "percentage": round(percentage, 2)
    }
