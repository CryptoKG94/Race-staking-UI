import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as nftTokenAbi } from "../abi/NFTToken.json";
import { abi as stakingAbi } from "../abi/Staking.json";
import { abi as FairLaunch } from "../abi/FairLaunch.json";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { error, info } from "../slices/MessagesSlice";
import { IStakeAsyncThunk,  INFTMintAsyncThunk, IJsonRPCError } from "./interfaces";
import { loadAccountDetails } from "./AccountSlice";
import axios from "axios";

interface IRarityTable {
  Balance: string,
  Speed: string,
  Power: string,
  Flash: string,
  Destroyer: string,
  Annihilator: string,
};

const RarityTable = {
  "Balance": "100",
  "Speed": "125",
  "Power": "150",
  "Flash": "175",
  "Destroyer": "200",
  "Annihilator": "300",
} as IRarityTable;

export const approve = createAsyncThunk(
  "nft/approve",
  async ({ amount, provider, address, networkID }: INFTMintAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const nftTokenContract = new ethers.Contract(addresses[networkID].NFT_TOKEN_ADDRESS as string, nftTokenAbi, signer);
    let approveTx;

    try {
      approveTx = await nftTokenContract.approbe(ethers.utils.parseUnits("100", "wei"), { value: ethers.utils.parseEther("0.15") });
      const text = "nft mint";
      const pendingTxnType = "nft_approbe";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: pendingTxnType, type: pendingTxnType }));

      await approveTx.wait();
      dispatch(loadAccountDetails({ networkID, address, provider }));
    } catch (e: unknown) {
      const errMsg = (e as IJsonRPCError).message;
      console.log(errMsg);
      dispatch(error("errMsg"));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

  },
);

export const mintNFTWithBNB = createAsyncThunk(
  "nft/mint",
  async ({ amount, provider, address, networkID }: INFTMintAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }


    const signer = provider.getSigner();
    const nftTokenContract = new ethers.Contract(addresses[networkID].NFT_TOKEN_ADDRESS as string, nftTokenAbi, signer);
    let approveTx;

    try {
      
       approveTx = await nftTokenContract.mint(ethers.utils.parseUnits("1", "wei"), { value: ethers.utils.parseEther("0.0005") });
      const text = "nft mint";
      const pendingTxnType = "nft_mint";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: pendingTxnType, type: pendingTxnType }));

      await approveTx.wait();
      dispatch(info("NFT Mint Successed. Please check your wallet!"));
      dispatch(loadAccountDetails({ networkID, address, provider }));

    } catch (e: unknown) {
      const errMsg = (e as IJsonRPCError).message;
      console.log(errMsg);
      dispatch(error("Purchased Failed!"));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

  },
);


export const mintNFTWithOIM = createAsyncThunk(
  "nft/mint",
  async ({ amount, provider, address, networkID }: INFTMintAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }


    const signer = provider.getSigner();
    const nftTokenContract = new ethers.Contract(addresses[networkID].NFT_TOKEN_ADDRESS as string, nftTokenAbi, signer);
    const oimTokenContract = new ethers.Contract(addresses[networkID].OIM_TOKEN_ADDRESS as string, ierc20Abi, signer);
    let approveTx;

    try {
      const balance = await nftTokenContract.balanceOf(address);

      console.log(balance.toString());
      if (balance.toString() > 0  ) {
        dispatch(info("Sorry. You bought a NFT arlready!"));
        return;
      }

      const tokenMinted = await nftTokenContract.tokenMinted();
      const IPFS_URL = "https://ipfs.moralis.io:2053/ipfs/QmZuKZycur8EELJd7UDuHu3cKMxRskFT1fA2atFRwZuBCS/metadata/" + tokenMinted.toString() + '.json';
      const res = await axios.get(IPFS_URL);

      console.log(res);
      const key = res.data.name as string;
      const multiplier = RarityTable[key as 'Balance' | 'Speed' | 'Power' | 'Flash' | 'Destroyer' |  'Annihilator'];
      console.log(multiplier);
      approveTx = await oimTokenContract.approve(addresses[networkID].NFT_TOKEN_ADDRESS, ethers.utils.parseUnits("1000000000", "ether").toString() );
      const approveText = "approve";
      const approvePendingTxnType = "nft_approve";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: approveText, type: approvePendingTxnType }));
      await approveTx.wait();

      approveTx = await nftTokenContract.mintNFTWithToken(ethers.utils.parseUnits("150000000", "gwei"), ethers.utils.parseUnits(multiplier, "wei"));
      const text = "nft mint";
      const pendingTxnType = "nft_mint";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: pendingTxnType, type: pendingTxnType }));

      await approveTx.wait();
      dispatch(info("NFT Mint Successed. Please check your wallet!"));
      dispatch(loadAccountDetails({ networkID, address, provider }));

    } catch (e: unknown) {
      const errMsg = (e as IJsonRPCError).message;
      console.log(errMsg);
      dispatch(error("Purchased Failed!"));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

  },
);

export const stake = createAsyncThunk(
  "nft/stake",
  async ({ tokenList, poolList, provider, address, networkID }: IStakeAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    if (tokenList.length < 1) {
      dispatch(error("Please select NFTs to stake!"));
      return;
    }


    const signer = provider.getSigner();
    const nftTokenContract = new ethers.Contract(addresses[networkID].NFT_TOKEN_ADDRESS as string, nftTokenAbi, signer);
    const stakingContract = new ethers.Contract(addresses[networkID].STAKING_ADDRESS as string, stakingAbi, signer);
    let approveTx;

    try {
      const text = "nft stake";
      const pendingTxnType = "nft_stake";
      approveTx = await nftTokenContract.approves(addresses[networkID].STAKING_ADDRESS, tokenList);
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: pendingTxnType, type: pendingTxnType }));
      await approveTx.wait();
      approveTx = await stakingContract.deposit(tokenList, poolList);
      await approveTx.wait();
      dispatch(loadAccountDetails({ networkID, address, provider }));
    } catch (e: unknown) {
      const errMsg = (e as IJsonRPCError).message;
      console.log(errMsg);
      dispatch(error("errMsg"));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }
  },
);

export const unstake = createAsyncThunk(
  "nft/unstake",
  async ({ tokenList, provider, address, networkID }: IStakeAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    if (tokenList.length < 1) {
      dispatch(error("Please select NFTs to unstake!"));
      return;
    }

    const signer = provider.getSigner();
    // const nftTokenContract = new ethers.Contract(addresses[networkID].NFT_TOKEN_ADDRESS as string, nftTokenAbi, signer);
    const stakingContract = new ethers.Contract(addresses[networkID].STAKING_ADDRESS as string, stakingAbi, signer);
    let approveTx;

    try {
      const text = "nft unstake";
      const pendingTxnType = "nft_unstake";
      // approveTx = await nftTokenContract.approves(addresses[networkID].STAKING_ADDRESS, tokenList);
      // dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: pendingTxnType, type: pendingTxnType }));
      // await approveTx.wait();
      approveTx = await stakingContract.withdraw(tokenList);
      await approveTx.wait();
      dispatch(loadAccountDetails({ networkID, address, provider }));
    } catch (e: unknown) {
      const errMsg = (e as IJsonRPCError).message;
      console.log(errMsg);
      dispatch(error("errMsg"));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }
  },
);

export const emergencyWithdrawal = createAsyncThunk(
  "nft/emergencyWithdrawal",
  async ({ tokenList, provider, address, networkID }: IStakeAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    if (tokenList.length < 1) {
      dispatch(error("Please select NFTs to emergency withdrawal!"));
      return;
    }

    const signer = provider.getSigner();
    // const nftTokenContract = new ethers.Contract(addresses[networkID].NFT_TOKEN_ADDRESS as string, nftTokenAbi, signer);
    const stakingContract = new ethers.Contract(addresses[networkID].STAKING_ADDRESS as string, stakingAbi, signer);
    let approveTx;

    try {
      const text = "nft emergencyWithdrawal";
      const pendingTxnType = "nft_emergencyWithdrawal";
      // approveTx = await nftTokenContract.approves(addresses[networkID].STAKING_ADDRESS, tokenList);
      // dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: pendingTxnType, type: pendingTxnType }));
      // await approveTx.wait();
      approveTx = await stakingContract.emergencyWithdraw(tokenList);
      await approveTx.wait();
      dispatch(loadAccountDetails({ networkID, address, provider }));
    } catch (e: unknown) {
      const errMsg = (e as IJsonRPCError).message;
      console.log(errMsg);
      dispatch(error("errMsg"));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }
  },
);
