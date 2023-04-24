from mock_data.mock_generator import MockUserGenerator
from utils.constants import QUESTION_ORDER
from utils.firestoreHelper import add_doc

def main():
    mock_gen = MockUserGenerator(QUESTION_ORDER, max_words_per_answer=5)
    mock_samples = mock_gen.generate_multiple_samples(100, with_id = False)
    for sample in mock_samples:
        _id = add_doc("users", sample)
        print(_id)
        
if __name__ == "__main__":
    main()