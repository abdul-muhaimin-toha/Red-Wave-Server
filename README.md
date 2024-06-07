# Red Wave Server

### Assignment_ID: assignment_category_0001

### Milestone: 12, Assignment: 12 (Red Wave). Project based assignment for Programming Hero course.

## Purpose

Red Wave is a user-friendly blood donation platform designed to facilitate seamless connections between blood donors and recipients. The platform aims to streamline the blood donation process, making it more efficient and accessible for everyone involved. Built using the MERN stack (MongoDB, Express.js, React, Node.js), Red Wave incorporates robust features for user registration, blood donation requests, donor management, content management, and role-based access control.

[Live Website Link](https://voluntree-go.netlify.app/)

[Client Site Repository Link](https://github.com/Porgramming-Hero-web-course/b9a11-client-side-abdul-muhaimin-toha)

[Server Site Repository Link](https://github.com/Porgramming-Hero-web-course/b9a11-server-side-abdul-muhaimin-toha)

## User Types

1. **Regular User:**

   - Can register on the platform.
   - View and respond to blood donation requests.
   - Maintain and update personal profile information.

2. **Volunteer:**

   - Manage blog posts (create, edit, publish/unpublish, delete).
   - Access all functionalities available to regular users.

3. **Admin:**
   - Access and manage all users on the platform.
   - Block or unblock users, and assign roles (admin or volunteer).
   - Create, publish, unpublish, or delete blog posts.
   - Access all functionalities available to both regular users and volunteers.

## Key Features

1. **User Registration and Authentication:**

   - Secure user registration and login functionality.
   - Role-based access control implemented using JWT tokens.
   - The entire project utilizes shad/cn for styling and component design.

2. **Dashboard:**

   - A personalized dashboard for users to manage their activities.
   - Overview of blood donation requests, user profiles, and blog posts.
   - Custom sidebar for easy navigation.
   - Supports both dark and light modes for user convenience.

3. **Blood Donation Requests:**

   - Users can apply to donate blood.
   - Requesters can accept or cancel donation applications.

4. **Search Functionality:**

   - Users can search for donors based on proximity or specific location input.
   - Efficient filtering to find the nearest available donors.

5. **Fund Donation:**

   - Logged-in users can donate funds using a secure card payment system powered by Stripe.
   - Fund management to support platform operations and related activities.

6. **Profile Management:**

   - Users can view and edit their profile information.
   - Manage personal donation history and responses to donation requests.

7. **Content Management:**
   - Admins and volunteers can create and manage blog posts.
   - Options to publish, unpublish, or delete content to keep the community informed and engaged.
   - Includes a blog post page where users can create blogs using a text editor.

## Security

- Implementation of JWT token-based authorization to ensure secure access to platform features.
- Role-based access control to restrict functionalities based on user roles (regular user, volunteer, admin).

## Technology Stack

- **Database:** MongoDB for storing user data and post information.
- **Backend:** Node.js, Express.js, with jwt for handling server-side logic and API endpoints.
- **Frontend:** React for building the user interface and providing a seamless browsing experience.
- **Payment Integration:** Stripe for secure card payments
- **Authentication:** JWT (JSON Web Tokens) for secure and scalable user authentication.

## Key npm Packages

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
