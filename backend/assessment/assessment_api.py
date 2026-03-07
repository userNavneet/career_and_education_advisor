from fastapi import FastAPI
from assessment_engine import run_assessment

app = FastAPI()

@app.post("/assessment")

def assessment(responses:list):

    result = run_assessment(responses)

    return result