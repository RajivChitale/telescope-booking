import admin from './firebase-config.js';

const middleware = async (req, res, next) => {
    if(req.headers.authorization === 'Bearer null'){
        if(req.path === '/fetchslots') {return next();} //fetch slots are excepted from authentication
        else {return res.json({ message: "Unauthorized" }); } 
    }
    const token = req.headers.authorization.split(' ')[1];  //get rid of the bearer part

    try {
        const decodeValue = await admin.auth().verifyIdToken(token); //validate token from google
        req.headers = decodeValue;

        if (decodeValue) { return next(); } //proceed to backend if valid
        else {return res.json({ message: "Unauthorized" }); } //invalid token
    }
    catch (err) {
        return res.json({ message: err.message }); 
    }
}

export default middleware;