import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Divider } from "@mui/material";
import axios from 'axios';

export default function Dashboard({user, bearerToken}) {
  const [card, setCard] = useState({});
  const [txn, setTxns] = useState({});

  const retrieveCard = async () => {
    try {
      const res = await axios({
        method: 'get',
        url: 'http://localhost:9000/api/virtualcards',
        headers: {
          'Authorization': 'Bearer ' + bearerToken,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.paywithextend.v2021-03-12+json',  
        }
      });
      setCard(res.data.virtualCards[0]); // hard code for one card
    } catch (e) {
      console.log(e);
    }
  }

  const retrieveTxns = async () => {
    try {
      const res = await axios({
        method: 'get',
        url: 'http://localhost:9000/api/virtualcards/' + card.id + '/transactions',
        headers: {
          'Authorization': 'Bearer ' + bearerToken,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.paywithextend.v2021-03-12+json',  
        }
      });
      setTxns(res.data.transattions);
    } catch (e) {
      console.log(e);
    }
  }

  // Render on bearer token updates
  useEffect(() => {
    retrieveCard()
  }, [bearerToken]);

  useEffect(() => {
    retrieveTxns()
  }, [card])

  return (
    <Container component="main" maxWidth="s" sx={{marginLeft: 10}}>
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 8,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box>
          <Typography component="h1" variant="h4" align="left">
          Welcome back, 
            <Typography component="h2" variant="h4" fontWeight={600}>{user?.firstName}</Typography>
          </Typography>
        </Box>
        <Divider/> 
        <Box 
          sx={{
            marginTop: 4,
            display: 'flex'
          }}
          >
          <Typography component="h1" variant="h6" align="left" fontWeight={700}>
            Your cards
          </Typography>
          
        </Box>
        <Divider/> 
        <Box 
          sx={{
            marginTop: 4,
            display: 'flex'
          }}
          >
          <Typography component="h1" variant="h6" align="left" fontWeight={700}>
            Your transactions
          </Typography>
          
        </Box>
      </Box>
    </Container>
  );
}