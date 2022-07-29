import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery, Button, Checkbox } from "@material-ui/core";

import { unstake, emergencyWithdrawal } from "../../slices/NFT";
import CardHeader from "../../components/CardHeader/CardHeader";
import { prettyVestingPeriod2 } from "../../helpers";
import { error, info } from "../../slices/MessagesSlice";

import "./tokenstake.scss";

import { useWallet } from "@solana/wallet-adapter-react";
import { claimReward, getStakedInfo, unstakeNft } from "src/context/helper/nft-staking";
import { getNftMetadataURI } from "src/context/utils";
import { CLASS_TYPES, LOCK_DAY, SECONDS_PER_DAY } from "src/context/constants";
import UnstakeTimer from "src/components/unstakeTimer/unstakeTimer"
import { NotificationManager } from "react-notifications";

function StakedRewardToken({ setLoadingStatus, refreshFlag, updateRefreshFlag }) {
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");
  const dispatch = useDispatch();

  const { connected, wallet, publicKey } = useWallet();

  const [tokenChecked, setTokenChecked] = useState([]);
  const tokenSelectedList = useRef([]);
  const [stakeInfos, setStakeInfos] = useState(0);
  // const [remainTimes, setRemainTimes] = useState([]);
  const [vault_items, setVault_items] = useState([]);
  const [flag, setFlag] = useState(true);

  // const setLoading = props.setLoading;

  const fetchStakedInfo = async () => {
    let stakedInfo = 2; // = await getStakedInfo(publicKey?.toBase58());
    
    setStakeInfos(stakedInfo);
  }

  useEffect(() => {
    async function getStakeInfo() {
      if (flag && connected) {
        await fetchStakedInfo();
        // setFlag(false);
      }
    }

    getStakeInfo();
  }, [connected, refreshFlag]);

  const onUnStake = async action => {
    let tokenList = [];
    let poolList = [];

    tokenSelectedList.current.map((item, index) => {
      if (item.selected) {
        tokenList.push(item.id);
      }
    })

    if (tokenList.length < 0) return;

    try {
      setLoadingStatus(true);
      let res = await unstakeNft(tokenList);
      setLoadingStatus(false);
      if (res.result == "success") {
        NotificationManager.success('Unstaked Successfully');
      } else {
        NotificationManager.error('Unstaking Failed!');
      }
      updateRefreshFlag();
    } catch (e) {
      console.log("[] => unstaking error: ", e);
      NotificationManager.error(e.message);
      setLoadingStatus(false);
    }

    // setLoading(false);
    // await dispatch(unstake({ tokenList, provider, address, networkID: chainID }));
  };

  const onEmergencyWithdrawal = async action => {
    let tokenList = [];
    let poolList = [];

    tokenSelectedList.current.map((item, index) => {
      if (item.selected) {
        tokenList.push(item.id);
      }
    })
  }

  return (
    <Container
      style={{
        paddingLeft: smallerScreen || verySmallScreen ? "0" : "2.3rem",
        paddingRight: smallerScreen || verySmallScreen ? "0" : "2.3rem",
      }}
    >
      <Zoom in={true}>
        <Paper className="ohm-card">
          <Box display="flex">
            <CardHeader title="Staked RACE Token" />
          </Box>
          <div className="pool-card-container">
            <Grid container spacing={2} className="data-grid" alignContent="center">
              { stakeInfos }
            </Grid>
            <Grid container spacing={2} className="data-grid" alignContent="center">
              <Grid item className="pool-button-container">
                <Button
                  className="pool-button"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    onUnStake();
                  }}
                >
                  Unstake
                </Button>
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
    <StakedRewardToken setLoadingStatus={setLoadingStatus} refreshFlag={refreshFlag} updateRefreshFlag={updateRefreshFlag} />
  </QueryClientProvider>
);