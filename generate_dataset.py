import csv
import random

# Common Spam Phrases
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
    "XXXMobileMovieClub: To use your credit, click the WAP link in the next txt message or click here>> {link}"
]

# Common Ham Phrases
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
    "Thanks for your help yesterday!"
]

prizes = ["$1000 Walmart Gift Card", "iPhone 15", "a luxury cruise", "£5000 cash", "a free vacation"]
links = ["http://bit.ly/fake", "www.scam.com", "http://claim-now.net", "www.win-prizes.com"]
phones = ["09061701461", "88888", "+447900000000", "08712400200"]
events = ["lunch", "dinner", "coffee", "the movie", "class"]
times = ["5 PM", "tomorrow morning", "Monday", "tonight"]
amounts = ["5000", "10000", "2000", "500"]

data = []
header = ["label", "text", "label_num"]

# Generate dataset entries
# 100 Spam
for _ in range(100):
    template = random.choice(spam_templates)
    text = template.format(
        prize=random.choice(prizes), 
        link=random.choice(links), 
        phone=random.choice(phones),
        amount=random.choice(amounts)
    )
    # label=spam, label_num=1
    data.append(["spam", text, 1])

# 100 Ham
for _ in range(100):
    template = random.choice(ham_templates)
    text = template.format(
        event=random.choice(events), 
        time=random.choice(times)
    )
    # label=ham, label_num=0
    data.append(["ham", text, 0])

# Shuffle
random.shuffle(data)

# Save to CSV using standard library
with open("spam_dataset.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(data)

print(f"Created spam_dataset.csv with {len(data)} samples.")
