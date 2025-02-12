window.addEventListener('onload',getData(),setContent());
function setContent() {
    let shortHtml = '';
    //short
    for (var i = 0; i < 7; i++) {
        shortHtml += '<div class="short-content">' +
            '<div id="shortThumbnail">' +
            '<img src ="https://i.ytimg.com/vi/WE82W3lMqHY/oardefault.jpg?sqp=-oaymwEoCJUDENAFSFqQAgHyq4qpAxcIARUAAIhC2AEB4gEKCBgQAhgGOAFAAQ==&amp;rs=AOn4CLDCYBuH3aYpzvkfnw2miX_DIFA7mw">' +
            '</div>' +
            // '<div id="media-info">' + 
            '<div id="shortMeta">' +
            '<div>' +
            '<div id="title"> 가짜 신라면 먹고 한국 맵기 무시한 외국인인' +
            '</div>' +
            '</div>' +
            '<div id="metadata-line">' +
            '<div>' +
            '<span>조회수 441만회 </span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            // '</div>' + 
            '</div>';
    }
    $('#shortContents').html(shortHtml);
}
// header side 버튼 누르면 메뉴 보여지거나 숨김
function viewSideMenu() {
    var id_display = $('#side-menu')[0];
    if (id_display.style.display == 'none') {
        id_display.style.display = 'flex'
        $('#sideHiddenMenu')[0].style.display = 'none'
    } else {
        id_display.style.display = 'none';
        $('#sideHiddenMenu')[0].style.display = 'flex'
    }
}
// fetch
async function getData() {
let html = '';
let idList = [];
await fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=10&regionCode=kr&key=AIzaSyBJ44NRjPwB8MtLztOJo-BZAj5lqObdmRE").then(res => res.json()).then(data => {
    let d = data.items;
    console.log(data);
    for(var i = 0 ; i<d.length ; i++){
        let data = d[i].snippet;
        console.log(data)                
        html += '<div class="content">' +
            '<a href="https://www.youtube.com/watch?v='+ d[i].id +'">' +
            '<div id="thumbnail">' +
            '<img src ="' + data.thumbnails.high.url + '">' +
            '</div>' +
            '</a>' +
            // '<div id="media-info">' + 
            '<div id="ch-img" class="ch-img'+ i +'">' +
            '</div>' +
            '<div id="meta">' +
            '<div>' +
            '<div id="title">' + data.title + '' +
            '</div>' +
            '</div>' +
            '<div id="metadata-line">' +
            '<div>' +
            '<span>' + data.channelTitle + '</span>' +
            '</div>' +
            '<div>' +
            '<span>조회수   </span><span>3개월전</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            // '</div>' + 
            '</div>';
        $('#contents').html(html);
        idList.push(data.channelId);
    };      
});
for(var i = 0 ; i < idList.length ; i++){
    let id = idList[i];         
    await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&id=" + id + "&key=AIzaSyBJ44NRjPwB8MtLztOJo-BZAj5lqObdmRE").then(res => res.json()).then(data => {
             let chHtml ='<img src="'+ data.items[0].snippet.thumbnails.default.url +'">';
             let chId = '.ch-img'+ i;
             $(chId).html(chHtml);
        });
}
}