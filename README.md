## MEvent 🎉: Evnet Management Web application

![Frontend](https://img.shields.io/badge/frontend-live-brightgreen)
![Backend](https://img.shields.io/badge/backend-API-blue)
![Status](https://img.shields.io/badge/status-active-success)

MEvent is a full-stack simple web application designed to make event planning and participation simple, fast, and efficient. Whether you're an event organizer or an enthusiastic attendee, MEvent offers a seamless platform to manage it all.

| 🏆 This project was developed as part of the Areeb Web Development Competition.

### 🔗 Live Demo

🌐 Frontend: [vercel](https://atc-01150095409.vercel.app/)

🛠️ Backend API: [azurewebsites](https://arabee-events-task-backend-g0gmf2deh5cfbsgd.francecentral-01.azurewebsites.net/api/v1/)

## 📍 Features

- [x] Multi-language support (En/Ar for now) using i18n library for dynamic translation
- [x] Admin Panel for managing Events <del>(using React-admin)</del> switched to a simple custom one.
- [x] Authentication & Authorization

  - [x] reset password functionality
    - [x] send mail to the user with the reset-token-url that expires in 1 hour.
    - [x] apply rate limiting to avoid abuse (limit each IP to 5 request every 15 minutesfor the reset password route)

- [x] Frontend
  - [x] Dark/light mode
  - [x] Deployed to Vercel
- [x] Backend

  - [x] ensuring Authorization and user roles
  - [x] Admin and user have two seperate sessions (usefull for security reasons e.g (making the admin have a shorter token))
  - [x] Event Management

    - [x] Tags and categories for events which could be used for filtering.
    - [x] Event images upload functionality (user can upload up to 5 images per Event).

## 🛠 Tech Stack

| Layer    | Technologies                                             |
| -------- | -------------------------------------------------------- |
| Frontend | Typescript, React/Vue                                    |
| Backend  | Node.js, Express, TS, Passport                           |
| Database | MongoDB                                                  |
| Hosting  | Vercel (Frontend), Microsoft Azure App Service (Backend) |

⚙️ Project Structure

```bash
mevent/
│
├── frontend/      # React + TS
│   └── README.md – Setup instructions for the frontend
│
├── backend/      # Backend (Express + TS)
│   └── README.md – Setup instructions for the backend
│
└── README.md    # Main project overview
```

➡️ For detailed setup and environment configuration, please refer to the individual `README.md` files located inside the `/frontend` and `/backend` folders.

### 🙏 Acknowledgements

Areeb Web Dev Competition — for the opportunity and platform
