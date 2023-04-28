from utils.matchHelper import calculate_suggestions_and_similarities
import numpy as np, os

def test_suggestion_with_mock_data():
	col_path = os.path.join(os.path.dirname(__file__), "mockFeatures.json")
	cluster_path = os.path.join(os.path.dirname(__file__), "mockCluster.npy")
	answer_embed = np.array([
		0., 1., 5.
	])

	suggests, sims = calculate_suggestions_and_similarities(col_path, cluster_path, answer_embed)

	assert sims[0] == 1.
	assert suggests[0] == 0

def test_matched_with_second():
	col_path = os.path.join(os.path.dirname(__file__), "mockFeatures.json")
	cluster_path = os.path.join(os.path.dirname(__file__), "mockCluster.npy")
	answer_embed = np.array([
		7., 3., 4.
	])

	suggests, sims = calculate_suggestions_and_similarities(col_path, cluster_path, answer_embed)

	assert sims[0] == 1.
	assert suggests[0] == 1

def test_not_perfect_match():
	col_path = os.path.join(os.path.dirname(__file__), "mockFeatures.json")
	cluster_path = os.path.join(os.path.dirname(__file__), "mockCluster.npy")
	answer_embed = np.array([
		1., 1., 5.
	])

	suggests, sims = calculate_suggestions_and_similarities(col_path, cluster_path, answer_embed)

	assert sims[0] == 0.5
	assert suggests[0] == 0

