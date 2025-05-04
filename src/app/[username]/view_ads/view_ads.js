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

export default function View_Ads() {

    const [ads, setads] = useState(null);
    const router = useRouter();
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        

        const fetchAds = async () => {
          const res = await fetch('/api/mediaAd/getAd');
          const data = await res.json();
          if(!ads) {setads(data);}
          else { return;}
        };
        fetchAds();
        console.log(ads);

        if (document.getElementById('map')?._leaflet_id != null) return;
        if (mapRef.current) return;

        const map = L.map('map').setView([36.1699, -115.1398], 12);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: false,
        }).addTo(map);

    },[]);

    // Render markers when ads update
    useEffect(() => {
      if (!ads || !mapRef.current) return;

      ads.forEach((ad) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ad.location)}`;
        renderAdMarkers(url);
      });
    }, [ads]);

    const renderAdMarkers = async (url) => {
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
              <LocationOnIcon style={{ color: 'red', fontSize: '32px' }} />
            );
      
            const customIcon = L.divIcon({
              html: iconMarkup,
              className: '',
              iconSize: [50, 50],
              iconAnchor: [16, 32],
            });
      
            const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
            marker.bindPopup(display_name);
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

    return (
      
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <style>{`
                .leaflet-control-attribution {
                  display: none !important;
                }
            `}
        </style>
        <Typography variant="h3" gutterBottom>
          Published Ads
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            
          <Grid container spacing={2} columns={12}>
            <Grid size={{ xs: 12, md: 6 }}>
              <div id="map" style={{ height: '500px', width: '100%' }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                    {ads?.map((ad, index) => (
                        <div  key = {ad._id}>
                            <Accordion key = {ad._id}>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls= {`panel1-content${index}`}
                                id={`panel${index}-header`}
                                onClick={(event) => {handleListItemClick(event, index); goToMapLocation(ad.location);}}
                                style={{ backgroundColor: 'grey', color: 'white', marginBottom: '2px' }}
                              >
                                <Typography component="span">{ad.location}</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                {ad.video.map((eachVideo, index) => (
                                    <video width="100%" height="auto" style={{marginBottom:'3px'}} controls key={index}>
                                        <source src={eachVideo.replace('.wmv', '.mp4')} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ))}
                              
                              </AccordionDetails>
                              <Divider />
                            </Accordion>
                        </div>
                    ))}
                </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
}