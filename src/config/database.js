const mongoose = require('mongoose');

async function connectTodb() {
    try{

        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected sucessfully")
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectTodb;
