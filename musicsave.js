const config = require('./config.json')
const fs = require('fs')

const addlink = (link) => {
var ok =0
const availableok= JSON.stringify(link)
const checkok= JSON.parse(availableok)
if(checkok[0].embeds[0]){ok=1}else{ok=0}
fs.readFile('musiclink.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); 
    const available = JSON.stringify(link)
    const check = JSON.parse(available)
    console.log(check[0].embeds)
    if(check[0].embeds[0]){
    var today = new Date()
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+" "+date;//now it an object
    obj.linksum.push({id:time ,address:link});//add some data
    json = JSON.stringify(obj); //convert it back to json
    
    fs.writeFile('musiclink.json', json, 'utf8',()=>{
      console.log('linkadded')
    })
    }
    else{
      console.log('error')
    }; // write it back 
}});
return ok
}


module.exports = {addlink}
