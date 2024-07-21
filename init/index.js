const mongoose= require('mongoose');
const initdata=require('./data.js');
const Listing=require('../models/listing.js');


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/VivaVoyage');
}
main()  

const initDB =async ()=>{
   await Listing.deleteMany({});
   initdata.data= initdata.data.map((dt)=>({...dt, owner:'669635d37a1742ea084c6a34',category:'Foreign'}))
    await Listing.insertMany(initdata.data);
    console.log('initialized');
}
initDB()