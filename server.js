const express = require('express')
const app = express()

app.all("/",(req,res)=>{
  res.send('bot is running')
})

function stayActive (){
  app.listen(3000,()=> console.log('active on port 3000'))
}

module.exports = stayActive;