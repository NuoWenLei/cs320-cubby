from typing import List, Dict
import numpy as np, json, os

lowercase_letters = "abcdefghijklmnopqrstuvwxyz "

stopwords = {"ourselves", "hers", "between", "yourself", "but", "again", "there", "about", "once", "during", "out", "very", "having", "with", "they", "own", "an", "be", "some", "for", "do", "its", "yours", "such", "into", "of", "most", "itself", "other", "off", "is", "s", "am", "or", "who", "as", "from", "him", "each", "the", "themselves", "until", "below", "are", "we", "these", "your", "his", "through", "don", "nor", "me", "were", "her", "more", "himself", "this", "down", "should", "our", "their", "while", "above", "both", "up", "to", "ours", "had", "she", "all", "no", "when", "at", "any", "before", "them", "same", "and", "been", "have", "in", "will", "on", "does", "yourselves", "then", "that", "because", "what", "over", "why", "so", "can", "did", "not", "now", "under", "he", "you", "herself", "has", "just", "where", "too", "only", "myself", "which", "those", "i", "after", "few", "whom", "t", "being", "if", "theirs", "my", "against", "a", "by", "doing", "it", "how", "further", "was", "here", "than"} 

def batch_text_to_embedding(batch: List[str]) -> List[np.ndarray]:
	"""
	Converts text batch each to an embedding.
	If text is a sentence, then remove punctuation and stopwords, then average the word embedding.
	If text is a word, then remove punctuation and return corresponding word embedding.

	Args:
	- batch: List[str], batch of text to convert to embedding

	Returns:
	- List[np.ndarray], embeddings of text batch, each of shape (50,)
	"""
	word_embed = load_embedding()
	word_index = load_word_index()

	embeds = []
	for text in batch:
		embeds.append(text_to_embedding(text, word_index, word_embed))
	
	return embeds

def load_embedding() -> np.ndarray:
	"""
	Loads embedding from embedding file.
	Embedding is taken from the pre-trained GloVe embeddings with 50 dimensions.

	Args:
	- None

	Returns:
	- np.ndarray, GloVe word embeddings of shape (400000, 50)
	"""
	path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "embed_data/word_embed.npy")
	with open(path, "rb") as embed_npy:
		embed = np.load(embed_npy)
	return embed

def load_word_index() -> Dict[str, int]:
	"""
	Loads word-to-index dictionary from word index file.

	Args:
	- None

	Returns:
	- Dict[str, int], word-to-index dictionary
	"""
	path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "embed_data/word_index.json")
	with open(path, "r") as index_json:
		word_index = json.load(index_json)
	return word_index

def filter_to_letters(text: str) -> str:
	"""
	Filters letters of text and keep only lowercase alphabets and spaces.

	Args:
	- text: str, text to filter

	Returns:
	- str, text after filter
	"""
	return "".join([l for l in text if l in lowercase_letters])

def text_to_embedding(
		text: str,
		word_index: Dict[str, int],
		word_embed: np.ndarray
		) -> np.ndarray:
	"""
	Converts from text to embedding.
	If text is a sentence, then remove punctuation and stopwords, then average the word embedding.
	If text is a word, then remove punctuation and return corresponding word embedding.

	Args:
	- text: str, text to convert to embedding
	- word_index: Dict[str, int], dictionary that maps words to index
	- word_embed: np.ndarray, word embedding

	Returns:
	- np.ndarray, embedding of text of shape (50,)
	"""
	filtered_text = filter_to_letters(text.strip().lower())
	words = [w for w in filtered_text.split(" ") if w != ""]
	vec = np.zeros((word_embed.shape[1],))
	if len(words) > 1:
		missed = 0
		for w in words:
			if w in stopwords:
				missed += 1
				continue
			index = word_index.get(w)
			if index is None:
				missed += 1
				continue
			vec += word_embed[index]
		vec = vec / (len(words) - missed)
	else:
		w = words[0]
		index = word_index.get(w)
		if w is not None:
			vec = word_embed[index]
	
	return vec

if __name__ == "__main__":
	res = load_embedding()
	print(res.shape)

    