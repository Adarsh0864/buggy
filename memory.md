🧠 Instructions for Building “BugTrackr” using React + Flask

✅ Project Structure

Create two folders:
	•	bugtrackr-backend – Flask backend
	•	bugtrackr-frontend – React frontend

⸻

🔧 Backend (Flask)

Step 1: Set up project
	•	Create virtual environment
	•	Install required packages: Flask, Flask-CORS, Flask-SQLAlchemy
	•	Create app.py, models.py

Step 2: Define Bug model in models.py
	•	Fields: id, title, description, severity, status, created_at
	•	Use Enum for status: Open, In Progress, Resolved

Step 3: Create API endpoints in app.py
	•	POST /bugs – Create a new bug
	•	GET /bugs – Retrieve all bugs
	•	PUT /bugs/<id> – Update a bug’s status or details
	•	DELETE /bugs/<id> – Delete a bug

Step 4: Configure SQLite DB
	•	Set up DB URI
	•	Initialize with db.create_all()

Step 5: Enable CORS and test API locally using flask run

⸻

💻 Frontend (React)

Step 1: Set up React app
	•	Use create-react-app
	•	Install axios

Step 2: Folder structure
	•	components/
	•	BugForm.jsx – Form to create bugs
	•	BugList.jsx – List all bugs
	•	BugCard.jsx – Display individual bug, status dropdown

Step 3: Create API layer (api.js)
	•	Methods: fetchBugs, createBug, updateBug, deleteBug

Step 4: Build UI Components
	•	BugForm to submit new bugs
	•	BugList maps all bugs to BugCard
	•	BugCard allows changing status or deleting the bug

Step 5: Connect components in App.jsx
	•	Display form and list side-by-side or stacked
	•	On form submit or status update, reload bug list


💡 Key Features and Talking Points
	•	CRUD: Full create, read, update, delete flow
	•	Clean architecture: Frontend/backend separation
	•	Technical Wins:
	•	Enum status field in Flask
	•	Axios-based API interaction
	•	Component-based React UI
	•	Improvements to Mention:
	•	Add filtering by status
	•	Add pagination
	•	Add user authentication (JWT)
	•	Walkthrough Tips for Loom Video:
	•	Brief project explanation
	•	Show Bug model and Flask routes
	•	Explain React component flow
	•	Discuss challenges or trade-offs
	•	Mention possible improvements and future scope