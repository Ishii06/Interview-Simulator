def section_analysis(submitted_answers):

    section_data = {}

    for q in submitted_answers:
        section = q["section"]

        if section not in section_data:
            section_data[section] = {"correct": 0, "total": 0}

        section_data[section]["total"] += 1

        if q["user_answer"] == q["correct_answer"]:
            section_data[section]["correct"] += 1

    return section_data
