from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from dotenv import load_dotenv
import os
import openai
import pandas as pd
import io
import matplotlib.pyplot as plt
from flask_cors import CORS

# Load environment variables
load_dotenv()
# openai.api_key = os.getenv('OPENAI_API_KEY')

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
# app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///community.db')
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///C:/Users/sister/Downloads/final/community.db" 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)

# Define database models
class UserProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    gender = db.Column(db.String(50), nullable=True)  # Add gender field
    location = db.Column(db.String(100))  # New Field
    language = db.Column(db.String(50))  # New Field
    email = db.Column(db.String(255), unique=True, nullable=False)
    interests = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resources = db.relationship('Resource', backref='user', lazy=True)

class Resource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    link = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50), nullable=False, default='general')  # e.g., funding, training
    description = db.Column(db.Text, nullable=True)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    eligibility = db.Column(db.String(200))  # New Field
    location = db.Column(db.String(100))  # New Field
    user_id = db.Column(db.Integer, db.ForeignKey('user_profile.id'), nullable=False)


# AI-powered mentorship advice endpoint
@app.route('/get-advice', methods=['POST'])
def get_advice():
    data = request.get_json()
    category = data.get('category', 'general')
    query = data.get('query', '')
    language = data.get('language', 'en')
    gender = data.get('gender', 'neutral')  # Gender input from the user

    prompt = f"You are a business mentor specializing in {category}. Provide detailed advice for {query}. Consider the gender factor of {gender}."
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "system", "content": prompt}, {"role": "user", "content": query}]
    )
    
    advice = response['choices'][0]['message']['content']

    if language != 'en':
        translation = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "system", "content": f"Translate the following to {language}: {advice}"}]
        )
        advice = translation['choices'][0]['message']['content']

    return jsonify({"advice": advice}), 200

def translate_text(text, target_language):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": f"Translate this text to {target_language}:"},
            {"role": "user", "content": text}
        ]
    )
    return response['choices'][0]['message']['content']


# Skill development hub endpoints
@app.route('/resources/all', methods=['GET'])
def get_resources():
    language = request.args.get('language', 'en')
    resources = Resource.query.all()
    print(f"Fetched resources: {resources}")  # Debugging line
    return jsonify({
        "resources": [
            {
                "id": resource.id,
                # "title": translate_text(resource.title, language),
                "title": (resource.title, language),
                "link": resource.link,
                # "category": translate_text(resource.category, language),
                "category": (resource.category, language),
                # "description": translate_text(resource.description, language),
                "description": (resource.description, language),
                "uploadedAt": resource.uploaded_at
            } for resource in resources
        ]
    }), 200

@app.route('/resources/<category>', methods=['GET'])
def get_resources_by_category(category):
    resources = Resource.query.filter_by(category=category).all()
    return jsonify({
        "resources": [
            {
                "id": resource.id,
                "title": resource.title,
                "link": resource.link,
                "description": resource.description,
                "uploadedAt": resource.uploaded_at
            } for resource in resources
        ]
    }), 200

@app.route('/add-resource', methods=['POST'])
def add_resource():
    data = request.get_json()
    title = data.get('title')
    link = data.get('link')
    category = data.get('category')
    description = data.get('description')
    user_id = data.get('user_id')
    
    try:
        resource = Resource(title=title, link=link, category=category, description=description,user_id=user_id)
        db.session.add(resource)
        db.session.commit()
        return jsonify({"message": "Resource added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/recommendations/<user_id>', methods=['GET'])
def get_recommendations(user_id):
    user = UserProfile.query.filter_by(uid=user_id).first()
    if not user:
        return jsonify({"error": "User not found."}), 404

    # Gender-specific resource filtering
    gender = user.gender
    user_interests = user.interests.split(',') if user.interests else []

    # Filtering based on gender (add more gender-specific logic if needed)
    if gender == 'female':
        recommended_resources = Resource.query.filter(
            Resource.category.in_(user_interests) | Resource.title.contains('women')
        ).all()
    else:
        recommended_resources = Resource.query.filter(
            Resource.category.in_(user_interests)
        ).all()

    return jsonify({
        "recommendations": [
            {
                "id": resource.id,
                "title": resource.title,
                "link": resource.link,
                "description": resource.description,
                "uploadedAt": resource.uploaded_at
            } for resource in recommended_resources
        ]
    }), 200

import requests

@app.route('/fetch-courses/<topic>', methods=['GET'])
def fetch_courses(topic):
    coursera_api_url = f"https://api.coursera.org/api/courses.v1?q=search&query={topic}"
    response = requests.get(coursera_api_url)
    
    if response.status_code == 200:
        courses = response.json()['elements']
        return jsonify({
            "courses": [
                {
                    "name": course['name'],
                    "link": f"https://www.coursera.org/learn/{course['slug']}",
                    "description": course.get('description', "No description available")
                } for course in courses
            ]
        }), 200
    else:
        return jsonify({"error": "Failed to fetch courses"}), 500


# Funding directory with AI-powered search
@app.route('/search', methods=['GET'])
def search_resources():
    query = request.args.get('query', '').lower()
    if not query:
        return jsonify([])

    resources = Resource.query.all()
    filtered = [
        resource for resource in resources
        if query in resource.title.lower() or query in resource.description.lower()
    ]

    return jsonify({
        "results": [
            {
                "id": resource.id,
                "title": resource.title,
                "link": resource.link,
                "description": resource.description,
                "uploadedAt": resource.uploaded_at
            } for resource in filtered
        ]
    }), 200
@app.route('/resources/funding', methods=['GET'])
def get_funding_resources():
    funding_resources = Resource.query.filter_by(type='funding').all()
    return jsonify({
        "fundingResources": [
            {
                "id": resource.id,
                "title": resource.title,
                "link": resource.link,
                "category": resource.category,
                "description": resource.description,
                "uploadedAt": resource.uploaded_at
            } for resource in funding_resources
        ]
    }), 200

# Event analysis visualization
@app.route('/visualize-events', methods=['GET'])
def visualize_events():
    resources = Resource.query.all()
    categories = [resource.category for resource in resources]
    category_counts = pd.Series(categories).value_counts()

    plt.figure(figsize=(10, 6))
    category_counts.plot(kind='bar', color='skyblue')
    plt.title('Resource Distribution by Category')
    plt.xlabel('Category')
    plt.ylabel('Number of Resources')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png', download_name='resource_distribution.png')
@app.route('/visualize-funding', methods=['GET'])
def visualize_funding():
    resources = Resource.query.filter_by(type='funding').all()
    categories = [resource.category for resource in resources]
    category_counts = pd.Series(categories).value_counts()

    plt.figure(figsize=(10, 6))
    category_counts.plot(kind='pie', autopct='%1.1f%%', startangle=90, colors=plt.cm.Pastel1.colors)
    plt.title('Funding Resources by Category')
    plt.ylabel('')  # Remove y-axis label for pie chart
    plt.tight_layout()

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png', download_name='funding_distribution.png')
@app.route('/visualize-gender', methods=['GET'])
def visualize_gender():
    resources = Resource.query.all()
    gender_specific_categories = ['women', 'gender', 'female', 'equity', 'inclusion']  # Keywords related to gender
    filtered_resources = [resource for resource in resources if any(keyword in resource.category.lower() for keyword in gender_specific_categories)]
    categories = [resource.category for resource in filtered_resources]
    category_counts = pd.Series(categories).value_counts()

    plt.figure(figsize=(10, 6))
    category_counts.plot(kind='bar', color='skyblue')
    plt.title('Gender-Specific Resource Distribution by Category')
    plt.xlabel('Category')
    plt.ylabel('Number of Resources')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png', download_name='gender_resource_distribution.png')

# ---------------------------------------------------------------------------------------------------------------
# ---------------------------------------------------------------------------------------------------------------

if __name__ == '__main__':
    with app.app_context():
        
       

        # db.drop_all()  # Ensure the app context is created before interacting with the database
        db.create_all()  # Create tables if they don't exist
        print(f"Database URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
        print(f"Current working directory: {os.getcwd()}")

        # Fetch users from the database
        users_in_db = UserProfile.query.all()
        for user in users_in_db:
            print(f"User: {user.name}, Email: {user.email}, Interests: {user.interests}")

        print("\n-- All Resources --")
        resources_in_db = Resource.query.all()
        for resource in resources_in_db:
            print(f"Resource: {resource.title}, Category: {resource.category}, Description: {resource.description}")
        import os
        print(f"Database path: {os.path.abspath('community.db')}")


    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
