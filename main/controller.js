'use strict'

var gCtx
var gElCanvas
let gSelectedImg = null
var gElImg
let sizeDiff = 0

// =======================================================================
//  JQuery init
// =======================================================================
$(onInit)

function onInit() {
    gTotalSearchWord = loadFromStorage(KEY_STORAGE)
    if (!Array.isArray(gTotalSearchWord)) gTotalSearchWord = []

    gElCanvas = document.querySelector('#meme-canvas')
    gCtx = gElCanvas.getContext('2d')

    renderGallery()
    searchWordCounter()
    bindEvents()

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    $('.generator-container').hide()
}

// =======================================================================
//  Bind events
// =======================================================================
function bindEvents() {
    // search
    $('#searchWord').on('keydown', function (ev) {
        if (ev.key === 'Enter') onSearch()
    })
    $('#searchBtn').on('click', onSearch)
    $('#clearBtn').on('click', () => {
        $('#searchWord').val('')
        renderGallery()
    })

    // add text (Enter בתוך האינפוט)
    $('#addText').on('keydown', function (ev) {
        if (ev.key !== 'Enter') return
        const text = $(this).val()
        if (!text) return
        const color = $('#pickColor').val()
        $(this).val('')
        onAddText(text, sizeDiff, color)
    })

    // pick color
    $('#pickColor').on('input', function () {
        pickColor($(this).val())
    })

    // text size
    $('.sizePlus').on('click', function () {
        onSize(+$(this).data('change')) // data-change="1"
    })
    $('.sizeMinus').on('click', function () {
        onSize(+$(this).data('change')) // data-change="-1"
    })

    // delete line
    $('.deleteBtn').on('click', onDeleteLine)

    // switch line
    $('.swichBtn').on('click', onSwich)

    // download
    $('#downloadBtn').on('click', function () {
        onDownload(this)
    })

    // back to gallery
    $('#backBtn').on('click', closeGenerator)

    // popular search words
    $('.topWords-container').on('click', '.searchWord-link', function (ev) {
        ev.preventDefault()
        const word = $(this).text()
        filterByWord(word)
    })

    // canvas mouse + touch
    const $canvas = $('#meme-canvas')
    $canvas.on('mousedown', onDown)
    $canvas.on('mousemove', onMove)
    $canvas.on('mouseup', onUp)

    $canvas.on('touchstart', onDown)
    $canvas.on('touchmove', onMove)
    $canvas.on('touchend', onUp)

    // gallery – event delegation
    $('.gallery-container').on('click', '.gallery-img', function () {
        const id = +$(this).data('id')
        openGenerator(id)
    })
}

// =======================================================================
//  Search / top words
// =======================================================================

function searchWordCounter() {
    if (!Array.isArray(gTotalSearchWord) || !gTotalSearchWord.length) {
        $('.topWords-container').html('')
        return
    }

    gKeyWordSearchCountMap = gTotalSearchWord.reduce((acc, word) => {
        if (!acc[word]) acc[word] = 0
        acc[word]++
        return acc
    }, {})

    const entriesSorted = Object.entries(gKeyWordSearchCountMap)
        .sort((w1, w2) => w2[1] - w1[1])

    const topWordsArry = entriesSorted.slice(0, 6)

    const topWords = []
    for (var i = 0; i < topWordsArry.length; i++) {
        const currArry = topWordsArry[i]
        const currWord = currArry[0]
        topWords.push(currWord)
    }
    renderTopWords(topWords)
}

function renderTopWords(topWords) {
    if (!topWords || !topWords.length) {
        $('.topWords-container').html('')
        return
    }

    let strHTMLs = ''
    for (var i = 0; i < topWords.length; i++) {
        strHTMLs += `<a href="#" class="searchWord-link">${topWords[i]}</a>`
    }
    $('.topWords-container').html(strHTMLs)
}

function onSearch() {
    const searchWord = $('#searchWord').val().toLowerCase().trim()
    $('#searchWord').val('')
    filterByWord(searchWord) // הלוגיקה בפונקציה בסרוויס
}

// =======================================================================
//  Gallery
// =======================================================================

function renderGallery() {
    let strHTMLs = ''
    if (gImgs && gImgs.length > 0) {
        strHTMLs = gImgs.map(img => {
            return `<img src="${img.url}" 
                         data-id="${img.id}" 
                         class="gallery-img" 
                         alt="meme ${img.id}">`
        }).join('')
    }
    $('.gallery-container').html(strHTMLs)
}

function renderGalleryByFilter(imgByFilter) {
    if (!imgByFilter || !imgByFilter.length) {
        $('.gallery-container').html('<p>Not found</p>')
        return
    }
    const strHTMLs = imgByFilter.map(img => {
        return `<img src="${img.url}" 
                     data-id="${img.id}" 
                     class="gallery-img" 
                     alt="meme ${img.id}">`
    }).join('')
    $('.gallery-container').html(strHTMLs)
}

// =======================================================================
//  Generator open / close
// =======================================================================

function openGenerator(imgID) {
    gSelectedImg = gImgs.findIndex(img => img.id === imgID)
    if (gSelectedImg === -1) return

    $('.gallery-container').hide()
    $('.generator-container').show()

    $('#backBtn').show()
    document.body.classList.add('generator-screen')
    $('.header-container').addClass('generator-header-color')
    $('.h1').addClass('h1-generator')
    $('footer').addClass('generator-footer-color')

    $('.search-container').hide()
    $('.topWords-container').hide()
    $('.myMEME-container').hide()

    onCreateMeme(gImgs[gSelectedImg])
}

function closeGenerator() {
    $('.gallery-container').show()
    $('.generator-container').hide()
    $('footer').removeClass('generator-footer-color')

    $('#backBtn').hide()
    document.body.classList.remove('generator-screen')
    $('.header-container').removeClass('generator-header-color')
    $('.h1').removeClass('h1-generator')

    $('.search-container').show()
    $('.topWords-container').show()
    $('.myMEME-container').show()
}

function onCreateMeme(img) {
    const elImg = new Image()
    elImg.src = img.url
    const id = gImgs[gSelectedImg].id
    gElImg = elImg
    gElImg.onload = () => {
        resizeCanvas()
        coverCanvasWithImg(elImg)
    }
    createGMeme(id)
}

// =======================================================================
//  Meme edit
// =======================================================================

function onDownload(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

function onDeleteLine() {
    deleteLine()
    renderCanvas()
}

function onAddText(text, sizeDiff, color) {
    if (!gMemes || !gMemes.lines) return

    const line = addLine(text, sizeDiff, color)
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

function pickColor(color) {
    const line = getLine()
    if (!line) return

    $('.newColor').css('color', color)
    line.color = color
    renderCanvas()
    selectElement(line)
}

function selectElement(line) {
    if (!line) return
    drawText(line.txt, line.pos.x, line.pos.y, line.size, line.color)
}

function onSize(diff) {
    const line = getLine()
    if (!line) return
    line.size += diff
    renderCanvas()
}

function onSwich() {
    if (!gMemes.lines.length) return
    gMemes.selectedLineIdx += 1
    if (gMemes.selectedLineIdx >= gMemes.lines.length) {
        gMemes.selectedLineIdx = 0
    }
    selectElement(gMemes.lines[gMemes.selectedLineIdx])
    return gMemes.lines[gMemes.selectedLineIdx]
}

// =======================================================================
//  Canvas elements
// =======================================================================

function renderCanvas() {
    if (!gElImg) return
    coverCanvasWithImg(gElImg)
    renderElements()
}

function renderElements() {
    const line = getLine()
    if (!line) return
    gMemes.lines.map(line =>
        drawText(line.txt, line.pos.x, line.pos.y, line.size, line.color)
    )
        drawSelectionBox(line)

}

function drawSelectionBox(line) {
    if (!line) return

    gCtx.save()
    gCtx.font = `${line.size}em Arial`
    const textWidth = gCtx.measureText(line.txt).width

    const paddingX = 20
    const paddingTop = 40  
    const paddingBottom = 40

    const rectX = line.pos.x - textWidth / 2 - paddingX

    const rectY = line.pos.y - paddingTop

    const rectWidth = textWidth + paddingX * 2
    const rectHeight = paddingTop + paddingBottom

    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'yellow'
    gCtx.setLineDash([6, 4]) 

    gCtx.strokeRect(rectX, rectY, rectWidth, rectHeight)

    gCtx.restore()
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
    ev.preventDefault()
    const pos = getEvPos(ev)
    selectLine(pos)

    const line = getLine()

    if (!line || !isElementClicked(pos)) return
    setElementDrag(true)
    line.pos = pos
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    ev.preventDefault()
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

    return isXInside && isYInside
}

// =======================================================================
//  Canvas init
// =======================================================================

function resizeCanvas() {
    if (!gElImg) return

    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth * 0.6
    gElCanvas.height = elContainer.clientHeight * 0.6

    coverCanvasWithImg(gElImg)
}

function coverCanvasWithImg(elImg) {
    gElCanvas.height = (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}
