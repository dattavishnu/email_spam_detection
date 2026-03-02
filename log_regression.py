import numpy as np
import pickle
import csv
from tensorflow.keras.preprocessing.text import Tokenizer

# =========================
# LOAD DATASET FROM CSV
# =========================
texts = []
labels = []

try:
    with open("spam_dataset.csv", "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            texts.append(row["text"])
            labels.append(int(row["label_num"]))
            
    print(f"Loaded {len(texts)} samples from spam_dataset.csv")

except FileNotFoundError:
    print("Error: spam_dataset.csv not found! Please run generate_dataset.py first.")
    exit(1)

# =========================
# CREATE & SAVE TOKENIZER
# =========================
tokenizer = Tokenizer()
tokenizer.fit_on_texts(texts)

# Save the tokenizer
with open("spam_tokenizer.pkl", "wb") as f:
    pickle.dump(tokenizer, f)

print("Tokenizer created and saved to spam_tokenizer.pkl")

vocab_size = len(tokenizer.word_index) + 1

# =========================
# TEXT → BAG OF WORDS
# =========================
def text_to_bow(text):
    vec = np.zeros(vocab_size)
    for word in text.lower().split():
        idx = tokenizer.word_index.get(word)
        if idx is not None and idx < vocab_size:
            vec[idx] += 1
    return vec

X = np.array([text_to_bow(t) for t in texts])
y = np.array(labels)

# =========================
# LOGISTIC REGRESSION
# =========================
def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# Initialize weights
W = np.zeros(vocab_size)
b = 0.0

lr = 0.01
epochs = 1500  # Increased epochs for better convergence on larger data
N = X.shape[0]

# =========================
# TRAINING LOOP
# =========================
print("Training model...")
for epoch in range(epochs):
    z = np.dot(X, W) + b
    y_pred = sigmoid(z)

    dW = (1 / N) * np.dot(X.T, (y_pred - y))
    db = (1 / N) * np.sum(y_pred - y)

    W -= lr * dW
    b -= lr * db

    if epoch % 100 == 0:
        loss = -np.mean(
            y * np.log(y_pred + 1e-9) +
            (1 - y) * np.log(1 - y_pred + 1e-9)
        )
        print(f"Epoch {epoch} | Loss: {loss:.4f}")

# =========================
# SAVE MODEL
# =========================
np.save("weights.npy", W)
np.save("bias.npy", np.array(b))

print("\nModel saved: weights.npy, bias.npy")

# =========================
# TEST MODEL
# =========================
def predict(text):
    x = text_to_bow(text)
    prob = sigmoid(np.dot(x, W) + b)
    label = "Spam" if prob > 0.5 else "Ham"
    return prob, label

print("\n--- TESTING ---")
print(predict("Get rich quick with crypto"))
print(predict("Let's have dinner tonight"))
