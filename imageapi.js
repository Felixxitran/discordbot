const google = require('googleapis').google
const customsearch = google.customsearch('v1')
const config = require('./config.json')

async function robot(parameter){
  const fetchimage = await getimage(parameter)
  
  async function getimage(query){
    const number = Math.floor(Math.random()*20)
    const response = await customsearch.cse.list({
    auth:config.API_KEY,
    cx:config.SEARCH_ENGINE_ID,
    siteSearch:'https://www.wallpaperflare.com/',
    siteSearchFilter:"i",
    q:query,
    searchType:'image',
    lr:"lang_zh-CN",
    num:1,
    start:number+10
  })
  if(response.data.items){
    console.log(response.data.items[0])
  const imageurl = response.data.items[0].link
  return imageurl}
  else{
    console.log('error')
  }
  
  }
  return fetchimage
}

module.exports = robot