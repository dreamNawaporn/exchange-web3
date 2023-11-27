"use client";
import React, { useState, useEffect } from "react";


import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";


import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";


import {
  Container,
  Card,
  CardContent,
  TextField,
  Divider,
} from "@mui/material";


// Knowledge about Ether.js https://docs.ethers.org/v6/getting-started/
import { ethers } from "ethers";
import { formatEther, parseUnits } from "ethers";
import abi from "./abi.json";


const [metaMask, hooks] = initializeConnector(
  actions => new MetaMask({ actions })
);
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } =
  hooks;
const contractChain = 11155111;


const contractAddress = "0xafeC49728d68Fd109B24dC417225aBe8fdEdDFFD";
//const contractAddress = "0xb3B9eD674453E88054879526Cccb18bD2b6Ce1a9";


export default function Page() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const isActive = useIsActive();


  const provider = useProvider();
  const [error, setError] = useState(undefined);


  const [balance, setBalance] = useState("");
  useEffect(() => {
    const fetchBalance = async () => {
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      const myBalance = await smartContract.balanceOf(accounts[0]);
      console.log(formatEther(myBalance));
      setBalance(formatEther(myBalance));
    };


    if (isActive) {
      fetchBalance();
    }
  }, [isActive]);


  const [neeValue, setNeeValue] = useState(0);


  const handleSetNeeValue = event => {
    setNeeValue(event.target.value);
  };


  const handleBuy = async () => {
    try {
      if (neeValue <= 0) {
        return;
      }


      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      const buyValue = parseUnits(neeValue.toString(), "ether");
      const tx = await smartContract.buy({
        value: buyValue.toString(),
      });
      console.log("Transaction hash:", tx.hash);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug("Failed to connect to metamask");
    });
  }, []);


  const handleConnect = () => {
    metaMask.activate(contractChain);
  };


  const handleDisconnect = () => {
    metaMask.resetState();
  };


  return (


    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="#B768FE"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Crypto exchange
          </Typography>


          {isActive ? (
            <Stack direction="row" spacing={1} >
              <Chip label={accounts[0]} variant="outlined" />
              <Button class="w3-btn w3-round-xxlarge" color="inherit" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </Stack>
          ) : (
            <Button class="w3-btn w3-round-xxlarge" color="inherit" onClick={handleConnect}>
              Connect
            </Button>
          )}


        </Toolbar>
      </AppBar>
      {isActive && (
        <Container maxWidth="sm" sx={{ mt: 2 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography
                  sx={{ fontSize: 20 }}
                  color="text.secondary"
                  gutterBottom
                >
                  My wallet balance
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Address"
                  value={accounts[0]}
                  variant="outlined"
                />
                <TextField
                  id="outlined-basic"
                  label="Dre Balance"
                  value={balance}
                  variant="outlined"
                />


                <Divider />
                <Typography
                  sx={{ fontSize: 20 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Buy Dre Token
                </Typography>


                <TextField
                  required
                  id="outlined-required"
                  label="Enter amount of Ether you want to buy Dre Token"
                  defaultValue=""
                  type="number"
                  onChange={handleSetNeeValue}
                />


                <Button variant="contained" onClick={handleBuy}>
                  Buy Dre Token
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      )}
    </Box>
  );
}


// w3school - React Ternary operator https://www.w3schools.com/react/react_es6_ternary.asp
