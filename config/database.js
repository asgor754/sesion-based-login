const mongoose = require('mongoose')
mongoose.connect(process.env.MONGOBD_URL).then((result)=>console.log('database is connected'))