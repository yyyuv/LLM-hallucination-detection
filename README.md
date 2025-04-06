# LLM-hallucination-detection
Hallucination Detection in Vision-Language Models

**Team Members**: Yuval Reuveni, Yoav Kor, Yuval Assif, Ohad Carmel  
**Advisors**: Dr. Yuval Pinter, Mr. Nitay Calderon

## 🔍 Overview

Large Language Models often generate **confident yet inaccurate (hallucinated)** content. Our project focuses on hallucinations in **vision-language models**, specifically [LLaVA](https://llava-vl.github.io/), which generates image descriptions.

We aim to:
- **Evaluate** how hallucinations and hedging affect human trust.
- **Build a model** that identifies hallucinated tokens in generated captions.

## 🧪 Experiment

Users were shown:
1. A model-generated image description.
2. A follow-up statement.
3. Asked to:
   - Judge the truth (True/False).
   - Bet “coins” to express trust.

We measured whether hallucinated or hedged tokens affected user confidence and accuracy.

## 🧠 Model

We fine-tuned a BERT-based classifier to detect hallucinated tokens:
- Inputs: LLaVA descriptions + token-level logits.
- Output: Binary hallucination prediction for each token.
- Achieved F1 ≈ 0.59

## 🛠️ Tech Stack

- **Frontend**: React, Material-UI
- **Backend**: Node.js, Express, MongoDB
- **ML**: Transformers (Huggingface), BERT, matplotlib, pandas

## 📁 Project Structure
. ├── src/ # Codebase ├── data/ # Input CSVs ├── results/ # Output predictions ├── frontend/ # React app ├── presentation/ # Final presentation
