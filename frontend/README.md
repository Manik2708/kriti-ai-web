
<h1>IITG WebPro - AI-Powered Website Generator</h1>

IITG WebPro is an AI-powered platform that enables users to create custom websites effortlessly by providing prompts. This repository contains the **frontend code** for the application built with React.js, featuring seamless authentication powered by Clerk and backend integration for data fetching.

---

## Features

- **AI-Powered Website Creation**: Generate custom websites by entering prompts.
- **User Authentication**: Secure user login and management with Clerk.
- **Dashboard**: Manage and edit projects in a user-friendly interface.
- **Dark Theme Support**: Designed for a modern and sleek look.
- **Drag and Drop Functionality**: Drag and drop the elements through no code interface .

---

## Environment Variables

Add the following environment variables to a `.env` file in the project root:

- **`REACT_APP_CLERK_PUBLISHABLE_KEY`**: Your Clerk publishable key for authentication.
- **`REACT_APP_BACKEND_URL`**: Backend API URL for data fetching.

Example `.env` file:
```env
REACT_APP_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
REACT_APP_BACKEND_URL=your-backend-url
```
## Installation

Follow these steps to set up and run the frontend locally:

1. **Clone the Repository**  
   Clone the project repository to your local machine using Git:
   ```bash
   git clone https://github.com/your-username/iitg-webpro-frontend.git

2. **Navigate to the Project Directory**
Move into the project directory:
```bash
cd iitg-webpro-frontend
```
3. **Install Dependencies**  
Install all the required dependencies using `npm`:
```bash
npm install
```
4. **Run the Project**  
Start the development server using the following command:  
```bash
npm start
```
