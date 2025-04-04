'use strict'
var gCtx
var gElCanvas
let gSelectedImg = null
var gElImg
let sizeDiff = 0

// =======================================================================
//  JQuery bottons - HTML
// =======================================================================

$('#searchWord').change('keydown', onSearch)
$('#searchBtn').click('input', onSearch)
$('#clearBtn').click('input', renderGallery)

$('#addText').change('keydown', function (event) {
    let text = $(this).val()
    let color = $('#pickColor').val()
    $('#addText').val('')
    onAddText(text, sizeDiff, color)
})

$('#pickColor').change(pickColor)
$('.sizePlus').click(function () {
    onSize(+$(this).data('change'))
})

$('.sizeMinus').click(function () {
    onSize(+$(this).data('change'))
})
$('.deleteBtn').click(onDeleteLine)
$('.swichBtn').click(onSwich)
$('#downloadBtn').click(function () { onDownload(this) })

$('#backBtn').click('input', closeGenerator)
$('.searchWord-link').click(function (event) {
    event.preventDefault()
    filterByWord($(this).text())
})


// =======================================================================
// on general
// =======================================================================

function onInit() {
    // loadFromStorage(KEY_STORAGE)
    renderGallery()
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    $('.generator-container').hide()
    searchWordCounter()
    renderTopWords()


}


function searchWordCounter() {
    gKeyWordSearchCountMap = gTotalSearchWord.reduce((acc, word) => {
        if (!acc[word]) acc[word] = 0
        acc[word]++
        return acc
    }, {})
    const entriesSorted = Object.entries(gKeyWordSearchCountMap).sort((w1, w2) => w2[1] - w1[1])
    const topWordsArry = entriesSorted.slice(0, 5)
    // return topWords
    const topWords = []
    for (var i = 0; i < topWordsArry.length; i++) {
        const currArry = topWordsArry[i]
        const currWord = currArry[0]
        topWords.push(currWord)
    }
    console.log(topWords)
    renderTopWords(topWords)
}

function renderTopWords(topWords) {
    let strHTMLs = ''
    if (topWords && topWords.length > 0) {
        for (var i = 0; i < topWords.length; i++) {
            strHTMLs += `<a href="#" class="searchWord-link">${topWords[i]}</a>`
        }
        $('.topWords-container').html(strHTMLs)
        console.log(strHTMLs)
    }
    // strHTMLs = topWords.map((word) => {
    //     return `<a href="#" class="searchWord-link">${word}</a>`
    // }).join('')
}
// }




function openGenerator(imgID) {
    gSelectedImg = gImgs.findIndex(img => img.id === imgID)

    $('.main-container').hide()
    $('.generator-container').show()

    document.body.classList.add('generator-screen')

    $('#searchWord').hide()
    $('#searchBtn').hide()
    $('#clearBtn').hide()

    onCreateMeme(gImgs[gSelectedImg])
}

function closeGenerator() {
    $('.main-container').show()
    $('.generator-container').hide()

    document.body.classList.remove('generator-screen')

    $('#searchWord').show()
    $('#searchBtn').show()
    $('#clearBtn').show()

}

function onCreateMeme(img) {
    const elImg = new Image()
    elImg.src = img.url
    const id = gImgs[gSelectedImg].id
    gElImg = elImg
    createGMeme(id)
    coverCanvasWithImg(elImg)

}

function onSearch(ev) {
    var searchWord = $('#searchWord').val().toLowerCase()
    filterByWord(searchWord)
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
//generator - edit MEME 
// ====================================================================

function onDownload(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

function onDeleteLine(selectedLineIdx) {
    deleteLine(selectedLineIdx)
    renderCanvas()

}

function onAddText(text, sizeDiff, color) {
    if (!gMemes || !gMemes.lines) {
        return
    }
    const line = addLine(text, sizeDiff, color)
    line.size += sizeDiff
    gMemes.selectedLineIdx = gMemes.lines.length - 1
    drawText(line.txt, line.pos.x, line.pos.y, line.size, line.color)

}

function drawText(txt, x = gElCanvas.width * 0.5, y = gElCanvas.height * 0.5, size = 5, color) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'white'
    gCtx.fillStyle = color
    gCtx.font = `${size}em Arial`
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(txt, x, y)
    gCtx.strokeText(txt, x, y)

}

function pickColor() {
    const line = getLine()
    let color = $('#pickColor').val()
    line.color = color
    renderCanvas()
    selectElement(line)
    $('#pickColor').val('#000000')
}

function selectElement(line) {
    if (!line) return

    return drawText(line.txt, line.pos.x, line.pos.y, line.size, line.color)
}

function onSize(diff) {
    const line = getLine()
    line.size += diff
    renderCanvas()
    selectElement(line)
}

function onSwich() {
    gMemes.selectedLineIdx += 1
    if (gMemes.selectedLineIdx >= gMemes.lines.length) {
        gMemes.selectedLineIdx = 0
    }
    selectElement(gMemes.lines[gMemes.selectedLineIdx])
    return gMemes.lines[gMemes.selectedLineIdx]
    // console.log(gMemes.lines[gMemes.selectedLineIdx])
}

// ====================================================================
// canvas - elements
// ====================================================================


function renderCanvas() {
    coverCanvasWithImg(gElImg)

    renderElements()
}

function renderElements() {
    const line = getLine()
    if (!line) return
    gMemes.lines.map((line) => drawText(line.txt, line.pos.x, line.pos.y, line.size, line.color))
    // drawText(line.txt, line.pos.x, line.pos.y, line.size, line.color)

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

function selectLine(pos) {
    const index = gMemes.lines.findIndex(line =>
        pos.x >= line.pos.x - 50 && pos.x <= line.pos.x + 50 &&
        pos.y >= line.pos.y - 20 && pos.y <= line.pos.y + 20
    )

    if (index !== -1) {
        gMemes.selectedLineIdx = index

        return gMemes.lines[index]
    }
}

function onDown(ev) {
    const pos = getEvPos(ev)
    // const index= gMemes.lines.findIndex((line) => line.pos.x === pos.x )
    selectLine(pos)

    const line = getLine()

    if (!line || !isElementClicked(pos)) return
    setElementDrag(true)
    line.pos = pos
    document.body.style.cursor = 'grabbing'


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

    const padding = 20


    const isXInside = pos.x >= line.pos.x - textWidth / 2 && pos.x <= line.pos.x + textWidth / 2 + padding
    const isYInside = pos.y >= line.pos.y - textHeight / 2 && pos.y <= line.pos.y + textHeight / 2 + padding

    // const currIdx= gMemes.lines.findIndex((line) => line.pos.x === pos.x )
    return isXInside && isYInside


}
// ====================================================================
// Canvas Init 
// ====================================================================

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


