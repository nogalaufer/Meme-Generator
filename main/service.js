'use strict'

const KEY_STORAGE = 'key-storage'

var gKeyWordSearchCountMap
var gTotalSearchWord

var gMemes = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [],
}

var gImgs = [
    { id: 1, url: 'main/service/meme-imgs/meme-imgs-(square)/1.jpg', keywords: ['donald trump', 'politician', 'united states', 'us'] },
    { id: 2, url: 'main/service/meme-imgs/meme-imgs-(square)/2.jpg', keywords: ['dog', 'puppy', 'cute', 'baby'] },
    { id: 3, url: 'main/service/meme-imgs/meme-imgs-(square)/3.jpg', keywords: ['dog', 'puppy', 'cute', 'baby'] },
    { id: 4, url: 'main/service/meme-imgs/meme-imgs-(square)/4.jpg', keywords: ['cat', 'cute', 'sleep'] },
    { id: 5, url: 'main/service/meme-imgs/meme-imgs-(square)/5.jpg', keywords: ['strong', 'cute', 'sleep'] },
    { id: 6, url: 'main/service/meme-imgs/meme-imgs-(square)/6.jpg', keywords: ['person', 'aliens', 'size', 'describe'] },
    { id: 7, url: 'main/service/meme-imgs/meme-imgs-(square)/7.jpg', keywords: ['baby', 'shock', 'stunning'] },
    { id: 8, url: 'main/service/meme-imgs/meme-imgs-(square)/8.jpg', keywords: ['birthday', 'willy wonka', 'purple', 'movie'] },
    { id: 9, url: 'main/service/meme-imgs/meme-imgs-(square)/9.jpg', keywords: ['baby', 'sneaky', 'kid', 'cute'] },
    { id: 10, url: 'main/service/meme-imgs/meme-imgs-(square)/10.jpg', keywords: ['politic', 'barak obama', 'black', 'people', 'laugh'] },
    { id: 11, url: 'main/service/meme-imgs/meme-imgs-(square)/11.jpg', keywords: ['man', 'kiss', 'people', 'gay'] },
    { id: 12, url: 'main/service/meme-imgs/meme-imgs-(square)/12.jpg', keywords: ['man', 'point', 'people', 'hand'] },
    { id: 13, url: 'main/service/meme-imgs/meme-imgs-(square)/13.jpg', keywords: ['man', 'wine', 'people', 'leonardo dicaprio', 'hot'] },
    { id: 14, url: 'main/service/meme-imgs/meme-imgs-(square)/14.jpg', keywords: ['man', 'black', 'people', 'glass'] },
    { id: 15, url: 'main/service/meme-imgs/meme-imgs-(square)/15.jpg', keywords: ['man', 'sean bean', 'people', 'hot', 'point', 'hand'] },
    { id: 16, url: 'main/service/meme-imgs/meme-imgs-(square)/16.jpg', keywords: ['man', 'star trek', 'people', 'laugh', 'eyes', 'hand'] },
    { id: 17, url: 'main/service/meme-imgs/meme-imgs-(square)/17.jpg', keywords: ['suit', 'russia', 'people', 'politic', 'vladimir putin', 'hand'] },
    { id: 18, url: 'main/service/meme-imgs/meme-imgs-(square)/18.jpg', keywords: ['cartoon', 'toy story', 'woody', 'buzz', 'pixar', 'hand'] },
]

// =======================================================================
//  Meme lines
// =======================================================================

function deleteLine() {
    if (!gMemes.lines.length) return
    gMemes.lines.splice(gMemes.selectedLineIdx, 1)
    if (gMemes.selectedLineIdx >= gMemes.lines.length) {
        gMemes.selectedLineIdx = gMemes.lines.length - 1
    }
}

function addLine(text, sizeDiff, color = 'black') {
    const line = {
        pos: { x: gElCanvas.width * 0.5, y: gElCanvas.height * 0.5 },
        txt: text,
        size: 5 + sizeDiff,
        color,
        isDrag: false,
    }
    gMemes.lines.push(line)
    gMemes.selectedLineIdx = gMemes.lines.length - 1
    return line
}

function createGMeme(id) {
    gMemes.selectedImgId = id
    gMemes.selectedLineIdx = 0
    gMemes.lines = []
}

function getCurrMeme(imgID) {
    return (gMemes.selectedImgId === imgID) ? gMemes : null
}

// =======================================================================
//  Search + storage
// =======================================================================

function _saveToStorage(value) {
    saveToStorage(KEY_STORAGE, value)
}

function filterByWord(searchWord) {
    if (!searchWord) {
        renderGallery()
        return
    }

    const lower = searchWord.toLowerCase()
    const imgByFilter = gImgs.filter(img =>
        img.keywords.some(kw => kw.toLowerCase().includes(lower))
    )

    if (!imgByFilter.length) {
        alert('Not found, try again')
        return
    }

    if (!Array.isArray(gTotalSearchWord)) gTotalSearchWord = []
    gTotalSearchWord.push(lower)

    _saveToStorage(gTotalSearchWord)

    renderGalleryByFilter(imgByFilter)
    searchWordCounter()
}

// =======================================================================
//  Drag helper
// =======================================================================

function setElementDrag(isDrag) {
    const line = getLine()
    if (!line) return
    line.isDrag = isDrag
    renderCanvas()
}

function getLine() {
    if (!gMemes || gMemes.selectedLineIdx < 0 || !gMemes.lines.length) {
        return null
    }
    return gMemes.lines[gMemes.selectedLineIdx]
}
