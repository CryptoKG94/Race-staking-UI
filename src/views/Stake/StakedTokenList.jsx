import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery, Button, Checkbox } from "@material-ui/core";

import { unstake, emergencyWithdrawal } from "../../slices/NFT";
import CardHeader from "../../components/CardHeader/CardHeader";
import { prettyVestingPeriod2 } from "../../helpers";

import "./stake.scss";

import { useWallet } from "@solana/wallet-adapter-react";

function StakedTokenList(props) {
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");
  const dispatch = useDispatch();

  const { connected, wallet } = useWallet();

  const [tokenChecked, setTokenChecked] = useState([]);
  const tokenSelectedList = useRef([]);
  const [stakeInfos, setStakeInfos] = useState([]);
  const [remainTimes, setRemainTimes] = useState([]);

  let nftList = [
    {
      url: "images/nft/nft_item_1.gif",
      id: 0,
      reward: 0,
      time: 0,
      poolId: 0
    },
    {
      url: "images/nft/nft_item_2.gif",
      id: 1,
      reward: 0,
      time: 0,
      poolId: 0
    },
    {
      url: "images/nft/nft_item_3.gif",
      id: 2,
      reward: 0,
      time: 0,
      poolId: 0
    },
    {
      url: "images/nft/nft_item_4.gif",
      id: 3,
      reward: 0,
      time: 0,
      poolId: 0
    },
    {
      url: "images/nft/nft_item_5.gif",
      id: 4,
      reward: 0,
      time: 0,
      poolId: 0
    },
    {
      url: "images/nft/nft_item_6.gif",
      id: 5,
      reward: 0,
      time: 0,
      poolId: 0
    }
  ];

  const setLoading = props.setLoading;

  useEffect(() => {
    async function fetchStakeInfo() {
      const data = [];
      setStakeInfos(data);
    }

    fetchStakeInfo();
  }, [connected]);

  useEffect(() => {
    if (stakeInfos !== null && stakeInfos !== undefined) {
      tokenSelectedList.current = [];
      stakeInfos.map((item) => {
        tokenSelectedList.current.push({ "id": item.id, "selected": false });
        tokenChecked.push(false);
      })
      setInterval(() => getRemainTime(), 30000);
      setTokenChecked(tokenChecked);
    }
  }, [stakeInfos]);

  const getRemainTime = async () => {
    let _remainTimes = [];
    for (let i = 0; i < stakeInfos.length; i++) {
      _remainTimes.push(prettyVestingPeriod2(stakeInfos[i].depositTime));

    }

    console.log("_remainTimes :", _remainTimes);

    setRemainTimes(_remainTimes)
  }

  const onTokenSeltected = (event, id) => {
    tokenSelectedList.current[id].selected = !tokenSelectedList.current[id].selected;
    tokenChecked[id] = event.target.checked;
    setTokenChecked([...tokenChecked]);
    console.log(tokenSelectedList.current);
  }



  const onUnStake = async action => {
    let tokenList = [];
    let poolList = [];

    tokenSelectedList.current.map((item, index) => {
      if (item.selected) {
        tokenList.push(item.id);
      }
    })

    await dispatch(unstake({ tokenList, provider, address, networkID: chainID }));
  };

  const onEmergencyWithdrawal = async action => {
    let tokenList = [];
    let poolList = [];

    tokenSelectedList.current.map((item, index) => {
      if (item.selected) {
        tokenList.push(item.id);
      }
    })
    await dispatch(emergencyWithdrawal({ tokenList, provider, address, networkID: chainID }));
  }


  const NFTItemView = ({ item, index }) => {
    console.log("NFTItemView", item);
    return (
      <Grid item lg={3} md={3} sm={3} xs={3}>
        <div className="pool-card">
          <Grid container className="data-grid" alignContent="center">
            <Grid item lg={9}  >
              <Typography variant="h6" >
                NFT ID: {item.id.toString()}
              </Typography>
            </Grid>
            <Grid item lg={3} style={{ display: "flex", justifyContent: "center" }}>
              <Checkbox style={{ marginTop: '-10px' }}
                checked={tokenSelectedList.current && tokenSelectedList.current[index] ? tokenSelectedList.current[index].selected : false} onClick={e => onTokenSeltected(e, index)} />
            </Grid>
          </Grid>

          <Grid container className="data-grid" alignContent="center">
            <img src={nftList[item.id % 6].url} className="nft-list-item-image" width={"100%"} />
          </Grid>
          <Grid container className="data-grid" alignContent="center">
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Typography variant="h6" className="nft-item-description-title" align={'left'}>
                PoolId:
              </Typography>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Typography variant="h6" className="nft-item-description-value" align={'right'}>
                {item.stakeType + 1}
              </Typography>
            </Grid>
          </Grid>
          <Grid container className="data-grid" alignContent="center">
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Typography variant="h6" className="nft-item-description-title" align={'left'}>
                Reward :
              </Typography>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Typography variant="h6" className="nft-item-description-value" align={'right'}>
                {item.reward}
              </Typography>
            </Grid>
          </Grid>
          <Grid container className="data-grid" alignContent="center">
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Typography variant="h6" className="nft-item-description-title" align={'left'}>
                RemainTime :
              </Typography>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Typography variant="h6" className="nft-item-description-value" align={'right'}>
                {/* { (item.stakeType == 0) ? "No lockup" : prettyVestingPeriod2(item.depositTime) } */}
                {remainTimes[index]}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </Grid>
    )
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
            <CardHeader title="Staked NFT List" />
          </Box>
          <div className="pool-card-container">
            <Grid container spacing={2} className="data-grid" alignContent="center">
              {
                (stakeInfos && stakeInfos.length > 0) ?
                  stakeInfos.map((item, index) => {
                    return <NFTItemView item={item} index={index} />
                  })
                  :
                  <div style={{ padding: '15px', fontSize: '30px' }}>No NFT</div>

              }
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
                  Claim & Unstake
                </Button>
                {/* <Button
                    className="pool-button"
                    variant="contained"
                    color="primary"
                    style = {{ color: 'white', background: 'red', marginLeft: '20px'}}
                    onClick={() => {
                      onEmergencyWithdrawal();
                    }}
                  >
                    Emergency Withdrawal
                  </Button> */}
              </Grid>
            </Grid>
          </div>

        </Paper>
      </Zoom>

    </Container >
  );
}

const queryClient = new QueryClient();

export default (props) => (
  <QueryClientProvider client={queryClient}>
    <StakedTokenList props />
  </QueryClientProvider>
);