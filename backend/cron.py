from cluster.kmeans_cluster import KMeansCluster
from utils.firestoreHelper import get_all_docs, add_doc
from utils.firestoreClasses import UserDoc
from utils.constants import QUESTION_ORDER, NUM_GROUPS, NUM_SUGGESTIONS, NUM_FEATURES, MIN_MEMBER_PER_GROUP
from utils.embeddingHelper import batch_text_to_embedding
from typing import List, Tuple
import numpy as np, json, os

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

async def main():
	"""
	Function for daily data clustering, group creating and matching.

	Process:
	- Get all user samples from Firestore
	- Process all user samples in text embeddings
	- Fit with KMeansCluster
	- Save cluster data in KMeansCluster
	- Add friend group clusters to firestore
	- Add matches to Firestore including KMeansCluster cosine similarity
	- Record id of friend group clusters corresponding to their cluster center index
	- Store in cluster/index_to_group_id.json

	Args:
	- None

	Returns:
	- None
	"""
	user_samples = get_all_docs("users", UserDoc.from_dict)
	
	user_ids, user_texts = extract_text_ids(user_samples, question_order=QUESTION_ORDER)

	cluster_model, (group_indices, counts) = fit_model(user_texts)
	
	cluster_model.save_clusters()

	# TODO: Do we filter out new groups with only 1 match?
	# group_indices[counts >= MIN_MEMBER_PER_GROUP]

	index2group_id = {}
	for group_index in group_indices:

		# create group
		group_id = await add_doc("groups", {
			"friend_group": True,
			"member_ids": []
		})

		index2group_id[group_index] = group_id
		
		# find users matched with group
		matched_indices = cluster_model.suggestions[cluster_model.suggestions == group_index].sum(axis = 1) > 0

		# get corresponding user id
		matched_user_ids = user_ids[matched_indices]

		# get corresponding user suggestions
		matched_user_suggestions = cluster_model.suggestions[matched_indices]

		# get corresponding similarity scores
		matched_similarities = cluster_model.cosine_sims[matched_indices]

		# add group invitations for each user matched
		for _id, matched_suggestions, sims in zip(
			matched_user_ids.tolist(),
			matched_user_suggestions,
			matched_similarities):

			# add new invitiation 
			add_doc("invitations", {
				"user_id": _id,
				"group_id": group_id,
				"status": "pending",
				"similarity_matched": sims[matched_suggestions == group_index][0]
			})

	# Locally store index-to-group_firebase_id map
	store_path = os.path.join(os.path.dirname(__file__), "cluster/index_to_group_id.json")

	with open(store_path, "w") as store_json:
		json.dump(index2group_id, store_json)
	

if __name__ == "__main__":
	main()

