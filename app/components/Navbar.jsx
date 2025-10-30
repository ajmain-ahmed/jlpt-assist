'use client'

import React, { useState, useEffect } from 'react'
import { AppBar, IconButton, Toolbar, Typography, Button, Box, MenuItem, Container, Avatar } from '@mui/material'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react';
import SunnySnowingIcon from '@mui/icons-material/SunnySnowing';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import { redirect } from 'next/navigation';
import { Google } from '@mui/icons-material';
import GoogleSignIn from "../serveraction";

const Navbar = () => {

    const { data: session, status } = useSession()
    const username = session?.user?.username

    async function signOutHelper() {
        await signOut({ redirectTo: '/' })
    }

    useEffect(() => {
        if (status === 'authenticated' && !username) {
            redirect('/register')
        }
    }, [session, username])

    const MobileNavbar = () => {
        const [mobileAnchorEl, setMobileAnchorEl] = React.useState(null);
        const [avatarAnchorEl, setAvatarAnchorEl] = useState(null)
        return (
            <AppBar color='error' position="sticky">
                <Container
                    sx={{ width: { md: '100%', xs: '100%' } }}>
                    <Toolbar>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

                            {/* LEFT */}
                            <Box sx={{ display: 'flex', flex: 1 }}>

                                <IconButton sx={{ display: { md: 'none' } }} onClick={(event) => setMobileAnchorEl(event.currentTarget)}>
                                    <MenuIcon sx={{ color: 'white' }} />
                                </IconButton>

                                <Box sx={{ display: { xs: 'none', md: 'flex', gap: 5 } }}>
                                    <Button onClick={() => redirect('/vocabulary')} variant='text' sx={{ color: 'white', fontWeight: '600' }}>Vocabulary</Button>
                                    <Button onClick={() => redirect('/test')} variant='text' sx={{ color: 'white', fontWeight: '600' }}>Test</Button>
                                    <Button onClick={() => redirect('/about')} variant='text' sx={{ color: 'white', fontWeight: '600' }}>About</Button>
                                </Box>

                            </Box>

                            {/* CENTER */}
                            <Box component={Link} href='/' sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 1, textDecoration: 'none', flex: { xs: 2, md: 1 } }}>
                                <SunnySnowingIcon sx={{ color: 'white' }} />
                                <Typography sx={{ color: 'white', fontWeight: '700' }}>
                                    JLPT ASSIST
                                </Typography>
                            </Box>

                            {/* RIGHT */}
                            <Box sx={{ display: 'flex', minWidth: 64, minHeight: 37, justifyContent: 'right', flex: 1 }}>
                                {(status) === 'loading' ? null :
                                    (status === 'authenticated' && (username)) ?
                                        <>
                                            <Avatar
                                                disableFocusRipple
                                                disableRipple
                                                component={IconButton}
                                                onClick={(event) => { setAvatarAnchorEl(event.currentTarget) }}
                                                sx={{ bgcolor: 'white', color: 'red' }}
                                            >
                                                {username[0].toUpperCase()}
                                            </Avatar>
                                            <Menu anchorEl={avatarAnchorEl} open={Boolean(avatarAnchorEl)} onClose={() => setAvatarAnchorEl(null)}>
                                                <MenuItem component={Link} href='/profile'>Profile</MenuItem>
                                                <MenuItem onClick={() => signOutHelper()}>Logout</MenuItem>
                                            </Menu>

                                        </>
                                        :
                                        <>
                                            <Button
                                                sx={{ color: 'white', fontWeight: '700' }}
                                                onClick={(event) => { setAvatarAnchorEl(event.currentTarget) }}
                                            >
                                                Login
                                            </Button>
                                            <Menu anchorEl={avatarAnchorEl} open={Boolean(avatarAnchorEl)} onClose={() => setAvatarAnchorEl(null)}>
                                                <MenuItem>
                                                    <Button
                                                        onClick={() => GoogleSignIn()}
                                                        color="error"
                                                        variant="contained"
                                                        startIcon={<Google />}
                                                        sx={{
                                                            borderRadius: '16px',
                                                        }}
                                                    >
                                                        Login with Google
                                                    </Button>
                                                </MenuItem>
                                            </Menu>
                                        </>
                                }
                                <Menu
                                    sx={{ display: { md: 'none' } }}
                                    color='black'
                                    anchorEl={mobileAnchorEl}
                                    open={Boolean(mobileAnchorEl)}
                                    onClose={() => setMobileAnchorEl(null)}
                                >
                                    <MenuItem component={Link} href='/vocabulary' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Vocabulary</MenuItem>
                                    <MenuItem component={Link} href='/test' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Test</MenuItem>
                                    <MenuItem component={Link} href='/about' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>About</MenuItem>
                                </Menu>
                            </Box>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        )
    }

    return (
        <MobileNavbar />
    )
}

export default Navbar