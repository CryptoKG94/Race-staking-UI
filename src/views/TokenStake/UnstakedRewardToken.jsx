import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { useWeb3Context } from "../../hooks";
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery, Button, Checkbox } from "@material-ui/core";
import { FormControl, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useSelector } from "react-redux";
import { trim, formatCurrency } from "../../helpers";
import { stake } from "../../slices/NFT";
import CardHeader from "../../components/CardHeader/CardHeader";
import { PublicKey } from '@solana/web3.js';

import { getNftMetadataURI, getAllNftData } from "../../context/utils";
import { stakeRace, getStakedInfo, getWalletBalance } from "../../context/helper/token-staking";
import { NFT_CREATOR } from "../../context/constants";

import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";

import { useTheme } from "@material-ui/core/styles";
import "./tokenstake.scss";

import { NotificationManager } from "react-notifications";

const collection_creator = NFT_CREATOR;

function UnstakedRewardToken({ setLoadingStatus, refreshFlag, updateRefreshFlag }) {
  const theme = useTheme();
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");
  const dispatch = useDispatch();
  // const { connect, address, provider, chainID, connected, hasCachedProvider } = useWeb3Context();
  const staked = useSelector(state => {
    return state.app.Staked;
  });

  const poolID = useRef("0");
  const tokenSelectedList = useRef([]);
  const [fetchFlag, setFetchFlag] = useState(true);
  const wallet = useWallet();

  const [tokenBalance, setTokenBalance] = useState(0);

  useEffect(() => {
    async function fetchAll() {
      console.log("Fetching...............")
      if (wallet && wallet.publicKey) {
        // console.log('fetchFlag:  TRUE')
        await fetchUnstakedInfo()
      }
    }

    fetchAll();
  }, [refreshFlag, wallet.connected])

  const fetchUnstakedInfo = async () => {
    let wallet_balance = await getWalletBalance();
    setTokenBalance(wallet_balance);
  }

  const onTokenSeltected = (event, id) => {
    tokenSelectedList.current[id].selected = !tokenSelectedList.current[id].selected;
    // console.log('token selected', tokenSelectedList.current);
  }

  const onStake = async () => {
    setLoadingStatus(true);

    try {
      let res = await stakeRace();
      if (res.result == "success") {
        NotificationManager.success('Transaction succeed');
        updateRefreshFlag();
      } else {
        NotificationManager.error('Transaction failed');
      }
    } catch (err) {
      NotificationManager.error(err.message);
    }

    setLoadingStatus(false);
  };

  return (
    <Container
      style={{
        paddingLeft: smallerScreen || verySmallScreen ? "0" : "2.3rem",
        paddingRight: smallerScreen || verySmallScreen ? "0" : "2.3rem",
      }}
    >
      <Zoom in={true}>
        <Paper className="ohm-card custom-scroll-bar">
          <Box display="flex">
            <CardHeader title="My RACE Token Balance" />
          </Box>
          <div className="token-list-container">
            <Grid container spacing={2} className="data-grid" alignContent="center">
              {tokenBalance}
            </Grid>
            <Grid container spacing={2} className="data-grid" style={{ padding: '10px' }} alignContent="center">
              <Grid item className="stake-button">
                <div className="stake-button-container">
                  <Button
                    // className="stake-button"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      onStake();
                    }}
                  >
                    Stake
                  </Button>
                </div>
              </Grid>
            </Grid>
          </div>
        </Paper>
      </Zoom>
    </Container >
  );
}

const queryClient = new QueryClient();

export default ({ setLoadingStatus, refreshFlag, updateRefreshFlag }) => (
  <QueryClientProvider client={queryClient}>
    <UnstakedRewardToken setLoadingStatus={setLoadingStatus} refreshFlag={refreshFlag} updateRefreshFlag={updateRefreshFlag} />
  </QueryClientProvider>
);