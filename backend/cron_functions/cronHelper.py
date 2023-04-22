from typing import List, Tuple
from utils.firestoreClasses import UserDoc
from utils.embeddingHelper import batch_text_to_embedding
from utils.constants import NUM_FEATURES, NUM_GROUPS, NUM_SUGGESTIONS
from cluster.kmeans_cluster import KMeansCluster
import numpy as np

def extract_text_ids(docs: List[UserDoc], question_order: List[str]) -> Tuple[np.ndarray, List[List[str]]]:
	"""
	Extract question answers and user ids from a list of user documents.

	Args:
	- docs: List[UserDoc], list of user documents

	Returns:
	- Tuple
		- np.ndarray, array of user ids
		- List[List[str]], list of user answer lists
	"""
	user_texts: List[List[str]] = []
	user_ids: List[str] = []
	for user in docs:
		if user.question_answers is None:
			continue
		texts: List[str] = []
		for question in question_order:
			answer = user.question_answers.get(question)
			if answer is None:
				answer = ""
			texts.append(answer)
		user_texts.append(texts)
		user_ids.append(user._id)

	user_id_array: np.ndarray = np.array(user_ids)
	return user_id_array, user_texts

def fit_model(texts: List[List[str]]) -> Tuple[KMeansCluster, Tuple[np.ndarray, np.ndarray]]:
	"""
	Creates and fits a KMeans model to the embeddings of the text provided. Additionally this function
	returns all the unique labels.

	Args:
	- texts: List[List[str]], texts to train the model on
	
	Returns:
	- Tuple
		- KMeansCluter, fitted model
		- Tuple
			- np.ndarray, unique labels
			- np.ndarray, count of occurrences of each label
	"""
	# shape of user_embeds: (num_users x (50 * num_questions))
	user_embeds: np.ndarray = batch_text_to_embedding(texts)
	cluster_model = KMeansCluster(
				num_groups=NUM_GROUPS,
				cluster_features = NUM_FEATURES,
				num_suggestions=NUM_SUGGESTIONS,
				data = user_embeds)
	group_indices, counts = np.unique(cluster_model.suggestions.reshape((-1, )), return_counts = True)
	return cluster_model, (group_indices, counts)
