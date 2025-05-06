# Business Resource Hub

A comprehensive web application designed to empower entrepreneurs with essential resources, funding insights, and community support.

![Business Resource Hub Banner](https://github.com/user-attachments/assets/44813040-29ab-44c9-a61e-234b18ba1bd2)

## Vision

To create an inclusive platform that bridges the gap between entrepreneurs and the resources they need to succeed, with special focus on supporting women in business.

## Features

### 📊 Interactive Dashboard
Personalized user experience with dynamic data visualization and quick access to all platform features.

![Dashboard](https://github.com/user-attachments/assets/b0161ec7-e615-4f3d-86e9-6693dc2c6b79)
![Dashboard Details](https://github.com/user-attachments/assets/b0ab4c63-7c68-416a-b642-02545ef61530)

### 💰 Funding Visualization
Interactive charts and graphs to help entrepreneurs understand funding trends, opportunities, and success stories.

![Funding Visualization](https://github.com/user-attachments/assets/8420b7cb-5b88-4418-9ac2-b4891f52a4ea)
![Funding Details](https://github.com/user-attachments/assets/2ff4e08d-92cf-4da5-a133-2cc744aeb5f2)
![Funding Graph](https://github.com/user-attachments/assets/72cfb73f-3848-41d4-948f-a22ebf63a6a6)

### 📚 Resource Directory
Comprehensive catalog of business resources categorized by type, accessibility, and relevance.

![Resource Directory](https://github.com/user-attachments/assets/70453bd1-5d00-4ebf-91cb-bb29bd916526)
![Resource Details](https://github.com/user-attachments/assets/b2832f95-4d83-41fc-a94d-a868006ba78a)

### 🤖 AI Business Mentor
Intelligent assistant that helps entrepreneurs understand and develop their business ideas.

### 👥 Community Hub
Connect with fellow entrepreneurs, share experiences, and build valuable networks.

![Community](https://github.com/user-attachments/assets/d639b605-115b-4aa8-bdb3-7c4da72da2de)

### 🔔 Smart Notifications
Stay updated with real-time alerts about new resources, funding opportunities, and community events.

## Technology Stack

### Frontend
- React with TypeScript
- Vite for fast development
- TailwindCSS for responsive design
- Lucide Icons for consistent UI elements
- React Router DOM for navigation

### Backend
- Flask framework
- SQLAlchemy ORM
- JWT authentication
- PostgreSQL database
- Flask-CORS for API security

## User Personas

Our platform is designed to serve diverse entrepreneur profiles:

- [User Persona 1](https://github.com/user-attachments/files/18281193/User.Persona1.pdf)
- [Persona 2](https://github.com/user-attachments/files/18281192/Persona.2.pdf)

## Reference Data

- [Women Empowerment Schemes SearchEngine](https://github.com/user-attachments/files/18281199/Women_Empowerment_Schemes_SearchEngine.xlsx)

## Getting Started

### Backend Setup

```bash
# Clone repository
git clone <repository-url>
cd <project-folder>/backend

# Create virtual environment
python -m venv env
source env/bin/activate  # For Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Create .env file with:
# SECRET_KEY=your-secret-key
# SQLALCHEMY_DATABASE_URI=postgresql://<user>:<password>@<host>:<port>/<database>

# Run migrations
flask db init
flask db migrate
flask db upgrade

# Start server
python app.py
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd <project-folder>/frontend

# Install dependencies
npm install

# Start development server
npm start
```

## Team

- Jashwanth Reddy (VAB)
- Nikhil Mamilla
- Bindhu Sathwika
- Sumanvitha
- Rupa Sri

## Contributing

We welcome contributions to enhance this project. Feel free to fork the repository, create a new branch, and submit a pull request.

## License

This project is licensed under the MIT License.
