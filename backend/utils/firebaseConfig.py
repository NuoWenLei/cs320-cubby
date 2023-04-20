import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import os

# Use the private key file of the service account directly.
cred = credentials.Certificate(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "private/cubby-firebase-firebase-adminsdk-pw1n9-800c62ee75.json"))
app = firebase_admin.initialize_app(cred)
db = firestore.client()

# Source: https://towardsdatascience.com/essentials-for-working-with-firestore-in-python-372f859851f7