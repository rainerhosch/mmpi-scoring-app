from bs4 import BeautifulSoup
import re
from database import SessionLocal
import models

def main():
    print("Reading HTML file...")
    html = open('../docs/soal.html.php', 'r', encoding='utf-8').read()
    soup = BeautifulSoup(html, 'html.parser')

    texts = soup.stripped_strings

    questions = []
    current_q = ''
    for t in texts:
        if re.match(r'^\d+\.', t):
            if current_q:
                questions.append(current_q)
            current_q = t
        elif current_q:
            current_q += ' ' + t

    if current_q:
        questions.append(current_q)

    # Clean the questions
    cleaned_questions = []
    for q in questions:
        # Remove extra whitespace
        q_clean = re.sub(r'\s+', ' ', q).strip()
        
        # Extract number and text
        match = re.match(r'^(\d+)\.\s*(.*)', q_clean)
        if match:
            num = int(match.group(1))
            text = match.group(2).strip()
            cleaned_questions.append({"no": num, "text": text})

    if len(cleaned_questions) != 567:
        print(f"Warning: Extracted {len(cleaned_questions)} questions instead of 567.")

    print(f"Updating database with {len(cleaned_questions)} questions...")
    db = SessionLocal()
    
    count = 0
    for q_data in cleaned_questions:
        db_q = db.query(models.Question).filter(models.Question.question_no == q_data["no"]).first()
        if db_q:
            db_q.text = q_data["text"]
            count += 1
            
    db.commit()
    db.close()
    print(f"Successfully updated {count} questions in the database.")

if __name__ == "__main__":
    main()
