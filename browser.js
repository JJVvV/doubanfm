
const $ = document.querySelector.bind(document)
const elementReady = require('element-ready');
const ipcRenderer = require('electron').ipcRenderer;
const PubSub = require('./src/pubsub')

function removeElement(){
    let ad = $('.section-switcher'),
        left = $('.left > div.jBvxsI'),
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
PubSub.subscribe('toggleLike', likeNotification)

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

function likeNotification(type, data){

    //页面激活时则不提醒
     if(!document.hidden) return
    let isLike = $('label[title="取消红心"]') !== null
    let title = $('.link._3bHLm1OOWrgMRrfiRpBpRz').innerHTML
    let url = getCover()
    let notification = {
        title: title,
        body: isLike ? '已标注为喜欢': '已取消喜欢',
        icon: url
    }
    const myNotification = new window.Notification(notification.title, notification)

    myNotification.onclick = () => {
        console.log('Notification clicked')
    }
}

// 获取封面地址
function getCover(){
    let url = $('.cover').style.backgroundImage;
    let reg = /url\((?:'|")?([^'"]+)+(?:'|")?/
    let res = url.match(reg)

    if(res){
        return res[1]
    }
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






