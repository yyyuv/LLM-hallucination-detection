import pandas as pd
import ast
# import numpy as np
from transformers import AutoProcessor
# from sklearn.metrics import accuracy_score, precision_recall_fscore_support
import matplotlib.pyplot as plt
from transformers import BertTokenizer
from itertools import zip_longest
import os.path


# Load the processor
processor = AutoProcessor.from_pretrained('llava-hf/llava-1.5-7b-hf')
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

# Set the threshold and small epsilon value
epsilon = 1


# Function to parse logits from the combined columns
def parse_logits(row):
    logits = row['logits']
    if not pd.isna(row['logits continutaion (if needed)']):
        cont = row['logits continutaion (if needed)']
        logits += cont
    return logits


# Function to get probabilities for a token
def get_probability(token, token_dict):
    return token_dict.get(token, epsilon)


def assign_labels_to_words(hallucination):
    words = hallucination.split()
    true_labels = []
    inside_hallucination = False
    for i, word in enumerate(words):
        if '[' in word:
            inside_hallucination = True
        if inside_hallucination:
            true_labels.append((word, True))
        else:
            true_labels.append((word, False))
        if ']' in word:
            inside_hallucination = False
    return true_labels


def map_words_to_tokens(tokens):
    tokens_fixed = [token.replace("▁", " ").replace('<0x0A>', ' ') for token in tokens]
    word_to_tokens = []
    current_word = ""
    token_index = 0
    tokens_in_current_word = []
    for token in tokens_fixed:
        if token.startswith(" "):
            if current_word:
                word_to_tokens.append((current_word, tokens_in_current_word))
            current_word = token.strip()
            tokens_in_current_word = []
        else:
            current_word += token
        tokens_in_current_word.append(token)
    if current_word:
        word_to_tokens.append((current_word, tokens_in_current_word))
    return word_to_tokens


def word_probs_from_tokens(tokens_lists_grouped_by_words, logits_list):
    words_probs_by_order = []
    token_index = 0
    for token_group in tokens_lists_grouped_by_words:
        prob = 1
        for j in range(len(token_group)):
            prob *= float(get_probability(token_group[j], logits_list[token_index]))
        words_probs_by_order.append(prob)
        token_index += len(token_group)
    return words_probs_by_order


# Read the CSV file
df = pd.read_csv(os.path.join(os.path.dirname(__file__), "Ohad's LLM-uncertainty - Sheet1.csv"))

# Combine logits columns
df = df.dropna(subset=['logits'])
df['logits'] = df.apply(parse_logits, axis=1)

# Initialize dictionaries to store results
threshold_to_accuracy = {}
threshold_to_f1 = {}

# Iterate through the thresholds
results = []
for index, row in df.iterrows():
    hallucination = row['hallucinations']
    description = row['description'].replace('\n', '').replace('<0x0A>', '\n')
    ends_with_space = description.strip() != description
    description = description.strip()
    try:
        logits_list = ast.literal_eval(row['logits'])
    except Exception as e:
        print(f'ERROR 1 [{index}]: {e}')
        continue
    if type(hallucination) is not str or type(logits_list) is not list or len(logits_list) == 0:
        print(f'ERROR 2 [{index}]: {type(hallucination) is not str}, {type(logits_list) is not list}, {len(logits_list)}')
        continue
    tokens = processor.tokenizer.tokenize(description)
    # tokens = tokenizer(description, padding=True, truncation=True, is_split_into_words=True)
    if len(tokens) != len(logits_list):
        print(f'ERROR 3 [{index}]: {len(tokens)} != {len(logits_list)}, {ends_with_space}')
        zipped = list(zip_longest(tokens, logits_list))
        continue

    hallucination = hallucination.replace('\n', '').replace('<0x0A>', '\n')
    words_with_labels = assign_labels_to_words(hallucination)
    words_by_order, labels_by_order = description.split(), [wl[1] for wl in words_with_labels]
    words_to_tokens = map_words_to_tokens(tokens)
    tokens_lists_grouped_by_words = [tokens for _, tokens in words_to_tokens]
    tokens_with_labels = [(token, label) for (token, label) in zip(tokens_lists_grouped_by_words, labels_by_order)]

    words_probs_by_order = word_probs_from_tokens(tokens_lists_grouped_by_words, logits_list)

    # predictions_by_order = [True if word_prob < threshold else False for word_prob in words_probs_by_order]

    if len(words_by_order) != len(words_probs_by_order) or len(words_by_order) != len(labels_by_order):
        print(f"ERROR 4 [{index}]: {len(words_by_order)}, {len(words_probs_by_order)}, {len(labels_by_order)}")
        continue

    results.append({
        'words': words_by_order,
        'word_probs': words_probs_by_order,
        'word_labels': labels_by_order,
    })

results_df = pd.DataFrame(results)
# words = results_df["words"].tolist()
# labels = results_df["labels"].tolist()
# probs = results_df["probs"].tolist()
results_df.to_csv(os.path.join(os.path.dirname(__file__), "nlp-results-df-yuval.csv"))
print("Done")


# all_true_labels = []
# all_predictions = []
#
# for index, row in results_df.iterrows():
#     all_true_labels.extend(row['true_labels'])
#     all_predictions.extend(row['predictions'])

# accuracy = accuracy_score(all_true_labels, all_predictions)
# precision, recall, f1, _ = precision_recall_fscore_support(all_true_labels, all_predictions, average='binary')
#
# threshold_to_accuracy[threshold] = accuracy
# threshold_to_f1[threshold] = f1

# Plotting accuracy and F1 score
# thresholds = list(threshold_to_accuracy.keys())
# accuracies = list(threshold_to_accuracy.values())
# f1_scores = list(threshold_to_f1.values())
#
# plt.figure(figsize=(10, 6))
# plt.plot(thresholds, accuracies, label='Accuracy', color='blue')
# plt.plot(thresholds, f1_scores, label='F1 Score', color='green')
# plt.xlabel('Threshold')
# plt.ylabel('Score')
# plt.title('Accuracy and F1 Score by Threshold')
# plt.legend()
# plt.grid(True)
# plt.show()
