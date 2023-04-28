from typing import Tuple
from utils.constants import QUESTION_ORDER
from utils.firestoreClasses import UserDoc
from cron_functions.cronHelper import extract_text_ids
from utils.embeddingHelper import batch_text_to_embedding
import numpy as np, json

def doc_to_id_and_embed(doc: UserDoc) -> Tuple[str, np.ndarray]:
	"""
	Extract document id and answer embedding from user document.

	Args:
	- doc: UserDoc, user document to extract from

	Returns:
	- Tuple[str, np.ndarray]
		- str, user id
		- np.ndarray, answer embedding
	"""
	
	_ids, texts = extract_text_ids([doc], question_order=QUESTION_ORDER)
	embeds = batch_text_to_embedding(texts)

	return (_ids[0], embeds[0])

def calculate_suggestions_and_similarities(
		col_path: str, cluster_path: str, answer_embed: np.ndarray
		) -> Tuple[np.ndarray, np.ndarray]:
	"""
	Calculate suggestions and similarities from cluster centers and user embedding.

	Args:
	- col_path: str, filepath of feature columns
	- cluster_path: str, filepath of cluster centers
	- answer_embed: np.ndarray, user answer embeddings

	Returns:
	- Tuple[np.ndarray, np.ndarray]
		- np.ndarray, suggestions sorted from most suggested to least
		- np.ndarray, similarities of each cluster sorted from highest to lowest
	"""

	with open(col_path, "r") as col_json:
		feature_columns = json.load(col_json)
	
	# Get specific features from embedding
	features = np.take_along_axis(answer_embed, np.array(feature_columns), axis = 0)

	with open(cluster_path, "rb") as cluster_npy:
		cluster_centers = np.load(cluster_npy)
	
	# Calculate distance between user answer and every cluster center
	expanded_features = features[np.newaxis, ...]

	euclidean_distance = (((cluster_centers - expanded_features) ** 2).sum(axis = 1))

	distance_sim = 1. / (1. + euclidean_distance)
	
	# Get suggestions
	sorted_suggestions = np.argsort(-distance_sim, axis = 0)

	sorted_sims = np.take_along_axis(distance_sim, sorted_suggestions, axis = 0)

	return sorted_suggestions, sorted_sims