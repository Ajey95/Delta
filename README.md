<<<<<<< HEAD
<<<<<<< HEAD
OM
# React + TypeScript + Vite


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

Project Title

Business Resource Hub – A web application to empower users with resources and funding insights while offering a smooth and secure user experience.

---

Project Overview

The Business Resource Hub is a comprehensive platform that provides users with various resources, notifications, and insights for business empowerment. It includes features like user authentication, funding visualization, and resource directory management. Built with a robust backend using Flask and a dynamic frontend using React, this application ensures scalability and user-friendliness.

---

Setup Instructions

1. Clone the Repository:
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. Backend Setup:
   - Navigate to the backend folder:
     ```bash
     cd backend
     ```
   - Create a virtual environment:
     ```bash
     python -m venv env
     source env/bin/activate  # For Windows: env\Scripts\activate
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Set up the `.env` file:
     - Add the following environment variables:
       ```
       SECRET_KEY=your-secret-key
       SQLALCHEMY_DATABASE_URI=postgresql://<user>:<password>@<host>:<port>/<database>
       ```
   - Run database migrations:
     ```bash
     flask db init
     flask db migrate
     flask db upgrade
     ```
   - Start the backend server:
     ```bash
     python app.py
     ```

3. Frontend Setup:
   - Navigate to the frontend folder:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the React application:
     ```bash
     npm start
     ```

---

Dependencies List

Backend:
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-CORS
- Python 3.x
- PostgreSQL
- JWT (PyJWT)

Frontend:
- React
- TypeScript
- React-Router-DOM
- TailwindCSS
- Lucide Icons

---

Usage Examples

- User Authentication: Sign up, log in, and manage your profile securely.
- AIBusinessMentor helps people understand the growth of business ideas.
- Resource Directory: Browse categorized resources for business needs.
- Funding Visualization: View funding statistics and success stories.
- Notifications: Stay updated with real-time notifications.

---

Screenshots or GIFs

Landing Page
![image](https://github.com/user-attachments/assets/44813040-29ab-44c9-a61e-234b18ba1bd2)
Community
![image](https://github.com/user-attachments/assets/d639b605-115b-4aa8-bdb3-7c4da72da2de)
Features
![image](https://github.com/user-attachments/assets/cf9bedea-5791-4d8c-96c9-cbd8f5290c7e)

Dashboard
![image](https://github.com/user-attachments/assets/b0161ec7-e615-4f3d-86e9-6693dc2c6b79)
![image](https://github.com/user-attachments/assets/b0ab4c63-7c68-416a-b642-02545ef61530)



Funding Visualization
![image](https://github.com/user-attachments/assets/8420b7cb-5b88-4418-9ac2-b4891f52a4ea)
![image](https://github.com/user-attachments/assets/2ff4e08d-92cf-4da5-a133-2cc744aeb5f2)
![image](https://github.com/user-attachments/assets/72cfb73f-3848-41d4-948f-a22ebf63a6a6)
ResourceDirectory
![image](https://github.com/user-attachments/assets/70453bd1-5d00-4ebf-91cb-bb29bd916526)

![image](https://github.com/user-attachments/assets/b2832f95-4d83-41fc-a94d-a868006ba78a)





---

Team Member Details

- Jashwanth Reddy (VAB) – Developer and Project Lead.
- Nikhil Mamilla
- Bindhu Sathwika
- Sumanvitha
- Rupa Sri

---

Contributing

We welcome contributions to enhance this project. Feel free to fork the repository, create a new branch, and submit a pull request.

---

License

This project is licensed under the MIT License.

