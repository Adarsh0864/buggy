# BugTrackr Backend - Evolution Phase: Enhanced Status Handling
# This update showcases our solution to frontend/backend status inconsistency
# Now supports both "Progress" (frontend display) and "In Progress" (backend storage)

from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Bug, BugStatus
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure database - support both development and production
try:
    if os.environ.get('RAILWAY_ENVIRONMENT') or os.environ.get('DATABASE_URL'):
        # Production environment (Railway or other platforms)
        database_url = os.environ.get('DATABASE_URL')
        if database_url and database_url.startswith('postgres://'):
            # Fix for SQLAlchemy 1.4+
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    else:
        # Development environment
        basedir = os.path.abspath(os.path.dirname(__file__))
        app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "bugs.db")}'

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)

    # Configure CORS for production
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
    CORS(app, resources={
        r"/*": {
            "origins": [
                frontend_url,
                "http://localhost:*",
                "http://127.0.0.1:*",
                "https://*.netlify.app"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    }, supports_credentials=True)

    # Add request logging (only in development)
    @app.before_request
    def log_request():
        if not os.environ.get('RAILWAY_ENVIRONMENT'):
            print(f"Request: {request.method} {request.url}")
            print(f"Origin: {request.headers.get('Origin')}")

    # Create tables with error handling
    with app.app_context():
        try:
            db.create_all()
            print("Database tables created successfully")
        except Exception as e:
            print(f"Error creating database tables: {e}")

except Exception as e:
    print(f"Error during app initialization: {e}")

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
        
        print(f"Updating bug {bug_id} with data: {data}")  # Debug logging
        
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
            # Handle status enum conversion - accept both "Progress" and "In Progress"
            status_value = data['status']
            print(f"Status received: '{status_value}'")  # Debug logging
            
            if status_value == 'Open':
                bug.status = BugStatus.OPEN
            elif status_value in ['In Progress', 'Progress']:
                bug.status = BugStatus.IN_PROGRESS
            elif status_value == 'Resolved':
                bug.status = BugStatus.RESOLVED
            else:
                error_msg = f'Invalid status: "{status_value}". Must be: Open, Progress/In Progress, or Resolved'
                print(f"Status error: {error_msg}")  # Debug logging
                return jsonify({'error': error_msg}), 400
        
        db.session.commit()
        print(f"Bug {bug_id} updated successfully")  # Debug logging
        return jsonify(bug.to_dict()), 200
    except Exception as e:
        print(f"Error updating bug {bug_id}: {str(e)}")  # Debug logging
        import traceback
        traceback.print_exc()  # Print full stack trace
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
    try:
        # Test database connection
        with app.app_context():
            db.session.execute('SELECT 1')
        
        return jsonify({
            'message': 'BugTrackr API is running!',
            'status': 'healthy',
            'database': 'connected'
        }), 200
    except Exception as e:
        return jsonify({
            'message': 'BugTrackr API is running but database connection failed',
            'status': 'degraded',
            'database': 'disconnected',
            'error': str(e)
        }), 503

@app.route('/test', methods=['GET', 'POST', 'OPTIONS'])
def test_endpoint():
    return jsonify({
        'message': 'Test endpoint working!',
        'method': request.method,
        'origin': request.headers.get('Origin'),
        'port': request.environ.get('SERVER_PORT')
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = not os.environ.get('RAILWAY_ENVIRONMENT')
    app.run(debug=debug, port=port, host='0.0.0.0') 