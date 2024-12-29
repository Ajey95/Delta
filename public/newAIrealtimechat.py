from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, join_room, leave_room, send
from datetime import datetime
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask app and database
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///community.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Initialize SocketIO for real-time chat
socketio = SocketIO(app, cors_allowed_origins="*")

# Define database models
class UserProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.String(255), nullable=False)
    receiver_id = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# API endpoint to fetch chat history
@app.route('/chat/history', methods=['GET'])
def get_chat_history():
    sender_id = request.args.get('sender_id')
    receiver_id = request.args.get('receiver_id')
    
    if not sender_id or not receiver_id:
        return jsonify({"error": "Missing sender_id or receiver_id"}), 400

    messages = ChatMessage.query.filter(
        ((ChatMessage.sender_id == sender_id) & (ChatMessage.receiver_id == receiver_id)) |
        ((ChatMessage.sender_id == receiver_id) & (ChatMessage.receiver_id == sender_id))
    ).order_by(ChatMessage.timestamp.asc()).all()

    return jsonify({
        "messages": [
            {
                "sender_id": msg.sender_id,
                "receiver_id": msg.receiver_id,
                "message": msg.message,
                "timestamp": msg.timestamp
            } for msg in messages
        ]
    }), 200

# Real-time chat events
@socketio.on('join')
def on_join(data):
    room = data['room']
    join_room(room)
    send(f"{data['user']} has joined the room.", room=room)

@socketio.on('typing')
def handle_typing(data):
    room = data['room']
    send({"message": f"{data['user']} is typing..."}, room=room)


@socketio.on('leave')
def on_leave(data):
    room = data['room']
    leave_room(room)
    send(f"{data['user']} has left the room.", room=room)

@socketio.on('message')
def handle_message(data):
    room = data['room']
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']
    message = data['message']

    # Save message to database
    chat_message = ChatMessage(sender_id=sender_id, receiver_id=receiver_id, message=message)
    db.session.add(chat_message)
    db.session.commit()

    # Broadcast the message to the room
    send({
        "sender_id": sender_id,
        "receiver_id": receiver_id,
        "message": message,
        "timestamp": chat_message.timestamp
    }, room=room)

# chat_routes.py
from flask import request, jsonify
from werkzeug.utils import secure_filename
import os

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload-file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return jsonify({'message': 'File uploaded successfully', 'file_path': f'/uploads/{filename}'})

# ai_chat.py
# Load model directly
"""from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")

def generate_response(user_input):
    inputs = tokenizer.encode(user_input + tokenizer.eos_token, return_tensors="pt")
    response_ids = model.generate(inputs, max_length=1000, pad_token_id=tokenizer.eos_token_id)
    return tokenizer.decode(response_ids[:, inputs.shape[-1]:][0], skip_special_tokens=True)

@app.route('/suggest-reply', methods=['POST'])
def suggest_reply():
    user_input = request.json.get('message', '')
    if not user_input:
        return jsonify({'error': 'No message provided'}), 400
    response = generate_response(user_input)
    return jsonify({'suggested_reply': response})

def main():
    # Define the local path where you saved the model files
    model_name = "models/DialoGPT-medium"

    # Load the model and tokenizer
    model = AutoModelForCausalLM.from_pretrained(model_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name)

    # Example usage
    input_text = "Hello! How are you?"
    inputs = tokenizer.encode(input_text, return_tensors="pt")
    response = model.generate(inputs, max_length=50, num_return_sequences=1)
    output = tokenizer.decode(response[0], skip_special_tokens=True)

    print("Chatbot response:", output)"""

# Run the Flask app with SocketIO
if __name__ == '__main__': 
    with app.app_context():
        db.create_all()
        socketio.run(app, debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
