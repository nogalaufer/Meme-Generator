'use strict'
var gCtx
var gElCanvas
let gSelectedImg = null
var gElImg

// search
$('#searchWord').change('keydown', onSearch)
$('#searchBtn').click('input', onSearch)
$('#addText').change('keydown', function (event) {
    let text = $(this).val()
    addText(text)
})

var gKeyWordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }




function onInit() {
    console.log('init')
    renderGallery()
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

}

function addText(text) {
    const line = {
        pos: { x: (gElCanvas.width * 0.5), y: (gElCanvas.height * 0.5) },
        txt: text,
        size: 20,
        color: 'pink',
        isDrag: false,
    }
    gMemes.lines.push(line)
    gMemes.selectedLineIdx = gMemes.lines.length - 1
    console.log("gmemes",line.txt)

    drawText(line.txt)

}

function drawText(txt, x = gElCanvas.width * 0.5, y = gElCanvas.height * 0.5, color) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'white'
    gCtx.fillStyle = 'black'
    gCtx.font = '45px Arial'
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(txt, x, y)
    gCtx.strokeText(txt, x, y)
}

function getLine(selectedLineIdx =0) {
    // if (selectedLineIdx < 0 ) {
    //     return
    // }
    const line = gMemes.lines[selectedLineIdx]
    return line


}




function openGenerator(imgID) {
    gSelectedImg = gImgs.findIndex(img => img.id === imgID)
    // document.querySelector('.generator-container').classList.remove('hide')
    // document.body.classList.toggle('generator-screen');

    onCreateMeme(gImgs[gSelectedImg])
}

function onCreateMeme(img) {
    // createMeme(img)
    const elImg = new Image()
    elImg.src = img.url
    coverCanvasWithImg(elImg)

}



function onSearch(ev) {
    var searchWord = $('#searchWord').val().toLowerCase()
    console.log(searchWord)

}


function renderGallery() {
    var strHTMLs = ''
    if (gImgs && gImgs.length > 0) {
        strHTMLs = gImgs.map(img => {
            return `<img src="${img.url}" alt="${img.id}" onclick="openGenerator(${img.id})">`
        }).join('')
    }
    $('.gallery-container').html(strHTMLs)
}








function setElementDrag(isDrag) {
    const line = getLine()
    line.isDrag = isDrag
}

function renderCanvas() {
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
    renderElements()
}

function renderElements() {
    //* Get the props we need from the circle
    const { pos, color, size } = getLine()
    //* Draw the circle
    drawText(txt, pos.x, pos.y, size, color)
}

function getEvPos(ev) {
    const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()

        ev = ev.changedTouches[0]


        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,


        }
    }
    return pos
}






function onMove(ev) {
    const line = getLine()
    const { isDrag } = getLine()
    if (!isDrag) return

    const pos = getEvPos(ev)

    const dx = pos.x - line.pos.x
    const dy = pos.y - line.pos.y
    moveLine(dx, dy)
    line.pos = pos
    renderCanvas()

}

function moveLine(dx, dy) {
    const line = getLine()
    line.pos.x += dx
    line.pos.y += dy
}

function onDown(ev) {
    const pos = getEvPos(ev)

    if (!isElementClicked(pos)) return
    setElementDrag(true)
    line.pos = pos
    document.body.style.cursor = 'grabbing'

}


function onUp() {
    setElementDrag(false)
    document.body.style.cursor = 'grab'
}



function isElementClicked(pos){
    const line = getLine()
    const textWidth = gCtx.measureText(line.txt).width
    const textHeight = line.size 

    if (
        pos.x >= line.pos.x - textWidth / 2 &&
        pos.x <= line.pos.x + textWidth / 2 &&
        pos.y >= line.pos.y - textHeight / 2 &&
        pos.y <= line.pos.y + textHeight / 2
    ) {
        return true
    }
    return false
}




// Canvas functions 
function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')

    //* Changing the canvas dimension clears the canvas\
    gElCanvas.width = elContainer.clientWidth * 0.9
    coverCanvasWithImg(gElImg)
}

function coverCanvasWithImg(elImg) {
    gElCanvas.height = (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}

