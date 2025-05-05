"use client";
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { renderToStaticMarkup } from 'react-dom/server';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert } from '@mui/material';

export default function View_Ads() {

    const [ads, setads] = useState(null);
    const router = useRouter();
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [username, setUsername] = useState("");
    const [adDeleteAlert, setAdDeleteAlert] = useState(false);
    const [adId, setAdId] = useState(null);

    const fetchAds = async () => {
      const res = await fetch('/api/mediaAd/getAd');
      const data = await res.json();
      if(!ads || ads?.length !== 0) {setads(data);}
      else { return;}
    };

    useEffect(() => {

        fetchAds();

        if (document.getElementById('map')?._leaflet_id != null) return;
        if (mapRef.current) return;

        const map = L.map('map').setView([36.1699, -115.1398], 12);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: false,
        }).addTo(map);

    },[]);

    useEffect(() => {
      setUsername(localStorage.getItem("username"));
    },[])

    // Render markers when ads update
    useEffect(() => {
      if (!ads || !mapRef.current) return;

      ads.forEach((ad, index) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ad.location)}`;
        renderAdMarkers(url, index);
      });
    }, [ads]);

    const renderAdMarkers = async (url, index) => {
        try {
            const res = await fetch(url);
            const data = await res.json();
      
            if (data.length === 0) {
              alert(`Location not found: ${ad.location}`);
              return;
            }
      
            const { lat, lon, display_name } = data[0];
            const map = mapRef.current;
      
            // Render MUI icon to static SVG markup
            const iconMarkup = renderToStaticMarkup(
              <div className="custom-marker-icon">
                <LocationOnIcon style={{ fontSize: '40px' }} />
              </div>
            );
      
            const customIcon = L.divIcon({
              html: iconMarkup,
              className: '',
              iconSize: [50, 50],
              iconAnchor: [16, 32],
            });
      
            const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
            marker.bindPopup(display_name);

            marker.on('click', () => {
              setSelectedIndex(index); // <- Expand corresponding accordion
              goToMapLocation(display_name); // Optional: center map on click
            });

            markersRef.current.push(marker);
      
            // Optional: Center to each marker (remove this if you want to center after all are placed)
            // map.setView([lat, lon], 14);
        } catch (err) {
          console.error('Forward geocoding error:', err);
        }
    }

    const handleListItemClick = ( event, index ) => {
        setSelectedIndex(index);
    };

    const goToMapLocation = async (address) => {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await res.json();
        const { lat, lon } = data[0];
        const map = mapRef.current;
        map.setView([lat, lon], 14);
    }

    const deleteAd = async () => {
        try {
          const res = await fetch("/api/mediaAd/deleteAd", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ad_id: adId,
            }),
          });
          if (res.ok) {
            fetchAds();
          } else {
            alert("Error");
          }
        } catch (error) {
          console.log(error);
        }
    };

    return (
      
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
        style={{marginTop:'80px'}}
      >
        {adDeleteAlert && (
          <Alert
            severity="danger"
            onClose={() => setAdDeleteAlert(false)} 
            style={{backgroundColor:'lightcoral'}}
            action={
              <>
                  <Button color="inherit" size="small" onClick={() => {setAdDeleteAlert(false); deleteAd();}}>
                    OK
                  </Button>
                  <Button color="inherit" size="small" onClick={() => setAdDeleteAlert(false)}>
                    CLOSE
                  </Button>
              </>
            }
          >
           Do really want to delete this Ad?
          </Alert>
        )}
        <style>{`
                .leaflet-control-attribution {
                  display: none !important;
                }
                .custom-marker-icon svg {
                  color: forestgreen;
                  transition: color 0.2s ease;
                }

                .custom-marker-icon:hover svg {
                  color: lightslategray; 
                }
            `}
        </style>
        <Typography variant="h7" style={{textAlign:'center', borderBottom:'solid 1px block', backgroundColor:'lightyellow', padding:'10px', color:'grey'}}>
          You can watch your ads details by clicking a map marker or select a pad on the right.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }} style={{marginTop:'-20px'}} >
          <Grid container spacing={2} columns={12}>
            <Grid size={{ xs: 12, md: 8 }}>
              <div id="map" style={{ height: '600px', width: '100%' }} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} style={{height:'600px'}}>
                <Box
                  sx={{
                    maxHeight: '600px',   // or any value that fits your design
                    overflowY: 'auto',    // enables vertical scroll
                    pr: 1                 // optional: padding for scroll bar
                  }}
                >
                    {ads?.slice().reverse().map((ad, index) => (
                        <div  key = {ad._id}>
                            <Button style={{color:'forestgreen'}} onClick={() => {router.push(`/${username}/view_ads/${ad._id}`)}}>
                                  <LaunchIcon />
                            </Button>
                            <Button style={{color:'grey'}} onClick={() => {setAdDeleteAlert(true); setAdId(ad._id)}}>
                                  <DeleteIcon />
                            </Button>
                            <Accordion key = {ad._id} style={{marginTop:'10px', marginBottom:'10px'}} expanded={selectedIndex === index} onChange={() => setSelectedIndex(index)}>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls= {`panel1-content${index}`}
                                id={`panel${index}-header`}
                                onClick={(event) => {handleListItemClick(event, index); goToMapLocation(ad.location);}}
                                style={{ color: 'black', marginBottom: '2px' }}
                              >
                                
                                <Typography component="span">{ad.location}</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                {/* {ad.video.map((eachVideo, index) => (
                                    <video width="100%" height="auto" style={{marginBottom:'3px'}} controls key={index}>
                                        <source src={eachVideo.replace('.wmv', '.mp4')} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ))} */}
                                <video width="400px" height="auto" style={{marginBottom:'3px'}} controls >
                                  <source src={ad.video[0]?.replace('.wmv', '.mp4')} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </AccordionDetails>
                            </Accordion>
                            <Divider />
                        </div>
                    ))}
                </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
}