from flask import Flask, request, jsonify, send_file, make_response,session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from flask_cors import CORS
import os
import openai
import pandas as pd
import io
import matplotlib.pyplot as plt
import requests
from dotenv import load_dotenv
from flask_cors import cross_origin
import uuid
import jwt
# Add these imports at the top
from functools import wraps
# from firebase_admin import auth as firebase_auth
# import firebase_admin
# from firebase_admin import credentials
from openai import OpenAI

from flask_migrate import Migrate
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from flask_validator import ValidateEmail, ValidateString, ValidateInteger
# Load environment variables
load_dotenv()
# At the top of your file after imports
api_key = "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"
client = OpenAI(api_key=api_key)
SECRET_KEY = 'your-secret-key' 
def verify_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No token provided'}), 401
        
        if auth_header:
            try:
                token = auth_header.split('Bearer ')[1]
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401

        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            request.user_id = payload['user_id']
            return f(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
            
    return decorated_function

# Initialize Flask app
app = Flask(__name__)
# Set secret key immediately after creating app
app.secret_key = os.getenv('SECRET_KEY')
if not app.secret_key:
    app.secret_key = 'dev-temporary-key'  # Fallback key for development
    print("Warning: Using temporary secret key")
app.config['PERMANENT_SESSION_LIFETIME']=timedelta(days=1)
# Update the CORS configuration
# Remove the existing CORS setup and replace with this
from flask_cors import CORS

# CORS(app, 
#      resources={r"/api/*": {
#          "origins": "http://localhost:5173",
#         #  "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#          "supports_credentials": True,
#          "allow_headers": ["Content-Type", "Authorization"],
#          "expose_headers": ["Content-Type", "Authorization"],
#          "supports_credentials": True,
#          "send_wildcard": False,
         
#      }})
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] =  'postgresql://postgres:vabjr@localhost:5432/Delta'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SQLALCHEMY_POOL_SIZE'] = 10
app.config['SQLALCHEMY_MAX_OVERFLOW'] = 20
app.config['SQLALCHEMY_POOL_TIMEOUT'] = 30
# Before db = SQLAlchemy(app)
from flask import current_app
app.app_context().push()
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app, supports_credentials=True)
# Original Models

class BaseModel(db.Model):
    __abstract__ = True
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    
class UserProfile(db.Model):
    __tablename__ = 'user_profiles'
    __table_args__ = (
        db.Index('idx_email', 'email'),
        db.Index('idx_uid', 'uid'),
    )
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    gender = db.Column(db.String(50), nullable=True)
    password = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(100))
    language = db.Column(db.String(50))
    email = db.Column(db.String(255), unique=True, nullable=False)
    interests = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # resources = db.relationship('Resource', backref='user', lazy=True)
    # Additional fields for dashboard
    avatar = db.Column(db.String(255))
    title = db.Column(db.String(255))
    badges = db.Column(db.String(500))
    expertise = db.Column(db.String(500))

    resources = db.relationship('Resource', backref='user', lazy=True, cascade='all, delete-orphan')
    achievements = db.relationship('Achievement', backref='user', lazy=True, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='user', lazy=True, cascade='all, delete-orphan')
    # @classmethod
    # def __declare_last__(cls):
    #     ValidateEmail(cls.email)
    #     ValidateString(cls.name, min_length=2, max_length=255)
    #     ValidateString(cls.password, min_length=8)
class Resource(db.Model):
    __tablename__ = 'resources'
    __table_args__ = (
        db.Index('idx_category', 'category'),
        db.Index('idx_type', 'type'),
    )
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    link = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50), nullable=False, default='general')
    description = db.Column(db.Text, nullable=True)
    # uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    eligibility = db.Column(db.String(200))
    location = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id',ondelete='CASCADE'), nullable=False)
    # Additional fields for resource directory
    rating = db.Column(db.Float)
    reviews = db.Column(db.Integer)
    popularity = db.Column(db.Integer)
    tags = db.Column(db.String(500))
    deadline = db.Column(db.DateTime, nullable=True)
    duration = db.Column(db.String(100))
    members = db.Column(db.Integer)

# Error handling decorator
def handle_errors(f):
    def wrapped(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except IntegrityError as e:
            db.session.rollback()
            return jsonify({"error": "Database integrity error", "details": str(e)}), 400
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"error": "Database error", "details": str(e)}), 500
        except Exception as e:
            return jsonify({"error": "Server error", "details": str(e)}), 500
    wrapped.__name__ = f.__name__
    return wrapped

# New Models for Dashboard
class Achievement(db.Model):
    __tablename__ = 'achievement'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id'))
    title = db.Column(db.String(255))
    progress = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id'))
    title = db.Column(db.String(255))
    time = db.Column(db.DateTime, default=datetime.utcnow)
    read = db.Column(db.Boolean, default=False)

class Insight(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    type = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

# Add these routes to your Flask app
def create_token(user_id):
    """Create a JWT token for the user"""
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')


@app.route('/test-api-key', methods=['GET'])
def test_api_key():
    try:
        # First, log the API key prefix (first few characters) to verify it's loaded
        key_prefix = api_key[:7] if api_key else "Not found"
        
        # Try a simple internet connection test
        response = requests.get('https://api.openai.com/v1/models', 
                              headers={'Authorization': f'Bearer {api_key}'},
                              timeout=10)
        
        return jsonify({
            "api_key_loaded": bool(api_key),
            "api_key_prefix": key_prefix,
            "openai_reachable": response.status_code == 200,
            "status_code": response.status_code
        })
    except requests.exceptions.RequestException as e:
        return jsonify({
            "error": str(e),
            "api_key_loaded": bool(api_key),
            "api_key_prefix": key_prefix
        })
@app.route('/api/signup', methods=['POST'])
@handle_errors
def signup():
    data = request.get_json()
    required_fields = ['name', 'email', 'password']
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Check if user already exists
    if UserProfile.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
    
    # Create new user
    new_user = UserProfile(
        uid=str(uuid.uuid4()),  # Generate a unique ID
        name=data['name'],
        email=data['email'],
        password=generate_password_hash(data['password']),
        gender=data.get('gender'),
        location=data.get('location'),
        language=data.get('language'),
        interests=data.get('interests'),
        avatar=data.get('avatar', ''),
        title=data.get('title', 'Member'),
        badges=data.get('badges', 'New Member'),
        expertise=data.get('expertise', '')
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        
        # Generate token
        token = create_token(new_user.uid)
        
        return jsonify({
            "message": "User created successfully",
            "token": token,
            "user": {
                "uid": new_user.uid,
                "name": new_user.name,
                "email": new_user.email
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# @app.route('/api/login', methods=['POST'])
# def login():
#     try:
#         data = request.get_json()
#         if not data:
#             return jsonify({"error": "No data provided"}), 400
            
#         print("Received login data:", data)  # Debug print
        
#         if 'email' not in data or 'password' not in data:
#             return jsonify({"error": "Email and password are required"}), 400
            
#         user = UserProfile.query.filter_by(email=data['email']).first()
#         print("Found user:", user)  # Debug print
        
#         if user and check_password_hash(user.password, data['password']):
#             session['user_id'] = user.id
#             session.permanent = True
#             return jsonify({
#                 "message": "Login successful",
#                 "user": {
#                     "uid": user.uid,
#                     "name": user.name,
#                     "email": user.email
#                 }
#             }), 200
        
#         return jsonify({"error": "Invalid credentials"}), 401
        
#     except Exception as e:
#         print("Login error:", str(e))  # Debug print
#         return jsonify({"error": str(e)}), 500

# @app.route('/api/check-auth', methods=['GET'])
# def check_auth():
#     if 'user_id' in session:
#         user = UserProfile.query.get(session['user_id'])
#         return jsonify({
#             "authenticated": True,
#             "user": {
#                 "uid": user.uid,
#                 "name": user.name,
#                 "email": user.email
#             }
#         }), 200
#     return jsonify({"authenticated": False}), 401
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        if 'email' not in data or 'password' not in data:
            return jsonify({"error": "Email and password are required"}), 400
            
        user = UserProfile.query.filter_by(email=data['email']).first()
        
        if user and check_password_hash(user.password, data['password']):
            token = create_token(user.uid)
            return jsonify({
                "message": "Login successful",
                "token": token,
                "user": {
                    "uid": user.uid,
                    "name": user.name,
                    "email": user.email
                }
            }), 200
        
        return jsonify({"error": "Invalid credentials"}), 401
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# Existing Endpoints
from flask import jsonify, request
from functools import wraps
from openai import OpenAI
from datetime import datetime
import redis
import logging
import urllib3
from typing import Optional, Tuple, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure urllib3 for better connection handling
urllib3.util.retry.Retry.DEFAULT_ALLOWED_METHODS = frozenset(['GET', 'POST'])


from openai import OpenAI
import os
from dotenv import load_dotenv

# api_key = os.getenv('OPENAI_API_KEY')
# if not api_key:
#     raise ValueError("No OpenAI API key found. Please set OPENAI_API_KEY environment variable.")

# client = OpenAI(api_key=api_key)

import requests
# Initialize Redis for rate limiting
from flask import Flask, jsonify, request
from functools import wraps

from datetime import datetime, timedelta
import logging
from typing import Optional, Tuple, Dict, Any
from collections import defaultdict
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = OpenAI(
    api_key=api_key,
    timeout=30.0,  # Set a longer timeout
    max_retries=3  # Allow retries
)

# Initialize OpenAI client
# client = OpenAI()  # Make sure OPENAI_API_KEY environment variable is set

# Simple in-memory rate limiting
request_counts = defaultdict(list)

def rate_limit(requests: int, window: int):
    """Simple in-memory rate limiting decorator"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            client_ip = request.remote_addr
            now = time.time()
            
            # Remove old requests
            request_counts[client_ip] = [
                req_time for req_time in request_counts[client_ip]
                if now - req_time < window
            ]
            
            # Check rate limit
            if len(request_counts[client_ip]) >= requests:
                return jsonify({
                    "error": "Rate limit exceeded",
                    "retry_after": window
                }), 429
            
            # Add new request
            request_counts[client_ip].append(now)
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def validate_input(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """Validate input parameters"""
    required_fields = ['query']
    
    # Check required fields
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
            
    # Validate query length
    if len(data['query']) > 1000:
        return False, "Query exceeds maximum length of 1000 characters"
        
    # Validate language code
    if 'language' in data and not isinstance(data['language'], str):
        return False, "Invalid language code format"
        
    # Validate category
    valid_categories = ['business', 'marketing', 'finance', 'strategy', 'leadership']
    if 'category' in data and data['category'] not in valid_categories:
        return False, f"Invalid category. Must be one of: {', '.join(valid_categories)}"
        
    return True, None

# At the top of your file, update these imports
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client properly

if not api_key:
    raise ValueError("No OpenAI API key found. Please set OPENAI_API_KEY environment variable.")


@app.route('/test-simple', methods=['GET'])
def test_simple():
    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=5
        )
        return jsonify({
            "status": "success",
            "response": completion.choices[0].message.content
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e),
            "type": type(e).__name__
        })

@app.route('/get-advice', methods=['POST'])
@rate_limit(requests=100, window=3600)  # 100 requests per hour
def get_advice():
    """Generate business advice and optionally translate it"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        # Validate input
        is_valid, error_message = validate_input(data)
        if not is_valid:
            return jsonify({"error": error_message}), 400
            
        query = data['query']
        language = data.get('language', 'en')
        category = data.get('category', 'business')
        
        logger.info(f"Processing advice request - Category: {category}, Language: {language}")

        try:
            # Create the completion using the new API format
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",  # Using GPT-3.5-turbo as it's more widely available
                messages=[
                    {
                        "role": "system",
                        "content": f"You are an experienced business mentor specializing in {category}. Provide practical, actionable advice."
                    },
                    {
                        "role": "user",
                        "content": query
                    }
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            advice = completion.choices[0].message.content
            
            # Translate if not English
            if language != 'en':
                translation = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {
                            "role": "system",
                            "content": f"Translate this text to {language}:"
                        },
                        {
                            "role": "user",
                            "content": advice
                        }
                    ],
                    temperature=0.3
                )
                advice = translation.choices[0].message.content
            
            return jsonify({
                "advice": advice,
                "category": category,
                "language": language,
                "timestamp": datetime.utcnow().isoformat()
            }), 200
            
        except Exception as api_error:
            logger.error(f"OpenAI API error: {str(api_error)}")
            return jsonify({"error": f"Service error: {str(api_error)}"}), 500
            
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

def translate_text(text: str, target_language: str) -> str:
    """Translate text to target language using OpenAI's GPT-3.5"""
    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": f"Translate the following text to {target_language}:"
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            temperature=0.3
        )
        return completion.choices[0].message.content
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        raise
@app.route('/resources/all', methods=['GET'])
def get_resources():
    language = request.args.get('language', 'en')
    resources = Resource.query.all()
    return jsonify({
        "resources": [
            {
                "id": resource.id,
                "title": translate_text(resource.title,language),
                "link": resource.link,
                "category":translate_text( resource.category,language),
                "description": translate_text(resource.description,language),
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
    new_resource = Resource(
        title=data.get('title'),
        link=data.get('link'),
        category=data.get('category'),
        description=data.get('description'),
        user_id=data.get('user_id')
    )
    try:
        db.session.add(new_resource)
        db.session.commit()
        return jsonify({"message": "Resource added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/recommendations/<user_id>', methods=['GET'])
def get_recommendations(user_id):
    user = UserProfile.query.filter_by(uid=user_id).first()
    if not user:
        return jsonify({"error": "User not found."}), 404

    gender = user.gender
    user_interests = user.interests.split(',') if user.interests else []

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

# Existing visualization endpoints
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
    plt.ylabel('')
    plt.tight_layout()

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png', download_name='funding_distribution.png')

# @app.route('/api/user/profile', methods=['OPTIONS'])
# def options_user_profile():
#     response = make_response()
#     response.headers['Access-Control-Allow-Origin'] = '*'
#     response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
#     response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
#     return response


# New endpoints for Dashboard
@app.route('/api/user/profile', methods=['GET'])
@verify_token
def get_user_profile():
    try:
        user = UserProfile.query.filter_by(uid=request.user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            'name': user.name,
            'avatar': user.avatar or "https://example.com/default-avatar.jpg",
            'title': user.title or "Business Professional",
            'badges': user.badges.split(',') if user.badges else [],
            'expertise': user.expertise.split(',') if user.expertise else [],
            'initials': ''.join(n[0].upper() for n in user.name.split() if n)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/user/achievements', methods=['GET'])
# @cross_origin()
def get_achievements():
    achievements = Achievement.query.all()
    return jsonify([{
        'id': a.id,
        'title': a.title,
        'progress': a.progress
    } for a in achievements])

@app.route('/api/notifications', methods=['GET'])
# @cross_origin()
def get_notifications():
    notifications = Notification.query.all()
    return jsonify([{
        'id': n.id,
        'title': n.title,
        'time': n.time.strftime('%Y-%m-%d %H:%M:%S'),
        'read': n.read
    } for n in notifications])


@app.route('/api/courses', methods=['GET'])
# @cross_origin()
def get_courses():
    try:
        # Using Resource model for courses
        courses = Resource.query.filter_by(type='course').all()
        return jsonify([{
            'name': course.title,
            'description': course.description,
            'link': course.link
        } for course in courses])
    except Exception as e:
        return jsonify({"error": "Failed to fetch courses"}), 500
@app.route('/api/insights', methods=['GET'])
# @cross_origin()
def get_insights():
    insights = Insight.query.all()
    return jsonify([{
        'id': i.id,
        'title': i.title,
        'type': i.type
    } for i in insights])
@app.route('/api/notifications/<int:notification_id>/read', methods=['PUT'])
# @cross_origin()
def mark_notification_read(notification_id):
    notification = Notification.query.get_or_404(notification_id)
    notification.read = True
    db.session.commit()
    return jsonify({"success": True})

# New endpoints for Resource Directory
@app.route('/api/categories', methods=['GET'])
# @cross_origin()
def get_categories():
    categories = db.session.query(Resource.category).distinct().all()
    return jsonify([cat[0] for cat in categories])

@app.route('/api/stats', methods=['GET'])
# @cross_origin()
def get_stats():
    return jsonify({
        'Total Resources': Resource.query.count(),
        'Active Opportunities': Resource.query.filter(Resource.deadline > datetime.now()).count(),
        'Community Members': UserProfile.query.count()
    })

# New endpoints for Funding Visualization
@app.route('/api/funding/statistics', methods=['GET'])
# @cross_origin()
def get_funding_statistics():
    time_range = request.args.get('timeRange', '6M')
    end_date = datetime.now()
    
    if time_range == '1M':
        start_date = end_date - timedelta(days=30)
    elif time_range == '3M':
        start_date = end_date - timedelta(days=90)
    elif time_range == '6M':
        start_date = end_date - timedelta(days=180)
    else:  # 1Y
        start_date = end_date - timedelta(days=365)
    
    funding_resources = Resource.query.filter(
        Resource.type == 'funding',
        Resource.uploaded_at.between(start_date, end_date)
    ).all()
    
    return jsonify({
        'fundingResources': [{
            'title': r.title,
            'amount': float(r.link) if r.link.isdigit() else 0,  # Using link field to store amount temporarily
            'status': r.type,
            'uploaded_at': r.uploaded_at.isoformat()
        } for r in funding_resources]
    })

@app.route('/api/funding/success-stories', methods=['GET'])
# @cross_origin()
def get_funding_success_stories():
    successful_resources = Resource.query.filter_by(
        type='funding'
    ).order_by(Resource.uploaded_at.desc()).limit(3).all()
    
    return jsonify([{
        'title': r.title,
        'founder': r.user.name,
        'amount': float(r.link) if r.link.isdigit() else 0,
        'impact': r.description
    } for r in successful_resources])

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "API is working"}), 200

@app.route('/api/resources', methods=['POST'])
@handle_errors
def create_resource():
    if 'user_id' not in session:
        return jsonify({"error": "Authentication required"}), 401

    data = request.get_json()
    required_fields = ['title', 'link', 'category']
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    new_resource = Resource(
        title=data['title'],
        link=data['link'],
        category=data['category'],
        type=data.get('type', 'general'),
        description=data.get('description'),
        user_id=session['user_id']
    )

    db.session.add(new_resource)
    db.session.commit()
    return jsonify({"message": "Resource created successfully", "id": new_resource.id}), 201

# Database initialization and migration commands
@app.cli.command("init-db")
def init_db():
    """Initialize the database."""
    db.create_all()
    print('Database initialized.')

@app.cli.command("migrate-db")
def migrate_db():
    """Migrate the database."""
    with app.app_context():
        migrate.init_app(app, db)
        migrate.upgrade()
    print('Database migrated.')



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    # Development server
    if app.debug:
        app.run(debug=True)
    # Production server
    else:
        from waitress import serve
        serve(app, host='0.0.0.0', port=5000, threads=4)
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))