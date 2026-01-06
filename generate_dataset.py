import csv
import random

# ================================
# SPAM TEMPLATES
# ================================
spam_templates = [
    "Congratulations! You've won a {prize}. Click {link} to claim now!",
    "URGENT: Your account has been compromised. Verify at {link}",
    "Free entry in 2 a wkly comp to win FA Cup final tkts 21st May 2005. Text FA to 87121",
    "You have a secret admirer. Reply YES to reveal.",
    "Cash prize waiting for you! Call {phone} immediately.",
    "Get rich quick! Invest in crypto now. Visit {link}",
    "Limited time offer: Buy 1 Get 1 Free on all products!",
    "Your loan of ${amount} is approved. Call {phone} to process.",
    "Lose weight fast with this magic pill. Order at {link}",
    "XXXMobileMovieClub: To use your credit, click the WAP link in the next txt message or click here>> {link}",
    "Reminder: You have (1) unread message from Amazon. View here: {link}",
    "FINAL NOTICE: Your car warranty is about to expire. Call {phone}",
    "Hot singles in your area waiting to chat. Text DATEME to {phone}",
    "You have been selected for a $1000 gift card! Survey required: {link}",
    "Alert: Suspicious activity on your bank account. Log in: {link}",
    "Make ${amount}/week working from home! No experience needed. Apply: {link}",
    "Unlock your exclusive reward today! Don't miss out."
]

# ================================
# HAM TEMPLATES
# ================================
ham_templates = [
    "Hey, are we still meeting for {event}?",
    "Can you send me the report by {time}?",
    "I'll be late today, stuck in traffic.",
    "Happy Birthday! Hope you have a great day.",
    "What's for dinner tonight?",
    "Just checking in, how are you?",
    "Don't forget to buy milk on your way home.",
    "Let's catch up this weekend.",
    "The meeting is rescheduled to {time}.",
    "Thanks for your help yesterday!",
    "Are you coming to the {event} tonight?",
    "I sent the files you asked for.",
    "Call me when you get a chance.",
    "Do you want to grab lunch at {time}?",
    "I'll be there in 10 minutes.",
    "Have a safe flight!",
    "Can we reschedule our call to Monday?",
    "Did you see the game last night?",
    "Looking forward to seeing you.",
    "Please reply to this email to confirm your attendance."
]

# ================================
# VARIABLES
# ================================
prizes = ["$1000 Walmart Gift Card", "iPhone 15", "a luxury cruise", "£5000 cash", "a free vacation", "MacBook Pro", "Tesla Model 3"]
links = ["http://bit.ly/fake", "www.scam.com", "http://claim-now.net", "www.win-prizes.com", "http://secure-login.com", "www.free-money.org"]
phones = ["09061701461", "88888", "+447900000000", "08712400200", "(800) 555-0199", "555-0123"]
events = ["lunch", "dinner", "coffee", "the movie", "class", "practice", "the party", "gym"]
times = ["5 PM", "tomorrow morning", "Monday", "tonight", "noon", "3:00 PM"]
amounts = ["5000", "10000", "2000", "500", "50,000"]

header = ["label", "text", "label_num"]
data = []

# ================================
# GENERATION (1000 Samples)
# ================================
dataset_size = 1000
half_size = dataset_size // 2

# Generate SPAM
for _ in range(half_size):
    template = random.choice(spam_templates)
    text = template.format(
        prize=random.choice(prizes), 
        link=random.choice(links), 
        phone=random.choice(phones),
        amount=random.choice(amounts)
    )
    # Add some random noise/variation in casing
    if random.random() > 0.8:
        text = text.upper()
    
    data.append(["spam", text, 1])

# Generate HAM
for _ in range(half_size):
    template = random.choice(ham_templates)
    text = template.format(
        event=random.choice(events), 
        time=random.choice(times)
    )
    # Add noise
    if random.random() > 0.9:
        text = text.lower()

    data.append(["ham", text, 0])

# Shuffle
random.shuffle(data)

# Save
with open("spam_dataset.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(data)

print(f"Created spam_dataset.csv with {len(data)} samples.")
