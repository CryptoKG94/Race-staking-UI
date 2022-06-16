import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { useWeb3Context } from "../../hooks";
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery, Button } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useSelector } from "react-redux";
import imgStakeButton from '../../assets/images/img_stake_btn.png';
import imgUnStakeButton from '../../assets/images/img_unstake_btn.png';
import imgCliamButton from '../../assets/images/img_claim_btn.png';
import imgApproveButton from '../../assets/images/img_approve_btn.png';
import { trim, formatCurrency } from "../../helpers";
import { mintNFTWithBNB } from "../../slices/NFT";
import CardHeader from "../../components/CardHeader/CardHeader";

import { useTheme } from "@material-ui/core/styles";
import TokenList from "./TokenList";
import StakedTokenList from "./StakedTokenList";
import PoolList from "./PoolList";
import "./stake.scss";

function Stake() {
  const [data, setData] = useState(null);
  const [apy, setApy] = useState(null);
  const [runway, setRunway] = useState(null);
  // const [staked, setStaked] = useState(null);
  const theme = useTheme();
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");
  const dispatch = useDispatch();
  const { connect, address, provider, chainID, connected, hasCachedProvider } = useWeb3Context();
  const staked = useSelector(state => {
    return state.app.Staked;
  });

  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY
  })

  useEffect(() => {
  }, []);


  const onMintwithBNB = async action => {
    await dispatch(mintNFTWithBNB({ provider, address, networkID: chainID }));
  };

  const PoolItem = () => {
    return (
      <div className="pool-card">
        <Typography variant="h4" >
          Pool 1
        </Typography>
        <Grid container className="data-grid" alignContent="center">
          <Grid item lg={6} md={6} sm={6} xs={6}>
            <Typography variant="h6" className="nft-item-description-title" align={'left'}>
              Staked Token :
            </Typography>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={6}>
            <Typography variant="h6" className="nft-item-description-value" align={'right'}>
              {"1, 8, 9, 10, 12"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container className="data-grid" alignContent="center">
          <Grid item lg={6} md={6} sm={6} xs={6}>
            <Typography variant="h6" className="nft-item-description-title" align={'left'}>
              Lock Day :
            </Typography>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={6}>
            <Typography variant="h6" className="nft-item-description-value" align={'right'}>
              {"10D"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container className="data-grid" alignContent="center">
          <Grid item lg={6} md={6} sm={6} xs={6}>
            <Typography variant="h6" className="nft-item-description-title" align={'left'}>
              Pending Token Amount :
            </Typography>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={6}>
            <Typography variant="h6" className="nft-item-description-value" align={'right'}>
              {"1000"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container className="data-grid" alignContent="center">
          <Grid item lg={12} md={12} sm={12} xs={12} className="pool-button-container">
            <Button
              className="pool-button"
              variant="contained"
              color="primary"
              onClick={() => {
                onClaim();
              }}
            >
              Stake
            </Button>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12} className="pool-button-container">
            <Button
              className="pool-button"
              variant="contained"
              color="primary"
              onClick={() => {
                onClaim();
              }}
            >
              Claim
            </Button>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12} className="pool-button-container">
            <Button
              className="pool-button"
              variant="contained"
              color="primary"
              onClick={() => {
                onClaim();
              }}
            >
              UnStake
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
  return (
    <div id="stake-view" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "2.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "2.3rem",
        }}
      >
        <TokenList />
        <StakedTokenList />
        <PoolList />
        {/* <Zoom in={true}>
          <Paper className="ohm-card">
            <Grid container spacing={2} className="data-grid" alignContent="center">
              <Grid item lg={3} md={3} sm={1} xs={0} />
              <Grid item lg={6} md={6} sm={10} xs={12}>
                <Typography variant="h4" className="title1" align={'center'}>
                  Token Staked Info
                </Typography>
                <Grid container className="data-grid" alignContent="center">
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <Typography variant="h6" className="nft-item-description-title" align={'left'}>
                      My NFT List  :
                    </Typography>
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <Typography variant="h6" className="nft-item-description-value" align={'right'}>
                      {"1, 5, 6, 123, 90"}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className="data-grid" alignContent="center">
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <Typography variant="h6" className="nft-item-description-title" align={'left'}>
                      Reward Token Amount :
                    </Typography>
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <Typography variant="h6" className="nft-item-description-value" align={'right'}>
                      {"1000"}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container className="data-grid" alignContent="center">
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <Typography variant="h6" className="nft-item-description-title" align={'left'}>
                      Pending Token Amount :
                    </Typography>
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <Typography variant="h6" className="nft-item-description-value" align={'right'}>
                      {"1000"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={3} md={3} sm={1} xs={0} />
            </Grid>
          </Paper>

        </Zoom>
        <Zoom in={true}>
          <Paper className="ohm-card">
            <Box display="flex">
              <CardHeader title="Pool List" />
            </Box>
            <div className="pool-card-container">
              <Grid container spacing={2} className="data-grid" alignContent="center">
                <Grid item lg={4} md={4} sm={4} xs={4}>
                  <PoolItem/>
                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={4}>
                  <PoolItem/>
                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={4}>
                  <PoolItem/>
                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={4}>
                  <PoolItem/>
                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={4}>
                  <PoolItem/>
                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={4}>
                  <PoolItem/>
                </Grid>
              </Grid>
            </div>

          </Paper>
        </Zoom> */}

      </Container >
    </div >
  );
}

const queryClient = new QueryClient();

export default () => (
  <QueryClientProvider client={queryClient}>
    <Stake />
  </QueryClientProvider>
);