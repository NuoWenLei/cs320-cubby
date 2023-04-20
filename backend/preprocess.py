import numpy as np
import json

def main():
	embeddings_index = {}
	
	with open("embed_data/glove.6B.50d.txt", "r") as f:
		for line in f:
			word, coefs = line.split(maxsplit=1)
			coefs = np.fromstring(coefs, "f", sep=" ")
			embeddings_index[word] = coefs
	
	word_indices = []
	embeddings = np.zeros((len(embeddings_index), 50))
	hits = 0
	misses = 0
	for i, w in enumerate(embeddings_index.keys()):
		vec = embeddings_index.get(w)
		if vec is not None:
			embeddings[i] = vec
			word_indices.append([i, w])
			hits += 1
		else:
			misses += 1
	
	embeddings_matrix = embeddings[:len(word_indices), :].astype("float32")
	print(f"Misses vs Hits: {misses} vs {hits}")
	with open("embed_data/word_embed.npy", "wb") as embed_npy:
		np.save(embed_npy, embeddings_matrix)
	
	with open("embed_data/word_index.json", "w") as index_json:
		json.dump(word_indices, index_json)

if __name__ == "__main__":
	main()
