from collections import Counter
from typing import Dict, List

from schemas.models import AssessmentAnswer


def score_assessment(answers: List[AssessmentAnswer]) -> Dict[str, int]:
    counter = Counter()
    for answer in answers:
        if answer.field:
            counter[answer.field] += 1
        else:
            counter[answer.choice] += 1
    return dict(counter)


def top_fields(scores: Dict[str, int], limit: int = 3) -> List[str]:
    return [field for field, _ in sorted(scores.items(), key=lambda x: x[1], reverse=True)][:limit]
