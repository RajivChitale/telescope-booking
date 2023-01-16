import { Sequelize } from "sequelize";

const { DataTypes, Op } = Sequelize;


const db = new Sequelize('cepheid', 'root', '321321', {
  host: "localhost",
  dialect: "mysql"
});

//table with slot details
const Slots = db.define('slot', {
  slotid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  startDate: DataTypes.DATEONLY,
  startTime: DataTypes.STRING,
  endTime: DataTypes.STRING,
  venue: DataTypes.STRING,
  guideid: DataTypes.STRING,
  guidename: DataTypes.STRING,
  userid: DataTypes.STRING,
  username: DataTypes.STRING,
  remarks: DataTypes.STRING,
}, {
  freezeTableName: true,
  timestamps: false
});

//list of admin email-ids
const Admin = db.define('admin', {
  emailid: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});

//1. returns true if email belongs to admin
const checkAdmin = async (email) => {
  if(email == null){return false;}
  
  const adminEntry = await Admin.findOne({
    where: {
      emailid: email
    }
  });  
  
  if(adminEntry){return true;}
  else {return false;}
}

//2. verifies token and finds if it belongs to admin. also checks if a user already booked a slot
export const getUserDetails = async (req, res) => {
  try {
    req.headers.isAdmin = await checkAdmin(req.headers.email);
    req.headers.hasBooked = await alreadyBooked(req.headers.email);
    res.json(req.headers);
  }
  catch (error) {
    res.json({ message: error.message });
  }
}

//3. fetches slot data
export const fetchSlots = async (req, res) => {
  var now = new Date().toJSON().slice(0,10);
  try {
    let slotArray = await Slots.findAll(
      {
        order: [['startDate', 'DESC'] ],
        where: {startDate: {[Op.gte] : now }}
      }
    );

    //admins are shown all details
    if(! await checkAdmin(req.headers.email) ){

      //hide details from users except the one who booked the slot
      slotArray.forEach(s => {
        if(  s.userid == null || s.userid!==req.headers.email) {
          s.guideid = null;
          s.guidename = null;
          if(s.userid!=null) {s.userid = "[hidden]";}
          s.username = null;
        }
      });
     
    }

    res.json(slotArray);
  } catch (error) {
    res.json({ message: error.message });
  }
}

//4. deletes slot from database. requires admin
export const cancelSlot = async (req, res) => {
  if(checkAdmin(req.headers.email)){
    try {
      await Slots.destroy({
        where: {
          slotid: req.body.slotid
        }
      });
      res.json({
        "message": "Slot Removed"
      });
    } catch (error) {
      res.json({ message: error.message });
    }
  }
  else{
    res.json({ message: "Not authorized" });  
  }
}

//5. creates slot. (requires admin and most fields not null)
export const createSlot = async (req, res) => {

  if(checkAdmin(req.headers.email)){
    try {

      if(req.body.startDate == null || req.body.startTime == null || req.body.endTime == null ||
        req.body.venue.length == 0 || req.body.guidename.length == 0 || req.body.guideid.length == 0 )
          {throw({message: "required" }); }

  
      req.body.guidename = req.headers.name;
      req.body.guideid = req.headers.email;
      await Slots.create(req.body);   

      res.json({
        "message": "Slot added"
      });

    } catch (error) {
      res.json({ message: error.message });
    }
  }
}

//6. returns true if a user already has a slot booking
const alreadyBooked = async (email) => {
  var now = new Date().toJSON().slice(0,10);

    let arr = await Slots.findOne(
      {
        where: {
          startDate: {[Op.gte] : now },
          userid: email
        }
      }
    );
    
    if(arr == null){ return false;}
    else {return true;}
}

//7. books slot if it is available
export const bookSlot = async (req, res) => {
  try {
    if(await alreadyBooked(req.headers.email)) {
      throw({message: "already" }); 
    }

    await Slots.update(
    {
       userid: req.headers.email,
       username: req.headers.name
    },
    {
      where: {
        slotid: req.body.slotid,
        userid: null,
        username: null  //checks slot availibility
      }
    });
    res.json({
      message: "Slot Booked"
    });
  } catch (error) {
    res.json({ message: error.message });
  }
}


//8. clear all slots from database before current day.
export const clearHistory = async (req, res) => {
  var now = new Date().toJSON().slice(0,10);
  if(checkAdmin(req.headers.email)){
    try {
      await Slots.destroy({
        where: {
          startDate: {[Op.lt] : now }
        }
      });
      res.json({
        "message": "Slot History Removed"
      });
    } catch (error) {
      res.json({ message: error.message });
    }
  }
  else{
    res.json({ message: "Not authorized" });  
  }
}

/*
const db = mysql.createConnection(
  {
    user: "root",
    host: "localhost",
    password: "321321",
    database: "cepheid"
  }
);

*/