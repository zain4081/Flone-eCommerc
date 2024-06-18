# Zain Blog

Zain Blog is a web application for creating, editing, deleting, and viewing blog posts. It is built using Django for the backend and React for the frontend. The project is designed to provide a seamless and interactive user experience for managing blog content.

## Features

- User Authentication (Login, Register)
- Create, Edit, Delete Blog Posts
- View Blog Post Details
- Real-time Notifications
- Dynamic Sidebar based on User Role
- WebSocket Connections for Live Updates

## Installation

### Prerequisites

- Python 3.x
- Node.js
- npm (Node Package Manager)
- Django
- React

### Backend Setup (Django)

1. Clone the repository and navigate to the project directory.
2. Create a virtual environment and activate it.
3. Install the required packages listed in `requirements.txt`.
4. Apply migrations.
5. Run the development server.

### Frontend Setup

#### User Interface (zain-blog-ui)

1. Navigate to the `zain-blog-ui` directory.
2. Install the required packages listed in `package.json`.
3. Start the React development server.

#### Admin Interface (zain-admin-ui)

1. Navigate to the `zain-admin-ui` directory.
2. Install the required packages listed in `package.json`.
3. Start the React development server.

## Usage

1. Open your browser and navigate to the appropriate URLs to access the Django backend, User Interface, and Admin Interface.
2. Register a new user or log in with existing credentials.
3. Start creating, editing, and managing your blog posts.

## Project Structure

```
zain-blog/
├── zain-backend/
│   ├── manage.py
│   ├── blog/
│   ├── account/
│   ├── notifications/
│   └── ...
├── zain-blog-ui/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
├── zain-admin-ui/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
├── README.md
└── requirements.txt
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for review.

## Contact

If you have any questions or suggestions, feel free to reach out to the project maintainer at zain.abbas@thehexaa.com.
