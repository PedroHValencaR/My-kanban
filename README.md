🚀 Smart Kanban System with Wikipedia Integration
This is a functional Full-Stack Kanban board designed for agile task management. It features a "smart" integration that allows users to fetch informative summaries directly from Wikipedia based on the task title, bridging the gap between task management and quick research.

🛠️ Tech Stack
Frontend: HTML5, CSS3 (Modern Responsive Design), Vanilla JavaScript.

Backend: PHP 8.x.

Database: MySQL (MariaDB).

External API: Wikipedia REST API.

✨ Key Features
Task Management: Create, list, and organize cards with titles and descriptions.

Interactive Drag & Drop: Seamlessly move cards between "To Do", "In Progress", and "Done" columns.

Data Persistence: All movements and new entries are permanently saved to the MySQL database.

Smart Summaries: A dedicated button on each card fetches technical definitions or lore directly from Wikipedia using the task's title as the search key.

🚀 Getting Started
1. Prerequisites
Install XAMPP, WAMP, or any local PHP/MySQL server environment.

Ensure the Apache and MySQL modules are active.

2. Database Configuration
Create a database named kanban_db in your MySQL manager (e.g., phpMyAdmin) and run the following script:

SQL
DROP DATABASE IF EXISTS kanban_db;
CREATE DATABASE kanban_db;
USE kanban_db;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('todo', 'doing', 'done') DEFAULT 'todo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
3. Port Adjustment
If your MySQL service is running on a non-standard port (such as 3307), update the connection string in api.php:

PHP
$port = '3307'; // Match your local MySQL port configuration
4. Installation
Clone this repository or move the files to your server's public folder (e.g., C:\xampp\htdocs\kanban\).

Open your browser and navigate to: http://localhost/kanban/

📁 File Structure
index.html: Contains the UI structure and modern CSS styling.

script.js: Handles DOM manipulation, Drag & Drop logic, and API calls.

api.php: Provides the RESTful endpoints for database communication.

💡 Use Case Example
Try creating a card titled "Python" or "Bloodborne". Clicking the "Wikipedia Summary" button will instantly populate the card description with official data retrieved via the API.
