


# Load trained transformer model
# classifier = None

# def get_classifier():
#     global classifier
#     if classifier is None:
#         print("Starting model download...")
#         from transformers import pipeline
#         print("Transformers imported")
#         classifier = pipeline(
#             "text-classification",
#             model="Arbaz04/aspect_model",
#             tokenizer="Arbaz04/aspect_model"
#         )
#         print("Model loaded!")
#     return classifier
import requests
import os
# from dotenv import load_dotenv

# Load env (only works locally, safe for Render too)
# load_dotenv()

HF_API_URL = "https://router.huggingface.co/hf-inference/models/Arbaz04/aspect_model"
HF_TOKEN = os.getenv("HF_TOKEN")  # store safely in env
print("HF TOKEN:", HF_TOKEN)

headers = {
    "Authorization": f"Bearer {HF_TOKEN}"
}


label_map_reverse = {
    0: "Delivery",
    1: "Product_Quality",
    2: "Price",
    3: "Packaging",
    4: "Customer_Service",
    5: "App_Experience"
}

def predict_aspects(text: str):
    payload = {
        "inputs": text
    }

    response = requests.post(HF_API_URL, headers=headers, json=payload,timeout=10)
    result = response.json()
    print("HF RAW RESPONSE:", result)

    if "loading" in result.get("error", "").lower():
        import time
        time.sleep(2)

        response = requests.post(
                HF_API_URL,
                headers=headers,
                json=payload
            )
        result = response.json()

        if isinstance(result, dict):
            return "Unknown"

    else:
            return "Unknown"
    # HF returns list of predictions
    output = result[0]

    label_index = int(output["label"].split("_")[-1])
    confidence = output["score"]

    print(text, confidence)

    return label_map_reverse[label_index]