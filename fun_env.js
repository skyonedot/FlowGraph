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
        first: 50 
        typeId: "${event}"
        ordering: Ascending
        ${after == null ? "" : "after:\"" + after + "\""}
      ){
        ...Edge
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

const getFields = (edges) => {
    let return_node = {}
    for (var i of edges) {
      let { node } = i
      if (node.type.name == "SoulMadeMainPurchased") {
        return_node = node
      }
    }
    return return_node
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

const marketEdges = (edge) => {
    var { cursor, node } = edge;
    const { time, transaction } = node;
    const { hash, authorizers, events } = transaction;
    const [{ address }] = authorizers
    const { edges } = events
    var { _, fields } =  getFields(edges)
    fields = fields.map((i) => i.value)
    return {
      cursor,
      time,
      hash,
      address,
      fields
    };
  }

  const compmarketEdges = (edge) => {
    var { cursor, node } = edge;
    const { time, transaction } = node;
    const { hash, authorizers, events } = transaction;
    const [{ address }] = authorizers
    const { edges } = events
    var { _, fields } =  getCompFields(edges)
    fields = fields.map((i) => i.value)
    return {
      cursor,
      time,
      hash,
      address,
      fields
    };
  }
//  SoulMadeMainPurchased

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
    compmarketEdges
}