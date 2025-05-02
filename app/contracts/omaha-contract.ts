export const OMAHA_CONTRACT = {
  address: "0xYourHandNFT" as const,
  abi: [
    {
      "inputs": [{ "name": "to", "type": "address" }],
      "name": "mint",
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "name": "from", "type": "address" },
        { "indexed": true, "name": "to", "type": "address" },
        { "indexed": true, "name": "tokenId", "type": "uint256" }
      ],
      "name": "Transfer",
      "type": "event"
    }
  ] as const
} as const; 