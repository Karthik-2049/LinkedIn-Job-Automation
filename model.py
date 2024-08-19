from transformers import pipeline

# Load the question-answering pipeline
qa_pipeline = pipeline(model = "deepset/roberta-base-squad2")

# Define the context paragraph
context = """
Machine learning is a branch of artificial intelligence (AI) focused on building applications
that learn from data and improve their accuracy over time without being programmed to do so.
In data science, an algorithm is a sequence of statistical processing steps. In machine learning,
algorithms are 'trained' to find patterns and features in massive amounts of data in order to make decisions and predictions
based on new data. The better the algorithm, the more accurate the decisions and predictions will become as it processes more data.
"""

# Define your question
question = "Is Machine Learning a branch of artificial Intelligence? Yes or No"

# Get the answer using the pipeline
result = qa_pipeline(question=question, context=context)

# Print the answer
print(f"Answer: {result['answer']}")
print(f"Score : {result['score']}")
