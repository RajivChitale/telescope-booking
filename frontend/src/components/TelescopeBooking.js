import TelescopeSlot from "./TelescopeSlot";
import TelescopeSlotForm from "./TelescopeSlotForm";
import './telescope.css';

import {signInWithPopup, GoogleAuthProvider, signOut} from 'firebase/auth';
import {auth} from './firebase-config';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const URL = 'http://localhost:5000';


const TelescopeBooking = () => {

let [admin, setAdmin] = useState(false);
let [hasBooked, setHasBooked] = useState(false);
let [currid, setCurrid] = useState(null);
let [token, setToken] = useState(null);

const getDetails = async () =>  {
    const userDetails = await JSON.parse(localStorage.getItem("cepheidUser"));

    if(userDetails !== null){
        const res = await axios.get(URL + '/getuser', {
            headers: {Authorization: "Bearer "+ userDetails._tokenResponse.idToken}
        });
        setCurrid(res.data.email);
        setAdmin(res.data.isAdmin);
        setHasBooked(res.data.hasBooked);
        //console.log(res);
        if(token === null) {setToken(userDetails._tokenResponse.idToken); }  
    }
  }
//restores user details if already signed in
useEffect( () => {getDetails();} , [token]);


let [slots, setSlots] = useState([]);

//useeffect to download slots. dependent on signIn

const fetchSlots =  async () => {
    const res =  await axios.get(URL + '/fetchslots', 
    {
        headers: {Authorization: "Bearer "+ token}
    });
    setSlots(res.data);
    if(res.data.message){
         await userSignOut();     
    }
   // console.log(res); 
}

useEffect( () => {fetchSlots();} , [token]);

//signin with google-firebase; store token locally
const signIn = async () => {
    var google_provider = new GoogleAuthProvider();
    await signInWithPopup(auth, google_provider)
    .then(
        (userDetails)=> {
            setToken(userDetails._tokenResponse.idToken);  //will use tokens for validating queries
            localStorage.setItem('cepheidUser', JSON.stringify(userDetails)); //persists on browser
        }
    )
    .catch(
        (err)=> {console.log(err);}
    );
}

//signs out and removes token from local storage
const userSignOut = async () => {
    localStorage.clear();
    setAdmin(false);
    setCurrid(null);
    setToken(null);

    await signOut(auth)
    .then( () => {
        console.log('Signout Successfull')
    }, (error) =>  {
        console.log('Signout Failed')  
    });

}

let menuButton = [];
let createButton = [];
//buttons for signin, signout and create-new-slot (for admins)
if(currid === null)
    {menuButton = <button onClick={signIn} className="linkButton" > Sign In </button>}
else
    {menuButton = <button onClick={userSignOut} className="linkButton" > Sign Out </button>}
if(admin)
    {createButton = <Link to='/TelescopeSlotForm' className="linkButton">Create New Slot </Link>}


return (
    <div className="telescopeBooking">
        <h1>
            Telescope Slots
        </h1>
        <div className = "telescopeMenu">
            <div>
            {createButton}
            {menuButton}
            </div>
        </div>

        <br/>
        <div className="telescopeSlotsContainer">
        {slots.length
            ? slots.map(slot => <div key = {slot.slotid}> {TelescopeSlot(slot, admin, currid, token, hasBooked)} </div>)
            : <div><h2>There are no slots at the moment</h2> </div>
        }
        </div>
        

        <br/> <br/>
        <div className="telescopeFooter" >
            <div>
                <div>Each person can book one slot.</div>
                <div>3 people are needed to carry the telescope.</div> 
            </div>
        </div>
        <img src={process.env.PUBLIC_URL + '/cepheidLogo.jpeg'} />
        <br/><br/>
    </div>
);
}

export default TelescopeBooking;

/*
const tempSlot =  {
    startDate: "2018-06-12",
    startTime: "19:30",
    endTime: "21:30",
    venue: "ground",
    userid: null,
    username: null,
    guideid: "cs21btech11051@iith.ac.in",
    guidename: "Rajiv Chitale",
    remarks: "Jupiter visible",
};
*/