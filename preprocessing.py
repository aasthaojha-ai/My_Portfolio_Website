import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Robust NLTK data initialization for Streamlit Cloud
def initialize_nltk():
    """Ensures required NLTK resources are available."""
    resources = ['punkt', 'punkt_tab', 'stopwords']
    for res in resources:
        try:
            if res == 'stopwords':
                nltk.data.find('corpora/stopwords')
            elif 'punkt' in res:
                nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download(res)

# Run initialization once on import
initialize_nltk()

def clean_text(text):
    """
    Cleans the input text: lowercase, removes punctuation, tokenizes, and removes stopwords.
    """
    if not text:
        return ""
        
    # 1. Lowercase conversion
    text = text.lower()
    
    # 2. Punctuation removal
    text = re.sub(r'[^\w\s]', ' ', text)
    
    # 3. Tokenization
    try:
        tokens = word_tokenize(text)
    except Exception:
        # Fallback if word_tokenize fails for any reason
        tokens = text.split()
    
    # 4. Stopword removal
    try:
        stop_words = set(stopwords.words('english'))
    except Exception:
        stop_words = set()
        
    cleaned_tokens = [word for word in tokens if word not in stop_words and word.strip()]
    
    return " ".join(cleaned_tokens)

# Predefined skill database
SKILL_DATABASE = [
    "python", "sql", "machine learning", "power bi", "java", "c++", "c#", "data analysis", 
    "nlp", "deep learning", "tensorflow", "pytorch", "aws", "azure", "gcp", "docker", 
    "kubernetes", "git", "linux", "javascript", "react", "node.js", "html", "css",
    "excel", "tableau", "statistics", "mathematics", "agile", "scrum",
    "pandas", "numpy", "scikit-learn", "matplotlib", "seaborn", "keras", "opencv",
    "apache spark", "hadoop", "mongodb", "postgresql", "mysql", "snowflake",
    "langchain", "prompt engineering", "r", "generative ai"
]

def extract_skills(text):
    """
    Extracts skills from text by matching against a predefined skill database using regex.
    """
    text = text.lower()
    detected_skills = []
    
    for skill in SKILL_DATABASE:
        escaped_skill = re.escape(skill)
        # Use lookarounds to ensure whole word matches
        pattern = r'(?<!\w)' + escaped_skill + r'(?!\w)'
        
        if re.search(pattern, text):
            detected_skills.append(skill)
            
    return detected_skills
