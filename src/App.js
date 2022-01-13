import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";


import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  width: 188px;
  height: 60px;
  color: white;
  background: #2c2f1e;
  cursor: pointer;
  font-size: 26px;
  font-family: initial;
  :hover {
    background-color: #393d27 !important;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: #2c2f1e;
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: white;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  :focus {
    outline: none;
  }
  :hover {
    background-color: #393d27 !important;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 4,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1000,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 2) {
      newMintAmount = 2;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <div className="container-fluid bg-green">
        <div className="container">
          <div className="row">
            <div className="col py-5 text-center text-white">
              <h1 className="font-60">Modern Mona</h1>
              <div className="line m-auto border border-white border-left-0 border-right-0 border-top-0"></div>
              <p className="pt-3">The world's most famous painting, reimagined for the digital age.</p>
              <p>and released as a collection of 1,000 exclusive NFTs on the Etherium blockchain</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid bg-yellow py-5">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-4 text-center">
              <img className="w-90" src="img/mona-1.png" alt="Modern Mona"/>
            </div>
            <div className="col-md-4 px-md-0">
              <img className="w-100" src="img/mona-2.png" alt="Modern Mona"/>
            </div>
            <div className="col-md-4 text-center">
              <img className="w-90" src="img/mona-3.png" alt="Modern Mona"/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 mobile-hide">
              <img className="w-100 silhouette-1" src="img/silhouette-1.png" alt="Modern Mona"/>
            </div>
            <div className="col-md-6 py-5 text-center">
              <h3 className="mb-0">How many Monas ser / madame?</h3>
              <s.Container
                flex={1}
                ai={"center"}
              >  
                <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
                  <s.Container
                    flex={2}
                    jc={"center"}
                    ai={"center"}
                  >
                    {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                      <>
                        <s.TextTitle
                          style={{ textAlign: "center", color: "var(--accent-text)" }}
                        >
                          The sale has ended.
                        </s.TextTitle>
                        <s.TextDescription
                          style={{ textAlign: "center", color: "var(--accent-text)" }}
                        >
                          You can still find {CONFIG.NFT_NAME} on
                        </s.TextDescription>
                        <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                          {CONFIG.MARKETPLACE}
                        </StyledLink>
                      </>
                    ) : (
                      <>
                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                          <StyledRoundButton
                            style={{ lineHeight: 0.4 }}
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              decrementMintAmount();
                            }}
                          >
                            -
                          </StyledRoundButton>
                              <s.SpacerMedium />
                              <s.TextDescription
                                style={{
                                  textAlign: "center",
                                  color: "var(--accent-text)",
                                  fontSize: "35px",
                                  width: "25px"
                                }}
                              >
                                {mintAmount}
                              </s.TextDescription>
                              <s.SpacerMedium />
                          <StyledRoundButton
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              incrementMintAmount();
                            }}
                          >
                            +
                          </StyledRoundButton>
                        </s.Container>
                        <s.SpacerMedium />
                        {blockchain.account === "" ||
                        blockchain.smartContract === null 
                        ? (
                          <s.Container ai={"center"} jc={"center"}>
                            <StyledButton
                              onClick={(e) => {
                                e.preventDefault();
                                dispatch(connect());
                                getData();
                              }}
                            >
                              CONNECT
                            </StyledButton>
                          </s.Container>
                        ) 
                        : (
                          <>
                            <s.Container ai={"center"} jc={"center"} fd={"row"}>
                              <StyledButton
                                disabled={claimingNft ? 1 : 0}
                                onClick={(e) => {
                                  e.preventDefault();
                                  claimNFTs();
                                  getData();
                                }}
                              >
                                {claimingNft ? "BUSY" : "Le Mint"}
                              </StyledButton>
                            </s.Container>
                          </>
                        )}
                      </>
                    )}
                  </s.Container>
                </ResponsiveWrapper>
              </s.Container>
            </div>
            <div className="col-md-3 mobile-hide">
              <img className="w-100 silhouette-2" src="img/silhouette-2.png" alt="Modern Mona"/>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col text-center pt-5">
              <a href="">
                <img className="mr-2" src="img/icon-discord.png" width="50" alt="Discord"/>
              </a>
              <a href="">
                <img className="ml-2" src="img/icon-twitter.png" width="50" alt="Twitter"/>
              </a>
            </div>
          </div>
        </div>
      </div>
    </s.Screen>
  );
}

export default App;
