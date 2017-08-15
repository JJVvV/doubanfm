
const $ = document.querySelector.bind(document)
const elementReady = require('element-ready');
const ipcRenderer = require('electron').ipcRenderer;
const PubSub = require('./src/pubsub')

function removeElement(){
    let ad = $('.section-switcher'),
        left = $('.left'),
        feedback = $('.feedback')

    //主广告
    ad.nextElementSibling.classList.add('disnone')
    // ad.nextElementSibling.parentNode.removeChild(ad.nextElementSibling)
    //左侧二维码
    left.classList.add('disnone')

    //feedback
    feedback.classList.add('disnone')
    // left.parentNode.removeChild(left)

}

PubSub.subscribe('next', next)
PubSub.subscribe('prev', prev)
PubSub.subscribe('togglePlay', togglePlay)
PubSub.subscribe('toggleLike', toggleLike)

function next(){
    clickElement($('label[title="下一首"]').children[0])
}

function prev(){
    let prevP = $('label[title="上一首"]') || $('label[title="下一首"]');
    clickElement(prevP.children[0])
}

function togglePlay(){
    let toggleButton = $('label[title="播放"]') || $('label[title="暂停"]')
    clickElement(toggleButton.children[0])
}

function toggleLike(){
    let toggleButton = $('label[title="加红心"]') || $('label[title="取消红心"]')
    clickElement(toggleButton.children[0])
}

function clickElement(element){
    let e = document.createEvent('MouseEvent')

    e.initEvent('click', true, false);
    element.dispatchEvent(e);
}


function addStyle(){
    let style = document.createElement('style');
    style.innerHTML = '.disnone{display: none !important} .draggable{-webkit-app-region: drag}'
    document.head.appendChild(style)
}

function addDraggable(){
    let div = document.createElement('div')
    div.className = 'draggable'
    div.style = 'position: fixed; left: 0; top:0; right: 0; height: 25px; z-index: 9999'
    document.body.appendChild(div)
}

function addBack(){
    let div = document.createElement('div'),
        appHeader = $('.app-header')
    div.id = 'doubanBack'
    div.innerHTML = '&lt;返回'
    div.style = 'cursor: pointer; font-size: 12px; color: #9b9b9b; display: none; position: absolute; left: 8px; top: 28px; z-index: 9999;'

    appHeader.insertBefore(div, appHeader.firstElementChild)
}

document.addEventListener('DOMContentLoaded', () => {
    elementReady('.app').then(() => {
        addStyle()
        removeElement()
        addDraggable()
        addBack()
        // document.body.addEventListener('click', function(event){
        //
        //     if(!event.target || !event.target.tagName) return
        //     if(event.target.tagName.toLocaleLowerCase() === 'a'){
        //         setTimeout(() => {
        //             ipcRenderer.send('urlchange', {});
        //         }, 300)
        //     }
        // })

        document.querySelector('#doubanBack').addEventListener('click', function(){
            ipcRenderer.send('goback')
        })
        ipcRenderer.on('url', function(event, data){

            let canGoBack = data.canGoback
            document.querySelector('#doubanBack').style.display = canGoBack ? 'block': 'none'
        })


        window.addEventListener('popstate', function(event) {
            // setTimeout(() => {
            //     ipcRenderer.send('urlchange', {})
            // }, 200)
            ipcRenderer.send('urlchange', {})
        });
    })
})






