import { PublicKey } from "@solana/web3.js";

/** GLOBAL CONSTANT */

export const Networks = {
    MAINNET: 101,
    DEVNET: 102
}
// export const DEFAULT_NETWORK = Networks.MAINNET;
export const DEFAULT_NETWORK = Networks.DEVNET;
export const IS_MAINNET = DEFAULT_NETWORK == Networks.MAINNET;
export const NETWORK = IS_MAINNET ? "mainnet-beta" : "devnet";

export const SECONDS_PER_DAY = 24 * 60 * 60;

export const RS_PREFIX = "puffu-nft-staking";
export const RS_STAKEINFO_SEED = "puffu-stake-info";
export const RS_STAKE_SEED = "puffu-nft-staking";
export const RS_VAULT_SEED = "puffu-vault";

export const CLASS_TYPES = [10, 20, 50]; // [65, 50, 43, 35, 27, 14, 9, 7, 4];
export const LOCK_DAY = [0, 10, 23]; // 0 => 10, 10 => 10, 23 => 50
export const TOKEN_DECIMALS = 9;

/** NFT Staking Constant */

export const SWRD_TOKEN_MINT = new PublicKey(
    IS_MAINNET ?
    "ExLjCck16LmtH87hhCAmTk4RWv7getYQeGhLvoEfDLrH" :
    "4FkRq5ikN6ZyF2SSH2tgvuFP4kf2vxTuDQN4Kqnz2MQz"
)

export const NFT_CREATOR = new PublicKey(
    IS_MAINNET ? 
    "6rQse6Jq81nBork8x9UwccJJh4qokVVSYujhQRuQgnna" : 
    "7etbqNa25YWWQztHrwuyXtG39WnAqPszrGRZmEBPvFup"
);

export const PROGRAM_ID = new PublicKey(
    IS_MAINNET ? 
    "6RhXNaW1oQYQmjTc1ypb4bEFe1QasPAgEfFNhQ3HnSqo" : 
    "7RdikeoWp1fzYyw6k1tpoULgZEQ33tFnRE3Nf111NBuu"
)

export const INITIALIZER = new PublicKey(
    IS_MAINNET ? 
    "7etbqNa25YWWQztHrwuyXtG39WnAqPszrGRZmEBPvFup" : 
    "GTVhUEjJ2wpVAQuctQHqnL1FF5cciYreQ1qrw6mw8QXh"
)

// console.log("*********", IS_MAINNET, NETWORK, SWRD_TOKEN_MINT.toBase58());