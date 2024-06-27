# Instructions for Setting Up the Todo Application

## Step 1: Clone the Repository

First, clone the repository to your local machine using Git:

```
git clone https://github.com/mahmodahmad003sy/todo.git
```

## Step 2: Navigate to the Project Directory

Change your current directory to the cloned repository:

```
cd todo
```

## Step 3: Install Dependencies

Install the required dependencies using Yarn:

```
yarn
```

## Step 4: Create an Environment File

Create a `.env` file in the root of your project directory and add the following environment variables. Replace the placeholder values with your actual database credentials and desired port number if different.

```plaintext
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=todo
DB_PASSWORD=todo
DB_NAME=todo
PORT=3000
```

## Step 5: Start the Development Server

Start the development server using Yarn:

```
yarn start:dev
```

## Step 6: Access the Application

Once the server is running, the application should be accessible at `http://localhost:3000`.

## Step 7: Check the API Documentation

View the API documentation at `http://localhost:3000/api-docs`.
