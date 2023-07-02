// const fs = require('fs');
var exampleInfo = "{\"username\":\"十九\",\"birthday\":\"1999.10.9\",\"email\":\"cat@example.com\"}"

function getLoginResponse(username, password){
    if (username === "" || password === ""){
        return false;
    }
    return true;
}

function getUserInfoResponse(username){
    try {
        const data = JSON.parse(exampleInfo);
        console.log(data); // The parsed JSON object
        return data
      } catch (err) {
        console.error('Error reading JSON file:', err);
      }
    
}


function setUserInfoResponse(username, email, bday){
    const obj = {username:username, email:email, birthday:bday}
    exampleInfo = JSON.stringify(obj)
}

module.exports = {getLoginResponse, getUserInfoResponse, setUserInfoResponse}