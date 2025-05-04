"use client";

import React from "react";
import { useState, useEffect } from "react";
import { styled, alpha } from '@mui/material/styles';
import { useRouter } from "next/navigation";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { clearUser } from '../../store/slices/userSlice';
import { useDispatch } from "react-redux";
import Divider from '@mui/material/Divider';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function Header() {
  const [user, setUser] = useState()
  const dispatch = useDispatch();
  const router = useRouter();
  const signOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    dispatch(clearUser());
    router.push('/');
  };

  useEffect(() => {

      setUser(localStorage.getItem("username"));

  }, []);

  return (
    <header>
      <AppBar
        position="fixed"
        enableColorOnDark
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: "calc(var(--template-frame-height, 0px) + 28px)",
        }}
      >
        <Container maxWidth="lg">
          <StyledToolbar variant="dense" disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button variant="text" color="info" size="small" style={{color:'grey'}} onClick={() => router.push(`/${user}`)}>
                  Create_Ad
                </Button>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Button variant="text" color="info" size="small" style={{color:'grey'}} onClick={() => router.push(`/${user}/view_ads`)}>
                  View_Ad
                </Button>
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
              {user && (
                <Button color="primary" variant="text" size="small" style={{color:"grey", backgroundColor:'lightblue'}} onClick={signOut}>
                  Sign out
                </Button>
              )}
            </Box>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Box style={{color:'grey'}}>Hello {user} !</Box>
          </StyledToolbar>
        </Container>
      </AppBar>
    </header>
  );
}