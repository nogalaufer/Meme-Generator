'use strict'

var gMemes = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [
        {
            pos: { x: (gElCanvas.width * 0.5), y: (gElCanvas.height * 0.5) },
            txt: 'I sometimes eat Falafel',
            size: 20,
            color: 'red',
            isDrag: false,
        }]
}

// $('#addText').change('keydown', function (event) {
//     let text = $(this).val()
//     console.log('dddddd',text)
//     addText(text)
//     console.log(gMemes)
// })


// function addText(text) {
//     const line = {
//         txt: text,
//         size: 20,
//         color: 'pink',
//         isDrag: false,
//     }
//     gMemes.lines.push(line)
//     gMemes.selectedLineIdx = gMemes.lines.length - 1
//     console.log(gMemes)

//     drawText(line.txt)

// }


// function drawText(txt, x = gElCanvas.width * 0.5, y = gElCanvas.height * 0.5, color) {
//     gCtx.lineWidth = 2
//     gCtx.strokeStyle = 'white'
//     gCtx.fillStyle = 'black'
//     gCtx.font = '45px Arial'
//     gCtx.textAlign = 'center'
//     gCtx.textBaseline = 'middle'
//     gCtx.fillText(txt, x, y)
//     gCtx.strokeText(txt, x, y)
// }


function getLine(selectedLineIdx =0) {
    // if (selectedLineIdx < 0 ) {
    //     return
    // }
    const line = gMemes.lines[selectedLineIdx]
    return line


}

