from fastapi import FastAPI, Form
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Load the trained model
model = tf.keras.models.load_model('spam_lstm_model.h5')

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use '*' for testing, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the tokenizer
with open('spam_tokenizer.pkl', 'rb') as f:
    tokenizer = pickle.load(f)

max_len = 100  # Same max_len used in training

@app.post('/predict')
async def predict_spam(text: str = Form(...)):  # Accepting the 'text' field from the form
    # Tokenize the text
    seq = tokenizer.texts_to_sequences([text])
    pad = pad_sequences(seq, maxlen=max_len, padding='post')
    
    # Get prediction probability
    prob = model.predict(pad)[0][0]
    
    # Assign label based on probability
    label = 'Spam' if prob > 0.5 else 'Ham'
    
    # Return response as JSON
    return JSONResponse(content={
        'risk_score': float(prob),
        'label': label
    })
