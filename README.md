# Vacations Project

Welcome to the Vacations Project! This README provides an overview of the project, its structure, and instructions for setup and usage.

## Project Description

The Vacations Project is a web application designed to manage vacations. It allows users to view and follow vacations, while administrators can manage vacation data and view reports. The application includes features such as user registration, login, and role-based access control.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [License](#license)

## Features

### User Roles

- **User**: Can view vacations, follow/unfollow vacations.
- **Admin**: Can add, edit, delete vacations, and view vacation reports.

### Functionalities

- User registration and login
- Viewing a list of vacations
- Following and unfollowing vacations
- Admin functionalities for managing vacations
- Viewing vacation reports

## Technologies Used

- **Backend**: Node.js, Express.js, MySQL
- **Frontend**: React.js
- **Languages**: JavaScript

## Installation

### Prerequisites

- Node.js
- MySQL
- Git

### Steps

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/vacations-project.git
cd vacations-project
```

2. **Backend Setup:**

```bash
 cd backend
 npm install
 npm start
```

2. **Frontend Setup:**

```bash
cd ../frontend
npm install
npm start
```

## Usage

1. **Registration and Login:**

   - Register a new user account or log in with existing credentials.

2. **User Dashboard:**

   - View the list of vacations.
   - Follow or unfollow vacations.

3. **Admin Dashboard:**
   - Add new vacations.
   - Edit existing vacations.
   - Delete vacations.
   - View vacation reports.

## Screenshots

### Home Page - Dark

![alt text](/Frontend/src/Assets/Screenshots/home-user-dark.png)

### Edit Vacation Page - Dark

![alt text](/Frontend/src/Assets/Screenshots/edit-vacation-dark.png)

### Manager Report Page - Light

![alt text](/Frontend/src/Assets/Screenshots/report-light.png)

### Vacation Card - Hover Mode

![alt text](/Frontend/src/Assets/Screenshots/hover-card.gif)

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
