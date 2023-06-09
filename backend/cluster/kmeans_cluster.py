from sklearn.cluster import KMeans
from typing import Union, List, Tuple
import numpy as np
import os
import json

class KMeansCluster():
	def __init__(self,
				 num_groups: int,
				 cluster_features: Union[int, List[int]],
				 num_suggestions: int,
				 data: np.ndarray
				 ):
		"""
		KMeansCluster clusters the data samples based on chosen features. This allows for more diverse clusters
		across different iterations. This class also calculates the cosine similarity between the samples and their
		suggested clusters.

		Args:
		- num_groups: int, number of groups (clusters) to fit the model
		- cluster_features: Union[int, List[int]]
			- if int, pick n random features to use as cluster features
			- if List[int], use features with index in the list as cluster features
		- num_suggestions: int, number of clusters to suggest to each sample
		- data: np.ndarray, samples of data to fit the model with, shape (num_users x num_features)
		"""
		assert num_suggestions <= num_groups, "Must have less number of suggestions than groups available"

		self.num_groups = num_groups
		self.num_suggestions = num_suggestions
		self.data_shape = data.shape

		if type(cluster_features) == int:
			assert self.data_shape[1] >= cluster_features, "Number of cluster features must be less than or equal to number of available features"
			cluster_features = np.random.choice(self.data_shape[1], cluster_features, replace = False)

		self.feature_columns = np.array(cluster_features)
		
		assert self.data_shape[1] >= len(cluster_features), "Number of cluster features must be less than or equal to number of available features"

		feature_data = data[:, cluster_features]
		self.fit_kmeans(feature_data)
		self.calc_euclidean_distance_score()

	def fit_kmeans(self, feature_data: np.ndarray):
		"""
		Fits a KMeans clustering model on features of samples and produces suggestions of clusters for each sample.
		Documentation: https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html

		Args:
		- self properties
			- num_groups: int, number of groups (clusters) to fit the model
			- num_suggestions: int, number of clusters to suggest to each sample
		- feature_data: np.ndarray, features of samples with shape (num_samples x num_features)

		Returns:
		- self properties
			- cluster_centers: np.ndarray, centers of groups (clusters) with shape (num_groups x num_features)
			- suggestions: np.ndarray, array of suggested cluster indices for each sample with shape (num_samples x num_suggestions)
		"""
		kmeans = KMeans(
			n_clusters=self.num_groups
		)
		cluster_distance = kmeans.fit_transform(feature_data)
		self.cluster_centers = kmeans.cluster_centers_

		sorted_suggestions = np.argsort(cluster_distance, axis = 1)

		self.suggestions = sorted_suggestions[:, :self.num_suggestions]
		self.cluster_distance_suggestions = np.take_along_axis(
			cluster_distance,
			sorted_suggestions,
			axis=0)[:, :self.num_suggestions]
	
	def calc_cosine_similarity(self, feature_data: np.ndarray):
		"""
		Calculates the cosine similarity between every sample and all of their suggested cluster centers.
		Definition and Formula for cosine similarity: https://en.wikipedia.org/wiki/Cosine_similarity

		Args:
		- self properties
			- cluster_centers: np.ndarray, centers of clusters with shape (num_groups x num_features)
			- suggestions: np.ndarray, array of suggested cluster indices for each sample with shape (num_samples x num_suggestions)
		- feature_data: np.ndarray, features of samples with shape (num_samples x num_features)

		Returns:
		- self.sims: np.ndarray, cosine similarity between each sample and all their suggested cluster centers
										with shape (num_samples x num_suggestions)
		"""
		# Shapes of data:
		# self.cluster_centers (num_groups x num_features)
		# self.suggestions (num_samples x num_suggestions)
		# feature_data (num_samples x num_features)

		# Indexing notation from: https://stackoverflow.com/a/5508404
		suggested_centers = self.cluster_centers[tuple(self.suggestions), ...] # (num_samples x num_suggestions x num_features)

		# Expand feature data for shape broadcasting
		expanded_data = feature_data[:, np.newaxis, ...] # (num_samples x 1 x num_features)
		
		# Dot product of feature data and suggested cluster centers
		# (num_samples x num_suggestions x num_features) . (num_samples x 1 x num_features) = (num_samples x num_suggestions)
		dot_prod = np.sum(suggested_centers * expanded_data, axis = -1)

		# Magnitude (L2-norm) of each vector sample
		feature_norm = np.sum(expanded_data ** 2, axis = -1) ** 0.5 # (num_samples x 1)

		# Magnitude (L2-norm) of each cluster center suggestion of each sample
		cluster_norm = np.sum(suggested_centers ** 2, axis = -1) ** 0.5 # (num_samples x num_suggestions)

		# Magnitudes to be divided from dot product
		norms = cluster_norm * feature_norm

		# Calculate cosine similarities through elementwise division
		# (num_samples x num_suggestions) / (num_samples x num_suggestions) = (num_samples x num_suggestions)
		self.sims = dot_prod / norms

	def calc_euclidean_distance_score(self):
		"""
		Calculates the euclidean distance score between every sample and all of their suggested cluster centers.
		More information on Euclidean Distance score: https://stats.stackexchange.com/questions/53068/euclidean-distance-score-and-similarity

		Args:
		- self properties
			- cluster_centers: np.ndarray, centers of clusters with shape (num_groups x num_features)
			- suggestions: np.ndarray, array of suggested cluster indices for each sample with shape (num_samples x num_suggestions)
		- feature_data: np.ndarray, features of samples with shape (num_samples x num_features)

		Returns:
		- self.sims: np.ndarray, distance similarity between each sample and all their suggested cluster centers
										with shape (num_samples x num_suggestions)
		"""
		self.sims = 1. / (1. + self.cluster_distance_suggestions)

	def save_clusters(self) -> Tuple[str, str]:
		"""
		Saves relevant cluster data to the corresponding paths:
		- cluster/clusters_today.npy: cluster centers
		- cluster/feature_columns.json: list of column indices used as features

		Args:
		- self.properties
			- self.cluster_centers: np.ndarray, cluster centers
			- self.feature_columns: np.ndarray, feature column indices

		Returns:
		- Tuple[str, str], contains the cluster center file path (.npy) and feature column file path (.json)
		"""
		npy_path = os.path.join(os.path.dirname(__file__), "clusters_today.npy")
		feature_path = os.path.join(os.path.dirname(__file__), "feature_columns.json")
		with open(npy_path, "wb") as npy:
			np.save(npy, self.cluster_centers)
		
		with open(feature_path, "w") as f:
			json.dump(self.feature_columns.tolist(), f)

		return (npy_path, feature_path)
			