from .firebaseConfig import db
from typing import Union, Callable, List, Dict

async def get_doc(collection: str, id: str, class_factory: Callable[[dict], object]) -> Union[object, None]:
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
	doc = await doc_ref.get()
	if doc.exists:
		doc_dict = doc.to_dict().copy()
		doc_dict["_id"] = id
		return class_factory(doc_dict)
	return None

async def get_all_docs(collection: str, class_factory: Callable[[dict], object]) -> List[object]:
	"""
	Get all documents from Firestore collection and instantiate object as a class.

	Args:
	- collection: str, database collection name
	- class_factory: Callable[[dict], object], function to instantiate object of a certain class

	Returns:
	- List[object], return list of object from class_factory
	"""
	collection_ref = db.collection(collection)
	docs = collection_ref.stream()
	objects = []
	for doc in docs:
		doc_dict = doc.to_dict().copy()
		doc_dict["_id"] = doc.id
		objects.append(class_factory(doc_dict))
	return objects

async def add_doc(collection: str, item) -> str:
	"""
	Add item to Firebase collection.

	Args:
	- collection: str, database collection name
	- item: any, object to add to database

	Returns:
	- str, id of object
	"""
	doc_ref = db.collection(collection).document()
	await doc_ref.set(item)
	return str(doc_ref.id)
