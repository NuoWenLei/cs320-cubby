from .cluster.kmeans_cluster import KMeansCluster

# TODO:
# - Get all user samples from Firestore
# - Process all user samples in text embeddings
# - Fit with KMeansCluster
# - Save cluster data in KMeansCluster
# - Add matches to Firestore including KMeansCluster cosine similarity
# - Add friend group clusters to firestore
# - Record id of friend group clusters corresponding to their cluster center index
# - Store in cluster/index_to_group_id.json