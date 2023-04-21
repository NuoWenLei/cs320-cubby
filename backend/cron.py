from cluster.kmeans_cluster import KMeansCluster
from utils.firestoreHelper import get_all_docs, add_doc
from utils.firestoreClasses import UserDoc
from utils.constants import QUESTION_ORDER, NUM_GROUPS, NUM_SUGGESTIONS, MIN_MEMBER_PER_GROUP
from utils.embeddingHelper import batch_text_to_embedding
import numpy as np, json, os

# Process:
# - Get all user samples from Firestore
# - Process all user samples in text embeddings
# - Fit with KMeansCluster
# - Save cluster data in KMeansCluster
# - Add friend group clusters to firestore
# - Add matches to Firestore including KMeansCluster cosine similarity
# - Record id of friend group clusters corresponding to their cluster center index
# - Store in cluster/index_to_group_id.json

async def main():
	user_samples = get_all_docs("users", UserDoc.from_dict)
	user_texts = []
	user_ids = []
	for user in user_samples:
		if user.question_answers is None:
			continue
		texts = []
		for question in QUESTION_ORDER:
			answer = user.question_answers.get(question)
			if answer is None:
				answer = ""
			texts.append(answer)
		user_texts.append(texts)
		user_ids.append(user._id)

	user_ids = np.array(user_ids)
	
	# shape of user_embeds: (num_users x (50 * num_questions))
	user_embeds: np.ndarray = batch_text_to_embedding(user_texts)
	cluster_model = KMeansCluster(
				num_groups=NUM_GROUPS,
				cluster_features = 50,
				num_suggestions=NUM_SUGGESTIONS,
				data = user_embeds)
	
	cluster_model.save_clusters()

	group_indices, counts = np.unique(cluster_model.suggestions.reshape((-1, )))

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

	store_path = os.path.join(os.path.dirname(__file__), "cluster/index_to_group_id.json")

	with open(store_path, "w") as store_json:
		json.dump(index2group_id, store_json)
	

if __name__ == "__main__":
	main()

