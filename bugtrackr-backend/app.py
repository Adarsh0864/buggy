from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Bug, BugStatus
import os

app = Flask(__name__)

# Configure SQLite database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "bugs.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:*",
            "http://127.0.0.1:*"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
}, supports_credentials=True)

# Add request logging
@app.before_request
def log_request():
    print(f"Request: {request.method} {request.url}")
    print(f"Origin: {request.headers.get('Origin')}")
    print(f"Headers: {dict(request.headers)}")

# Create tables
with app.app_context():
    db.create_all()

@app.route('/bugs', methods=['POST'])
def create_bug():
    try:
        data = request.get_json()
        
        if not data or not all(key in data for key in ['title', 'description', 'severity']):
            return jsonify({'error': 'Missing required fields: title, description, severity'}), 400
        
        new_bug = Bug(
            title=data['title'],
            description=data['description'],
            severity=data['severity']
        )
        
        db.session.add(new_bug)
        db.session.commit()
        
        return jsonify(new_bug.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/bugs', methods=['GET'])
def get_all_bugs():
    try:
        bugs = Bug.query.order_by(Bug.created_at.desc()).all()
        return jsonify([bug.to_dict() for bug in bugs]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/bugs/<int:bug_id>', methods=['PUT'])
def update_bug(bug_id):
    try:
        bug = Bug.query.get_or_404(bug_id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update fields if provided
        if 'title' in data:
            bug.title = data['title']
        if 'description' in data:
            bug.description = data['description']
        if 'severity' in data:
            bug.severity = data['severity']
        if 'status' in data:
            # Handle status enum conversion
            if data['status'] == 'Open':
                bug.status = BugStatus.OPEN
            elif data['status'] == 'In Progress':
                bug.status = BugStatus.IN_PROGRESS
            elif data['status'] == 'Resolved':
                bug.status = BugStatus.RESOLVED
            else:
                return jsonify({'error': 'Invalid status. Must be: Open, In Progress, or Resolved'}), 400
        
        db.session.commit()
        return jsonify(bug.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/bugs/<int:bug_id>', methods=['DELETE'])
def delete_bug(bug_id):
    try:
        bug = Bug.query.get_or_404(bug_id)
        db.session.delete(bug)
        db.session.commit()
        return jsonify({'message': 'Bug deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'message': 'BugTrackr API is running!'}), 200

@app.route('/test', methods=['GET', 'POST', 'OPTIONS'])
def test_endpoint():
    return jsonify({
        'message': 'Test endpoint working!',
        'method': request.method,
        'origin': request.headers.get('Origin'),
        'port': request.environ.get('SERVER_PORT')
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0') 