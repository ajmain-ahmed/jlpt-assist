import { DeleteForeverOutlined, InfoOutline } from "@mui/icons-material";
import { Box, Button, Container, Dialog, DialogContent, DialogTitle, Grid, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useVocab } from "../VocabDataProvider";
import { redirect } from "next/navigation";

export default function ProfileComponent() {

    const { data: session, status } = useSession()
    const username = session?.user?.username

    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('md'))

    const [userKnownWordIds, setUserKnownWordIds] = useState([])
    const [level, setLevel] = useState('all')
    const [user, setUser] = useState()
    const [records, setRecords] = useState()
    const [page, setPage] = useState(0)
    const itemsPP = 5
    const [vocab, setVocab] = useState(useVocab())
    const flagB = useRef(false)
    const [testDetailDialog, toggleTestDetailDialog] = useState(false)
    const [testDetail, setTestDetail] = useState()
    const [fillNotif, toggleFillNotif] = useState(false)
    const [fillMsg, setFillMsg] = useState('')

    const getTestRecords = async () => {
        const response = await fetch('api/GetUserQuizRecords', { method: 'POST', body: JSON.stringify({ RequestType: 'meta' }) })
        const testRecords = await response.json()
        if (testRecords.status === "200") {
            const testResults = testRecords.message
            console.log('records', testResults)
            setRecords(testResults)
        }
    }

    const deleteRecord = async (qid) => {
        if (username) {
            const request = await fetch('api/DeleteRecord',
                {
                    method: 'POST',
                    body: JSON.stringify({ quiz_id: qid })
                }
            )
            const response = await request.json()
            if (response.status === 200) {
                try {
                    await fetchUserQuizRecords('meta', null)
                }
                catch (error) {
                    toggleFillNotif(true)
                    setFillMsg(error)
                    toggleTestDetailDialog(false)
                    setPage(0)
                }
                finally {
                    const newRecords = records.filter(x => x.quiz_id != qid)
                    setRecords(newRecords)
                    toggleFillNotif(true)
                    setFillMsg('Record deleted')
                    toggleTestDetailDialog(false)
                    setPage(0)
                }
            }
            else {
                toggleFillNotif(true)
                setFillMsg('Error deleting record')
                toggleTestDetailDialog(false)
                setPage(0)
            }
        }
    }

    useEffect(() => {
        getTestRecords()
    }, [])

    // fetch user known word ids once status is verified
    useEffect(() => {
        if (status === 'authenticated' && !flagB.current) {
            fetch('/api/GetUserVocab')
                .then(response => response.json())
                .then(data => {
                    setUserKnownWordIds(data.message.map(x => x.word_id))
                    console.log('all user known word ids', data.message.map(x => x.word_id))
                })
                .finally(
                    flagB.current = true
                )
        }
    }, [status])

    useEffect(() => {
        if (session && username) {
            const userDetails = {
                username: session?.user?.username,
                createdAt: (session?.user?.createdAt).slice(0, 10)
            }
            setUser(userDetails)
        }
    }, [session])

    useEffect(() => {
        if (status === 'unauthenticated') {
            redirect('/')
        }
    }, [status, username])

    function capitalizeFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    if (status === 'loading' || status === 'unauthenticated') {
        return null
    }

    return (

        <Container sx={{}}>

            <Snackbar
                sx={{ width: '40%' }}
                open={fillNotif}
                autoHideDuration={4000}
                message={fillMsg}
                onClose={() => toggleFillNotif(false)}
            />

            <Dialog open={testDetailDialog} onClose={() => toggleTestDetailDialog(false)}>
                <DialogTitle textAlign="center">Test Details</DialogTitle>
                <DialogContent>
                    <Table size="small">
                        <TableBody>
                            {(testDetail) ?
                                <>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '600', fontSize: { xs: '1rem', md: '1.2rem' } }}>Test Type</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>{capitalizeFirstLetter(testDetail.quiz_type)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '600', fontSize: { xs: '1rem', md: '1.2rem' } }}>Random</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>{testDetail.random === true ? 'True' : 'False'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '600', fontSize: { xs: '1rem', md: '1.2rem' } }}>Correct</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>{testDetail.correct}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: '600', fontSize: { xs: '1rem', md: '1.2rem' } }}>Incorrect</TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>{testDetail.incorrect}</TableCell>
                                    </TableRow>
                                </>
                                :
                                <TableRow>
                                    <TableCell colSpan={9}>
                                        <Typography sx={{ textAlign: 'center', fontSize: { xs: '1rem', md: '1.2rem' } }}>No data available</Typography>
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                    <Box sx={{ pt: 2, textAlign: 'center' }}>
                        <Button
                            onClick={() => deleteRecord(testDetail.quiz_id)}
                            sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}
                            color="error"
                            size={matches ? 'medium' : 'small'}
                            variant="contained"
                            startIcon={<DeleteForeverOutlined />
                            }>
                            Delete record?
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* n level toolbar */}
            <Box sx={{ pt: 3, mb: 5, textAlign: 'center' }}>
                <ToggleButtonGroup
                    onChange={
                        (event, newN) => {
                            if (newN != null) {
                                setPage(0)
                                setLevel(newN)
                            }
                            else {
                                null
                            }
                        }}
                    color='error'
                    exclusive
                    value={level}
                    size={matches ? 'large' : 'medium'}
                    sx={{ mt: 2 }
                    }>
                    <ToggleButton
                        value='all'
                    >
                        All
                    </ToggleButton>
                    <ToggleButton
                        value='n1'
                    >
                        N1
                    </ToggleButton>
                    <ToggleButton
                        value='n2'
                    >
                        N2
                    </ToggleButton>
                    <ToggleButton
                        value='n3'
                    >
                        N3
                    </ToggleButton>
                    <ToggleButton
                        value='n4'
                    >
                        N4
                    </ToggleButton>
                    <ToggleButton
                        value='n5'
                    >
                        N5
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Grid container spacing={matches ? 5 : 3}>

                <Grid size={matches ? 6 : 12}>

                    {/* user details */}
                    <Paper sx={{ py: 0.2, px: 0.1, borderRadius: '16px', mb: 3 }}>
                        <TableContainer sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5, mb: 1.5 }}>
                            <Table sx={{ width: { xs: '100%', md: '100%' } }}>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>
                                            Username
                                        </TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>
                                            {(user) && user.username}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>
                                            Joined
                                        </TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>
                                            {(user) && user.createdAt}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>
                                            Tests Complete
                                        </TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>
                                            {
                                                (records) ?
                                                    level === 'all' ?
                                                        records.length :
                                                        records.filter(record => record.n_level === level).length
                                                    :
                                                    null
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>
                                            Average Score
                                        </TableCell>
                                        <TableCell sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>
                                            {
                                                (records) ?
                                                    level === 'all' ?
                                                        records.map(x => (x.correct + x.incorrect)).flatMap(y => y).reduce((a, b) => a + b, 0) === 0 ?
                                                            '0%' :
                                                            `${Math.floor(
                                                                (
                                                                    records.map(x => (x.correct)).flatMap(y => y).reduce((a, b) => a + b, 0) /
                                                                    records.map(x => (x.correct + x.incorrect)).flatMap(y => y).reduce((a, b) => a + b, 0)

                                                                ) * 100
                                                            )}%` :
                                                        records.map(x => (x.correct + x.incorrect)).flatMap(y => y).reduce((a, b) => a + b, 0) === 0 ?
                                                            '0%' :
                                                            `${Math.floor(
                                                                (
                                                                    records.filter(record => record.n_level === level).map(x => (x.correct)).flatMap(y => y).reduce((a, b) => a + b, 0) /
                                                                    records.map(x => (x.correct + x.incorrect)).flatMap(y => y).reduce((a, b) => a + b, 0)

                                                                ) * 100
                                                            )}%`
                                                    :
                                                    null
                                            }
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* level summary */}
                    <Paper sx={{ py: 0.2, px: 0.1, borderRadius: '16px' }}>
                        <TableContainer sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1.5, mb: 1.5 }}>
                            <Table sx={{ width: { xs: '100%', md: '100%' } }}>
                                <TableHead>
                                    <TableRow>
                                        {
                                            ['Level', 'Total', 'Known', 'Completion'].map((x, index) => (
                                                <TableCell sx={{ textAlign: 'center', padding: 1, fontSize: { xs: '1rem', md: '1.2rem' } }} key={index}>
                                                    {x}
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.keys(vocab).map((x, index) => (
                                        <TableRow selected={x === level} onClick={() => setLevel(x)} key={index}>
                                            <TableCell sx={{ textAlign: 'center', padding: 1, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                                                {x.toUpperCase()}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center', padding: 1, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                                                {vocab[x].length}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center', padding: 1, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                                                {vocab[x].filter(y => userKnownWordIds.includes(y.id)).length}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center', padding: 1, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                                                {`${Math.floor(
                                                    (vocab[x].filter(y => userKnownWordIds.includes(y.id)).length /
                                                        vocab[x].length) * 100
                                                )}%`}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                <Grid size={matches ? 6 : 12}>
                    {/* test results */}
                    <Paper sx={{ py: 1.5, px: 2, borderRadius: '16px', mb: 3 }}>
                        <TableContainer sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ flexGrow: 1, pt: 2 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ width: '10%', px: 1, mx: 0, fontSize: { xs: '1rem', md: '1.2rem' } }} />
                                            <TableCell sx={{ width: '30%', px: 0, mx: 0, textAlign: 'center', fontSize: { xs: '1rem', md: '1.2rem' } }}>Date</TableCell>
                                            <TableCell sx={{ width: '30%', px: 0, mx: 0, textAlign: 'center', fontSize: { xs: '1rem', md: '1.2rem' } }}>Level</TableCell>
                                            <TableCell sx={{ width: '30%', px: 0, mx: 0, textAlign: 'center', fontSize: { xs: '1rem', md: '1.2rem' } }}>Score</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(records) ?
                                            level === 'all' ?
                                                records.length > 0 ?
                                                    records.slice(page * itemsPP, (page * itemsPP) + itemsPP).map((test, index) => (
                                                        <TableRow key={test.quiz_id}>
                                                            <TableCell sx={{ width: '1%', px: 1, mx: 0, fontSize: { xs: '1rem', md: '1.2rem' } }} >
                                                                <IconButton
                                                                    onClick={() => {
                                                                        setTestDetail(test)
                                                                        toggleTestDetailDialog(true)
                                                                    }}>
                                                                    <InfoOutline color="info" fontSize="small" />
                                                                </IconButton>
                                                            </TableCell>
                                                            <TableCell sx={{ px: 0, mx: 0, textAlign: 'center', fontSize: { xs: '1rem', md: '1.2rem' } }}>{`${test.created_at.slice(8, 10)}/${test.created_at.slice(5, 7)}/${test.created_at.slice(0, 4)}`}</TableCell>
                                                            <TableCell sx={{ px: 0, mx: 0, textAlign: 'center', fontSize: { xs: '1rem', md: '1.2rem' } }}>{test.n_level.toUpperCase()}</TableCell>
                                                            <TableCell sx={{ px: 0, mx: 0, textAlign: 'center', fontSize: { xs: '1rem', md: '1.2rem' } }}>{Math.floor(((test.correct) / (test.correct + test.incorrect) * 100))}%</TableCell >
                                                        </TableRow>

                                                    ))
                                                    :
                                                    <TableRow>
                                                        <TableCell sx={{ textAlign: 'center', fontSize: { xs: '1rem', md: '1.2rem' } }} colSpan={4}>
                                                            No data available
                                                        </TableCell>
                                                    </TableRow>
                                                :
                                                records.filter(record => record.n_level === level).length > 0 ?
                                                    records.filter(record => record.n_level === level).slice(page * itemsPP, (page * itemsPP) + itemsPP).map((test, index) => (
                                                        <TableRow key={test.quiz_id}>
                                                            <TableCell sx={{ width: '1%', px: 1, mx: 0, fontSize: { xs: '1rem', md: '1.2rem' } }} >
                                                                <IconButton
                                                                    onClick={() => {
                                                                        setTestDetail(test)
                                                                        toggleTestDetailDialog(true)
                                                                    }}>
                                                                    <InfoOutline color="info" fontSize="small" />
                                                                </IconButton>
                                                            </TableCell>
                                                            <TableCell sx={{ px: 0, mx: 0, textAlign: 'center', fontSize: { xs: '1rem', md: '1.2rem' } }}>{`${test.created_at.slice(8, 10)}/${test.created_at.slice(5, 7)}/${test.created_at.slice(0, 4)}`}</TableCell>
                                                            <TableCell sx={{ px: 0, mx: 0, textAlign: 'center', fontSize: { xs: '1rem', md: '1.2rem' } }}>{test.n_level.toUpperCase()}</TableCell>
                                                            <TableCell sx={{ px: 0, mx: 0, textAlign: 'center', fontSize: { xs: '1rem', md: '1.2rem' } }}>{Math.floor(((test.correct) / (test.correct + test.incorrect) * 100))}%</TableCell >
                                                        </TableRow>
                                                    ))
                                                    :
                                                    <TableRow>
                                                        <TableCell sx={{ textAlign: 'center', fontSize: { xs: '1rem', md: '1.2rem' } }} colSpan={4}>
                                                            No data available
                                                        </TableCell>
                                                    </TableRow>
                                            : null
                                        }
                                    </TableBody>
                                </Table>
                            </Box>

                            {
                                <Box sx={{ textAlign: 'center', py: 1 }}>
                                    <Button
                                        sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}
                                        onClick={() => {
                                            if (page > 0) {
                                                setPage(prev => prev - 1)
                                            }
                                        }}
                                    >
                                        Prev
                                    </Button>
                                    <Button sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>
                                        {
                                            (records) ?
                                                level === 'all' ?
                                                    `${records.length === 0 ? 0 : page + 1} | ${Math.ceil(records.length / 10)}` :
                                                    `${records.filter(record => record.n_level === level).length === 0 ? 0 : page + 1} | ${Math.ceil(records.filter(record => record.n_level === level).length / 10)}`
                                                : null
                                        }
                                    </Button>
                                    <Button
                                        sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}
                                        onClick={() => {
                                            let maxPages = 0
                                            if (level === 'all') {
                                                maxPages = Math.ceil(records.length / 10)
                                            }
                                            else {
                                                maxPages = Math.ceil(records.filter(record => record.n_level === level).length / 10)
                                            }
                                            if (page < maxPages - 1) {
                                                setPage(prev => prev + 1)
                                            }
                                        }}
                                    >
                                        Next
                                    </Button>
                                </Box>
                            }
                        </TableContainer>
                    </Paper>
                </Grid>

            </Grid>

        </Container>
    )
}