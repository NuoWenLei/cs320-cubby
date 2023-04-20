from .firebaseConfig import db
from typing import Union, Callable

def get_doc(collection: str, id: str, class_factory: Callable[[dict], object]) -> Union[object, None]:
	"""
	Get document from Firestore and instantiate object as a class.

	Args:
	- collection: str, database collection name
	- id: str, database document id
	- class_factory: Callable[[dict], object], function to instantiate object of a certain class

	Returns:
	- Union[object, None]
		- if queried object does not exist, return None
		- if queried object does exist, return instance of object from class_factory
	"""
	doc_ref = db.collection(collection).document(id)
	doc = doc_ref.get()
	if doc.exists:
		doc_dict = doc.to_dict().copy()
		doc["_id"] = id
		return class_factory(doc_dict)
	return None