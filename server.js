const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');



const DB = process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);
//console.log(DB);
mongoose.connect(DB, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(con => {
    //console.log(con.connections);
    //console.log('DB connection successful!');
})


const port = process.env.PORT || 3001;
app.listen(port, () =>{
    //console.log(`App running on port ${port}`);
});