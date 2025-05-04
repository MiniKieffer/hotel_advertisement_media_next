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
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { renderToStaticMarkup } from 'react-dom/server';



const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

export default function Home({ username }) {

    const [localUsername, setLocalUsername] = useState(null);
    const [video, setVideo] = useState([]);
    const [location, setLocation] = useState("");
    const router = useRouter();
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        setLocalUsername(storedUsername);
    
        if (storedUsername !== username) {
          router.push('/');
        }

        if (document.getElementById('map')?._leaflet_id != null) return;
        if (mapRef.current) return;

        const map = L.map('map').setView([36.1699, -115.1398], 12);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: false,
        }).addTo(map);

        map.on('dblclick', async (e) => {
          
            const { lat, lng } = e.latlng;
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

            try {
              const res = await fetch(url);
              const data = await res.json();
              if (data && data.address) {
                  const { road, suburb, city, state, postcode, country } = data.address;
                
                  setLocation(`${road || ''} ${suburb || ''}, ${city || ''}, ${state || ''} ${postcode || ''}`);
                
                  console.log(location); // Example: "2000 Las Vegas Blvd S, Las Vegas, NV 89104"
              } else {
                  console.log('Address not found');
              }
            } catch (err) {
              console.error('Geocoding error:', err);
            }
          }
        );
    },[username, router]);

    const upload = async (e) => {
        try {
          e.preventDefault();
          const data = new FormData();
    
          data.append("location", location);
          for (var x = 0; x < video.length; x++) {
            data.append("videos", video[x]);
          }

          const res = await fetch('/api/mediaAd/createAd', {
            method: "POST",
            body: data,
          });
          if (res.ok) {
            setLocation("");
            setVideo(null);
            alert('Successfully published!');
          }
        } catch (error) {
          console.log(error);
        }
    };

    const handleSearch = async () => {
        if (!location) return;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
        try {
          const res = await fetch(url);
          const data = await res.json();
    
          if (data.length === 0) {
            alert('Location not found');
            return;
          }
    
          const { lat, lon, display_name } = data[0];
    
          const map = mapRef.current;
          map.setView([lat, lon], 14);

          // Render MUI icon to static SVG markup
          const iconMarkup = renderToStaticMarkup(
            <LocationOnIcon style={{ color: 'red', fontSize: '32px' }} />
          );
          
          // Create Leaflet DivIcon from SVG
          const customIcon = L.divIcon({
            html: iconMarkup,
            className: '', // Remove Leaflet default styles
            iconSize: [50, 50],
            iconAnchor: [16, 32], // center bottom of icon
          });
          
          // If marker exists, update it; otherwise create a new one
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lon]);
          } else {
            markerRef.current = L.marker([lat, lon], { icon: customIcon }).addTo(map);
          }
    
          markerRef.current.bindPopup(display_name).openPopup();
        } catch (err) {
          console.error('Forward geocoding error:', err);
        }
    };

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
          Create ADH
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            
          <Grid container spacing={2} columns={12}>
            <Grid size={{ xs: 12, md: 6 }}>
              <div id="map" style={{ height: '500px', width: '100%' }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  component="form"
                  noValidate
                  onSubmit={upload}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: 2,
                  }}
                >
                  <FormControl>
                    <FormLabel htmlFor="email">Location</FormLabel>
                    <TextField
                      type="text"
                      id="location"
                      name="location"
                      placeholder="Enter location"
                      autoComplete="location"
                      autoFocus
                      required
                      fullWidth
                      variant="outlined"
                      color="primary"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <Button onClick={handleSearch} style={{ padding: '6px 12px' }}>
                      Search
                    </Button>
                  </FormControl>
                  <FormControl>
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload files
                      <VisuallyHiddenInput
                        type="file"
                        filename="video"
                        onChange={(e) => setVideo(e.target.files)}
                        multiple
                      />
                    </Button>
                  </FormControl>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                  >
                    Publish
                  </Button>
                </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
}