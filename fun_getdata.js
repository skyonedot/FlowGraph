
const fs = require('fs');
const { client, queryEvent, delay, 
      writetoFile, marketEdges, collecitonEdges, 
      compmarketEdges, dropOpenEdges, 
      packClaimEdges, queryTokenTransfer } = require('./fun_env.js')



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
async function getEvent() {
  // await getData("A.9a57dfe5c8ce609c.SoulMadeComponent.SoulMadeComponentCollectionCreated", "./json/compInit.json", queryEvent, collecitonEdges)
  // await getData("A.9a57dfe5c8ce609c.SoulMadeMain.SoulMadeMainCollectionCreated", "./json/mainInit.json", queryEvent, collecitonEdges)
  // await getData("A.9a57dfe5c8ce609c.SoulMadeMarketplace.SoulMadeMainPurchased", "./json/mainPurchased.json", queryEvent, marketEdges)
  // await getData("A.9a57dfe5c8ce609c.SoulMadeMarketplace.SoulMadeComponentPurchased", "./json/compPurchased.json", queryEvent, compmarketEdges)
  await getData("A.9a57dfe5c8ce609c.SoulMadePack.SoulMadePackOpened", "./json/packOpened.json", queryEvent, dropOpenEdges)
  await getData("A.9a57dfe5c8ce609c.SoulMadePack.SoulMadePackFreeClaim", "./json/packClaimed.json", queryEvent, packClaimEdges)
}

// getEvent()



//-----------------------------------------
async function getToken(){
  // let response = await client.request(queryEvent("A.9a57dfe5c8ce609c.SoulMadePack.SoulMadePackOpened"));
  // console.log(response)

  let response = await client.request(queryTokenTransfer("0x9a57dfe5c8ce609c", "A.1654653399040a61.FlowToken"));
  response.account.tokenTransfers.edges.map((i) => {
    if (i.node.amount.value == '1500000000'){
      fs.writeFileSync("FlowTransfer.txt", `15--${i.node.transaction.hash}--${i.node.transaction.time}\n`,{flag: "a+" }, 'utf-8')
    }else if (i.node.amount.value == '300000000') {
      fs.writeFileSync("FlowTransfer.txt", `03--${i.node.transaction.hash}--${i.node.transaction.time}\n`,{flag: "a+" }, 'utf-8')
    }
  })
  // console.log()
  while (response.account.tokenTransfers.pageInfo.hasNextPage) {
    response = await client.request(queryTokenTransfer("0x9a57dfe5c8ce609c", "A.1654653399040a61.FlowToken", response.account.tokenTransfers.pageInfo.endCursor));
    // response = await client.request(query(event, response.events.pageInfo.endCursor));
    response.account.tokenTransfers.edges.map((i) => {
      if (i.node.amount.value == '1500000000'){
        fs.writeFileSync("FlowTransfer.txt", `15--${i.node.transaction.hash}--${i.node.transaction.time}\n`,{flag: "a+" }, 'utf-8')
      }else if (i.node.amount.value == '300000000') {
        fs.writeFileSync("FlowTransfer.txt", `03--${i.node.transaction.hash}--${i.node.transaction.time}\n`,{flag: "a+" }, 'utf-8')
      }
    })
    console.log(response.account.tokenTransfers.pageInfo.endCursor, response.account.tokenTransfers.pageInfo.hasNextPage)
  }
}

getToken()