'use strict'
var gCtx
var gElCanvas
let gSelectedImg = null
var gElImg 


// search
$('#searchWord').change('keydown', onSearch)
$('#searchBtn').click('input', onSearch)
$('#clearBtn').click('input', renderGallery)
$('#addText').change('keydown', function (event) {
    let text = $(this).val()
    $('#addText').val('')
    onAddText(text)
})




function onInit() {
    console.log('init')
    renderGallery()
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

}


function onAddText(text) {
    if (!gMemes || !gMemes.lines) {
        // console.error('gMemes is not defined or lines array is missing!')
        return
    }
    const line = addText(text)
    gMemes.selectedLineIdx = gMemes.lines.length - 1
    drawText(line.txt, line.pos.x, line.pos.y, line.color, line.size)

}


function drawText(txt, x = gElCanvas.width * 0.5, y = gElCanvas.height * 0.5, size = 50, color) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'white'
    gCtx.fillStyle = color
    gCtx.font = `${size}px Arial`
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(txt, x, y)
    gCtx.strokeText(txt, x, y)
}





function openGenerator(imgID) {
    gSelectedImg = gImgs.findIndex(img => img.id === imgID)

    // document.querySelector('.generator-container').classList.remove('hide')
    // document.body.classList.toggle('generator-screen');
    onCreateMeme(gImgs[gSelectedImg])

}

function onCreateMeme(img) {
    const elImg = new Image()
    elImg.src = img.url
    const id = gImgs[gSelectedImg].id
    gElImg =elImg
    createGMeme(id)
    coverCanvasWithImg(elImg)

}

function onSearch(ev) {
    var searchWord = $('#searchWord').val().toLowerCase()
    filterByWord(searchWord)
    console.log(searchWord)
    $('#searchWord').val('')
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


function renderGalleryByFilter(imgByFilter) {
    var strHTMLs = ''
    if (!imgByFilter || imgByFilter.length < 0) {
        alert('not find') 
    }
        strHTMLs = imgByFilter.map(img => {
            return `<img src="${img.url}" alt="${img.id}" onclick="openGenerator(${img.id})">`
        }).join('')
        $('.gallery-container').html(strHTMLs)

}







// ====================================================================



function renderCanvas() {
    coverCanvasWithImg(gElImg)

    renderElements()
}



function renderElements() {
    const line = getLine()
    if (!line) return 
    drawText(line.txt, line.pos.x, line.pos.y, line.size, line.color)
    
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




function onDown(ev) {
    const pos = getEvPos(ev)
    const line = getLine()

    if (!line || !isElementClicked(pos)) return
    setElementDrag(true)
    line.pos = pos
    document.body.style.cursor = 'grabbing'


}

function moveLine(dx, dy) {
    const line = getLine()
    if (!line) return

    line.pos.x += dx
    line.pos.y += dy
    
    renderCanvas()

}

function onMove(ev) {
    const line = getLine()
  
    if (!line || !line.isDrag) return

    const pos = getEvPos(ev)


    line.pos.x = pos.x
    line.pos.y = pos.y

    renderCanvas()

}


function onUp() {
    setElementDrag(false)
    document.body.style.cursor = 'grab'
}



function isElementClicked(pos) {
    const line = getLine()
    if (!line) return false

    const textWidth = gCtx.measureText(line.txt).width
    const textHeight = line.size

    const isXInside = pos.x >= line.pos.x - textWidth / 2 && pos.x <= line.pos.x + textWidth / 2
    const isYInside = pos.y >= line.pos.y - textHeight / 2 && pos.y <= line.pos.y + textHeight / 2
    return isXInside && isYInside

}




// Canvas functions 
function resizeCanvas() {
    if (!gElImg) return

    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth * 0.9
    coverCanvasWithImg(gElImg)

}

function coverCanvasWithImg(elImg) {
        gElCanvas.height = (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)

}


