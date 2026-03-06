import certifi
import os
from pymongo import MongoClient
from core.config import MONGO_URI, MONGO_DB_NAME

_allow_invalid = os.getenv("MONGO_TLS_ALLOW_INVALID", "").lower() in {"1", "true", "yes"}
_server_sel_timeout = int(os.getenv("MONGO_SERVER_SELECTION_TIMEOUT_MS", "30000"))

client = MongoClient(
    MONGO_URI,
    tlsCAFile=certifi.where(),
    tlsAllowInvalidCertificates=_allow_invalid,
    tlsAllowInvalidHostnames=_allow_invalid,
    serverSelectionTimeoutMS=_server_sel_timeout,
)

if MONGO_DB_NAME:
    db = client[MONGO_DB_NAME]
else:
    db = client.get_database()


def get_db():
    return db
