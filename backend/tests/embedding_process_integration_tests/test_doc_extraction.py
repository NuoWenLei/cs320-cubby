from mock_data.mock_generator import MockUserGenerator
from utils.firestoreClasses import UserDoc
from utils.constants import QUESTION_ORDER
from utils.matchHelper import doc_to_id_and_embed

def test_extract_id_from_random_sample():
	generator = MockUserGenerator(question_order=QUESTION_ORDER, max_words_per_answer=5)
	samples = [UserDoc.from_dict(s) for s in generator.generate_multiple_samples(10, with_id = True)]
	for sample in samples:
		_id, _ = doc_to_id_and_embed(sample)
		assert sample._id == _id

def test_extract_embed_shape_from_random_sample():
	generator = MockUserGenerator(question_order=QUESTION_ORDER, max_words_per_answer=5)
	samples = [UserDoc.from_dict(s) for s in generator.generate_multiple_samples(10, with_id = True)]
	for sample in samples:
		_, embed = doc_to_id_and_embed(sample)
		assert embed.shape[0] == 400

