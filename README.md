# telescope-booking
Webpages for telescope slot booking and creation for Cepheid.

### Tech Stack
- Frontend: React
- Backend: Node
- Database: MYSQL
- Misc: Express, Axios, Sequelize

### Installation
To install dependencies, run\
npm install

Edit URL in frontend/src/components/TelescopeBooking.js to be the address of the backend server.
backend/serviceAccount.json is not public here. It is needed for firebase authentication services.

Create a database 'cepheid' and two tables. Use the commented code in backend/index.js for this.

Manually insert gmail ids of admins: <code> INSERT INTO admin VALUES("placeholder@iith.ac.in"); </code> \
Removal of an admin: <code> DELETE FROM admin WHERE emailid = "placeholder@iith.ac.in"; </code>


## Features

### User
- Book a slot
- User and guide details are hidden from other users

### Admin
- Create a slot
- Cancel a slot
- Clear past slots from database
- Sees all details for slots

### Colour code
- Blue: available
- Red: not available
- Green: booked
