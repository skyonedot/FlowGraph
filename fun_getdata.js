
const fs = require('fs');
const { client, queryEvent, delay, writetoFile, marketEdges, collecitonEdges, compmarketEdges, dropOpenEdges, packClaimEdges } = require('./fun_env.js')



async function getData(event, file, query, parseEdges) {
  let response = await client.request(query(event));
  let info = response.events.edges.map(parseEdges);
  fs.writeFileSync(file, "[", { flag: "a+" }, 'utf-8');
  writetoFile(info, file)
  while (response.events.pageInfo.hasNextPage) {
    response = await client.request(query(event, response.events.pageInfo.endCursor));
    if (response.events.edges.length != 0) {
      info = response.events.edges.map(parseEdges);
      writetoFile(info, file)
    }
    console.log(response.events.pageInfo.endCursor, response.events.pageInfo.hasNextPage)
  }
  fs.writeFileSync(file, "]", { flag: "a+" }, 'utf-8');
}


async function main() {
  // await getData("A.9a57dfe5c8ce609c.SoulMadeComponent.SoulMadeComponentCollectionCreated", "./json/compInit.json", queryEvent, collecitonEdges)
  // await getData("A.9a57dfe5c8ce609c.SoulMadeMain.SoulMadeMainCollectionCreated", "./json/mainInit.json", queryEvent, collecitonEdges)
  // await getData("A.9a57dfe5c8ce609c.SoulMadeMarketplace.SoulMadeMainPurchased", "./json/mainPurchased.json", queryEvent, marketEdges)
  // await getData("A.9a57dfe5c8ce609c.SoulMadeMarketplace.SoulMadeComponentPurchased", "./json/compPurchased.json", queryEvent, compmarketEdges)
  await getData("A.9a57dfe5c8ce609c.SoulMadePack.SoulMadePackOpened", "./json/packOpened.json", queryEvent, dropOpenEdges)
  await getData("A.9a57dfe5c8ce609c.SoulMadePack.SoulMadePackFreeClaim", "./json/packClaimed.json", queryEvent, packClaimEdges)

}

main()