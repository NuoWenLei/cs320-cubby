from utils.firestoreHelper import get_all_docs, add_doc
from utils.firestoreClasses import UserDoc
from utils.constants import QUESTION_ORDER, NUM_FEATURES_PER_QUESTION, NUM_FEATURES
from cron_functions.cronHelper import extract_text_ids, fit_model, get_random_group_name
import numpy as np
import json, os, asyncio

async def add_friend_groups():
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
	user_samples = await get_all_docs("users", UserDoc.from_dict)

	print(f"Number of user samples: {len(user_samples)}")
	
	user_ids, user_texts = extract_text_ids(user_samples, question_order=QUESTION_ORDER)

	cluster_model, (group_indices, counts) = fit_model(user_texts)
	
	cluster_model.save_clusters()

	all_unique_features = [0 for _ in range(len(QUESTION_ORDER))]

	(unique_features, feature_counts) = np.unique(np.int32(cluster_model.feature_columns / float(NUM_FEATURES_PER_QUESTION)), return_counts=True)

	for f, c in zip(unique_features.tolist(), (feature_counts.astype("float32") / float(NUM_FEATURES)).tolist()):
		all_unique_features[int(f)] = round(c, 3) 

	# TODO: Do we filter out new groups with only 1 match?
	# group_indices[counts >= MIN_MEMBER_PER_GROUP]

	index2group_id = {}
	for group_index in group_indices:

		# create group
		group_id = await add_doc("groups", {
			"name": get_random_group_name(),
			"friend_group": True,
			"feature_dist": all_unique_features,
			"member_ids": []
		})

		index2group_id[str(int(group_index))] = group_id
		
		# find users matched with group
		matched_indices = (cluster_model.suggestions == group_index).sum(axis = 1) > 0

		if len(matched_indices) == 0:
			continue

		# get corresponding user id
		matched_user_ids = user_ids[matched_indices]

		# get corresponding user suggestions
		matched_user_suggestions = cluster_model.suggestions[matched_indices]

		# get corresponding similarity scores
		matched_similarities = cluster_model.sims[matched_indices]

		# add group invitations for each user matched
		for _id, matched_suggestions, sims in zip(
			matched_user_ids.tolist(),
			matched_user_suggestions,
			matched_similarities):

			print({
				"user_id": _id,
				"group_id": group_id,
				"status": "pending",
				"similarity_matched": round(sims[matched_suggestions == group_index][0], 3)
			})

			# add new invitiation 
			await add_doc("invitations", {
				"user_id": _id,
				"group_id": group_id,
				"status": "pending",
				"similarity_matched": round(sims[matched_suggestions == group_index][0], 3)
			})

	print(f"Index to group id: {index2group_id}")

	# Locally store index-to-group_firebase_id map
	store_path = os.path.join(os.path.dirname(__file__), "cluster/index_to_group_id.json")

	with open(store_path, "w") as store_json:
		json.dump(index2group_id, store_json)

async def add_interest_group_invites():
	"""
	Function for daily interest group suggestions.

	Idea 1:
	- choose random interest groups to suggest to each user

	Idea 2:
	- find most similar interest groups to user questions
	"""
	pass
	

if __name__ == "__main__":
	asyncio.run(add_friend_groups())

