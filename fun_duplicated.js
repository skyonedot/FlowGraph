
const fs = require('fs')
const comp = require('./json/componentInit.json')
const main = require('./json/mainInit.json')
const market = require('./json/MainPurchased.json')
const compMarket = require('./json/componentpurchased.json')



let addressArray = comp.map(item => (item.address))
let uniqueAddress = [...new Set(addressArray)]
console.log("SoulMadeComponent init address count:",addressArray.length, "After duplicated, the amount: ",uniqueAddress.length)

addressArray = main.map(item => (item.address))
uniqueAddress = [...new Set(addressArray)]
console.log("Soulmademain  init address count:",addressArray.length, "After duplicated, the amount: ",uniqueAddress.length)


addressArray = market.map(item => (item.address))
let total_sell = market.reduce((item,value) =>  parseFloat(value.fields[1]) + item,0 )
uniqueAddress = [...new Set(addressArray)]
console.log("SoulmadeMarket buyer address count:",addressArray.length, "After duplicated, the amount:",uniqueAddress.length, "Total_Sell",total_sell.toFixed(2))



addressArray = compMarket.map(item => (item.address))
total_sell = compMarket.reduce((item,value) =>  parseFloat(value.fields[1]) + item,0 )
uniqueAddress = [...new Set(addressArray)]
console.log("SoulmadeComponent Market buyer address count:",addressArray.length, "After duplicated, the amount:",uniqueAddress.length, "Total_Sell",total_sell.toFixed(2))