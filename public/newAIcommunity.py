from flask import Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from newHackathonAI import app, db

# Blueprint setup for community module
community_bp = Blueprint('community', __name__)

# Define Community Platform Models
class DiscussionPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(255), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    tags = db.Column(db.String(255), nullable=True)  # e.g., "entrepreneurship, funding"
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    likes = db.Column(db.Integer, default=0)  # Add likes field

class MentorshipMatch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mentor_id = db.Column(db.String(255), nullable=False)
    mentee_id = db.Column(db.String(255), nullable=False)
    match_date = db.Column(db.DateTime, default=datetime.utcnow)

# Community Discussion Forum Endpoints
@community_bp.route('/forum/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    user_id = data.get('userId')
    title = data.get('title')
    content = data.get('content')
    tags = data.get('tags')

    if not all([user_id, title, content]):
        return jsonify({"error": "Missing required fields: userId, title, content"}), 400
    
    try:
        post = DiscussionPost(user_id=user_id, title=title, content=content, tags=tags)
        db.session.add(post)
        db.session.commit()
        return jsonify({
            "message": "Post created successfully",
            "post": {
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "createdAt": post.created_at
            }
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@community_bp.route('/forum/posts', methods=['GET'])
def get_posts():
    posts = DiscussionPost.query.all()
    return jsonify({
        "posts": [
            {
                "id": post.id,
                "userId": post.user_id,
                "title": post.title,
                "content": post.content,
                "createdAt": post.created_at
            } for post in posts
        ]
    }), 200

@community_bp.route('/like-post/<post_id>', methods=['POST'])
def like_post(post_id):
    post = DiscussionPost.query.get(post_id)
    if post:
        post.likes += 1
        db.session.commit()
        return jsonify({'message': 'Post liked successfully', 'likes': post.likes})
    return jsonify({'error': 'Post not found'}), 404

@community_bp.route('/forum/trending', methods=['GET'])
def get_trending_topics():
    trending_tags = db.session.query(
        DiscussionPost.tags, db.func.count(DiscussionPost.id).label('tag_count')
    ).group_by(DiscussionPost.tags).order_by(db.desc('tag_count')).limit(5).all()

    return jsonify({
        "trendingTopics": [{"tag": tag, "count": count} for tag, count in trending_tags]
    }), 200

# Mentorship Matching Endpoints
@community_bp.route('/mentorship/match', methods=['POST'])
def mentorship_match():
    data = request.get_json()
    mentor_id = data.get('mentorId')
    mentee_id = data.get('menteeId')

    if not all([mentor_id, mentee_id]):
        return jsonify({"error": "Missing required fields: mentorId, menteeId"}), 400
    try:
        match = MentorshipMatch(mentor_id=mentor_id, mentee_id=mentee_id)
        db.session.add(match)
        db.session.commit()
        return jsonify({
            "message": "Mentorship match created successfully",
            "match": {
                "mentorId": match.mentor_id,
                "menteeId": match.mentee_id,
                "matchDate": match.match_date
            }
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@community_bp.route('/mentorship/matches', methods=['GET'])
def get_mentorship_matches():
    matches = MentorshipMatch.query.all()
    return jsonify({
        "matches": [
            {
                "mentorId": match.mentor_id,
                "menteeId": match.mentee_id,
                "matchDate": match.match_date
            } for match in matches
        ]
    }), 200

# Integration Helper Function
def register_community_module(app):
    """Register the community module with the main Flask app."""
    app.register_blueprint(community_bp, url_prefix='/community')
    # db.init_app(app)
    with app.app_context():
        db.create_all()

if __name__ == '__main__':
    register_community_module(app)
    app.run(debug=True)