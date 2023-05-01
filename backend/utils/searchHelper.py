from typing import List, Tuple
from utils.firestoreClasses import GroupDoc
from utils.embeddingHelper import batch_text_to_embedding
import numpy as np

def search(groups: List[GroupDoc], q: str, cosine_sim: bool = True) -> Tuple[np.ndarray, np.ndarray]:
	"""
	Find order of most similar group names to query.

	Args:
	- groups: List[GroupDoc], list of groups to compare to query
	- q: str, query to compare with
	- cosine_sim: bool, whether to use cosine similarity (True) or euclidean similarity (False)

	Returns:
	- Tuple[np.ndarray, np.ndarray]
		- np.ndarray, array of sorted group ids
		- np.ndarray, array of sorted similarities
	"""
	group_names = [[group.name] for group in groups]

	group_ids = np.array([group._id for group in groups])

	group_embeddings = batch_text_to_embedding(group_names)

	query_embedding = batch_text_to_embedding([[q]])

	if cosine_sim:
		sims = cosine_similarity(group_embeddings, query_embedding)
	else:
		sims = euclidean_similarity(group_embeddings, query_embedding)

	sorted_indices = np.argsort(-sims)

	return np.take_along_axis(group_ids, sorted_indices, axis = 0), np.take_along_axis(sims, sorted_indices, axis = 0)



def euclidean_similarity(group_embeds: np.ndarray, query_embeds: np.ndarray) -> np.ndarray:
	"""
	Calculate euclidean similarity between query and every group

	Args:
	- group_embeds: np.ndarray, group embeddings with shape (num_groups, 50)
	- query_embeds: np.ndarray, query embeddings with shape (1, 50)

	Returns:
	- np.ndarray, euclidean similarity between query and every group
	"""
	euclid_dist = ((group_embeds - query_embeds) ** 2.).sum(axis = 1) ** .5

	euclid_sims = 1. / (1. + euclid_dist)

	return euclid_sims


def cosine_similarity(group_embeds: np.ndarray, query_embeds: np.ndarray) -> np.ndarray:
	"""
	Calculate cosine similarity between query and every group

	Args:
	- group_embeds: np.ndarray, group embeddings with shape (num_groups, 50)
	- query_embeds: np.ndarray, query embeddings with shape (1, 50)

	Returns:
	- np.ndarray, cosine similarity between query and every group with shape (num_groups, )
	"""
	dot_prod = (group_embeds * query_embeds).sum(axis = 1)
	norms = (((group_embeds ** 2.).sum(axis = 1) ** 0.5) * ((query_embeds ** 2.).sum(axis = 1) ** 0.5))
	return dot_prod / norms
