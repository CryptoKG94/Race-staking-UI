import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import {
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { isValidSolanaAddress } from "@nfteyez/sol-rayz";

import { IDL } from '../anchor_idl/idl/staking_program';
import {
  SWRD_TOKEN_MINT,
  CLASS_TYPES,
  PROGRAM_ID,
  SECONDS_PER_DAY,
  LOCK_DAY,
} from '../constants';
import {
  getPoolKey,
  getRewardVaultKey,
  getStakedNFTKey,
  getStakeInfoKey,
} from '../keys';
import {
  getProvider,
  getMultipleTransactions,
  sendMultiTransactions,
  getNftMetadataURI,
  getTokenAccount,
  getNFTTokenAccount,
  getAssociatedTokenAccount,
} from '../utils';

export const initProject = async () => {
  // console.log("On init click");
  const provider = await getProvider();
  const program = new anchor.Program(IDL, PROGRAM_ID, provider);

  const res = await program.methods.initializeStakingPool(CLASS_TYPES, LOCK_DAY).accounts({
    admin: provider.wallet.publicKey,
    poolAccount: await getPoolKey(),
    rewardMint: SWRD_TOKEN_MINT,
    rewardVault: await getRewardVaultKey(),
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY
  }).rpc();
  // console.log("Your transaction signature : ", res);
}

export const stakeNft = async (selectedNftMint) => {
  // console.log("On stake NFT");
  const provider = await getProvider();
  const program = new anchor.Program(IDL, PROGRAM_ID, provider);

  let instructions = [];
  for (let i = 0; i < selectedNftMint.length; i++) {
    const nftMintPk = new PublicKey(selectedNftMint[i]);

    let uri = await getNftMetadataURI(nftMintPk);
    let tokenId = await getNftTokenId(uri);
    let nftClass = getNftClass(tokenId);

    if (nftClass < 0) return;
    // console.log("token URI : ", uri);
    // console.log("token Class : ", nftClass);

    const ix = await program.methods.stakeNft(nftClass).accounts({
      owner: provider.wallet.publicKey,
      poolAccount: await getPoolKey(),
      nftMint: nftMintPk,
      userNftTokenAccount: await getNFTTokenAccount(nftMintPk, provider.wallet.publicKey),
      destNftTokenAccount: await getStakedNFTKey(nftMintPk),
      nftStakeInfoAccount: await getStakeInfoKey(nftMintPk),
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    }).instruction();
    instructions.push(ix);
    // console.log("Your transaction signature : ", res);
  }

  let instructionSet = await getMultipleTransactions(provider.connection, provider.wallet, instructions);
  let res = await sendMultiTransactions(provider.connection, provider.wallet, instructionSet);
  // console.log('txHash =', res);
  return res;
}

export const unstakeNft = async (selectedNftMint) => {
  // console.log("On Unstake NFT");
  const provider = await getProvider();
  const program = new anchor.Program(IDL, PROGRAM_ID, provider);

  let instructions = [];
  for (let i = 0; i < selectedNftMint.length; i++) {
    const nftMintPk = new PublicKey(selectedNftMint[i]);

    const ix = await program.methods.withdrawNft().accounts({
      owner: provider.wallet.publicKey,
      poolAccount: await getPoolKey(),
      nftMint: nftMintPk,
      userNftTokenAccount: await getTokenAccount(nftMintPk, provider.wallet.publicKey),
      stakedNftTokenAccount: await getStakedNFTKey(nftMintPk),
      nftStakeInfoAccount: await getStakeInfoKey(nftMintPk),
      rewardToAccount: await getAssociatedTokenAccount(provider.wallet.publicKey, SWRD_TOKEN_MINT),
      rewardVault: await getRewardVaultKey(),
      rewardMint: SWRD_TOKEN_MINT,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    }).instruction();
    instructions.push(ix);
    // console.log("Your transaction signature", res);
  }

  let instructionSet = await getMultipleTransactions(provider.connection, provider.wallet, instructions);
  let res = await sendMultiTransactions(provider.connection, provider.wallet, instructionSet);
  // console.log('txHash =', res);
  return res;
}

export const claimReward = async (params) => {
  // console.log("On claim reward");
  const provider = await getProvider();
  const program = new anchor.Program(IDL, PROGRAM_ID, provider);

  let instructions = [];
  for (let i = 0; i < params.length; i++) {
    const nftMintPk = new PublicKey(params[i].id);

    const ix = await program.methods.claimReward()
      .accounts(
        {
          owner: provider.wallet.publicKey,
          poolAccount: await getPoolKey(),
          nftStakeInfoAccount: await getStakeInfoKey(nftMintPk),
          rewardMint: SWRD_TOKEN_MINT,
          rewardVault: await getRewardVaultKey(),
          rewardToAccount: await getAssociatedTokenAccount(provider.wallet.publicKey, SWRD_TOKEN_MINT),
          rent: SYSVAR_RENT_PUBKEY,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          nftMint: nftMintPk,
        }
      ).instruction();
    instructions.push(ix);
  }

  let instructionSet = await getMultipleTransactions(provider.connection, provider.wallet, instructions);
  let res = await sendMultiTransactions(provider.connection, provider.wallet, instructionSet);
  // console.log('txHash =', res);
  return res;
}

export const getClaimableReward = (params) => {
  // console.log("############################", params);
  let currentTimeStamp = new Date().getTime() / 1000;
  // console.log("############################", currentTimeStamp);

  let reward = 0;
  params.map((item) => {
    reward += CLASS_TYPES[item.classId] * (currentTimeStamp - item.lastUpdateTime) / SECONDS_PER_DAY / 10;
  });
  // console.log("#############################", reward);
  if (reward < 0) reward = 0;

  return reward.toFixed(2);
}

export const getStakedInfo = async (pubKey) => {
  // console.log("Publick key =====================> ", pubKey)
  if (!isValidSolanaAddress(pubKey)) return [];
  let provider = await getProvider();
  const program = new anchor.Program(IDL, PROGRAM_ID, provider);

  const res = await program.account.stakeInfo.all(
    [
      {
        memcmp: {
          offset: 12,
          bytes: pubKey
        }
      }
    ]
  );
  // console.log("Staked info : ", res);
  return res;
}

const getNftTokenId = async (tokenURI) => {
  // console.log("token id =========================> ", tokenURI.properties.edition);
  return tokenURI?.properties?.edition;
}


const getNftClass = (tokenId) => {
  if (tokenId > 0 && tokenId <= 9) return 0;
  else if (tokenId > 9 && tokenId <= 150) return 1;
  else if (tokenId > 150 && tokenId <= 400) return 2;
  else if (tokenId > 400 && tokenId <= 700) return 3;
  else if (tokenId > 700 && tokenId <= 1100) return 4;
  else if (tokenId > 1100 && tokenId <= 1650) return 5;
  else if (tokenId > 1650 && tokenId <= 2350) return 6;
  else if (tokenId > 2350 && tokenId <= 3200) return 7;
  else if (tokenId > 3200) return 8;
  else return -1;
}

// export const showToast = (txt, ty) => {
//   let type = toast.TYPE.SUCCESS;
//   if (ty === 1) type = toast.TYPE.ERROR;
//   toast.error(txt, {
//     position: "bottom-left",
//     autoClose: 5000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     progress: undefined,
//     type,
//     theme: 'colored'
//   });
// }
