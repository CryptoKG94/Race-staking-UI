import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery, Button } from "@material-ui/core";

import TokenList from "./TokenList";
import StakedTokenList from "./StakedTokenList";
import PoolList from "./PoolList";
import "./stake.scss";

function Stake() {

  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  // const { connect, address, provider, chainID, connected, hasCachedProvider } = useWeb3Context();

  // const PoolItem = () => {
  //   return (
  //     <div className="pool-card">
  //       <Typography variant="h4" >
  //         Pool 1
  //       </Typography>
  //       <Grid container className="data-grid" alignContent="center">
  //         <Grid item lg={6} md={6} sm={6} xs={6}>
  //           <Typography variant="h6" className="nft-item-description-title" align={'left'}>
  //             Staked Token :
  //           </Typography>
  //         </Grid>
  //         <Grid item lg={6} md={6} sm={6} xs={6}>
  //           <Typography variant="h6" className="nft-item-description-value" align={'right'}>
  //             {"1, 8, 9, 10, 12"}
  //           </Typography>
  //         </Grid>
  //       </Grid>
  //       <Grid container className="data-grid" alignContent="center">
  //         <Grid item lg={6} md={6} sm={6} xs={6}>
  //           <Typography variant="h6" className="nft-item-description-title" align={'left'}>
  //             Lock Day :
  //           </Typography>
  //         </Grid>
  //         <Grid item lg={6} md={6} sm={6} xs={6}>
  //           <Typography variant="h6" className="nft-item-description-value" align={'right'}>
  //             {"10D"}
  //           </Typography>
  //         </Grid>
  //       </Grid>
  //       <Grid container className="data-grid" alignContent="center">
  //         <Grid item lg={6} md={6} sm={6} xs={6}>
  //           <Typography variant="h6" className="nft-item-description-title" align={'left'}>
  //             Pending Token Amount :
  //           </Typography>
  //         </Grid>
  //         <Grid item lg={6} md={6} sm={6} xs={6}>
  //           <Typography variant="h6" className="nft-item-description-value" align={'right'}>
  //             {"1000"}
  //           </Typography>
  //         </Grid>
  //       </Grid>
  //       <Grid container className="data-grid" alignContent="center">
  //         <Grid item lg={12} md={12} sm={12} xs={12} className="pool-button-container">
  //           <Button
  //             className="pool-button"
  //             variant="contained"
  //             color="primary"
  //             onClick={() => {
  //               onClaim();
  //             }}
  //           >
  //             Stake
  //           </Button>
  //         </Grid>
  //         <Grid item lg={12} md={12} sm={12} xs={12} className="pool-button-container">
  //           <Button
  //             className="pool-button"
  //             variant="contained"
  //             color="primary"
  //             onClick={() => {
  //               onClaim();
  //             }}
  //           >
  //             Claim
  //           </Button>
  //         </Grid>
  //         <Grid item lg={12} md={12} sm={12} xs={12} className="pool-button-container">
  //           <Button
  //             className="pool-button"
  //             variant="contained"
  //             color="primary"
  //             onClick={() => {
  //               onClaim();
  //             }}
  //           >
  //             UnStake
  //           </Button>
  //         </Grid>
  //       </Grid>
  //     </div>
  //   )
  // }

  const setPageLoading = (loading) => {
    setLoading(loading);
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
        <StakedTokenList setLoading={setPageLoading} loading={loading} />
        <PoolList />

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