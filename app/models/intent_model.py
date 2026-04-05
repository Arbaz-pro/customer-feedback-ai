


# Load trained transformer model
classifier = None

def get_classifier():
    global classifier
    if classifier is None:
        from transformers import pipeline  # ✅ move inside
        classifier = pipeline(
            "text-classification",
            model="Arbaz04/aspect_model",
            tokenizer="Arbaz04/aspect_model"
        )
    return classifier

label_map_reverse = {
    0: "Delivery",
    1: "Product_Quality",
    2: "Price",
    3: "Packaging",
    4: "Customer_Service",
    5: "App_Experience"
}

def predict_aspects(text: str):
    cls=get_classifier()
    result = cls(text)[0]

    label_index = int(result["label"].split("_")[-1])
    confidence = result["score"]

    # debug (optional)
    print(text, confidence)

    return label_map_reverse[label_index]