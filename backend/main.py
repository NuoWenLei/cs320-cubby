from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from utils.matchHelper import calculate_suggestions_and_similarities, doc_to_id_and_embed
from utils.searchHelper import search
from utils.firestoreHelper import *
from utils.constants import NUM_SUGGESTIONS
from utils.firestoreClasses import UserDoc, GroupDoc
from mock_data.mock_generator import MockUserGenerator
import json, os


# Local run command:
# uvicorn main:app --reload

# Server run command:
# uvicorn main:app --host 0.0.0.0

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/interestSearch")
async def interest_search(q: str = None):
	"""
	Search for interest groups most relevant to query.

	Process:
	- get interest group docs
	- process interest group names to embeddings
	- process query to embeddings
	- sort by closest interest groups to query
	- return all interest groups in that order

	Args:
	- q: str = None, query of user
	
	Returns:
	- ordered_ids: List[str], list of group ids
	- ordered_sims: List[float], list of similarity of each group with query

	Throws:
	- HTTPException when there is a bad request or internal server error
	"""
	if q is None:
		raise HTTPException(status_code = 400, detail = "Bad Request: query not provided")
	
	interest_groups = await get_all_docs("groups", GroupDoc.from_dict, ("friend_group", "==", False))

	sorted_group_ids, sorted_sims = search(interest_groups, q)

	return {
		"ordered_ids": sorted_group_ids.tolist(),
		"ordered_sims": sorted_sims.tolist()
	}

@app.get("/friendMatches")
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

	Throws:
	- HTTPException when there is a bad request or internal server error
	"""
	if user_id is None:
		raise HTTPException(status_code = 400, detail = "Bad Request: user_id not provided")
	
	# Get user document
	doc = await get_doc("users", user_id, UserDoc.from_dict)
	
	if doc is None:
		raise HTTPException(status_code = 404, detail = "user not found")

	user_id, answer_embed = doc_to_id_and_embed(doc)

	column_path = os.path.join(os.path.dirname(__file__), "cluster/feature_columns.json")

	cluster_path = os.path.join(os.path.dirname(__file__), "cluster/clusters_today.npy")

	if not (os.path.exists(column_path) and os.path.exists(cluster_path)):
		raise HTTPException(status_code = 404, detail = "Serverside data not found")
	
	sorted_suggestions, sorted_sims = calculate_suggestions_and_similarities(column_path, cluster_path, answer_embed)

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