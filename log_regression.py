import numpy as np
import pickle

# =========================
# LOAD TOKENIZER
# =========================
with open("spam_tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

vocab_size = len(tokenizer.word_index) + 1

# =========================
# LOAD DATASET
# =========================
# CHANGE THIS PART to your dataset
texts = [
    "Congratulations you won a free prize",
    "Win cash now click the link",
    "Hey are we meeting tomorrow",
    "Please call me when you are free",
    "Urgent offer claim your reward now",
    "Let's have lunch today"
]

labels = [1, 1, 0, 0, 1, 0]  # 1 = Spam, 0 = Ham

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

W = np.zeros(vocab_size)
b = 0.0

lr = 0.01
epochs = 1000
N = X.shape[0]

# =========================
# TRAINING LOOP
# =========================
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
print(predict("Congratulations you won cash prize"))
print(predict("Hey are we going to college tomorrow"))
