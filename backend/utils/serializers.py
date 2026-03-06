from typing import Any, Dict, Iterable, List
from bson import ObjectId


def _serialize_value(value: Any) -> Any:
    if isinstance(value, ObjectId):
        return str(value)
    return value


def serialize_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
    if not doc:
        return {}
    data = {k: _serialize_value(v) for k, v in doc.items()}
    if "_id" in data:
        data["id"] = str(data.pop("_id"))
    return data


def serialize_docs(docs: Iterable[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [serialize_doc(doc) for doc in docs]
