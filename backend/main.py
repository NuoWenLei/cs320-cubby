from fastapi import FastAPI, HTTPException
from .utils.firestoreHelper import *
from .utils.constants import NUM_SUGGESTIONS

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
    if user_id is None:
        raise HTTPException(status_code = 400, detail = "Bad Request: user_id not provided")
    # TODO:
    # - get user doc
    # - process question answers to embeddings
    # - get specific features from cluster/feature_columns.json
    # - if feature_columns does not exist, return None
    # - find num suggestions by calculating the index of closest cluter centers
    # - find ids of suggested friend groups through cluster/index_to_group_id.json
    # - return friend group ids