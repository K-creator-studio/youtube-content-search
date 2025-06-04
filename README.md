An intelligent web-based application that extracts key content from lecture documents (PDF, Word, PPTX, or image), searches YouTube for the most relevant videos, and displays matching video segments based on transcript similarity — saving time and enhancing learning.

🔍 Key Features

📄 Lecture Document Reader
Supports multiple formats: PDF, Word, PowerPoint, and JPG images.

🔠 Keyword Extraction & NLP Matching
Extracts text from uploaded documents and applies advanced NLP techniques for keyword detection and semantic analysis.

🔗 Automated YouTube Video Search
Uses the YouTube Data API to fetch videos based on document titles and engagement metrics (likes, views, comments).

🧠 Transcript Extraction & Matching
Retrieves video transcripts, summarizes them using BART, and compares them with document content using TF-IDF + Cosine Similarity.

🎯 Smart Video Segment Display
Only displays the specific part of a YouTube video where the transcript matches ≥75% with the document — no need to watch full videos.

👤 User Authentication
Supports signup/login to save and manage searched content.


💡 How It Works

1. User uploads a lecture document.


2. System extracts text and identifies the topic/title.


3. Relevant YouTube videos are searched and filtered.


4. Transcripts are fetched and summarized.


5. Cosine similarity is calculated between lecture content and video transcripts.


6. Top matching segment(s) are displayed with video timestamp.



🛠️ Tech Stack

Frontend: HTML, CSS, React.js

Backend: Python (Flask), MySQL (PHPMyAdmin)

AI/ML Libraries: TensorFlow, PyTorch, NLTK, Transformers (BART, TF-IDF)

APIs: YouTube Data API

Tools: Visual Studio Code, Jupyter, Google Colab


⚙️ Future Enhancements

Support for lecture folder uploads

Video recommendation history per user

Voice-based search input

Enhanced accuracy with LLM fine-tuning


🧠 Purpose

This application aims to reduce the time students and teachers spend searching for the right educational content on YouTube by providing accurate, context-aware video suggestions. It bridges lecture material with real-time learning media using NLP and AI.
