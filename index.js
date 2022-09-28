const app = require('./app')
require('dotenv').config()
const port = process.env.PORT
require('./config/database')



app.listen(port, () => {
  console.log(` app listening on port ${port}`)
})