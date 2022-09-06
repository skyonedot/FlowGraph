
const fs = require('fs')
const comp = require('./json/compInit.json')
const main = require('./json/mainInit.json')
const market = require('./json/mainPurchased.json')
const compMarket = require('./json/compPurchased.json')
const packOpen = require('./json/packOpened.json')
const packClaim = require('./json/packClaimed.json')
const adminAddress = "0x9a57dfe5c8ce609c"




let addressArray = comp.map(item => (item.address))
let uniqueAddress = [...new Set(addressArray)]
console.log("SoulMadeComponent init address count:", addressArray.length, "After duplicated, the amount: ", uniqueAddress.length)
console.log('---------------------------------------')

addressArray = main.map(item => (item.address))
uniqueAddress = [...new Set(addressArray)]
console.log("Soulmademain  init address count:", addressArray.length, "After duplicated, the amount: ", uniqueAddress.length)
console.log('---------------------------------------')

addressArray = market.map(item => (item.address))
let market_admin_sell = market.reduce((value, item) => {
    if (item.fields[2] == adminAddress) {
        return (parseFloat(item.fields[1]) + value)
    } else {
        return value
    }
}, 0)
let maket_user_sell = market.reduce((value, item) => {
    if (item.fields[2] != adminAddress) {
        return (parseFloat(item.fields[1]) + value)
    } else {
        return value
    }
}, 0)
uniqueAddress = [...new Set(addressArray)]
console.log("SoulmadeMain Market buyer address count:", addressArray.length, "After duplicated, the amount:", uniqueAddress.length)
console.log("For Market, total sale data,", (market_admin_sell + maket_user_sell).toFixed(2), "our admin account sale data: :", market_admin_sell.toFixed(2), "user account sale data:", maket_user_sell.toFixed(2))
console.log('---------------------------------------')


addressArray = compMarket.map(item => (item.address))
market_admin_sell = compMarket.reduce((value, item) => {
    if (item.fields[2] == adminAddress) {
        return (parseFloat(item.fields[1]) + value)
    } else {
        return value
    }
}, 0)
maket_user_sell = compMarket.reduce((value, item) => {
    if (item.fields[2] != adminAddress) {
        return (parseFloat(item.fields[1]) + value)
    } else {
        return value
    }
}, 0)
uniqueAddress = [...new Set(addressArray)]
console.log("SoulmadeComponent Market buyer address count:", addressArray.length, "After duplicated, the amount:", uniqueAddress.length)
console.log("For Market, total sale data,", (market_admin_sell + maket_user_sell).toFixed(2), "our admin account sale data: :", market_admin_sell.toFixed(2), "user account sale data:", maket_user_sell.toFixed(2))
console.log('---------------------------------------')


addressArray = packOpen.map(item => (item.address))
let openpack_admin = packOpen.reduce((value, item) => {
    if (item.address == adminAddress) {
        return value + 1
    } else {
        return value
    }
}, 0)
let openpack_user = packOpen.reduce((value, item) => {
    if (item.address != adminAddress) {
        return value + 1
    } else {
        return value
    }
}, 0)
uniqueAddress = [...new Set(addressArray)]
console.log("SoulmadePack open address count:", addressArray.length, "After duplicated, the amount:", uniqueAddress.length)
console.log("For pack, total open amount:", (openpack_admin + openpack_user).toFixed(2), "our admin open pack amount: :", openpack_admin.toFixed(2), "user open pack amount:", openpack_user.toFixed(2))
console.log('---------------------------------------')


addressArray = packClaim.map(item => (item.address))
openpack_admin = packClaim.reduce((value, item) => {
    if (item.address == adminAddress) {
        return value + 1
    } else {
        return value
    }
}, 0)
openpack_user = packClaim.reduce((value, item) => {
    if (item.address != adminAddress) {
        return value + 1
    } else {
        return value
    }
}, 0)
uniqueAddress = [...new Set(addressArray)]
console.log("SoulmadePack open address count:", addressArray.length, "After duplicated, the amount:", uniqueAddress.length)
console.log("For pack, total open amount:", (openpack_admin + openpack_user).toFixed(2), "our admin open pack amount: :", openpack_admin.toFixed(2), "user open pack amount:", openpack_user.toFixed(2))
console.log('---------------------------------------')

