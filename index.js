const discord = require('discord.js')
const client = new discord.Client()
const config = require('./config.json')
const search = require('youtube-search')
const  stayActive =require('./server.js')
const schedule = require('node-schedule');
const fs = require('fs')
var cron = require('node-cron')
const google = require('googleapis').google
const customsearch = google.customsearch('v1')
const {addlink} = require('./musicsave.js')
const robot = require('./imageapi.js')
const mongoose = require('mongoose')
const mongodb =require('mongodb')
const Schema = mongoose.Schema
mongoose.connect('mongodb+srv://musiclinks:marily1903@cluster0.md5yk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true}).then(console.log('created'));
const opts = {
  maxResults : 25,
  key : config.YOUTUBE_API,
  type :'video',
  relevanceLanguage:'zh-Hans'
}

const MyModel = mongoose.model('Music link', new Schema({ link: String }));


client.on('ready',()=>{console.log('channel ran')}); // You don't need to add anything to the message event listener
var today = new Date()
var hour = today.getHours()
var minute = today.getMinutes()+3
var second = today.getSeconds()
console.log(`${second} ${minute} ${hour}`)
let scheduledMessage = new cron.schedule(`${second} ${minute} ${hour} * * *`, () => {
  // This runs every day at 10:30:00, you can do anything you want
  const guild = client.guilds.cache.get('864308335629303808');
  let channel =guild.channels.get('864308336589406212');
  console.log('sent message')
  channel.send('message sent');
},{scheduled:true});

// When you want to start it, use:
scheduledMessage.start()

client.on('message', async message =>{
 if(message.author.bot) return 
 if(message.content=="@hello") 
 {
   message.reply('hello khoa')
 }


 if(message.content =="@search-random"){
   
   let filter = m => m.author.id===message.author.id
   let embed = new discord.MessageEmbed()
    .setColor('#73ffdc')
    .setDescription('please enter the search query')
    .setTitle('maid chan youtube search')
  let embedmsg = await message.channel.send(embed)
  let collected = await message.channel.awaitMessages(filter,{max :1})
   
  console.log(collected.first().content)
  
   
  
  const results = await search(collected.first().content,opts).catch(error =>console.log(error))
  console.log(results)
  let index = Math.floor(Math.random()*25)
  if(results){
  let show = results.results[index]
  console.log(show)
  newembed = new discord.MessageEmbed()
    .setColor('#73ffdc')
    .setURL(`${show.link}`)
    .setDescription(`${show.description}`)
    .setThumbnail(`${show.thumbnails.default.url}`)
    .setTitle(`${show.title}`)
 }
 message.reply("Here you are! Dont search more😑😑😑")
  message.channel.send(newembed)
 }


 if(message.content=="@search"){
  message.reply("what you need to search??😑😑😑")
  let filter = m => m.author.id === message.author.id 
  
  let collect = await message.channel.awaitMessages(filter,{max:1})
  const show = await search(collect.first().content,opts).catch(error=>console.log(error))
  if(show){
  var index = 0
  search_result = show.results
  let titles = search_result.map(
      result =>{
        index++;
        return index +`.`+result.title
      }
    )
    
    message.channel.send({
      embed:{
        title : "pick one by number(just number 🥺🥺🥺)",
        description :titles.join("\n")
      }
      })
  
  const filterer = m => m.author.id ===message.author.id
  const choice = await message.channel.awaitMessages(filterer,{max:1})
  const final = search_result[choice.first().content -1]
  console.log(choice.first().content)
  newembed = new discord.MessageEmbed()
    .setColor('#73ffdc')
    .setURL(`${final.link}`)
    .setDescription(`${final.description}`)
    .setThumbnail(`${final.thumbnails.default.url}`)
    .setTitle(`${final.title}`)
  
 message.channel.send(newembed)
  }
 }






 if(message.content=="@searchunlimit")
 {
   ok1 = 1
   message.reply('what now😑😑😑?')
   
     let filter = m => m.author.id ===message.author.id
    let collect = await message.channel.awaitMessages(filter,{max:1})
    
   const show = await search(collect.first().content,opts).catch(error=>console.log(error))
  if(show){
  var index = 0
  search_result = show.results
  let titles = search_result.map(
      result =>{
        index++;
        return index +`.`+result.title
      }
    )
    message.channel.send('pick one numberjust number🥺')
  message.channel.send({
      embed:{
        title : "pick one by number(just number 🥺🥺🥺)",
        description :titles.join("\n")
      }
      })
  ok2 =1;
 while(ok2){
  const filterer = m => m.author.id ===message.author.id
  const choice = await message.channel.awaitMessages(filterer,{max:1})
  if(choice.first().content =="@stop"||choice.first().content=="@stopall")
  {
    ok2 = 0
    break
  }
  const final = search_result[choice.first().content -1]
  if(final){
  console.log(choice.first().content)
  newembed = new discord.MessageEmbed()
    .setColor('#73ffdc')
    .setURL(`${final.link}`)
    .setDescription(`${final.description}`)
    .setThumbnail(`${final.thumbnails.default.url}`)
    .setTitle(`${final.title}`)
  
 message.channel.send(newembed)
  }
  else{
    message.channel.send("Type ngu bỏ moẹ! Type lại đi(only number🥺)")
  }
  }
  }
 
 
 }
  if(message.content=="@img")
  {
    message.reply("What kind of image you want to search😑?")
    let filter = m => m.author.id ===message.author.id
    const choice = await message.channel.awaitMessages(filter,{max:1})
    var listimage = await robot(`${choice.first().content}`)
    
    console.log(listimage)
    if(listimage){
    const embed  = new discord.MessageEmbed()
      .setImage(listimage)
    message.channel.send(embed)
    }
    else{
      message.channel.send('image not found🥲🥲🥲')
    }
  }
  if(message.content=='@sandp')
  {
    message.reply("what you need to search and play ??😑😑😑")
  let filter = m => m.author.id === message.author.id 
  
  let collect = await message.channel.awaitMessages(filter,{max:1})
  const show = await search(collect.first().content,opts).catch(error=>console.log(error))
  if(show){
  var index = 0
  search_result = show.results
  let titles = search_result.map(
      result =>{
        index++;
        return index +`.`+result.title
      }
    )
  message.channel.send({
      embed:{
        title : "pick one by number(just number 🥺🥺🥺)",
        description:titles.join("\n")
      }
      })
  const filterer = m => m.author.id ===message.author.id
  const choice = await message.channel.awaitMessages(filterer,{max:1})
  const final = search_result[choice.first().content -1]
  console.log(choice.first().content)
  newembed = new discord.MessageEmbed()
    .setColor('#73ffdc')
    .setURL(`${final.link}`)
    .setDescription(`${final.description}`)
    .setThumbnail(`${final.thumbnails.default.url}`)
    .setTitle(`${final.title}`)
  
 message.channel.send(`!play ${final.link}`)
  }
  }
  if(message.content =='@savelink'){
    var ok 
    let filter = m => m.author.id ===message.author.id
    message.channel.send('what do u want to save 😉😉😉')
    const link = await message.channel.awaitMessages(filter,{max:1}
    )
    
    var able = addlink(link)
    //console.log(able)
    if(able){
    message.channel.send('Link saved 😉')}
    else{
      message.channel.send('link not saved 🥲,try the with another url🥲')
    }
  }
  if(message.content =='@showsavedlink'){
    fs.readFile('musiclink.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); 
    links = obj.linksum
    console.log(links)
    var index =0 
    const search_result = links.map((link)=>{
      index+=1;
      const content = JSON.stringify(link.address)
      const parsecontent = JSON.parse(content)
      const embed = JSON.stringify(parsecontent[0].embeds)
      const embed2 = JSON.parse(embed)
      if(embed2[0].title){
      return index +`)`+embed2[0].title;
      console.log('ok')}
      else{return false}
    })
    console.log(search_result)
    if(search_result){
    const embedmsg = new discord.MessageEmbed()
      .setTitle("here are the list")
      .setDescription(search_result.join(`\n`))
    message.channel.send(embedmsg)}
    else{message.channel.send('can not show because u saved the wrong link 😑')}
  }
 })}
})


stayActive()
client.login(config.TOKEN)