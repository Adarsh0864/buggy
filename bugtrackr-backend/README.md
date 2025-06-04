# BugTrackr Backend

Flask-based REST API for the BugTrackr application.

## Setup

1. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Create Bug
- **POST** `/bugs`
- Body: `{"title": "string", "description": "string", "severity": "string"}`

### Get All Bugs
- **GET** `/bugs`

### Update Bug
- **PUT** `/bugs/<id>`
- Body: `{"title": "string", "description": "string", "severity": "string", "status": "Open|In Progress|Resolved"}`

### Delete Bug
- **DELETE** `/bugs/<id>`

### Health Check
- **GET** `/`

## Features

- SQLite database with SQLAlchemy ORM
- Enum-based status field (Open, In Progress, Resolved)
- CORS enabled for frontend integration
- Full CRUD operations
- Error handling and validation 