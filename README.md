#  Finance Dashboard Backend

##  Overview

This project is a backend system for a finance dashboard that allows users to manage financial records and view analytical insights based on their role.

It demonstrates:

* Role-based access control (RBAC)
* Clean backend architecture (Controller → Service → Model)
* Financial data processing
* Dashboard analytics (summary, trends, insights)

___________________________________________________________________________________________

#Features

#  Authentication

* User registration & login using JWT
* Token stored in HTTP-only cookies

# Role-Based Access Control

* Viewer → Can view dashboard summary only
* Analyst → Can view records + insights
* Admin → Full access (CRUD + user management)

___________________________________________________________________________________________

# Financial Records

* Create, update, delete records (Admin only)
* View records (Analyst + Admin)
* Filter by:

  * Type (income/expense)
  * Category
  * Date

___________________________________________________________________________________________

#  Dashboard APIs

 1. Summary

* Total income
* Total expense
* Net balance

 2. Category-wise Breakdown

* Spending grouped by category
* Income vs expense distribution

 3. Monthly Trends

* Income/expense per month
* Supports custom range (query param)

4. Weekly Trends

* Daily income/expense (last 7 days)

 5. Recent Activity

* Latest transactions
* Sorted by most recent

___________________________________________________________________________________________

# Tech Stack

* Backend: Node.js, Express.js
* Database: MongoDB (Mongoose)
* Authentication: JWT,cookie-parser,bcrypt
* Middleware: Custom auth & role middleware

___________________________________________________________________________________________

##  Project Structure

src/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── validators/
├── db/
└── app.js



___________________________________________________________________________________________

# Authentication Flow

1. User logs in → JWT generated
2. Token stored in cookie
3. Middleware verifies token
4. User info attached to req.user

___________________________________________________________________________________________

# Role Middleware Example

js
router.post(
  "/records",
  protect,
  allowRoles("admin"),
  createRecord
);


___________________________________________________________________________________________

# API Endpoints

# Auth

* POST /api/auth/register
* POST /api/auth/login

### Records

* POST /api/records (Admin)
* GET /api/records (Analyst, Admin)
* PUT /api/records/:id (Admin)
* DELETE /api/records/:id (Admin)

### Dashboard

* GET /api/dashboard/summary
* GET /api/dashboard/categories
* GET /api/dashboard/trends/monthly
* GET /api/dashboard/trends/weekly
* GET /api/dashboard/recent

___________________________________________________________________________________________

# Setup Instructions

1. Clone the repository

   git clone <your-rhttps://github.com/SURAJ-PARMAR2005/Zorvyn_Assigmentepo-link>


3. Install dependencies
  npm install


4. Create .env file


PORT=3000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret


4. Run server:

    npm run dev

___________________________________________________________________________________________

##  Testing

Use Postman or Thunder Client to test APIs.


##  Assumptions

* Each record belongs to a user (`user)
* Soft delete is used (isDele)
* Roles are predefined: viewer, analyst, admin

##  Highlights

* Clean architecture (separation of concerns)
* Efficient data aggregation (MongoDB pipelines)
* Secure authentication using cookies
* Scalable role-based system

##  Future Improvements

* Pagination for records
* Search functionality
* Refresh token implementation

  
# Author

Suraj Parmar
