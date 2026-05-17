# Full-Stack Blog Application Deployment on AWS EC2 (Ubuntu)

This project demonstrates deployment of a full-stack blog application (React frontend + Node.js/Express backend + MongoDB) on an AWS EC2 instance. The application allows users to create, view, update, and delete blog posts through a web interface.

---

## Architecture

```
User → Browser → EC2 (Node/Express Server)
                      ├── React Build (Frontend)
                      └── API (Backend)
                      ↓
                   MongoDB Database
```

---

## Features

- Create blog posts  
- View blog posts  
- Update blog posts  
- Delete blog posts  

---

## Conclusion

The full-stack blog application is successfully deployed on an AWS EC2 instance. The backend serves both API endpoints and the React frontend. The application is publicly accessible and supports remote updates using SSH.
