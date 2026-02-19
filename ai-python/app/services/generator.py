import random

def generate_test_structure(test_type, difficulty, questions):

    if test_type == "aptitude":
        numerical = [q for q in questions if q["section"] == "numerical"]
        logical = [q for q in questions if q["section"] == "logical"]
        verbal = [q for q in questions if q["section"] == "verbal"]

        selected = (
            random.sample(numerical, 10) +
            random.sample(logical, 10) +
            random.sample(verbal, 10)
        )

    elif test_type == "technical":
        selected = random.sample(questions, 25)

    random.shuffle(selected)

    return selected
