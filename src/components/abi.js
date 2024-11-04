const abi = {"contract": {
  "name": "AlgoStory",
  "desc": "A simple contract for selling NFTs.",
  "methods": [
      {
          "name": "creator",
          "args": [],
          "readonly": false,
          "returns": {
              "type": "address",
              "desc": "The creator's address."
          },
          "desc": "A public method that returns the creator's address encoded as an ARC-4 ABI type."
      },
      {
          "name": "book_opt_in",
          "args": [
              {
                  "type": "asset",
                  "name": "nft",
                  "desc": "The asset to opt in to."
              }
          ],
          "readonly": false,
          "returns": {
              "type": "void"
          },
          "desc": "Opts the contract into an asset."
      },
      {
          "name": "list_book",
          "args": [
              {
                  "type": "axfer",
                  "name": "axfer",
                  "desc": "The transaction transferring the asset for sale to the contract."
              },
              {
                  "type": "uint64",
                  "name": "price",
                  "desc": "The minimum price the asset can be sold for."
              }
          ],
          "readonly": false,
          "returns": {
              "type": "void"
          },
          "desc": "Lists an NFT for sale."
      },
      {
          "name": "book_price",
          "args": [
              {
                  "type": "asset",
                  "name": "nft",
                  "desc": "The NFT."
              }
          ],
          "readonly": false,
          "returns": {
              "type": "uint64",
              "desc": "The minimum sale price in MicroAlgos."
          },
          "desc": "Returns the minimum sale price for an NFT."
      },
      {
          "name": "purchase_book",
          "args": [
              {
                  "type": "asset",
                  "name": "nft",
                  "desc": "The NFT being purchased."
              },
              {
                  "type": "pay",
                  "name": "payment",
                  "desc": "The payment to the creator."
              },
              {
                  "type": "uint64",
                  "name": "amount"
              }
          ],
          "readonly": false,
          "returns": {
              "type": "void"
          },
          "desc": "Allows a user to purchase an NFT."
      }
  ],
  "networks": {}
},}