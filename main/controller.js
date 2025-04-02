'use strict'


var gKeyWordSearchCountMap = {'funny': 12,'cat': 16, 'baby': 2} 


 

    function onInit() {
        console.log('init')
        renderGallery()
    
    }

function renderGallery(){
    var strHTMLs = ''
    if (gImgs && gImgs.length > 0) {
        strHTMLs= gImgs.map(img => {
            return `<img src ="${img.url}" alt="${img.id}">`
        }).join('')
    }
$('.gallery-container').html(strHTMLs)
  

}