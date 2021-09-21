const express = require('express');
const path = require('path');
const app = express();
app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'));
const gamesRouter = require('./routes/gameRoutes');
const usersRouter = require('./routes/userRoutes');
const reviewsRouter = require('./routes/reviewRoutes');
const viewsRouter = require('./routes/viewRoutes');
const cookieParser = require('cookie-parser');
const compression = require('compression');


app.use(express.json());
app.use(cookieParser());
app.use((req,res,next) => {
    next();
});

app.use(compression())
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/',viewsRouter);
app.use('/game',gamesRouter);
app.use('/users',usersRouter);
app.use('/reviews',reviewsRouter);


module.exports = app;

//CODE IDEAS

// names = [];
// for(game in games){
//     names.push(games[game].name);
// }