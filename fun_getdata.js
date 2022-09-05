
const fs = require('fs');
const { client, queryEvent, delay, writetoFile, marketEdges, collecitonEdges,compmarketEdges } = require('./fun_env.js')



async function getCollectionInitData(event, file) {
  let response = await client.request(queryEvent(event));
  let info = response.events.edges.map(collecitonEdges);
  fs.writeFileSync(file, "[", { flag: "a+" }, 'utf-8');
  writetoFile(info, file)
  while (response.events.pageInfo.hasNextPage) {
    response = await client.request(queryEvent(event, response.events.pageInfo.endCursor));
    info = response.events.edges.map(collecitonEdges);
    writetoFile(info, file)
    console.log(response.events.pageInfo.endCursor, response.events.pageInfo.hasNextPage)
    // await delay(1000);
  }
  fs.writeFileSync(file, "]", { flag: "a+" }, 'utf-8');
}




async function getMarketSellData(event, file) {
  let response = await client.request(queryEvent(event));
  let info = response.events.edges.map(marketEdges);
  // console.log(info)
  fs.writeFileSync(file, "[", { flag: "a+" }, 'utf-8');
  writetoFile(info, file)
  while (response.events.pageInfo.hasNextPage) {
    response = await client.request(queryEvent(event, response.events.pageInfo.endCursor));
    console.log(response.events.edges)
    info = response.events.edges.map(marketEdges);
    writetoFile(info, file)
    console.log(response.events.pageInfo.endCursor, response.events.pageInfo.hasNextPage)
    await delay(1000);
  }
  fs.writeFileSync(file, "]", { flag: "a+" }, 'utf-8');
}


async function compgetMarketSellData(event, file) {
  let response = await client.request(queryEvent(event));
  let info = response.events.edges.map(compmarketEdges);
  // console.log(info)
  fs.writeFileSync(file, "[", { flag: "a+" }, 'utf-8');
  writetoFile(info, file)
  while (response.events.pageInfo.hasNextPage) {
    response = await client.request(queryEvent(event, response.events.pageInfo.endCursor));
    // console.log(response.events.edges)
    info = response.events.edges.map(compmarketEdges);
    writetoFile(info, file)
    console.log(response.events.pageInfo.endCursor, response.events.pageInfo.hasNextPage)
    await delay(1000);
  }
  fs.writeFileSync(file, "]", { flag: "a+" }, 'utf-8');
}

async function getDropSaleData(event, file){

}


async function main() {
  // getCollectionInitData("A.9a57dfe5c8ce609c.SoulMadeComponent.SoulMadeComponentCollectionCreated","./json/compinit.json")
  // getCollectionInitData("A.9a57dfe5c8ce609c.SoulMadeMain.SoulMadeMainCollectionCreated","./json/maininit.json")
  // getMarketSellData("A.9a57dfe5c8ce609c.SoulMadeMarketplace.SoulMadeMainPurchased","./json/newmainpurchased.json","SoulMadeMainPurchased")
  compgetMarketSellData("A.9a57dfe5c8ce609c.SoulMadeMarketplace.SoulMadeComponentPurchased","./json/componentpurchased.json")
}



main()