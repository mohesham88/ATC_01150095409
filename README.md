# Areeb Technology Competition 

## Event Management Web application

##  📍 Requirements

- [ ] Frontend
  - [ ] Auth Page
  - [ ] Landing Page
  - [ ] Admin Panel (using React-admin)
    - [ ] Admin Login Page
    - [ ] Events & booking
      - [ ] view , edit , create events
      - [ ] export data to CSV
  - [ ] Dark/light mode
  - [ ] Deployment
- [ ] Backend
  - [x] Authentication
    - [x] reset password functionality
      - [x] send mail to the user with the reset-token-url that expires in 1 hour.
      - [x] apply rate limiting to avoid abuse (limit each IP to 5 request every 15 minutes for the reset password route)
    - [ ] Authorization & roles
      - [x] restrict Creating , Updating & Deleting Events to admins only
      - [ ] admin must have a sepearte session independent from the user session.
  - [ ] Event Management
    - [x] Tags and categories for events.
    - [ ] Event images upload functionality.
    - [ ] Google Maps integration Feature
  - [ ] Booking API
  - [ ] Deployment

- [ ] Unit testing
- [ ] Multi-language support (En/Ar for now)



