from __future__ import absolute_import
from ..utils.helper import *

def test_embed_shape():
    embed = load_embedding()
    assert embed.shape == (400000, 50)

def test_word_index_length():
    word2index = load_word_index()
    assert len(word2index) == 400000