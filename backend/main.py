from fastapi import FastAPI, HTTPException
from utils.firestoreHelper import *
from utils.constants import NUM_SUGGESTIONS, QUESTION_ORDER
from utils.firestoreClasses import UserDoc
from utils.embeddingHelper import batch_text_to_embedding
from mock_data.mock_generator import MockUserGenerator
from cron_functions.cronHelper import extract_text_ids
import json, os
import numpy as np

app = FastAPI()

@app.get("/")
async def root():
	return {"message": "Hello World"}

# Endpoints TODO:
# - Cluster Results (Stored on Linode of cluster results and what algo is used)
# - Keep index of interest group embeddings with index of interest group names on Linode
# 	- updated daily
# - Interest Group Person Match
# - Interest Group Name Search
# - New user match to groups

@app.get("/friendMatches/")
async def friend_matches(user_id: str = None, num_suggestions: int = NUM_SUGGESTIONS):
	"""
	Create new group suggestions for user.

	Process:
	- get user doc
	- process question answers to embeddings
	- get specific features from cluster/feature_columns.json
	- if feature_columns does not exist, return None
	- find num suggestions by calculating the index of closest cluter centers
	- find ids of suggested friend groups through cluster/index_to_group_id.json
	- return friend group ids

	Args:
	- user_id: str = None, id of user to suggest groups for
	- num_suggestions: int = NUM_SUGGESTIONS, number of groups to suggest to user

	Returns:
	- added_groups: List[string], ids of suggested groups
	- similarites: List[float], euclidean distance similarity with each group
	"""
	if user_id is None:
		raise HTTPException(status_code = 400, detail = "Bad Request: user_id not provided")
	
	# Get user document
	doc = await get_doc("users", user_id, UserDoc.from_dict)
	
	if doc is None:
		raise HTTPException(status_code = 404, detail = "user not found")
	
	# Get user answer embedding
	_ids, texts = extract_text_ids([doc], question_order=QUESTION_ORDER)
	embeds = batch_text_to_embedding(texts)
	user_id = _ids[0]
	answer_embed = embeds[0]

	if not os.path.exists("cluster/feature_columns.json"):
		return None

	with open("cluster/feature_columns.json", "r") as col_json:
		feature_columns = json.load(col_json)
	
	# Get specific features from embedding
	features = np.take_along_axis(answer_embed, feature_columns, axis = 0)

	with open("cluster/clusters_today.npy", "rb") as cluster_npy:
		cluster_centers = np.load(cluster_npy)
	
	# Calculate distance between user answer and every cluster center
	expanded_features = features[np.newaxis, ...]

	euclidean_distance = ((cluster_centers - expanded_features) ** 2).sum(axis = 1)

	distance_sim = 1. / (1. + euclidean_distance)
	
	# Get suggestions
	sorted_suggestions = np.argsort(distance_sim, axis = 0)

	sorted_sims = np.take_along_axis(distance_sim, sorted_suggestions, axis = 0)

	with open("cluster/index_to_group_id.json", "r") as i2g_json:
		index2group_id = json.load(i2g_json)

	added_groups = []

	# Add invitation for every new suggestion
	for suggestion_index, sim in zip(sorted_suggestions.tolist()[:num_suggestions], sorted_sims.tolist()[:num_suggestions]):
		group_id = index2group_id[str(int(suggestion_index))]
		await add_doc("invitations", {
			"user_id": user_id,
			"group_id": group_id,
			"status": "pending",
			"similarity_matched": round(sim, 3)
		})

		added_groups.append(group_id)
	
	return {
		"added_groups": added_groups,
		"similarities": sorted_sims.tolist()[:num_suggestions]
	}

@app.get("/randomMockUsers")
async def random_mock_users(num_users: int = 1):
	some_questions = ["a", "b", "c", "d"]
	generator = MockUserGenerator(question_order=some_questions, max_words_per_answer=3)
	return generator.generate_multiple_samples(num_users)