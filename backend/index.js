import {fetchSlots, createSlot, cancelSlot, bookSlot, getUserDetails, clearHistory} from "./controllers.js";
import express from "express";
import cors from "cors";
import middleware from "./middleware.js";

const app = express();
app.use(express.json()); //reads as json
app.use(cors());
app.use(middleware);
  
app.get('/fetchslots', fetchSlots);
app.post('/createslot', createSlot);
app.delete('/cancelslot', cancelSlot);
app.patch('/bookslot', bookSlot);
app.get('/getuser', getUserDetails);
app.delete('/clearhistory', clearHistory);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



/*
CREATE TABLE admin (
emailid VARCHAR(60) NOT NULL,
PRIMARY KEY(emailid)
);

CREATE TABLE slot (
slotid INT NOT NULL AUTO_INCREMENT,
startdate DATE,
starttime TIME,
endtime TIME,
venue VARCHAR(50),
guideid VARCHAR(50),
guidename VARCHAR(50),
userid VARCHAR(50),
username VARCHAR(50),
remarks VARCHAR(100),
PRIMARY KEY(slotid)
);
*/