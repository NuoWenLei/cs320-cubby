from fastapi import FastAPI

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

# @app.get("/")