from database import SessionLocal, engine
import models
import random

def seed_db():
    print("Creating tables...")
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if scales already exist
    if db.query(models.Scale).count() > 0:
        print("Database already seeded. Skipping.")
        db.close()
        return

    print("Seeding Scales...")
    scales = [
        {"name": "L", "description": "Lie", "mean": 50.0, "std_dev": 10.0},
        {"name": "F", "description": "Infrequency", "mean": 50.0, "std_dev": 10.0},
        {"name": "K", "description": "Defensiveness", "mean": 50.0, "std_dev": 10.0},
        {"name": "1-Hs", "description": "Hypochondriasis", "mean": 50.0, "std_dev": 10.0},
        {"name": "2-D", "description": "Depression", "mean": 50.0, "std_dev": 10.0},
        {"name": "3-Hy", "description": "Hysteria", "mean": 50.0, "std_dev": 10.0},
        {"name": "4-Pd", "description": "Psychopathic Deviate", "mean": 50.0, "std_dev": 10.0},
        {"name": "5-Mf", "description": "Masculinity-Femininity", "mean": 50.0, "std_dev": 10.0},
        {"name": "6-Pa", "description": "Paranoia", "mean": 50.0, "std_dev": 10.0},
        {"name": "7-Pt", "description": "Psychasthenia", "mean": 50.0, "std_dev": 10.0},
        {"name": "8-Sc", "description": "Schizophrenia", "mean": 50.0, "std_dev": 10.0},
        {"name": "9-Ma", "description": "Hypomania", "mean": 50.0, "std_dev": 10.0},
        {"name": "0-Si", "description": "Social Introversion", "mean": 50.0, "std_dev": 10.0},
    ]
    
    db_scales = []
    for s in scales:
        scale = models.Scale(**s)
        db.add(scale)
        db_scales.append(scale)
        
    db.commit()
    
    print("Seeding Questions & Answer Keys...")
    # Seed 567 questions with dummy text for now
    for i in range(1, 568):
        q = models.Question(question_no=i, text=f"Ini adalah pertanyaan MMPI nomor {i}. Apakah Anda setuju dengan pernyataan ini?")
        db.add(q)
        db.flush() # get q.id
        
        # Randomly map to 1-3 scales as answer keys
        num_keys = random.randint(1, 3)
        assigned_scales = random.sample(db_scales, num_keys)
        
        for scale in assigned_scales:
            trigger = random.choice([True, False])
            key = models.AnswerKey(question_id=q.id, scale_id=scale.id, answer_trigger=trigger)
            db.add(key)
            
    db.commit()
    db.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_db()
