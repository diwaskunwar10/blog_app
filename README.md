# Blog Application

This repository contains the source code for a simple blog application developed using FastAPI for the backend and React for the frontend.

## Backend Setup

### Requirements
- Python 3.7+
- PostgreSQL

### Installation

1. Clone the repository:

```
git clone <repository_url>
```

```

cd backend

```
```
create virtual environment(ubuntu)
python -m venv venv
```

```

activate enviroinment

source venv/bin/activate
```


2. Install dependencies:

```
pip install -r requirement.txt
```

3. Set up the database:
   
   - Ensure PostgreSQL is installed and running.
   
   - Create a new database for the application.
   
   - Update the database connection URL in `backend/.env` file:

    ```
    SQLALCHEMY_DATABASE_URL=postgresql://<username>:<password>@<host>/<database_name>
    ```

4. Run Migrations:

```
alembic upgrade head
```

5. Start the backend server:

```
uvicorn main:app --reload
```

The backend server should now be running on `http://localhost:8000`.

## Frontend Setup

### Requirements
- Node.js
- npm or yarn

### Installation

1. Navigate to the frontend directory:

```
cd frontend
```

2. Install dependencies:

```
npm install
```

### Configuration

1. Update API Base URL:

   In the file `frontend/src/api/api.js`, update the `baseURL` to point to the backend server URL:


3. Start the frontend server:

```
npm start
```

The frontend server should now be running on `http://localhost:3000`.

## Usage

1. Register a new user by visiting `http://localhost:3000/signup`.
2. Log in with the registered user credentials at `http://localhost:3000/login`.
3. Create, update, or delete blog posts.
4. View a list of all blog posts and their details.

## Deployment

- The backend and frontend applications is currently configured for localmachine only but can be deployed separately using platforms like railway (backend) and render (frontend).

## Contributing

Contributions are welcome! If you'd like any improvements, feel free to  submit an issue.
