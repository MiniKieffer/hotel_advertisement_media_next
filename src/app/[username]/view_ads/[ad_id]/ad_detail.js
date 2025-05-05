"use client";
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

export default function Ad_Detail({ad_id}) {

    const [ads, setads] = useState(null);
    const [ad, setAd] = useState(null);
    const [maxSteps, setMaxSteps] = useState(0);
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    useEffect(() => {
        const fetchAds = async () => {
          const res = await fetch('/api/mediaAd/getAd');
          const data = await res.json();
          if(!ads) {setads(data);}
          else { return;}
        };
        fetchAds();
    },[]);

    useEffect(() => {
      setAd(ads?.find(ad => ad._id === ad_id));
    },[ads])

    useEffect(() => {
      setMaxSteps(ad?.video.length);
      console.log(ad);
    }, [ad])


    return (
      
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
        style={{marginTop:'90px'}}
      >
        <Typography variant="h7" style={{ borderBottom:'solid 1px block', backgroundColor:'white', padding:'10px', color:'black'}}>
          {ad?.location}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }} style={{marginTop:'-20px', border:'solid 1px black'}} >

                {/* {ad?.video?.map((eachVideo, index) => (
                 <video width="100%" height="auto" style={{marginBottom:'3px'}} controls key={index}>
                 <source src={eachVideo.replace('.wmv', '.mp4')} type="video/mp4" />
                 Your browser does not support the video tag.
               </video>
                ))} */}
          <Box>
              <video width="100%" height="auto" style={{marginBottom:'3px'}} controls key={activeStep}>
                {ad?.video?.[activeStep] && (
                  <source src={ad.video[activeStep].replace('.wmv', '.mp4')} type="video/mp4" />
                )}
                Your browser does not support the video tag.
              </video>
          </Box>
          <MobileStepper
          style={{marginTop:'-30px', backgroundColor:'black', position:'static', top:'50vh', justifyContent:'center'}}
            variant='none'
            steps={maxSteps}
            
            activeStep={activeStep}
            nextButton={
              <Button
                size="medium"
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1 || maxSteps == 0}
                style={{backgroundColor:'grey', borderRadius:'50%', height:'58px', width:'50px', color:'white'}}
              >
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft fontSize='large' />
                ) : (
                  <KeyboardArrowRight fontSize='large' />
                )}
              </Button>
            }
            backButton={
              <Button size="medium" onClick={handleBack} disabled={activeStep === 0 || maxSteps == 0} style={{color:'white',backgroundColor:'grey', borderRadius:'50%', height:'58px', width:'50px'}}>
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight fontSize='large' />
                ) : (
                  <KeyboardArrowLeft fontSize='large' />
                )}
              </Button>
            }
          />
         </Box>
      </Container>
    );
}