import { PublicKey } from "@solana/web3.js";
import {
    RS_PREFIX,
    RS_STAKEINFO_SEED,
    RS_STAKE_SEED,
    RS_VAULT_SEED,
    PROGRAM_ID,
    SWRD_TOKEN_MINT
} from "./constants"

/** Get NFT Staking Account Keys  */

export const getPoolKey = async () => {
    const [poolKey] = await asyncGetPda(
        [Buffer.from(RS_PREFIX)],
        PROGRAM_ID
    );
    return poolKey;
};

export const getRewardVaultKey = async () => {
    const [rewardVaultKey] = await asyncGetPda(
        [
            Buffer.from(RS_VAULT_SEED),
            SWRD_TOKEN_MINT.toBuffer()
        ],
        PROGRAM_ID
    );
    return rewardVaultKey;
};

export const getStakedNFTKey = async (
    nftMintPk
) => {
    const [stakedNftKey] = await asyncGetPda(
        [
            Buffer.from(RS_STAKE_SEED),
            nftMintPk.toBuffer()
        ],
        PROGRAM_ID
    );
    return stakedNftKey;
};

export const getStakeInfoKey = async (
    nftMintPk
) => {
    const [stakedNftKey] = await asyncGetPda(
        [
            Buffer.from(RS_STAKEINFO_SEED),
            nftMintPk.toBuffer()
        ],
        PROGRAM_ID
    );
    return stakedNftKey;
};



const asyncGetPda = async (
    seeds,
    programId
) => {
    const [pubKey, bump] = await PublicKey.findProgramAddress(seeds, programId);
    return [pubKey, bump];
};