# telescope-booking
Webpages for slot booking and creation for Cepheid.

### Tech Stack
- Frontend: React
- Backend: Node
- Database: MYSQL
- Misc: Express, Axios, Sequelize

### Installation
To install dependencies, run\
npm install

Create a database 'cepheid' and two tables. Use the commented code in backend/index.js \
Insert email ids of admins into the table admin

backend/firebase-config.json is not public here

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
