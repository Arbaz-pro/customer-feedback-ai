
import logging
import joblib

logging.basicConfig(level=logging.INFO)
model = joblib.load("aspect_model.pkl")
vectorizer = joblib.load("aspect_vectorizer.pkl")
mlb = joblib.load("aspect_mlb.pkl")

def predict_aspects(text: str):
    X_test = vectorizer.transform([text])
    probs = model.predict_proba(X_test)[0]


    logging.info(f"TEXT: {text}")
    logging.info(f"PROBS: {list(zip(mlb.classes_, probs))}")

    threshold = 0.33
    predicted = [mlb.classes_[i] for i, p in enumerate(probs) if p >= threshold]

    return predicted

# import joblib
# import os


# model = None
# vectorizer = None
# def load_model():
#     global model, vectorizer

#     if model is None or vectorizer is None:
#         print("Loading aspect model...")

#         base_path = os.path.dirname(__file__)

#         model_path = os.path.join(base_path, "../../aspect_model.pkl")
#         vectorizer_path = os.path.join(base_path, "../../aspect_vectorizer.pkl")

#         model = joblib.load(model_path)
#         vectorizer = joblib.load(vectorizer_path)

#         print("Aspect model loaded!")

#     return model, vectorizer


# label_map_reverse = {
#     0: "Delivery",
#     1: "Product_Quality",
#     2: "Price",
#     3: "Packaging",
#     4: "Customer_Service",
#     5: "App_Experience"
# }


# def predict_aspects(text: str):
#     try:
#         model, vectorizer = load_model()

#         X = vectorizer.transform([text])

#         pred = model.predict(X)[0]

#         return label_map_reverse.get(pred, "Unknown")

#     except Exception as e:
#         print("LOCAL MODEL ERROR:", e)
#         return "Unknown"


# import requests
# import os
# import time
# from dotenv import load_dotenv

# # Load env (only works locally, safe for Render too)

# load_dotenv()


# HF_API_URL = "https://router.huggingface.co/hf-inference/models/Arbaz04/aspect_model"
# HF_TOKEN = os.getenv("HF_TOKEN")  # store safely in env
# print("HF TOKEN:", HF_TOKEN)

# headers = {
#     "Authorization": f"Bearer {HF_TOKEN}"
# }


# label_map_reverse = {
#     0: "Delivery",
#     1: "Product_Quality",
#     2: "Price",
#     3: "Packaging",
#     4: "Customer_Service",
#     5: "App_Experience"
# }

# def predict_aspects(text: str):
#     payload = {"inputs": text}

#     try:
#         response = requests.post(
#             HF_API_URL,
#             headers=headers,
#             json=payload,
#             timeout=10
#         )

#         #  FIX 1: check status code
#         if response.status_code != 200:
#             print("HF STATUS ERROR:", response.status_code, response.text)
#             return "Unknown"

#         #  FIX 2: safe JSON parsing
#         try:
#             result = response.json()
#         except Exception as e:
#             print("JSON ERROR:", response.text)
#             return "Unknown"

#         print("HF RAW RESPONSE:", result)

#         #  FIX 3: handle dict errors
#         if isinstance(result, dict):
#             print("HF ERROR:", result)

#             if "loading" in result.get("error", "").lower():
#                 time.sleep(2)

#                 retry = requests.post(
#                     HF_API_URL,
#                     headers=headers,
#                     json=payload
#                 )

#                 try:
#                     result = retry.json()
#                 except:
#                     return "Unknown"

#                 if isinstance(result, dict):
#                     return "Unknown"
#             else:
#                 return "Unknown"

#         #  safe now
#         output = result[0]

#         label_index = int(output["label"].split("_")[-1])
#         return label_map_reverse.get(label_index, "Unknown")

#     except Exception as e:
#         print("HF CALL FAILED:", e)
#         return "Unknown"