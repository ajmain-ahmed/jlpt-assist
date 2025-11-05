'use client'
import { Card, CardContent, Container, Typography, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../components/Navbar";
import { SessionProvider } from "next-auth/react";

export default function AboutPage() {

    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('md'))

    return (
        <SessionProvider>
            <Navbar />
            <Container>
                <Card sx={{ mt: {md:10, xs:5}, borderRadius: '16px' }}>
                    <CardContent>

                        <Typography sx={{ mb: 2 }} variant={matches ? 'h5' : 'h5'}>
                            JLPT Assist Project
                        </Typography>

                        <Typography gutterBottom variant={matches ? 'subtitle1' : 'subtitle1'}>
                            The JLPT Assist project was built using Next.js, Material UI components, Supabase and NextAuth.
                            The app was designed to enable learners to measure and track their understanding of the vocabulary required across each JLPT level.
                            That being said, it must be emphasised that no level has an exhaustive vocabulary list.
                        </Typography>

                        <Typography gutterBottom variant={matches ? 'subtitle1' : 'subtitle1'}>
                            Users are encouraged to first look through the vocabulary table for their target JLPT level and tick words they are familiar with.
                            Users could then benefit by running tests on unknown cards to learn new words, known cards to solidify their existing knowledge or all cards for a comprehensive study session.
                        </Typography>

                        <Typography gutterBottom variant={matches ? 'subtitle1' : 'subtitle1'}>
                            The profile page contains a summary of each test run and the progress made on each JLPT level.
                        </Typography>

                    </CardContent>
                </Card>

                <Card sx={{ mt: 3, mb: 0, borderRadius: '16px' }}>
                    <CardContent>

                        <Typography sx={{ mb: 2 }} variant={matches ? 'h5' : 'h5'}>
                            Sources
                        </Typography>

                        <Typography gutterBottom variant={matches ? 'subtitle1' : 'subtitle1'}>
                            Vocabulary: https://jisho.org
                        </Typography>
                        <Typography gutterBottom variant={matches ? 'subtitle1' : 'subtitle1'}>
                            Kanji: https://kanjiapi.dev/
                        </Typography>

                    </CardContent>
                </Card>

                <Card sx={{ mt: 3, mb: 0, borderRadius: '16px' }}>
                    <CardContent>

                        <Typography sx={{ mb: 2 }} variant={matches ? 'h5' : 'h5'}>
                            From the developer
                        </Typography>

                        <Typography gutterBottom variant={matches ? 'subtitle1' : 'subtitle1'}>
                            I've been studying Japanese for around 3 years and passed N2 back in the December of 2024.
                            I'm working towards preparing for the N1 now but there's still a lot to learn.
                            Japanese is difficult but a lot of fun, I hope this app can be of some use to you (and me).
                        </Typography>

                        <Typography>
                            <strong>dydxcosxさん</strong>
                        </Typography>

                    </CardContent>
                </Card>

                <Card sx={{ mt: 3, mb: 5, borderRadius: '16px' }}>
                    <CardContent>

                        <Typography sx={{ mb: 2 }} variant={matches ? 'h5' : 'h5'}>
                            Contact details
                        </Typography>

                        <Typography gutterBottom variant={matches ? 'subtitle1' : 'subtitle1'}>
                            <strong>dydxcosx@naver.com</strong>
                        </Typography>

                    </CardContent>
                </Card>

            </Container>
        </SessionProvider>
    )
}