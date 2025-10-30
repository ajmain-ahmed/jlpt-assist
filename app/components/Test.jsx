import { Container, ToggleButton, ToggleButtonGroup, Box, useTheme, useMediaQuery, Typography, Button, Alert, Collapse, Paper, TableContainer, Table, TableRow, TableCell, TableHead, TableBody, Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, DialogContent, Card, CardContent, Slider, Divider, FormControlLabel, Switch, TextField, DialogActions, Input, Grid, DialogContentText, FormGroup, Checkbox, CircularProgress, Snackbar, IconButton } from "@mui/material";
import LooksOne from "@mui/icons-material/LooksOne";
import SettingsIcon from "@mui/icons-material/Settings";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import { ArrowLeftOutlined, ArrowRightOutlined, Article, CancelOutlined, Check, Clear, DoneOutline, KeyboardArrowDownOutlined, Looks3, Looks4, Looks5, LooksTwo, Quiz, Start, VisibilityOff } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useVocab } from "../VocabDataProvider";

export default function Test() {

    const { data: session, status } = useSession()
    const userid = session?.user?.userId

    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('md'))

    const flagA = useRef(false)
    const flagB = useRef(false)

    const [vocab, setVocab] = useState(useVocab())
    const [userKnownWordIds, setUserKnownWordIds] = useState()
    const [ukwidByLevel, setUkwidByLevel] = useState({ 'n1': [], 'n2': [], 'n3': [], 'n4': [], 'n5': [] })

    const [kanjiBank, setKanjiBank] = useState([]) // keeping each kanji so we don't hit the api on repeat opens
    const [kanjiDia, setKanjiDia] = useState(false)
    const [kanjiLoading, setKanjiLoading] = useState(false)

    const [level, setLevel] = useState('n1')
    const [type, setType] = useState('all')
    const [random, setRadnom] = useState(false)
    const [cardCount, setCardCount] = useState(20)
    const [parcel, setParcel] = useState({ setKnown: [], setUnknown: [] })

    const [settingsDia, openSettingsDia] = useState(false)
    const [stopDia, openStopDia] = useState(false)
    const [resultsDia, openResultsDia] = useState(false)

    const [testCards, setTestCards] = useState()
    const [cardNumber, setCardNumber] = useState(0)
    const [showCard, toggleShowCard] = useState(false)
    const [testOn, setTestOn] = useState(false)
    const [testComplete, setTestComplete] = useState(false)
    const [saveToVT, setSaveToVT] = useState(true)
    const [saveToDB, setSaveToDB] = useState(true)
    const [vtSubmissionStatus, setVTSubmissionStatus] = useState()
    const [dbSubmissionStatus, setDBSubmissionStatus] = useState()
    const [submissionCollapse, setSubmissionCollapse] = useState(false)
    const [loadingSubmission, setLoadingSubmission] = useState(false)
    const [fillNotif, toggleFillNotif] = useState(false)
    const [fillMsg, setFillMsg] = useState([])

    const allKana = [
        // Hiragana
        'あ', 'い', 'う', 'え', 'お',
        'か', 'き', 'く', 'け', 'こ',
        'が', 'ぎ', 'ぐ', 'げ', 'ご',
        'さ', 'し', 'す', 'せ', 'そ',
        'ざ', 'じ', 'ず', 'ぜ', 'ぞ',
        'た', 'ち', 'つ', 'て', 'と',
        'だ', 'ぢ', 'づ', 'で', 'ど',
        'な', 'に', 'ぬ', 'ね', 'の',
        'は', 'ひ', 'ふ', 'へ', 'ほ',
        'ば', 'び', 'ぶ', 'べ', 'ぼ',
        'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ',
        'ま', 'み', 'む', 'め', 'も',
        'や', 'ゆ', 'よ',
        'ら', 'り', 'る', 'れ', 'ろ',
        'わ', 'を', 'ん',

        // Katakana
        'ア', 'イ', 'ウ', 'エ', 'オ',
        'カ', 'キ', 'ク', 'ケ', 'コ',
        'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
        'サ', 'シ', 'ス', 'セ', 'ソ',
        'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
        'タ', 'チ', 'ツ', 'テ', 'ト',
        'ダ', 'ヂ', 'ヅ', 'デ', 'ド',
        'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
        'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
        'バ', 'ビ', 'ブ', 'ベ', 'ボ',
        'パ', 'ピ', 'プ', 'ペ', 'ポ',
        'マ', 'ミ', 'ム', 'メ', 'モ',
        'ヤ', 'ユ', 'ヨ',
        'ラ', 'リ', 'ル', 'レ', 'ロ',
        'ワ', 'ヲ', 'ン'
    ]

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

    // set ukwid by level once jlpt and user word id is present
    useEffect(() => {
        if (userKnownWordIds && vocab && session) {
            Object.keys(vocab).forEach(level => {
                const levelData = vocab[level]
                const levelWordIDs = levelData.map(word => word.id)
                setUkwidByLevel(prev => ({ ...prev, [level]: userKnownWordIds.filter(id => levelWordIDs.includes(id)) }))
            })
        }
    }, [userKnownWordIds, vocab, session])

    // force card count to be > 1 and < 100 and not a word
    useEffect(() => {
        // if it's a word
        if ((isNaN(cardCount)) && cardCount != '') {
            setCardCount(20)
        }
        if ((type === 'all' || type === 'unknown') && cardCount > vocab[level].length) {
            setCardCount(20)
        }
        if (type === 'known' && cardCount > ukwidByLevel[level].length) {
            setCardCount(20)
        }
    }, [cardCount, level, type])

    // detects when all cards have either a true/false result, and fills in the parcel
    useEffect(() => {
        // fill in parcel
        if (testCards && session) {
            const correctCards = testCards.filter(x => x.result === true)
            const incorrectCards = testCards.filter(x => x.result === false)
            const toBeCorrect = correctCards.filter(x => !userKnownWordIds.includes(x.id))
            console.log('tbc', toBeCorrect.length)
            const toBeinCorrect = incorrectCards.filter(x => userKnownWordIds.includes(x.id))
            console.log('tbi', toBeinCorrect.length)
            setParcel({ setKnown: toBeCorrect, setUnknown: toBeinCorrect })
            console.log({ setKnown: toBeCorrect, setUnknown: toBeinCorrect })
        }

        // detect when test is over
        if (testCards && testCards.map(x => x.result).filter(y => y === null).length === 0) {
            if (!testComplete) {
                if (parcel.setKnown.length === 0 && parcel.setUnknown.length === 0) {
                    setSaveToVT(false)
                }
                setTestComplete(true)
                openResultsDia(true)
                console.log('the test is over')
            }
        }

    }, [testCards])

    // preventing a level/type bug
    useEffect(() => {
        // levels that can use used for known test
        const safeKnownLevels = Object.keys(ukwidByLevel).filter(x => ukwidByLevel[x].length >= 20)
        const fallBack = safeKnownLevels[0]
        if (type === 'known' && ukwidByLevel[level].length < 20) {
            setLevel(fallBack)
        }
    }, [level, type])

    // randomise vocab array
    function shuffle(array) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
    }

    // fetching kanji details from external apis when button clicked IF it doesn't exist in kanji bank
    const fetchKanji = async (testCards, cardNumber) => {
        if (testCards) {
            const indiv = [...testCards[cardNumber].slug].map(x => (!allKana.includes(x) ? x : null)).filter(x => x != null).filter(y => !kanjiBank.map(x => x.kanji).includes(y))

            if (indiv.length > 0) {

                setKanjiLoading(true)

                const willResolve = []

                console.log('FETCH RUN')

                indiv.map(async x => {
                    const response = fetch(`https://kanjiapi.dev/v1/kanji/${x}`).then(res => res.json())
                    willResolve.push(response)
                })

                const kanji = await Promise.all(willResolve)
                console.log('new kanji bank', [...kanjiBank, kanji].flatMap(x => x))
                setKanjiBank(prev => [...prev, kanji].flatMap(x => x)) // add details to the bank

                setKanjiLoading(false)
                console.log(kanji)
            }
        }
    }

    const startTest = (level, type, random, cardCount) => {
        setSaveToDB(true)
        setSaveToVT(true)
        setSubmissionCollapse(false)
        const testCards = vocab[level]
        if (random) {
            shuffle(testCards)
        }

        if (type === 'all') {
            const slicedCards = testCards.slice(0, cardCount)
            setTestCards(slicedCards)
            console.log('sliced cards', slicedCards)
            setTestOn(true)
        }

        if (type === 'known') {
            const knownCards = testCards.filter(x => ukwidByLevel[level].includes(x.id))
            const slicedCards = knownCards.slice(0, cardCount)
            setTestCards(slicedCards)
            console.log('sliced cards', slicedCards)
            setTestOn(true)
        }

        if (type === 'unknown') {
            const unknownCards = testCards.filter(x => !ukwidByLevel[level].includes(x.id))
            // if there are not enough unknown cards to cover the number of cards the user wants...
            if (unknownCards.length < cardCount) {
                const fillCards = testCards.filter(x => ukwidByLevel[level].includes(x.id))
                shuffle(fillCards)
                const slicedCards = fillCards.slice(0, cardCount - unknownCards.length)
                const concatCards = unknownCards.concat(slicedCards)
                setTestCards(concatCards)
                setFillMsg(`Test partially filled with +${slicedCards.length} cards`)
                toggleFillNotif(true)
                console.log('concat cards', concatCards)
                setTestOn(true)
            }
            else {
                const slicedCards = unknownCards.slice(0, cardCount)
                setTestCards(slicedCards)
                console.log('sliced cards', slicedCards)
                setTestOn(true)
            }
        }
    }

    const endTest = () => {
        openStopDia(false)
        openResultsDia(false)
        setTestOn(false)
        toggleShowCard(false)
        setCardNumber(0)
        setTestComplete(false)
    }

    const sendData = async (saveToVT, saveToDB) => {
        setLoadingSubmission(true)
        if (saveToVT) {
            const initialPackage = {}
            parcel.setKnown.forEach(x => initialPackage[x.id] = false)
            parcel.setUnknown.forEach(x => initialPackage[x.id] = true)
            const adjustedPackage = {}
            parcel.setKnown.forEach(x => adjustedPackage[x.id] = true)
            parcel.setUnknown.forEach(x => adjustedPackage[x.id] = false)

            if (session) {

                const response = await fetch('api/SubmitVocabChange',
                    {
                        method: 'POST',
                        body: JSON.stringify({ initial: initialPackage, adjusted: adjustedPackage })
                    })

                const responseMsg = await response.json()
                console.log(responseMsg)
                if (responseMsg.status === 200) {
                    setVTSubmissionStatus(true)
                    const toDelete = []
                    const toAppend = []
                    Object.keys(initialPackage).map(x => {
                        if (initialPackage[x] === true && adjustedPackage[x] === false) {
                            toDelete.push(Number(x))
                        }
                        else if (initialPackage[x] === false && adjustedPackage[x] === true) {
                            toAppend.push(Number(x))
                        }
                    })
                    const newUserKnownWordIDs = userKnownWordIds.filter(x => !toDelete.includes(x)).concat(toAppend)
                    console.log('newuserknownwordids', newUserKnownWordIDs)
                    setUserKnownWordIds(newUserKnownWordIDs)
                }
                else {
                    setVTSubmissionStatus(false)
                }

            }
        }

        if (saveToDB) {

            const quizSession = {
                nLevel: level,
                quizType: type,
                random: random,
                correct: testCards.filter(x => x.result === true).length,
                incorrect: testCards.filter(x => x.result === false).length,
            }

            const apiResponse = await fetch('/api/SubmitQuizSession',
                {
                    method: 'POST',
                    body: JSON.stringify(quizSession)
                })

            const apiResult = await apiResponse.json()
            console.log('db api result', apiResult)
            if (apiResult.status === 200) {
                setDBSubmissionStatus(true)
            }
            else {
                setDBSubmissionStatus(false)
            }
        }
        setLoadingSubmission(false)
    }

    return (
        <Container>

            {/* kanji dialog */}
            <Dialog sx={{}} fullWidth={matches ? true : true} maxWidth={matches ? 'xs' : 'xl'} open={kanjiDia} onClose={() => setKanjiDia(false)}>
                <DialogContent>
                    <Paper sx={{ mt: 1, borderRadius: '16px', py: 1.5, px: 2, mb: 10 }}>
                        <TableContainer>
                            <Table size="small">
                                <TableBody>
                                    {
                                        (!kanjiLoading) ?
                                            kanjiBank.filter(x => [...testCards[cardNumber].slug].map(x => (!allKana.includes(x) ? x : null)).filter(x => x != null).includes(x.kanji)).map((x, index) => (
                                                <React.Fragment key={index}>
                                                    <TableRow>
                                                        <TableCell sx={{ padding: 0, py: 0.5, textAlign: 'center', width: '100%' }}>
                                                            <Typography variant="h6">
                                                                {x.kanji}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell colSpan={3} sx={{ padding: 0, py: 1, px: 1 }}>
                                                            <Collapse in={true}>
                                                                <Box>
                                                                    <Typography gutterBottom>
                                                                        <strong>On:</strong> {x.on_readings.map(onR => onR).join(', ')}
                                                                    </Typography>
                                                                    <Typography gutterBottom>
                                                                        <strong>Kun:</strong> {x.kun_readings.map(kunR => kunR).join(', ')}
                                                                    </Typography>
                                                                    <Typography gutterBottom>
                                                                        {x.meanings.map(meaning => meaning).join(', ')}
                                                                    </Typography>
                                                                </Box>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            ))
                                            :
                                            <TableRow>
                                                <TableCell sx={{ textAlign: 'center' }}>
                                                    <Typography>
                                                        <CircularProgress color="error" size="25px" />
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setKanjiDia(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* quiz settings */}
            <Dialog sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} open={settingsDia}>
                <DialogContent sx={{ pb: 0.5 }}>
                    <Card>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 0 }}>

                            <ToggleButtonGroup
                                disabled={testOn}
                                color='error'
                                exclusive
                                onChange={
                                    (event, newN) => (newN) != null ? (setLevel(newN)) : null}
                                value={level}
                                size={matches ? 'medium' : 'small'}
                                sx={{ mt: 2 }
                                }>
                                <ToggleButton
                                    value='n1'
                                    disabled={type === 'known' && ukwidByLevel['n1'].length < 20}
                                >
                                    N1
                                </ToggleButton>
                                <ToggleButton
                                    disabled={type === 'known' && ukwidByLevel['n2'].length < 20}
                                    value='n2'
                                >
                                    N2
                                </ToggleButton>
                                <ToggleButton
                                    disabled={type === 'known' && ukwidByLevel['n3'].length < 20}
                                    value='n3'
                                >
                                    N3
                                </ToggleButton>
                                <ToggleButton
                                    disabled={type === 'known' && ukwidByLevel['n4'].length < 20}
                                    value='n4'
                                >
                                    N4
                                </ToggleButton>
                                <ToggleButton
                                    disabled={type === 'known' && ukwidByLevel['n5'].length < 20}
                                    value='n5'
                                >
                                    N5
                                </ToggleButton>
                            </ToggleButtonGroup>

                            <ToggleButtonGroup
                                disabled={testOn}
                                onChange={(event, newType) => newType != null ? setType(newType) : null}
                                color='error'
                                exclusive
                                value={type}
                                size={matches ? 'medium' : 'small'}
                                sx={{ mt: 2 }}>
                                <ToggleButton value='all'>All Cards</ToggleButton>
                                <ToggleButton
                                    disabled={!session || Object.values(ukwidByLevel).every(level => level.length < 20)}
                                    value='known'>
                                    Known
                                </ToggleButton>
                                <ToggleButton
                                    disabled={!session}
                                    value='unknown'>
                                    Unknown
                                </ToggleButton>
                            </ToggleButtonGroup>

                            <Divider sx={{ mt: 2, width: '80%' }} />

                            <Box sx={{ pl: 2, mt: 2, mb: 1 }}>
                                <FormControlLabel
                                    disabled={testOn}
                                    control={<Switch checked={random} size={matches ? 'medium' : 'small'} color='error' />}
                                    label="Randomise card order"
                                    onChange={() => setRadnom(prev => !prev)}
                                />
                            </Box>

                            <Box sx={{ minWidth: '100%', mt: 2, display: 'flex', gap: 1 }}>
                                <TextField
                                    error={cardCount < 20}
                                    disabled={testOn}
                                    sx={{ minWidth: '100%' }}
                                    size={matches ? 'medium' : 'small'}
                                    variant="outlined"
                                    value={cardCount}
                                    label="Number of Cards"
                                    onChange={(e) => setCardCount(e.target.value)}
                                    helperText={
                                        (type === 'all' || type === 'unknown') ?
                                            `Min: 20, Max: ${vocab[level].length}` :
                                            `Min: 20, Max: ${ukwidByLevel[level].length}`
                                    }
                                />
                            </Box>

                        </CardContent>
                    </Card>
                </DialogContent>
                <DialogActions sx={{ pt: 0.5 }}>
                    <Button
                        onClick={() => {
                            if (cardCount === '' || cardCount < 20) {
                                setCardCount(20)
                                openSettingsDia(false)
                            }
                            else {
                                openSettingsDia(false)
                            }
                        }}
                        size={matches ? 'medium' : 'small'}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* stop test dialog */}
            <Dialog open={stopDia} onClose={() => openStopDia(false)}>
                <DialogTitle variant='subtitle1'>
                    Would like to end the quiz?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your progress will be not saved.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => openStopDia(false)}>Go Back</Button>
                    <Button onClick={() => endTest()}>End Quiz</Button>
                </DialogActions>
            </Dialog>

            {/* post quiz dialog */}
            <Dialog open={resultsDia} sx={{}}>
                <DialogContent sx={{ pb: 0 }}>
                    <Paper sx={{ py: 1.5, px: 2 }}>
                        <Typography sx={{ textAlign: 'center', mb: 2, fontWeight: '600' }}>
                            Test Complete
                        </Typography>

                        {(session) ?
                            <>
                                <Alert icon={false} severity="success" sx={{ mb: 2 }}>
                                    <Typography>
                                        Correct word(s) marked as unknown in table: <strong>{parcel['setKnown'].length}</strong>
                                    </Typography>
                                </Alert>

                                <Alert icon={false} severity="error" sx={{ mb: 2 }}>
                                    <Typography>
                                        Incorrect word(s) marked as known in table: <strong>{parcel['setUnknown'].length}</strong>
                                    </Typography>
                                </Alert>

                                <FormGroup sx={{ mb: 1 }}>
                                    <FormControlLabel
                                        control={<Checkbox
                                            onChange={() => setSaveToVT(prev => !prev)}
                                            disabled={(parcel['setUnknown'].length === 0 && parcel['setKnown'].length === 0) || (submissionCollapse)}
                                            checked={saveToVT} />
                                        }
                                        label="Save changes to table." />
                                    <FormControlLabel control={<Checkbox disabled={(submissionCollapse)} checked={saveToDB} onChange={() => setSaveToDB(prev => !prev)} />} label="Save test result to database." />
                                </FormGroup>

                                <Collapse timeout={{ enter: 400, exit: 400 }} in={submissionCollapse}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1, flexDirection: 'column' }}>
                                        {(loadingSubmission) ?
                                            <CircularProgress color="error" size="25px" /> :
                                            <>
                                                <Typography>
                                                    {(saveToVT && vtSubmissionStatus) ?
                                                        `Changes saved.` :
                                                        (saveToVT && !vtSubmissionStatus) ?
                                                            `Error saving changes` :
                                                            null
                                                    }
                                                </Typography>
                                                <Typography>
                                                    {(saveToDB && dbSubmissionStatus) ?
                                                        `Results saved.` :
                                                        (saveToDB && !dbSubmissionStatus) ?
                                                            `Error saving results` :
                                                            null
                                                    }
                                                </Typography>
                                            </>
                                        }
                                    </Box>
                                </Collapse>
                            </> :
                            <Alert severity="error" icon={false}>
                                <Typography sx={{ textAlign: 'center' }}>
                                    You must be logged in to save test results.
                                </Typography>
                            </Alert>
                        }

                    </Paper>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            if (!session) {
                                openResultsDia(false)
                            }
                            else {
                                if (submissionCollapse) {
                                    endTest()
                                }
                                else {
                                    openResultsDia(false)
                                }
                            }
                        }}
                        size={matches ? 'large' : 'small'}
                    >
                        {(session) ? 'Close' : 'Close Dialog'}
                    </Button>
                    <Button
                        disabled={submissionCollapse}
                        onClick={() => {
                            if (!session) {
                                endTest()
                            }

                            else {
                                if (saveToVT || saveToDB) {
                                    setSubmissionCollapse(true)
                                }
                                else {
                                    endTest()
                                }
                                sendData(saveToVT, saveToDB)
                            }
                        }}
                        size={matches ? 'large' : 'small'}
                    >
                        {(session) ? 'Confirm' : 'End Test'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* when the test cards get filled */}
            <Snackbar
                sx={{ width: '70%' }}
                open={fillNotif}
                autoHideDuration={4000}
                message={fillMsg}
                onClose={() => toggleFillNotif(false)}
            />

            <Paper sx={{ mt: 5, borderRadius: '16px', py: 1.5, px: 2, mb: 10 }}>
                <Box sx={{ textAlign: 'center' }}>

                    {/* toolbar */}
                    <Box sx={{ pt: 1 }}>
                        <ToggleButtonGroup disabled={(session) && (!userKnownWordIds)} size={matches ? 'medium' : 'medium'}>

                            <ToggleButton onClick={() => openSettingsDia(true)} size={matches ? 'medium' : 'medium'} sx={{ borderColor: '#d32f2f', px: { md: 1.4, xs: 1.4 } }}>
                                <SettingsIcon fontSize={matches ? 'medium' : 'medium'} color='error' />
                            </ToggleButton>

                            <ToggleButton
                                onClick={() => {
                                    if (testOn) {
                                        openStopDia(true)
                                    }
                                    else {
                                        startTest(level, type, random, cardCount)
                                    }
                                }}
                                variant='contained'
                                size={matches ? 'medium' : 'medium'}
                                sx={{ borderColor: '#d32f2f', px: { md: 1.3, xs: 1.3 } }}
                            >
                                {(testOn) ?
                                    <StopIcon fontSize={matches ? 'medium' : 'medium'} color='error' /> :
                                    <PlayArrowIcon fontSize={matches ? 'medium' : 'medium'} color='error' />
                                }
                            </ToggleButton>

                            <ToggleButton
                                onClick={() => {
                                    if (testOn) {
                                        fetchKanji(testCards, cardNumber)
                                        setKanjiDia(true)
                                    }
                                }}
                                variant='contained'
                                size={matches ? 'medium' : 'medium'}
                                sx={{ borderColor: '#d32f2f', px: { md: 1.3, xs: 1.3 } }}
                            >
                                <Article
                                    fontSize={matches ? 'medium' : 'medium'}
                                    color={testOn ? 'error' : ''}
                                />
                            </ToggleButton>


                            <ToggleButton onClick={() => {
                                if (testComplete) {
                                    openResultsDia(true)
                                }
                            }}
                                variant='contained'
                                size={matches ? 'medium' : 'medium'}
                                sx={{ borderColor: '#d32f2f', px: { md: 1.3, xs: 1.3 } }}
                            >
                                <SportsScoreIcon fontSize={matches ? 'medium' : 'medium'} color={testComplete ? 'error' : ''} />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Collapse timeout={{ enter: 400, exit: 0 }} in={testOn}>
                        {(testOn && testCards) &&
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 1, pb: 1.5, pt: 1.5 }}>
                                <Button size={matches ? 'large' : 'small'} startIcon={<Quiz />} variant="outlined" color="info">
                                    <Typography variant="body1">{`${cardNumber + 1} / ${testCards.length}`}</Typography>
                                </Button>

                                <Button size={matches ? 'large' : 'small'} startIcon={<DoneOutline />} disableRipple disableFocusRipple variant={testCards[cardNumber].result === true ? 'contained' : 'outlined'} color="success">
                                    <Typography variant="body1">{testCards.map(x => x.result).filter(y => y === true).length}</Typography>
                                </Button>

                                <Button size={matches ? 'large' : 'small'} startIcon={<CancelOutlined />} disableRipple disableFocusRipple variant={testCards[cardNumber].result === false ? 'contained' : 'outlined'} color="error">
                                    <Typography variant="body1">{testCards.filter(x => x.result === false).length}</Typography>
                                </Button>
                            </Box>}

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, pb: 1.5 }}>
                            <Button
                                onClick={() => {
                                    if (cardNumber >= 1) {
                                        setCardNumber(prev => prev - 1)
                                        toggleShowCard(false)
                                    }
                                }}
                                size={matches ? 'large' : 'small'}
                                variant="outlined"
                                color="primary"
                                startIcon={<ArrowLeftOutlined />}
                            >
                                Prev
                            </Button>

                            <Button
                                disabled={showCard}
                                size={matches ? 'large' : 'small'}
                                variant="contained"
                                color="primary"
                                startIcon={<VisibilityOff />}
                                onClick={() => { (showCard === false) && toggleShowCard(prev => !prev) }}
                            >
                                Show
                            </Button>

                            <Button
                                onClick={() => {
                                    if (cardNumber < testCards.length - 1) {
                                        setCardNumber(prev => prev + 1)
                                        toggleShowCard(false)
                                    }
                                }}
                                size={matches ? 'large' : 'small'}
                                variant="outlined"
                                color="primary"
                                endIcon={<ArrowRightOutlined />}
                            >
                                Next
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <Button
                                onClick={() => {
                                    setTestCards(prev =>
                                        prev.map((card, index) => {
                                            return index === cardNumber ? { ...card, result: true } : card
                                        })
                                    )
                                    if (cardNumber < testCards.length - 1) {
                                        setCardNumber(prev => prev + 1)
                                        toggleShowCard(false)
                                    }
                                }}
                                size={matches ? 'large' : 'small'}
                                variant="contained"
                                color="success"
                                startIcon={<Check />}
                                disabled={!showCard}
                            >
                                Correct
                            </Button>
                            <Button
                                onClick={() => {
                                    setTestCards(prev =>
                                        prev.map((card, index) => {
                                            return index === cardNumber ? { ...card, result: false } : card
                                        })
                                    )
                                    if (cardNumber < testCards.length - 1) {
                                        setCardNumber(prev => prev + 1)
                                        toggleShowCard(false)
                                    }
                                }}
                                size={matches ? 'large' : 'small'}
                                variant="contained"
                                color="error"
                                startIcon={<Clear />}
                                disabled={!showCard}
                            >
                                Incorrect
                            </Button>
                        </Box>
                    </Collapse>

                    <Collapse timeout={{ enter: 400, exit: 400 }} in={!testOn}>

                        <Alert icon={false} severity='info' sx={{ mb: 1, mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: { xs: '1rem', md: '1.2rem' } }}>
                            Set the test configuration before running.
                        </Alert>

                        {(vocab && userKnownWordIds) &&
                            <TableContainer sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, mb: 2 }}>
                                <Table size={!matches && 'small'} sx={{ width: { xs: '100%', md: '35%' }, border: 2 }}>
                                    <TableHead>
                                        <TableRow>
                                            {
                                                ['Level', 'Total', 'Known', 'Completion'].map((x, index) => (
                                                    <TableCell sx={{ textAlign: 'center', padding: 1 }} key={index}>
                                                        {x}
                                                    </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(vocab).map((x, index) => (
                                            <TableRow selected={x === level} onClick={() => setLevel(x)} key={index}>
                                                <TableCell sx={{ textAlign: 'center', padding: 1 }}>
                                                    {x.toUpperCase()}
                                                </TableCell>
                                                <TableCell sx={{ textAlign: 'center', padding: 1 }}>
                                                    {vocab[x].length}
                                                </TableCell>
                                                <TableCell sx={{ textAlign: 'center', padding: 1 }}>
                                                    {vocab[x].filter(y => userKnownWordIds.includes(y.id)).length}
                                                </TableCell>
                                                <TableCell sx={{ textAlign: 'center', padding: 1 }}>
                                                    {`${Math.floor(
                                                        (vocab[x].filter(y => userKnownWordIds.includes(y.id)).length /
                                                            vocab[x].length) * 100
                                                    )}%`}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>}

                    </Collapse>

                    {/* main word */}
                    <Collapse timeout={{ enter: 400, exit: 400 }} in={testOn}>
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ textAlign: 'center', fontWeight: '700', fontSize: { xs: '2.5rem', md: '3rem' } }}>
                                {(testOn && testCards) && testCards[cardNumber].slug}
                            </Typography>
                        </Box>
                    </Collapse>

                </Box>

                <Collapse timeout={{ enter: 250, exit: 10 }} in={(showCard)}>
                    {(testCards) &&
                        <Box sx={{ py: 1 }}>

                            {[...new Set(testCards[cardNumber].japanese.map(y => y.word))].map((z, zindex) => (
                                <Typography key={zindex} sx={{ fontWeight: '700', fontSize: { xs: '1.8rem', md: '2rem' } }}>{z}</Typography>
                            ))}

                            <Typography gutterBottom sx={{ color: 'orange', mt: 1, fontWeight: '700', fontSize: { xs: '1.2rem', md: '1.5rem' } }}>Reading</Typography>

                            {[...new Set(testCards[cardNumber].japanese.map((x => x.reading)))].map(b => (
                                <Typography key={b} sx={{ fontWeight: '700', fontSize: { xs: '1.2rem', md: '1.2rem' } }}>{b}</Typography>
                            ))}

                            <Typography gutterBottom sx={{ color: 'orange', mt: 1, fontWeight: '700', fontSize: { xs: '1.2rem', md: '1.5rem' } }}>Meaning</Typography>

                            <Box sx={{ mb: 1 }}>

                                {testCards[cardNumber].senses.map((x, senseIndex) => (
                                    x.parts_of_speech != 'Wikipedia definition' && x.parts_of_speech != 'Place' && x.parts_of_speech != 'Full name' ?
                                        <Box key={senseIndex}>

                                            {x.parts_of_speech.map((f, posIndex) => (
                                                <Typography key={posIndex} sx={{ color: 'grey', fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                                                    {f}
                                                </Typography>
                                            ))}

                                            {x.tags.map((g, tagIndex) => (
                                                <Typography key={tagIndex} sx={{ color: 'grey', fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                                                    {g}
                                                </Typography>
                                            ))}

                                            <Typography sx={{ mb: 1, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                                                {x.english_definitions.join(', ')}
                                            </Typography>
                                        </Box>
                                        : null
                                ))}
                            </Box>
                        </Box>
                    }
                </Collapse>

            </Paper>
        </Container>
    );
}