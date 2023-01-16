import './telescope.css';
import axios from 'axios';

const URL = 'http://localhost:5000';


const TelescopeSlot = (slot,admin,currid,token,hasBooked) => {
    //format date
    let startDate = new Date(slot.startDate);
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    startDate = startDate.toLocaleDateString('en-uk', options);


    let bookingStatus = slot.userid === null ? "Free" : "Taken";
    if(bookingStatus === "Taken" && slot.userid === currid) {bookingStatus = "Booked";}
    let remarks = slot.remarks;
    let username = slot.username;
    let userid = slot.userid == "[hidden]"? null : slot.userid;
    let startTime = slot.startTime? slot.startTime : "99:99:99";
    let endTime = slot.endTime? slot.endTime : "99:99:99";

    if(slot.remarks !== null) {remarks = "Remarks: " + slot.remarks}
    if(slot.userid === null) {username = "Not booked yet"; userid = "";}

    //display contact information only to admin or booker
    let privateSlotInfo = [];
    if(bookingStatus === "Booked" || admin) 
    {
        privateSlotInfo = <div className = "privateSlotInfo"> 
        <div> Guide: {slot.guidename} / {slot.guideid} </div>
        <div> User: {username} / {userid} </div>
        </div> ; 
    }

    //do checks
    const bookSlot = async () => {
        const res = await axios.patch(URL + '/bookslot', 
        {
            slotid: slot.slotid
        },
        {
            headers: {Authorization: "Bearer "+ token}
        });
        if(res.data.message === "already"){alert("Cannot book more than one slot per user!");}
        else { window.location.reload(); }
     } 

    const cancelSlot = async () => { 
        if(window.confirm("Confirm Slot Deletion") )
        {
            const res = await axios.delete(URL + '/cancelslot', 
            {
                headers: {Authorization: "Bearer "+ token},
                data: {slotid: slot.slotid}
            });
            window.location.reload();
        }   
    } 


    /* 
    admin- shown cancel button
    user with a booking- shown booked slot details, button removed from other available slots
    not signed in- shown available or not   
    user- shown book button where available    
    */
    
    let button = [];
    if(admin)   
        {button = <button id= {slot.slotid} onClick = {cancelSlot} > Cancel </button> }

    else if(bookingStatus === "Booked")
        {button = <div>✔ Booked</div>}

    else if(bookingStatus === "Free" && (currid === null || hasBooked))
        {button = <div>Available</div>}

    else if(bookingStatus === "Free" && !hasBooked)
        {button = <button id= {slot.slotid} onClick = {bookSlot} > Book </button> }


    //slot is colour coded. Slot has info to left, buttons to right. Private info is on second line
    return (
    <div className = {"telescopeSlot"+ bookingStatus}>
        <div className = "telescopeSlotInfo">

            <div className = "publicSlotInfo">
                <div> {startDate} </div>
                <div> {startTime} to {endTime} IST </div>
                <div> Location: {slot.venue} </div>
                <div> {remarks} </div>
            </div>
            
            {privateSlotInfo}
        </div>
        
        <div className = "telescopeSlotButtons">
            {button}
        </div>
    </div>

    );
}

export default TelescopeSlot;