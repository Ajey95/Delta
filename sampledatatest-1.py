from datetime import datetime, timezone
from newHackathonAI import db, app, UserProfile, Resource
import os
from dotenv import load_dotenv

# Ensure the environment is loaded
load_dotenv()

# Ensure the correct path for your SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:/Users/sister/Downloads/final/community.db'  # Or the correct path

with app.app_context():
    # Drop and recreate all tables
    db.drop_all()
    print("All tables dropped successfully.")
    db.create_all()
    print("All tables created successfully.")

    # Sample Users
    users = [
        UserProfile(
            uid="user001",
            name="Alice Johnson",
            gender="female",
            location="New York",
            language="en",
            email="alice.johnson@example.com",
            interests="technology,education"
        ),
        UserProfile(
            uid="user002",
            name="Bob Smith",
            gender="male",
            location="California",
            language="en",
            email="bob.smith@example.com",
            interests="finance,training"
        ),
        UserProfile(
            uid="user003",
            name="Chloe Brown",
            gender="female",
            location="London",
            language="en",
            email="chloe.brown@example.com",
            interests="women empowerment,leadership"
        )
    ]

    # Add users to the database
    for user in users:
        db.session.add(user)
    db.session.commit()

    # Fetch User IDs
    alice_id = UserProfile.query.filter_by(uid="user001").first().id
    bob_id = UserProfile.query.filter_by(uid="user002").first().id
    chloe_id = UserProfile.query.filter_by(uid="user003").first().id

    # Sample Resources
    resources = [
        Resource(
            title="AI for Everyone",
            link="https://www.coursera.org/learn/ai-for-everyone",
            category="technology",
            type="training",
            description="A course on the basics of Artificial Intelligence.",
            location="Online",
            eligibility="Open to all",
            user_id=chloe_id,  # Correct user ID
            uploaded_at=datetime.now(timezone.utc)  # Updated to timezone-aware datetime
        ),
        Resource(
            title="Women in Tech Scholarship",
            link="https://example.com/scholarship",
            category="women empowerment",
            type="funding",
            description="Scholarship program for women pursuing careers in technology.",
            location="USA",
            eligibility="Women only",
            user_id=bob_id,  # Correct user ID
            uploaded_at=datetime.now(timezone.utc)  # Updated to timezone-aware datetime
        ),
        Resource(
            title="Leadership Bootcamp",
            link="https://example.com/leadership-bootcamp",
            category="leadership",
            type="training",
            description="A 2-week intensive bootcamp on leadership skills.",
            location="New York",
            eligibility="Open to professionals",
            user_id=alice_id,  # Correct user ID
            uploaded_at=datetime.now(timezone.utc)  # Updated to timezone-aware datetime
        )
    ]

    # Add resources to the database
    for resource in resources:
        db.session.add(resource)
    db.session.commit()

    # Fetch all users and resources in the DB to confirm insertion
    users_in_db = UserProfile.query.all()
    resources_in_db = Resource.query.all()

    print(f"Users in DB: {len(users_in_db)}")
    print(f"Resources in DB: {len(resources_in_db)}")

    # Print all Users and Resources
    print("\n-- All Users --")
    for user in users_in_db:
        print(f"User: {user.name}, Email: {user.email}, Interests: {user.interests}")

    print("\n-- All Resources --")
    for resource in resources_in_db:
        print(f"Resource: {resource.title}, Category: {resource.category}, Description: {resource.description}")

    print(f"Database URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
    print(f"Database path: {os.path.abspath('community.db')}")
