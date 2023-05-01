from typing import Dict

class Freezer:
	'''
	Freeze any class, such that instantiated
	objects become immutable.
	
	Source: https://medium.datadriveninvestor.com/immutability-in-python-d57a3b23f336
	'''
	
	_frozen = False
	
	def __init__(self):
		self._frozen = True
	
	def __delattr__(self, *args, **kwargs):
		if self._frozen:
			raise AttributeError('This object is frozen!')
		object.__delattr__(self, *args, **kwargs)
	
	def __setattr__(self, *args, **kwargs):
		if self._frozen:
			raise AttributeError('This object is frozen!')
		object.__setattr__(self, *args, **kwargs)

class UserDoc(Freezer):
	"""
	UserDoc represents the class of the data stored in the Firebase User collection.
	"""
	def __init__(self, attributes: dict):
		self.name = attributes.get("name")
		self.email = attributes.get("email")
		self._id = attributes.get("_id")
		self.question_answers = attributes.get("questions")
		super().__init__()
	
	@staticmethod
	def from_dict(attributes: dict):
		return UserDoc(attributes)

class GroupDoc(Freezer):
	"""
	GroupDoc represents the class of the data stored in the Firebase Group collection.
	"""
	def __init__(self, attributes: dict):
		self.name = attributes.get("name")
		self._id = attributes.get("_id")
		self.friend_group = attributes.get("friend_group")
		self.feature_dist = attributes.get("feature_dist")
		super().__init__()
	
	@staticmethod
	def from_dict(attributes: dict):
		return GroupDoc(attributes)
