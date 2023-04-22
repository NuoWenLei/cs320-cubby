from cron_functions.cronHelper import extract_text_ids, fit_model
from mock_data.mock_generator import MockUserGenerator
from utils.firestoreClasses import UserDoc
import numpy as np

def test_extraction_size():
	some_questions = ["a", "b", "c", "d"]
	generator = MockUserGenerator(some_questions, max_words_per_answer=3)
	samples = generator.generate_multiple_samples(50, with_id = True)
	docs = [UserDoc.from_dict(sample) for sample in samples]
	user_ids, user_texts = extract_text_ids(docs, some_questions)
	assert len(user_ids) == 50
	assert sum([len(texts) for texts in user_texts]) == 50 * len(some_questions)

def test_extraction_content():
	some_questions = ["a", "b", "c", "d"]
	generator = MockUserGenerator(some_questions, max_words_per_answer=3)
	samples = generator.generate_multiple_samples(50, with_id = True)
	docs = [UserDoc.from_dict(sample) for sample in samples]
	user_ids, _ = extract_text_ids(docs, some_questions)
	
	assert (user_ids == np.array([doc._id for doc in docs])).all()

def test_model_fit():
	some_questions = ["a", "b", "c", "d"]
	generator = MockUserGenerator(some_questions, max_words_per_answer=3)
	samples = generator.generate_multiple_samples(50, with_id = True)
	docs = [UserDoc.from_dict(sample) for sample in samples]
	_, user_texts = extract_text_ids(docs, some_questions)
	cluster_model, _ = fit_model(user_texts)

	# Suggestion shape
	assert cluster_model.suggestions.shape[0] == 50
	assert cluster_model.suggestions.shape[1] == cluster_model.num_suggestions

	# Cosine similarity shape
	assert cluster_model.suggestions.shape[0] == cluster_model.cosine_sims.shape[0]
	assert cluster_model.suggestions.shape[1] == cluster_model.cosine_sims.shape[1]

	# Cosine similarity always lower than 100%
	assert (cluster_model.cosine_sims <= 1.).all()