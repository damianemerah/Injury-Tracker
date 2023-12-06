# PainPoint - Injury Tracking System

Welcome to PainPoint, an injury tracking system designed to help organizations, such as the police, easily record and track injuries reported by individuals. This web application is built using Next.js with GraphQL, Prisma, and Auth0 for seamless user authentication. The UI/UX is crafted with Grommet for a clean and user-friendly experience.

## Features

### 1. Injury Reporting

- **Create, View, Update, and Delete Reports:**

  - Users can easily create, view, update, and delete injury reports.
  - Each report includes details like the reporter's name, date and time of injury, and a body map for marking affected areas.

- **Body Map with Automatic Labeling:**

  - Users can encircle different areas of injury on a body map.
  - The system automatically labels each encircled area for easy identification.

- **List of Injuries:**
  - Provides a list/table of all reported injuries, showing reporter name, injury date and time, and report date.

### 2. User Authentication

- **Registration and Login:**

  - Users can register for an account using a username and password.
  - Authentication options include Google login and email login via Auth0.

- **User History:**
  - Registered users can log in and log out of their accounts.
  - View a history of their submitted injury reports.

### 3. UI/UX

- **Responsive Design:**
  - The application is responsive and works seamlessly on both desktop and mobile devices.
  - Built with Grommet for a visually appealing and user-friendly interface.

## Bonus Features

### 1. Progressive Web App (PWA)

- **Fully Responsive:**
  - PainPoint is built as a fully responsive Progressive Web App (PWA).
  - Installable on a user's home screen, works offline, and provides an app-like experience across devices.

### 2. Automatic Location Detection

- **Smart Labeling:**
  - Automatic detection of labeled areas on the body map instead of just numbers.
  - Labels, like "left hand" and "left foot," are generated for easier interpretation.

### 3. Analytics Dashboard

- **Visualize Metrics:**
  - An analytics dashboard provides visualizations of relevant injury tracking metrics.
  - Utilizes libraries like Chart.js or D3.js for data visualization.

## Tech Stack

- **Front-end:**

  - Next.js with Grommet for UI/UX.
  - React Context for state management.

- **Back-end:**

  - GraphQL with Prisma as the ORM.
  - Auth0 for user authentication.

- **Analytics:**
  - Data visualization libraries like Chart.js or D3.js.

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/painpoint.git
   ```
