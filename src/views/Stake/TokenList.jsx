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

import { useTheme } from "@material-ui/core/styles";
import "./stake.scss";

function TokenList() {
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

  const [poolID, setPoolID] = useState('0');
  const [tokenChecked, setTokenChecked] = useState([]);
  const tokenSelectedList = useRef([]);

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

  const tokenIDList = useSelector(state => {
    return state.account.nft && state.account.nft.tokenIDList;
  })

  console.log("tokenIDList", tokenIDList);

  useEffect(() => {
    if (tokenIDList !== null && tokenIDList !== undefined) {
      tokenSelectedList.current = [];
      tokenIDList.map((item, index) => {
        tokenSelectedList.current.push({ "id": tokenIDList[index], "selected": false });
        tokenChecked.push(false);
      })

      setTokenChecked(tokenChecked);
    }
  }, [tokenIDList]);


  const onTokenSeltected = (event, id) => {
    tokenSelectedList.current[id].selected = !tokenSelectedList.current[id].selected;
    tokenChecked[id] = event.target.checked;
    setTokenChecked([...tokenChecked]);
    console.log(tokenSelectedList.current);
  }

  const onStake = async action => {
    let tokenList = [];
    let poolList = [];

    tokenSelectedList.current.map((item, index) => {
      if (item.selected) {
        tokenList.push(item.id);
        poolList.push(poolID);
      }
    })

    await dispatch(stake({ tokenList, poolList, provider, address, networkID: chainID }));
  };


  const onChangePool = (event) => {
    console.log(poolID);
    setPoolID(event.target.value);
  };

  const RowRadioButtonsGroup = () => {
    return (
      <FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={poolID}
          onChange={onChangePool}
        >
          <FormControlLabel value="0" control={<Radio />} label="Pool 1" />
          <FormControlLabel value="1" control={<Radio />} label="Pool 2" />
          <FormControlLabel value="2" control={<Radio />} label="Pool 3" />
          <FormControlLabel value="3" control={<Radio />} label="Pool 4" />
          <FormControlLabel value="4" control={<Radio />} label="Pool 5" />
          {/* <FormControlLabel value="5" control={<Radio />} label="Pool 6" /> */}

        </RadioGroup>
      </FormControl>
    );
  }

  const NFTItemView = ({ id, index }) => {
    return (
      <Grid item lg={3}>
        <div className="pool-card">
          <Grid container className="data-grid" alignContent="center">
            <Grid item lg={9}  >
              <Typography variant="h6" >
                NFT ID: {id}
              </Typography>
            </Grid>
            <Grid item lg={3} style={{ display: "flex", justifyContent: "center" }}>
              <Checkbox style={{ marginTop: '-10px' }} 
              checked={tokenSelectedList.current && tokenSelectedList.current[index] ? tokenSelectedList.current[index].selected : false} onClick={e => onTokenSeltected(e, index)} />
            </Grid>
          </Grid>

          <Grid container className="data-grid" alignContent="center">
            <img src={nftList[id % 6].url} className="nft-list-item-image" width={"100%"} />
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
            <CardHeader title="My NFT List" />
          </Box>
          <div className="token-list-container">
            <Grid container spacing={2} className="data-grid" alignContent="center">
              {
                (tokenIDList && tokenIDList.length > 0) ?
                  tokenIDList.map((id, index) => {
                    return <NFTItemView id={id} index={index} />
                  })
                  :
                  <div style={{padding: '15px', fontSize: '30px'}}>No NFT</div>

              }
            </Grid>
            <Grid container spacing={2} className="data-grid" style = {{padding: '10px'}} alignContent="center">
              <div>
                <RowRadioButtonsGroup />

              </div>
              <Grid item lg={2} md={2} sm={2} xs={2} className="stake-button">
                <div className="stake-button-container">
                  <Button
                    className="stake-button"
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

export default () => (
  <QueryClientProvider client={queryClient}>
    <TokenList />
  </QueryClientProvider>
);