# ChronicleHub

> ChronicleHub is a personal blogging platform that allows users to create, edit, and delete posts. Each post can contain a title, description, date, images, and location. The application also allows users to search for posts based on a date range or filter them using keywords. Authentication is handled through access tokens to ensure secure access.

# Features 
- Create, Edit, and Delete Posts: Users can easily manage their blog posts.
- Post Details: Each post includes a title, description, date, images, and location.
- Search Functionality: Search posts based on date range or filter through keywords.
- Secure Authentication: Access tokens are used for user authentication and authorization.

# Technologies Used
**Backend**: Node.js, Express   
**Database**: MongoDB  
**Authentication**: JWT (JSON Web Tokens)  
**Frontend**: React (for future integration)  

# Getting Started
1. Clone the repository: git clone <repository_url>
2. Install dependencies: npm install
3. Set up environment variables: Create a .env file with the necessary configurations such as MongoDB URI, JWT_SECRET, and other related variables.
4. Run the application: npm start

# Authentication
Authentication is handled using JWT. Include the access token in the Authorization header for protected routes.

