var { GraphQLClient, gql } = require("graphql-request");
const fs = require('fs');
require('dotenv').config()
const endpointFlowScan = "https://query.flowgraph.co";

const client = new GraphQLClient(endpointFlowScan, {
  headers: {
    authorization: `Bearer ${process.env.TOKEN}`,
  },
});


const edge = gql`
fragment Edge on EventConnection {
  pageInfo {
    endCursor
    hasNextPage
  }
  edges {
    cursor
    node {
      time
      transaction {
        hash
        authorizers {
          address
        }
        events {
          edges {
              node {
                  type {
                      name
                  }
                  fields
              }
          }
        }
      }
    }
  }
}
`;

const queryEvent = (event, after = null) => {
  return gql`
    ${edge}
    query StakingRewardTokensWithdrawn {
      events (
        first: 100
        typeId: "${event}"
        ordering: Ascending
        ${after == null ? "" : "after:\"" + after + "\""}
      ){
        ...Edge
      }
    }
 `
}



const queryTokenTransfer = (account,token, after = null) => {
  return gql`
  {
    account(id: "${account}") {
      tokenTransfers (
        first: 5 
        ordering: Descending
        contractId: "${token}"
        ${after == null ? "" : "after:\"" + after + "\""}
        type: Deposit
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            transaction {
              hash
              time
            }
            type
            amount {
              token {
                id
              }
              value
            }
            counterparty {
              address
            }
            counterpartiesCount
          }
        }
      }
    }
  }
  
  `
}




const collecitonEdges = (edge) => {
  const { cursor, node } = edge;
  const { time, transaction } = node;
  const { hash, authorizers } = transaction;
  const [{ address }] = authorizers
  return {
    cursor,
    time,
    hash,
    address
  };
}

const getFields = (edges, event) => {
  let return_node = {}
  for (var i of edges) {
    let { node } = i
    if (node.type.name == "SoulMadeMainPurchased") {
      return_node = node
    }
  }
  return return_node
}

const marketEdges = (edge) => {
  var { cursor, node } = edge;
  const { time, transaction } = node;
  const { hash, authorizers, events } = transaction;
  const [{ address }] = authorizers
  const { edges } = events
  var { _, fields } = getFields(edges)
  fields = fields.map((i) => i.value)
  return {
    cursor,
    time,
    hash,
    address,
    fields
  };
}


const getCompFields = (edges) => {
  let return_node = {}
  for (var i of edges) {
    let { node } = i
    if (node.type.name == "SoulMadeComponentPurchased") {
      return_node = node
    }
  }
  return return_node
}


const compmarketEdges = (edge) => {
  var { cursor, node } = edge;
  const { time, transaction } = node;
  const { hash, authorizers, events } = transaction;
  const [{ address }] = authorizers
  const { edges } = events
  var { _, fields } = getCompFields(edges)
  fields = fields.map((i) => i.value)
  return {
    cursor,
    time,
    hash,
    address,
    fields
  };
}

const getDropOpenFields = (edges) => {
  let return_node = {type:{name:""},fields:[]}
  // let return_node = {}
  for (var i of edges) {
    let { node } = i
    if (node.type.name == "SoulMadePackOpened") {
      return_node = node
    }
  }
  return return_node
}

const dropOpenEdges = (edge) => {
  var { cursor, node } = edge;
  const { time, transaction } = node;
  const { hash, authorizers, events } = transaction;
  const [{ address }] = authorizers
  const { edges } = events
  var { _, fields } = getDropOpenFields(edges)
  fields = fields.map((i) => i.value)
  return {
    cursor,
    time,
    hash,
    address,
    fields
  };
}


const getPackClaimFields = (edges) => {
  let return_node = {type:{name:""},fields:[]}
  for (var i of edges) {
    let { node } = i
    if (node.type.name == "SoulMadePackFreeClaim") {
      return_node = node
    }
  }
  return return_node
}

const packClaimEdges = (edge) => {
  var { cursor, node } = edge;
  const { time, transaction } = node;
  const { hash, authorizers, events } = transaction;
  const [{ address }] = authorizers
  const { edges } = events
  var { _, fields } = getPackClaimFields(edges)
  fields = fields.map((i) => i.value)
  return {
    cursor,
    time,
    hash,
    address,
    fields
  };
}


function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function writetoFile(info, file) {
  for (var i of info) {
    fs.writeFileSync(file, JSON.stringify(i, null, 2) + ",\n", { flag: "a+" }, 'utf-8');
  }
}

module.exports = {
  client,
  queryEvent,
  delay,
  writetoFile,
  marketEdges,
  collecitonEdges,
  compmarketEdges,
  dropOpenEdges,
  packClaimEdges,
  queryTokenTransfer
}