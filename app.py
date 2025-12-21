from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pickle

app = FastAPI()

# -------------------------
# CORS
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Load tokenizer
# -------------------------
with open("spam_tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

vocab_size = len(tokenizer.word_index) + 1

# -------------------------
# Load Logistic Regression parameters
# -------------------------
W = np.load("weights.npy")      # shape: (vocab_size,)
b = np.load("bias.npy")         # scalar

# -------------------------
# Helper functions
# -------------------------
def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def text_to_bow(text):
    """
    Convert text to Bag-of-Words vector
    """
    vec = np.zeros(vocab_size)
    for word in text.lower().split():
        idx = tokenizer.word_index.get(word)
        if idx is not None and idx < vocab_size:
            vec[idx] += 1
    return vec

# -------------------------
# API Endpoint
# -------------------------
@app.post("/predict")
async def predict_spam(text: str = Form(...)):
    X = text_to_bow(text)
    prob = sigmoid(np.dot(X, W) + b)

    label = "Spam" if prob > 0.5 else "Ham"

    return JSONResponse({
        "risk_score": float(prob),
        "label": label
    })
