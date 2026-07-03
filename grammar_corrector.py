import re

def correct_grammar(text):
    """
    Corrects common grammatical errors in the given text using regular expressions.

    Corrections include:
    - Replacing multiple spaces with single spaces
    - Correcting "its" to "it's" (case-insensitive, assuming contraction)
    - Adding missing periods at the end of sentences (before capital letters or at end)
    - Capitalizing the first letter of the text

    Args:
    text (str): The input text to correct.

    Returns:
    str: The corrected text.
    """
    if not text:
        return text

    # Replace multiple spaces with single space
    text = re.sub(r' +', ' ', text)

    # Correct "its" to "it's" (case-insensitive, replacing " its " with " it's ")
    text = re.sub(r' its ', " it's ", text, flags=re.IGNORECASE)

    # Add periods before capital letters that follow lowercase letters (indicating new sentences)
    text = re.sub(r'([a-z])\s+([A-Z])', r'\1. \2', text)

    # Add period at the end if it ends with a lowercase letter
    if text and text[-1].islower():
        text += '.'

    # Capitalize the first letter of the text
    text = text[0].upper() + text[1:] if text else text

    return text

# Example usage
if __name__ == "__main__":
    # Test cases from the task
    input1 = "Its a sunny day Are you coming"
    output1 = correct_grammar(input1)
    print(f"Input: '{input1}'")
    print(f"Output: '{output1}'")

    input2 = "india                  is our country"
    output2 = correct_grammar(input2)
    print(f"Input: '{input2}'")
    print(f"Output: '{output2}'")