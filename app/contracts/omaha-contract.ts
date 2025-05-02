export const OMAHA_CONTRACT = {
  address: "0x8886737f833d28AD550ef193fA90B96803F823Ce" as const,
  abi: [
    {
     "inputs": [
      {
       "internalType": "uint256",
       "name": "game_id",
       "type": "uint256"
      },
      {
       "internalType": "uint256",
       "name": "fid",
       "type": "uint256"
      },
      {
       "internalType": "string",
       "name": "uri",
       "type": "string"
      }
     ],
     "name": "buy_hand",
     "outputs": [
      {
       "internalType": "uint256",
       "name": "token_id",
       "type": "uint256"
      }
     ],
     "stateMutability": "nonpayable",
     "type": "function"
    },
    {
     "inputs": [
      {
       "internalType": "uint256",
       "name": "game_id",
       "type": "uint256"
      }
     ],
     "name": "claim",
     "outputs": [],
     "stateMutability": "nonpayable",
     "type": "function"
    },
    {
     "inputs": [
      {
       "internalType": "uint256",
       "name": "game_id",
       "type": "uint256"
      },
      {
       "internalType": "uint256",
       "name": "token_id",
       "type": "uint256"
      }
     ],
     "name": "fold_hand",
     "outputs": [],
     "stateMutability": "nonpayable",
     "type": "function"
    },
    {
     "inputs": [
      {
       "internalType": "address",
       "name": "_owner",
       "type": "address"
      },
      {
       "internalType": "address",
       "name": "_buy_in_token",
       "type": "address"
      },
      {
       "internalType": "uint256",
       "name": "_buy_in_amount",
       "type": "uint256"
      },
      {
       "internalType": "uint256",
       "name": "_buy_in_token_decimals",
       "type": "uint256"
      }
     ],
     "stateMutability": "nonpayable",
     "type": "constructor"
    },
    {
     "inputs": [
      {
       "internalType": "address",
       "name": "owner",
       "type": "address"
      }
     ],
     "name": "OwnableInvalidOwner",
     "type": "error"
    },
    {
     "inputs": [
      {
       "internalType": "address",
       "name": "account",
       "type": "address"
      }
     ],
     "name": "OwnableUnauthorizedAccount",
     "type": "error"
    },
    {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "internalType": "uint256",
       "name": "game_id",
       "type": "uint256"
      },
      {
       "indexed": true,
       "internalType": "address",
       "name": "user",
       "type": "address"
      },
      {
       "indexed": false,
       "internalType": "uint256",
       "name": "amount",
       "type": "uint256"
      }
     ],
     "name": "Claimed",
     "type": "event"
    },
    {
     "inputs": [
      {
       "internalType": "uint256",
       "name": "game_id",
       "type": "uint256"
      },
      {
       "internalType": "address[]",
       "name": "_winners",
       "type": "address[]"
      }
     ],
     "name": "end_game",
     "outputs": [],
     "stateMutability": "nonpayable",
     "type": "function"
    },
    {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "internalType": "uint256",
       "name": "game_id",
       "type": "uint256"
      },
      {
       "indexed": false,
       "internalType": "address[]",
       "name": "winners",
       "type": "address[]"
      }
     ],
     "name": "GameEnded",
     "type": "event"
    },
    {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "internalType": "uint256",
       "name": "game_id",
       "type": "uint256"
      }
     ],
     "name": "GameStarted",
     "type": "event"
    },
    {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "internalType": "uint256",
       "name": "game_id",
       "type": "uint256"
      },
      {
       "indexed": true,
       "internalType": "address",
       "name": "user",
       "type": "address"
      },
      {
       "indexed": true,
       "internalType": "uint256",
       "name": "token_id",
       "type": "uint256"
      },
      {
       "indexed": false,
       "internalType": "uint256",
       "name": "fid",
       "type": "uint256"
      }
     ],
     "name": "HandBought",
     "type": "event"
    },
    {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "internalType": "uint256",
       "name": "game_id",
       "type": "uint256"
      },
      {
       "indexed": true,
       "internalType": "address",
       "name": "user",
       "type": "address"
      },
      {
       "indexed": true,
       "internalType": "uint256",
       "name": "token_id",
       "type": "uint256"
      },
      {
       "indexed": false,
       "internalType": "uint256",
       "name": "refund_amount",
       "type": "uint256"
      }
     ],
     "name": "HandFolded",
     "type": "event"
    },
    {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "internalType": "address",
    "name": "previousOwner",
    "type": "address"
   },
   {
    "indexed": true,
    "internalType": "address",
    "name": "newOwner",
    "type": "address"
   }
  ],
  "name": "OwnershipTransferred",
  "type": "event"
 },
 {
  "inputs": [],
  "name": "renounceOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
 },
 {
  "inputs": [],
  "name": "start_game",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
 },
 {
  "inputs": [
   {
    "internalType": "address",
    "name": "newOwner",
    "type": "address"
   }
  ],
  "name": "transferOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
 },
 {
  "inputs": [
   {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
   }
  ],
  "name": "update_buy_in_amount",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
 },
 {
  "inputs": [
   {
    "internalType": "address",
    "name": "token",
    "type": "address"
   },
   {
    "internalType": "uint256",
    "name": "decimals",
    "type": "uint256"
   }
  ],
  "name": "update_buy_in_token",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
 },
 {
  "inputs": [],
  "name": "fetch_buy_in",
  "outputs": [
   {
    "internalType": "uint256",
    "name": "buy_in",
    "type": "uint256"
   }
  ],
  "stateMutability": "view",
  "type": "function"
 },
 {
  "inputs": [],
  "name": "fetch_buy_token",
  "outputs": [
   {
    "internalType": "address",
    "name": "token",
    "type": "address"
   }
  ],
  "stateMutability": "view",
  "type": "function"
 },
 {
  "inputs": [
   {
    "internalType": "uint256",
    "name": "game_id",
    "type": "uint256"
   },
   {
    "internalType": "address",
    "name": "user",
    "type": "address"
   }
  ],
  "name": "fetch_game_participant_data",
  "outputs": [
   {
    "internalType": "uint256",
    "name": "token_id",
    "type": "uint256"
   },
   {
    "internalType": "uint256",
    "name": "fid",
    "type": "uint256"
   }
  ],
  "stateMutability": "view",
  "type": "function"
 },
 {
  "inputs": [],
  "name": "fetch_hands_address",
  "outputs": [
   {
    "internalType": "address",
    "name": "hands_address",
    "type": "address"
   }
  ],
  "stateMutability": "view",
  "type": "function"
 },
 {
  "inputs": [
   {
    "internalType": "uint256",
    "name": "game_id",
    "type": "uint256"
   }
  ],
  "name": "fetch_participant_list",
  "outputs": [
   {
    "internalType": "address[]",
    "name": "participants",
    "type": "address[]"
   }
  ],
  "stateMutability": "view",
  "type": "function"
 },
 {
  "inputs": [
   {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
   }
  ],
  "name": "games",
  "outputs": [
   {
    "internalType": "uint256",
    "name": "game_pot",
    "type": "uint256"
   },
   {
    "internalType": "uint256",
    "name": "hand_count",
    "type": "uint256"
   },
   {
    "internalType": "enum OnchainOmahaGame.GameState",
    "name": "state",
    "type": "uint8"
   }
  ],
  "stateMutability": "view",
  "type": "function"
 },
 {
  "inputs": [],
  "name": "owner",
  "outputs": [
   {
    "internalType": "address",
    "name": "",
    "type": "address"
   }
  ],
  "stateMutability": "view",
  "type": "function"
 }
] as const
} as const; 