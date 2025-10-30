"use client"
import { Box, Button, Card, CardContent, Container, Divider, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { ArrowLeft, ArrowRight, CancelOutlined, Check, Clear, CloudUploadOutlined, DoneOutline, InfoOutlineSharp, InsertChartOutlinedOutlined, KeyboardArrowUp, MoneyOff, MyLocationOutlined, PersonAddAlt1, Quiz, QuizOutlined, SchoolOutlined, SunnySnowing, Visibility } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Collapse from '@mui/material/Collapse';
import Checkbox from "@mui/material/Checkbox";
import { redirect } from 'next/navigation';
import { useRef } from "react";
import { useSession } from 'next-auth/react';

const Banner = () => {

    const MobileHomepage = () => {

        const theme = useTheme()
        const matches = useMediaQuery(theme.breakpoints.up('md'))

        // getting user session if it exists
        const { data: session, status } = useSession()
        const userid = session?.user?.userId
        const username = session?.user?.username

        // list containing the example words we use on the homepage
        const [exampleWords, setExampleWords] = useState([
            {
                slug: '美味しい',
                reading: ['おいしい'],
                definitions: [
                    {
                        type: 'I-adjective (keiyoushi)',
                        meaning: 'good (tasting), nice, delicious, tasty'
                    },
                    {
                        type: 'I-adjective (keiyoushi)',
                        meaning: 'attractive (offer, opportunity, etc.), appealing, convenient, favorable, desirable, profitable'
                    }
                ],
                result: null
            },
            {
                slug: '趣味',
                reading: ['しゅみ'],
                definitions: [
                    {
                        type: 'Noun',
                        meaning: 'hobby, pastime'
                    },
                    {
                        type: 'Noun',
                        meaning: 'tastes, preference, liking'
                    }
                ],
                result: null
            },
            {
                slug: '夢',
                reading: ['ゆめ'],
                definitions: [
                    {
                        type: 'Noun',
                        meaning: 'dream'
                    }
                ],
                result: null
            },
            {
                slug: '気分',
                reading: ['きぶん'],
                definitions: [
                    {
                        type: 'Noun',
                        meaning: 'feeling, mood'
                    }
                ],
                result: null
            },
            {
                slug: '歴史',
                reading: ['れきし'],
                definitions: [
                    {
                        type: 'Noun',
                        meaning: 'history'
                    }
                ],
                result: null
            },

        ])

        // state to manage which example is shown on the homepage (quiz/vocabtable)
        const [activeExample, setActiveExample] = useState('vocabtable')

        // table state management
        const [tableExpand, toggleTableExpand] = useState(true)
        const [tableExpand2, toggleTableExpand2] = useState(true)


        // card state management
        const [cardNumber, setCardNumber] = useState(0)
        const [cardCollapse, toggleCardCollapse] = useState(true)

        // card correct incorrect counter state management
        const [correctCount, setCorrectCount] = useState(0)
        const [incorrectCount, setIncorrectCount] = useState(0)

        // card switch function
        const changeCard = (direction) => {
            if (direction === 'back') {
                if (cardNumber > 0) {
                    setCardNumber(prev => prev - 1)
                    toggleCardCollapse(false)
                }
            }
            if (direction === 'forward') {
                if (cardNumber < exampleWords.length - 1) {
                    setCardNumber(prev => prev + 1)
                    toggleCardCollapse(false)
                }
            }
        }

        // card correct/incorrect function
        const evaluateCard = (result) => {

            if (result === 'correct') {
                setExampleWords(prev => prev.map((x, index) => (
                    (cardNumber === index) ? { ...x, result: true } : x
                )))
                changeCard('forward')
            }

            if (result === 'incorrect') {
                setExampleWords(prev => prev.map((x, index) => (
                    (cardNumber === index) ? { ...x, result: false } : x
                )))
                changeCard('forward')
            }
        }

        // card updating incorrect correct counts
        useEffect(() => {

            const correct = exampleWords.filter(x => x.result === true).length
            const incorrect = exampleWords.filter(x => x.result === false).length

            setCorrectCount(correct)
            setIncorrectCount(incorrect)

        }, [exampleWords])

        // for the more info button
        const moreInfo = useRef(null)

        return (

            <>
                <Container
                    sx={{
                        display: { md: 'flex' },
                        flexDirection: { md: 'column' },
                        alignItems: { md: 'center' },
                        justifyContent: { md: 'flex-start' }
                    }}>

                    <Box sx={{
                        width: { xs: '100%', md: '100%' },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>

                        {/* masthead */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mt: { md: 15, xs: 10 },
                            mb: { md: 10, xs: 5}
                        }}>


                            < Typography gutterBottom variant={matches ? 'h2' : 'h5'} sx={{ fontWeight: '600' }}>
                                「日本語能力試験アシスト」
                            </Typography>

                            <Typography textAlign="center" variant={matches ? 'h5' : 'subtitle1'}>
                                Master Japanese vocabulary through targeted practice and repetition.
                            </Typography>

                        </Box>

                        {/* Buttons */}
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 10 }}>

                            {/* get started */}
                            <Button
                                onClick={() => {
                                    session ?
                                        redirect('/vocabulary') :
                                        redirect('/login')
                                }}
                                variant="contained"
                                size={matches ? 'large' : 'medium'}
                                startIcon={<SchoolOutlined />}
                                color='error'
                                sx={{
                                    fontSize: '0.95rem',
                                    borderRadius: '12px',
                                    px: 2,
                                    py: 1
                                }}
                            >
                                Get Started
                            </Button>

                            {/* learn more */}
                            <Button
                                onClick={() =>
                                    window.scrollTo({
                                        top: moreInfo.current.offsetTop,
                                        behavior: "smooth"
                                    })
                                }
                                variant="outlined"
                                size={matches ? 'large' : 'medium'}
                                startIcon={<InfoOutlineSharp />}
                                color='error'
                                sx={{
                                    fontSize: '0.95rem',
                                    borderRadius: '12px',
                                    px: 2,
                                    py: 1
                                }}
                            >
                                Learn More
                            </Button>

                        </Box>

                        {/* card explaining the vocab table */}
                        <Grid container spacing={2}>
                            <Grid size={matches ? 6 : 12}>
                                <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: '16px', mb:3 }}>

                                    <CardContent sx={{ paddingBottom: 0 }}>
                                        <Button
                                            onClick={() => redirect('/vocabulary')}
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            startIcon={<AutoStoriesIcon />}
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: '0.95rem',
                                                borderRadius: '12px',
                                                px: 2,
                                                py: 1
                                            }}
                                        >
                                            Vocabulary Tables
                                        </Button>
                                    </CardContent>

                                    <CardContent sx={{ paddingBottom: 2 }}>
                                        <Typography sx={{ color: 'grey.600' }}>
                                            Begin by identifying known vocabulary, split by N-Level.
                                        </Typography>
                                    </CardContent>

                                    <Divider />

                                    <CardContent>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell sx={{ width: '1%', paddingY: 0, paddingRight: 0, paddingLeft: 1 }}>
                                                        <IconButton>
                                                            <KeyboardArrowUp />
                                                        </IconButton>
                                                    </TableCell>

                                                    <TableCell sx={{ width: '1%', padding: 0 }}>
                                                        <Checkbox defaultChecked />
                                                    </TableCell>

                                                    <TableCell sx={{ width: '98%', textAlign: 'center', pr: 9, fontSize: '1rem', fontWeight: 'bold' }}>
                                                        旅行
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                                        <Collapse in={tableExpand}>
                                                            <Box sx={{ paddingY: 2 }}>
                                                                <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>旅行</Typography>
                                                                <Typography sx={{ color: 'orange', fontSize: '1rem', mt: 1, fontWeight: 'bold' }}>Reading</Typography>
                                                                <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>りょこう</Typography>
                                                                <Typography sx={{ color: 'orange', fontSize: '1rem', mt: 1, fontWeight: 'bold' }}>Meaning</Typography>
                                                                <Typography sx={{ color: 'grey', fontSize: '1rem' }}>Noun, Suru verb, Intransitive verb</Typography>
                                                                <Typography sx={{ fontSize: '1rem' }}>travel, trip, journey, excursion, tour</Typography>
                                                            </Box>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>

                                                    <TableCell sx={{ width: '1%', paddingY: 0, paddingRight: 0, paddingLeft: 1 }}>
                                                        <IconButton>
                                                            <KeyboardArrowUp />
                                                        </IconButton>
                                                    </TableCell>

                                                    <TableCell sx={{ width: '1%', padding: 0 }}>
                                                        <Checkbox />
                                                    </TableCell>

                                                    <TableCell sx={{ width: '98%', textAlign: 'center', pr: 9, fontSize: '1rem', fontWeight: 'bold' }}>
                                                        英語
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                                        <Collapse in={tableExpand2}>
                                                            <Box sx={{ paddingY: 2 }}>
                                                                <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>英語</Typography>
                                                                <Typography sx={{ color: 'orange', fontSize: '1rem', mt: 1, fontWeight: 'bold' }}>Reading</Typography>
                                                                <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>えいご</Typography>
                                                                <Typography sx={{ color: 'orange', fontSize: '1rem', mt: 1, fontWeight: 'bold' }}>Meaning</Typography>
                                                                <Typography sx={{ color: 'grey', fontSize: '1rem' }}>Noun</Typography>
                                                                <Typography sx={{ fontSize: '1rem' }}>English (language)</Typography>
                                                            </Box>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardContent>

                                </Card>
                            </Grid>


                            {/* card explaining the quiz table */}
                            <Grid size={matches ? 6 : 12}>
                                <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: '16px', width: '100%', pb: 2.2 }}>

                                    <CardContent sx={{ paddingBottom: 0 }}>
                                        <Button
                                            onClick={() => redirect('/test')}
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            startIcon={<Quiz />}
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: '0.95rem',
                                                borderRadius: '12px',
                                                px: 2,
                                                py: 1
                                            }}
                                        >
                                            Flashcards
                                        </Button>
                                    </CardContent>

                                    <CardContent sx={{ paddingBottom: 2 }}>
                                        <Typography sx={{ color: 'grey.600' }}>
                                            Run flashcard style tests on all, known or unknown vocabulary words.
                                        </Typography>
                                    </CardContent>

                                    <Divider />

                                    <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', pt: 3 }}>

                                        {/* card numbers, right and wrong counters */}
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                            <Button size='small' disableRipple disableFocusRipple startIcon={<Quiz />} variant="outlined" color="info">
                                                <Typography variant="body1"> Card {cardNumber + 1} / {exampleWords.length} </Typography>
                                            </Button>
                                            <Button size='small' startIcon={<DoneOutline />} disableRipple disableFocusRipple variant={(exampleWords[cardNumber].result === true ? 'contained' : 'outlined')} color="success">
                                                <Typography variant="body1">{correctCount}</Typography>
                                            </Button>

                                            <Button size='small' startIcon={<CancelOutlined />} disableRipple disableFocusRipple variant={(exampleWords[cardNumber].result === false ? 'contained' : 'outlined')} color="error">
                                                <Typography variant="body1">{incorrectCount}</Typography>
                                            </Button>
                                        </Box>

                                        {/* forward, backwards, eye icon */}
                                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, paddingTop: 2 }}>

                                            <Button
                                                size='small'
                                                variant="outlined"
                                                color="primary"
                                                startIcon={<ArrowLeft />}
                                            >
                                                Prev
                                            </Button>

                                            <Button
                                                startIcon={<Visibility />}
                                                disabled={(cardCollapse === true)}
                                                size='small'
                                                variant="contained"
                                                color="primary">
                                                <Typography>Show</Typography>
                                            </Button>

                                            <Button
                                                size='small'
                                                variant="outlined"
                                                color="primary"
                                                endIcon={<ArrowRight />}
                                            >
                                                Next
                                            </Button>

                                        </Box>

                                        {/* correct, incorrect buttons */}
                                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, paddingTop: 2 }}>

                                            <Button
                                                disabled={cardCollapse === true ? false : true}
                                                size='small'
                                                variant="contained"
                                                color="success"
                                                startIcon={<Check />}
                                            >
                                                Correct
                                            </Button>
                                            <Button
                                                disabled={cardCollapse === true ? false : true}
                                                size='small'
                                                variant="contained"
                                                color="error"
                                                startIcon={<Clear />}
                                            >
                                                Incorrect
                                            </Button>

                                        </Box>

                                    </CardContent>

                                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
                                        <Typography sx={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            {exampleWords[cardNumber].slug}
                                        </Typography>
                                    </CardContent>

                                    {/* content holder for card details */}
                                    <Collapse in={true} timeout={{ enter: 400, exit: 10 }}>
                                        <CardContent sx={{ pt: 0 }}>
                                            <Box>
                                                <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}> {exampleWords[cardNumber].slug}</Typography>

                                                <Typography sx={{ color: 'orange', mt: 1, fontWeight: 'bold' }}>Reading</Typography>

                                                {exampleWords[cardNumber].reading.map((x, index) => (
                                                    <Typography sx={{ fontWeight: 'bold' }} key={`reading ${index}`}>{x}</Typography>
                                                ))}

                                                <Typography sx={{ color: 'orange', mt: 1, fontWeight: 'bold' }}>Meaning</Typography>

                                                {exampleWords[cardNumber].definitions.map((y, index) => (
                                                    <Box sx={{ mb: 1 }} key={`meaning ${index}`}>
                                                        <Typography sx={{ color: 'grey', fontSize: '1rem' }}>{y.type}</Typography>
                                                        <Typography sx={{ fontSize: '1rem' }}>{y.meaning}</Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </CardContent>
                                    </Collapse>

                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                </Container >

                <Box
                    ref={moreInfo}
                    sx={{
                        background: `repeating-linear-gradient(
                        -55deg,
                        rgba(34, 34, 34, 0.04),
                        rgba(34, 34, 34, 0.04) 10px,
                        rgba(51, 51, 51, 0.04), 
                        rgba(51, 51, 51, 0.04) 20px
                        )`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        width: '100%',
                        mt: 5,
                        pt: 5,
                        pb: { md: 15, xs: 5 }
                    }}>
                    <Box sx={{ mb: 5, width: '100%', textAlign: 'center' }}>
                        <Typography variant={matches ? 'h2' : 'h5'} gutterBottom sx={{}}>Core Features</Typography>
                        <Typography variant={matches ? 'h4' : 'h5'} gutterBottom sx={{ color: 'grey' }}>Modern features, simple design philosophy</Typography>
                    </Box>

                    <Box sx={{ width: { xs: '90%', md: '50%' } }}>

                        <Grid container spacing={2} sx={{}}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 1, padding: 1 }}>
                                        <MyLocationOutlined color='error' fontSize={'large'} sx={{ border: 1, borderRadius: '16px', px: 0.5, py: 0.2 }} />
                                        <Typography sx={{ fontWeight: '600' }} variant='h6'>Targeted Study</Typography>
                                    </Box>
                                    <Box sx={{ padding: 1 }}>
                                        <Typography sx={{ color: 'grey' }} variant='subtitle1'>Tailor your learning to specific N-Levels, building a solid foundation for the next exam.</Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 1, padding: 1 }}>
                                        <QuizOutlined color='error' fontSize={'large'} sx={{ border: 1, borderRadius: '16px', px: 0.5, py: 0.2 }} />
                                        <Typography sx={{ fontWeight: '600' }} variant='h6'>Customisable Tests</Typography>
                                    </Box>
                                    <Box sx={{ padding: 1 }}>
                                        <Typography sx={{ color: 'grey' }} variant='subtitle1'>Quiz yourself on all words, those you know, those you don't, or the ones you keep missing.</Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 1, padding: 1 }}>
                                        <CloudUploadOutlined color='error' fontSize={'large'} sx={{ border: 1, borderRadius: '16px', px: 0.5, py: 0.2 }} />
                                        <Typography sx={{ fontWeight: '600' }} variant='h6'>Sync Across Devices</Typography>
                                    </Box>
                                    <Box sx={{ padding: 1 }}>
                                        <Typography sx={{ color: 'grey' }} variant='subtitle1'>Progress data saved securely to the cloud, allowing you to continue on any device.</Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 1, padding: 1 }}>
                                        <MoneyOff color='error' fontSize={'large'} sx={{ border: 1, borderRadius: '16px', px: 0.5, py: 0.2 }} />
                                        <Typography sx={{ fontWeight: '600' }} variant='h6'>Free to use</Typography>
                                    </Box>
                                    <Box sx={{ padding: 1 }}>
                                        <Typography sx={{ color: 'grey' }} variant='subtitle1'>No paid features, no advertisements and no user data collected beyond authentication.</Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                        </Grid>
                    </Box>
                </Box>
            </>
        )
    }

    return (
        <MobileHomepage />
    )
}

export default Banner