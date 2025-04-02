'use strict'

// search
$('#searchWord').change('keydown',onSearch )
$('#searchBtn').click('input', onSearch)

var gKeyWordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }




function onInit() {
    console.log('init')
    renderGallery()

}

function onSearch(ev) {
    var searchWord = $('#searchWord').val().toLowerCase()
    console.log(searchWord)

}


function renderGallery() {
    var strHTMLs = ''
    if (gImgs && gImgs.length > 0) {
        strHTMLs = gImgs.map(img => {
            return `<img src ="${img.url}" alt="${img.id}">`
        }).join('')
    }
    $('.gallery-container').html(strHTMLs)


}