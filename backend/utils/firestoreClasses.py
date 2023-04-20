from typing import Dict

class UserDoc:
	"""
	UserDoc represents the class of the data stored in the Firebase User collection.
	"""
	def __init__(self, attributes: dict):
		self.email = attributes.get("email")
		self._id = attributes.get("_id")
		self.question_answers = attributes.get("questions")

	@property
	def email(self) -> str:
		return self.email
	
	@property
	def _id(self) -> str:
		return self._id
	
	@property
	def question_answers(self) -> Dict[str, str]:
		return self.question_answers
	
	@staticmethod
	def from_dict(attributes: dict):
		return UserDoc(attributes)