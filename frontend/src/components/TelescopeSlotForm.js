import './telescope.css';
import {Link, useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const URL = 'http://localhost:5000';


//PROTECT ROUTE BASED ON TOKEN / OR CHECK TOKEN WHEN SUBMITTING

const TelescopeSlotForm = () => {
    let today = new Date();
    today = today.toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [venue, setVenue] = useState(null);
    const [remarks, setRemarks] = useState(null);
    //const userid = null;
    //const username = null; 
    const [guideid, setGuideid] = useState(null);
    const [guidename, setGuidename]= useState(null);
    
    const [admin, setAdmin] = useState(false);
    const [currid, setCurrid] = useState(null);
    const [token, setToken] = useState(null);
    const [errMessage, setErrMessage] = useState("");
    const navigate = useNavigate();

    const getDetails = async () =>  {
        const userDetails = await JSON.parse(localStorage.getItem("cepheidUser"));
        if(userDetails !== null){
            const res = await axios.get(URL + '/getuser', {
                headers: {Authorization: "Bearer "+ userDetails._tokenResponse.idToken}
            });
            setCurrid(res.data.email);
            setAdmin(res.data.isAdmin);
            setGuidename(res.data.name); //make current email and name the default for input box
            setGuideid(res.data.email);
            if(token === null) {setToken(userDetails._tokenResponse.idToken); }  
        }
      }

      const clearHistory = async () => { 
        if(window.confirm("This action will delete past slots from database.") )
        {
            const res = await axios.delete(URL + '/clearhistory', 
            {
                headers: {Authorization: "Bearer "+ token},
            });
           // window.location.reload();
        }   
    } 

       
    //restores user details if already signed in
    useEffect( () => {getDetails();} , [token]);

    const createSlot = async (e) => {
        e.preventDefault();
        const userDetails = await JSON.parse(localStorage.getItem("cepheidUser"));

        const res = await axios.post(URL + '/createslot', {
            startDate: startDate,
            startTime: startTime,
            endTime: endTime,
            venue: venue,
            userid: null,
            username: null,
            guideid: guideid,
            guidename: guidename,
            remarks: remarks
        },
        {
            headers: {Authorization: "Bearer "+ userDetails._tokenResponse.idToken}
        }
        );  
        if(res.data.message != "Slot added"){
            setErrMessage("Please fill out the required details!");
        }
        else {
            navigate('/');
        }
    } 

    return (
    <div className = "telescopeCreate">
        <h1>
            Create a Slot
        </h1>

        <div>
        <form className= "telescopeSlotForm">

            <label>
                <div> Start Date:</div>
                <input type="date" required onChange = {(e) => setStartDate(e.target.value) }
                min={today} max="2033-01-01"/> 
            </label>
            <label>
                <div> Start Time:</div>
                <input type="time" required onChange = {(e) => setStartTime(e.target.value)} />
            </label>
            <label>
                <div> End Time:</div>
                <input type="time" required onChange = {(e) => setEndTime(e.target.value)} />
            </label>
            <label>
                <div> Venue:</div>
                <input type = "text"  className="longInput" required onChange = {(e) => setVenue(e.target.value)} />
            </label>
            <label>
                <div> Remarks (optional):</div>
                <input type = "text" className="longInput" onChange = {(e) => setRemarks(e.target.value)} />
            </label>
            <label>
                <div> Guide Name:</div>
                <input type = "text" defaultValue={guidename} className="longInput"  required onChange = {(e) => setRemarks(e.target.value)} />
            </label>
            <label>
                <div> Guide Email:</div>
                <input type = "text" defaultValue={guideid} className="longInput" required onChange = {(e) => setRemarks(e.target.value)} />
            </label>
            <div className='errorMessage'>
                {errMessage}
            </div>
            <label>
                <button className="submitButton" onClick = {createSlot} > Submit </button>
            </label>
        </form>
        </div>

        <div className = "adminMenu">
            <Link to='/' className="linkButton"> Back </Link>
            <button className="linkButton" onClick = {clearHistory} > Clear Slot History</button>  
        </div>
 
    </div>
    );
}

export default TelescopeSlotForm;