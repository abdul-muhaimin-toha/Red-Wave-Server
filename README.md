# Red Wave Server

A user-friendly blood donation platform powered by the MERN stack, facilitating seamless connections between donors and recipients while incorporating robust features for user management and role-based access control.

## Links

- [Live Website](https://red-wave.netlify.app/)
- [Client Site Repository](https://github.com/abdul-muhaimin-toha/Red-Wave-Client)
- [Server Site Repository](https://github.com/abdul-muhaimin-toha/Red-Wave-Server)

## Account Credentials

- **Admin Account:**
  - **Email:** admin@gmail.com
  - **Password:** 123123

- **Volunteer Account:**
  - **Email:** Volunteer@gmail.com
  - **Password:** 123123

- **User Account:**
  - **Email:** user@gmail.com
  - **Password:** 123123
 
## Run Locally

To run Red Wave locally, follow these steps:

```sh
npm install
npm run dev
```

## User Types

1. **Regular User:**
   - Register on the platform.
   - View and respond to blood donation requests.
   - Manage personal profile information.
   - Donate blood and money.

2. **Volunteer:**
   - Manage blog posts (create, edit, publish/unpublish, delete).
   - Access all functionalities available to regular users.

3. **Admin:**
   - Manage all users on the platform.
   - Assign roles (admin or volunteer).
   - Create, publish, unpublish, or delete blog posts.
   - Access all functionalities available to both regular users and volunteers.

## Key Features

### User Management

- Secure registration and login.
- Role-based access control with JWT tokens.
- Modern styling and UI components with shad/cn.

### Dashboard

- Personalized dashboard for managing activities.
- Overview of blood donation requests, user profiles, and blog posts.
- Customizable sidebar with dark and light modes.

### Blood Donation

- Apply to donate blood.
- Accept or cancel donation applications.

### Search Functionality

- Find donors based on proximity or location.
- Efficient filtering for nearest available donors.

### Fund Donation

- Secure fund donations via Stripe.
- Management for supporting platform operations.

### Profile Management

- Edit profile information.
- Track donation history and responses.

### Content Management

- Create, manage, and publish blog posts.
- Engage community with informative content.

## Security

- JWT token-based authorization for secure platform access.
- Role-based restrictions ensure appropriate access levels.

## Technology Stack

Red Wave leverages a powerful technology stack to deliver its features:

- **Database:** MongoDB for flexible and scalable data storage.
- **Backend:** Node.js and Express.js provide a robust foundation for server-side logic and API development.
- **Frontend:** React offers a dynamic and responsive user interface for seamless user interactions.
- **Payment Integration:** Stripe ensures secure and efficient online payment processing.
- **Authentication:** JWT (JSON Web Tokens) for secure and scalable user authentication.

## Npm Packages used in this project

- tanstack/react-query
- react-hook-form
- stripe/react-stripe-js
- axios
- react-helmet-async
- jsonwebtoken
- firebase
- date-fns
- jodit-react
- react-to-print
