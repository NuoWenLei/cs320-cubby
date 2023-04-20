from ...utils.helper import filter_to_letters

def test_filter_lowercase_letters():
    string = "I lOve to eAt Food"
    assert filter_to_letters(string) == " lve to et ood"
    
def test_filter_punctuation():
    string = "i love to eat food! i eat twice2 a day."
    assert filter_to_letters(string) == "i love to eat food i eat twice a day"
    
def test_filter_empty_string():
    assert filter_to_letters("") == ""
    
	