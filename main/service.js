'use strict'
var KEY_STORAGE = 'key-storage'

var gMemes = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [],
}
var gKeyWordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }
var gImgs = [
    { id: 1, url: 'main/service/meme-imgs/meme-imgs-(square)/1.jpg', keywords: ['donald trump', 'politician', 'United States', 'us'] },
    { id: 2, url: 'main/service/meme-imgs/meme-imgs-(square)/2.jpg', keywords: ['dog', 'puppy', 'cute', 'baby'] },
    { id: 3, url: 'main/service/meme-imgs/meme-imgs-(square)/3.jpg', keywords: ['dog', 'puppy', 'cute', 'baby'] },
    { id: 4, url: 'main/service/meme-imgs/meme-imgs-(square)/4.jpg', keywords: ['cat', 'cute', 'sleep'] },
    { id: 5, url: 'main/service/meme-imgs/meme-imgs-(square)/5.jpg', keywords: ['strong', 'cute', 'sleep'] },
    { id: 6, url: 'main/service/meme-imgs/meme-imgs-(square)/6.jpg', keywords: ['person', 'aliens', 'size', 'describe'] },
    { id: 7, url: 'main/service/meme-imgs/meme-imgs-(square)/7.jpg', keywords: ['baby', 'shock', 'stunning'] },
    { id: 8, url: 'main/service/meme-imgs/meme-imgs-(square)/8.jpg', keywords: ['birthday', 'willy wonka', 'perple', 'movie'] },
    { id: 9, url: 'main/service/meme-imgs/meme-imgs-(square)/9.jpg', keywords: ['baby', 'snicky', 'kid', 'cute'] },
    { id: 10, url: 'main/service/meme-imgs/meme-imgs-(square)/10.jpg', keywords: ['politic', 'barak obama', 'black', 'people', 'laught'] },
    { id: 11, url: 'main/service/meme-imgs/meme-imgs-(square)/11.jpg', keywords: ['man', 'kiss', 'people', 'gey'] },
    { id: 12, url: 'main/service/meme-imgs/meme-imgs-(square)/12.jpg', keywords: ['man', 'point', 'people', 'hand'] },
    { id: 13, url: 'main/service/meme-imgs/meme-imgs-(square)/13.jpg', keywords: ['man', 'wine', 'people', 'leonardo dicaprio', 'hot'] },
    { id: 14, url: 'main/service/meme-imgs/meme-imgs-(square)/14.jpg', keywords: ['man', 'black', 'people', 'glass'] },
    { id: 15, url: 'main/service/meme-imgs/meme-imgs-(square)/15.jpg', keywords: ['man', 'sean bean', 'people', 'hot', 'piont', 'hand'] },
    { id: 16, url: 'main/service/meme-imgs/meme-imgs-(square)/16.jpg', keywords: ['man', 'star trek', 'people', 'laught', 'eyes', 'hand'] },
    { id: 17, url: 'main/service/meme-imgs/meme-imgs-(square)/17.jpg', keywords: ['suit', 'russia', 'people', 'politic', 'vladimir putin', 'hand'] },
    { id: 18, url: 'main/service/meme-imgs/meme-imgs-(square)/18.jpg', keywords: ['cartoon', 'toy story', 'woodie', 'bazz', 'pixar', 'hand'] },
]


function addText(text) {
    const line = {
        pos: { x: (gElCanvas.width * 0.5), y: (gElCanvas.height * 0.5) },
        txt: text,
        size: 50,
        color: 'black',
        isDrag: false,
    }
    gMemes.lines.push(line)
    return line
}

function createGMeme(id) {
    gMemes.selectedImgId =id
}

function setSelectedMeme(index) {
    gMemes.lines[selectedLineIdx] = index
}

function getCurrMeme(imgID) {
    return gMemes.find(meme => meme.selectedImgId === imgID)
}

function _saveToStorage() {
    saveToStorage(KEY_STORAGE, value)
}


function filterByWord(searchWord) {
   const imgByFilter= gImgs.filter((img) => img.keywords.includes(searchWord))
   searchWordCounter(searchWord)
   renderGalleryByFilter(imgByFilter)


}

function searchWordCounter(searchWord){
    

}
