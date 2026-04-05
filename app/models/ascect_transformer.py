import json
from datasets import Dataset
from sklearn.model_selection import train_test_split
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import TrainingArguments, Trainer

# ---- LOAD DATA ----
with open("converted_aspect_data.json") as f:
    data = json.load(f)

train_data, test_data = train_test_split(data, test_size=0.2)

train_dataset = Dataset.from_list(train_data)
test_dataset = Dataset.from_list(test_data)

# ---- TOKENIZER ----
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

def tokenize(example):
    return tokenizer(
        example["text"],
        truncation=True,
        padding="max_length",
        max_length=64   # 🔥 critical for speed
    )

train_dataset = train_dataset.map(tokenize)
test_dataset = test_dataset.map(tokenize)

# ---- MODEL ----
from transformers import AutoModelForSequenceClassification, TrainingArguments, Trainer

model = AutoModelForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=6
)

training_args = TrainingArguments(
    output_dir="./aspect_model",

    # 🔥 Performance / memory
    per_device_train_batch_size=4,   # lower RAM usage
    num_train_epochs=4,              # slightly better accuracy

    # 🔥 Stability
    remove_unused_columns=False,

    # 🔥 Logging (clean output)
    logging_steps=50,
    logging_dir="./logs",

    # 🔥 Disable unnecessary stuff (faster)
    save_strategy="no",

    # 🔥 Makes training deterministic
    seed=42
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset
)

trainer.train()

# ---- SAVE ----
trainer.save_model("aspect_model")
tokenizer.save_pretrained("aspect_model")

from transformers import pipeline

# Create classifier directly from trained model (no saving)
classifier = pipeline(
    "text-classification",
    model=trainer.model,
    tokenizer=tokenizer
)

label_map_reverse = {
    0: "Delivery",
    1: "Product_Quality",
    2: "Price",
    3: "Packaging",
    4: "Customer_Service",
    5: "App_Experience"
}

def predict(text):
    result = classifier(text)[0]
    
    label_index = int(result["label"].split("_")[-1])
    confidence = result["score"]
    
    return {
        "text": text,
        "aspect": label_map_reverse[label_index],
        "confidence": round(confidence, 3)
    }

# ---- TEST ----
tests = [
    "my order came after 12 days",
    "this app is laggy af",
    "feels like cheap plastic",
    "support didn’t reply for days",
    "this is overpriced garbage"
]

for t in tests:
    print(predict(t))
