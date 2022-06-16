import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { useWeb3Context } from "../../hooks";
import { Paper, Grid, Button, Typography, Box, Zoom, Container, useMediaQuery } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useSelector } from "react-redux";
import imgBNBBuyButton from '../../assets/images/img_bnb_buy_btn.webp';
import imgTokenBuyButton from '../../assets/images/img_token_buy_btn.webp';
import { trim, formatCurrency } from "../../helpers";
import { mintNFTWithBNB, mintNFTWithOIM } from "../../slices/NFT";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { useTheme } from "@material-ui/core/styles";
import "./nft-mint-page.scss";

function NFTMintPage() {
  const [data, setData] = useState(null);
  const [apy, setApy] = useState(null);
  const [runway, setRunway] = useState(null);
  // const [staked, setStaked] = useState(null);
  const theme = useTheme();
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");
  const dispatch = useDispatch();
  const { connect, address, provider, chainID, connected, hasCachedProvider } = useWeb3Context();

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  const staked = useSelector(state => {
    return state.app.Staked;
  });

  const nftList = [
    {
      url: "images/nft/nft_item_1.gif",
      name: 'Valkyrie M81',
      rarity: 'Legendary',
      stakingMultiplier: 'x3',
      dropChance: '5%'
    },
    {
      url: "images/nft/nft_item_2.gif",
      name: 'Mauler',
      rarity: 'Super Rare',
      stakingMultiplier: 'X2',
      dropChance: '7%'
    },
    {
      url: "images/nft/nft_item_3.gif",
      name: 'Cyanide',
      rarity: 'Rare',
      stakingMultiplier: 'X1.75',
      dropChance: '8%'
    },
    {
      url: "images/nft/nft_item_4.gif",
      name: 'Hussar',
      rarity: 'Epic',
      stakingMultiplier: 'X1.5',
      dropChance: '10%'
    },
    {
      url: "images/nft/nft_item_5.gif",
      name: 'Mordred',
      rarity: 'Supreme',
      stakingMultiplier: 'X1.25',
      dropChance: '30%'
    },
    {
      url: "images/nft/nft_item_6.gif",
      name: 'Ardor',
      rarity: 'Common',
      stakingMultiplier: 'X1',
      dropChance: '40%'
    },
  ];
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY
  })

  useEffect(() => {
  }, []);


  const onMintwithBNB = async action => {
    await dispatch(mintNFTWithBNB({ provider, address, networkID: chainID }));
  };

  const onMintwithToken = async action => {
    await dispatch(mintNFTWithOIM({ provider, address, networkID: chainID }));
  };


  const addTokenToWallet = () => async () => {
    const nftSymbol = "OIM81NFT";
    const nftAddress = addresses[chainID].NFT_TOKEN_ADDRESS;
    if (window.ethereum) {
      const host = window.location.origin;
      // NOTE (appleseed): 33T token defaults to sOHM logo since we don't have a 33T logo yet

      try {
        await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC721",
            options: {
              address: nftAddress,
              symbol: nftSymbol,
              decimals: 0,
              image: "",
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }

    const rewwardTokenSymbol = "OIF81";
    const rewardTokenAddress = addresses[chainID].REWARD_TOKEN_ADDRESS;
    if (window.ethereum) {
      const host = window.location.origin;
      // NOTE (appleseed): 33T token defaults to sOHM logo since we don't have a 33T logo yet

      try {
        await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: rewardTokenAddress,
              symbol: rewwardTokenSymbol,
              decimals: 18,
              image: "",
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const ButtonGroup = () => {
    return <div className="button-group">
      {
        !(pendingTransactions && pendingTransactions.length > 0) ?
          <Grid container spacing={2} className="data-grid" alignContent="center">
            <Grid item lg={1} md={1} sm={1} xs={1} />
            <Grid item lg={5} md={5} sm={5} xs={5} >
              <img src={imgBNBBuyButton} className="left-button" onClick={onMintwithBNB} />
            </Grid>
            <Grid item lg={5} md={5} sm={5} xs={5} >
              <img src={imgTokenBuyButton} className="right-button" onClick={onMintwithToken} />
            </Grid>
          </Grid> :
          <Typography variant="h4" className="message" align={'center'}>
            In progress
          </Typography>
      }

    </div>
  }

  return (
    <div id="treasury-dashboard-view" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "2.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "2.3rem",
        }}
      >
        <Zoom in={true}>
          <Paper className="ohm-card">
            <Grid container spacing={2} className="data-grid" alignContent="center">
              <Grid item lg={2} md={2} sm={1} xs={0} />
              <Grid item lg={8} md={8} sm={10} xs={12}>
                <div className="buy-pannel">
                  <Typography variant="h4" className="title1" align={'center'}>
                    Welcome to OrbitInu
                  </Typography>
                  <Typography variant="h6" className="sub-title" align={'center'}>
                    Mint OrbitInu NFT with OIM81 tokens or with BNB
                  </Typography>
                  <Typography variant="h6" className="sub-title-content" align={'center'}>
                    150,000,000 OIM81 OR 0.15 BNB
                  </Typography>
                  <ButtonGroup />
                </div>
              </Grid>
              <Grid item lg={2} md={2} sm={1} xs={0} />
            </Grid>
            <div className="nft-list-pannel">
              <Grid container spacing={2} className="data-grid" alignContent="center">
                <Grid item lg={1} md={1} sm={0} xs={0} />
                <Grid item lg={10} md={10} sm={12} xs={12} >
                  <Grid container spacing={2} className="data-grid" alignContent="center">
                    {
                      nftList.map(item => {
                        return (
                          < Grid item lg={4} md={4} sm={6} xs={12} style={{ display: "flex", justifyContent: "center" }} >
                            <div className="nft-item">
                              <img src={item.url} className="nft-list-item-image" />
                              <Grid container className="data-grid" alignContent="center">
                                <Grid item lg={6} md={6} sm={6} xs={6}>
                                  <Typography variant="h6" className="nft-item-description-title" align={'left'}>
                                    Name :
                                  </Typography>
                                </Grid>
                                <Grid item lg={6} md={6} sm={6} xs={6}>
                                  <Typography variant="h6" className="nft-item-description-value" align={'right'}>
                                    {item.name}
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Grid container className="data-grid" alignContent="center">
                                <Grid item lg={6} md={6} sm={6} xs={6}>
                                  <Typography variant="h6" className="nft-item-description-title" align={'left'}>
                                    Rarity :
                                  </Typography>
                                </Grid>
                                <Grid item lg={6} md={6} sm={6} xs={6}>
                                  <Typography variant="h6" className="nft-item-description-value" align={'right'}>
                                    {item.rarity}
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Grid container className="data-grid" alignContent="center">
                                <Grid item lg={6} md={6} sm={6} xs={6}>
                                  <Typography variant="h6" className="nft-item-description-title" align={'left'}>
                                    Staking Multiplier :
                                  </Typography>
                                </Grid>
                                <Grid item lg={6} md={6} sm={6} xs={6}>
                                  <Typography variant="h6" className="nft-item-description-value" align={'right'}>
                                    {item.stakingMultiplier}
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Grid container className="data-grid" alignContent="center">
                                <Grid item lg={6} md={6} sm={6} xs={6}>
                                  <Typography variant="h6" className="nft-item-description-title" align={'left'}>
                                    Drop Chance :
                                  </Typography>
                                </Grid>
                                <Grid item lg={6} md={6} sm={6} xs={6}>
                                  <Typography variant="h6" className="nft-item-description-value" align={'right'}>
                                    {item.dropChance}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </div>
                          </Grid>
                        )
                      })
                    }
                  </Grid>
                </Grid>
                <Grid item lg={1} md={1} sm={0} xs={0} />
              </Grid>
            </div>
          </Paper>
        </Zoom>
      </Container >
    </div >
  );
}

const queryClient = new QueryClient();

export default () => (
  <QueryClientProvider client={queryClient}>
    <NFTMintPage />
  </QueryClientProvider>
);