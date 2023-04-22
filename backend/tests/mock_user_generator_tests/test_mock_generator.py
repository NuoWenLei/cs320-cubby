from ...mock_data.mock_generator import MockUserGenerator

def test_random_words_less_than_or_equal_max():
	some_questions = ["a", "b", "c", "d"]
	num_trials = 10
	generator = MockUserGenerator(question_order=some_questions, max_words_per_answer=3)
	for _ in range(num_trials):
		assert 1 <= len(generator.get_random_words(3)) <= 3
	
def test_random_words_in_word_list():
	some_questions = ["a", "b", "c", "d"]
	num_trials = 3
	generator = MockUserGenerator(question_order=some_questions, max_words_per_answer=3)
	for _ in range(num_trials):
		assert generator.get_random_words(1)[0] in generator.word_list

def test_random_answer_open_and_end_w_text():
	some_questions = ["a", "b", "c", "d"]
	generator = MockUserGenerator(question_order=some_questions, max_words_per_answer=5)
	
	assert (not generator.get_random_answer().startswith(" "))
	assert (not generator.get_random_answer().endswith(" "))

def test_generate_samples():
	some_questions = ["a", "b", "c", "d"]
	generator = MockUserGenerator(question_order=some_questions, max_words_per_answer=5)
	samples = generator.generate_multiple_samples(50)
	for sample in samples:
		assert len(sample) == 3
		assert len(sample["questions"]) == len(some_questions)
	
	