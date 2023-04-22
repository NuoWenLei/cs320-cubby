from utils.embeddingHelper import *

def test_embed_shape():
    embed = load_embedding()
    assert embed.shape == (400000, 50)

def test_word_index_length():
    word2index = load_word_index()
    assert len(word2index) == 400000

def test_text_to_embedding_ignores_minor_difference():
    embed = load_embedding()
    word2index = load_word_index()
    word1 = "FoOd"
    word2 = "Food"
    word3 = "food"
    word4 = "food   "
    assert \
        text_to_embedding(word1, word2index, embed).sum() == text_to_embedding(word2, word2index, embed).sum()\
        == text_to_embedding(word3, word2index, embed).sum() == text_to_embedding(word4, word2index, embed).sum()
    assert text_to_embedding(word1, word2index, embed).sum() != 0.

def test_text_to_embedding_sentence_remove_stopwords():
    embed = load_embedding()
    word2index = load_word_index()
    
    sentence = "Hello, world! Today is a good day."
    sent_embed = text_to_embedding(sentence, word2index, embed)
    word1 = text_to_embedding("hello", word2index, embed)
    word2 = text_to_embedding("world", word2index, embed)
    word3 = text_to_embedding("today", word2index, embed)
    word4 = text_to_embedding("good", word2index, embed)
    word5 = text_to_embedding("day", word2index, embed)
    word_sum = word1 + word2 + word3 + word4 + word5

    # Assert difference is trivial
    assert abs(sent_embed.sum() - word_sum.sum() / 5.) < 0.01
