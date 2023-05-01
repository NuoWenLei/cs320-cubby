from typing import List, Tuple
from utils.firestoreClasses import GroupDoc
from utils.embeddingHelper import batch_text_to_embedding
import numpy as np

def search(groups: List[GroupDoc], q: str) -> Tuple[np.ndarray, np.ndarray]:
	"""
	Find order of most similar group names to query.

	Args:
	- groups: List[GroupDoc], list of groups to compare to query
	- q: str, query to compare with

	Returns:
	- Tuple[np.ndarray, np.ndarray]
		- np.ndarray, array of sorted group ids
		- np.ndarray, array of sorted similarities
	"""
	group_names = [group.name for group in groups]

	group_ids = np.array([group._id for group in groups])

	group_embeddings = batch_text_to_embedding(group_names)

	query_embedding = batch_text_to_embedding([[q]])

	euclid_dist = ((group_embeddings - query_embedding) ** 2.).sum(axis = 1) ** .5

	euclid_sims = 1. / (1. + euclid_dist)

	sorted_indices = np.argsort(-euclid_sims)

	return np.take_along_axis(group_ids, sorted_indices, axis = 0), np.take_along_axis(euclid_sims, sorted_indices, axis = 0)
