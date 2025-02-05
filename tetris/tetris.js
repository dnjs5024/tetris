var blockArray = [
[[1,0],[-0,0],[2,0],[3,0]], // I  
[[0,-1],[0,0],[0,1],[0,2]], // -
[[1,0],[-0,0],[2,0],[3,0]], // I
[[0,-1],[0,0],[0,1],[0,2]], // -
[[1,0],[0,0],[2,0],[2,1]], // L
[[1,0],[1,-1],[2,-1],[1,1]], 
[[1,0],[0,-1],[0,0],[2,0]],
[[1,0],[1,-1],[1,1],[0,1]],
[[1,0],[0,0],[2,0],[2,-1]], 
[[1,0],[0,-1],[1,-1],[1,1]], 
[[1,0],[0,0],[0,1],[2,0]],
[[1,0],[1,-1],[1,1],[2,1]], 
[[1,0],[0,0],[1,-1],[2,0]], // ㅓ
[[0,0],[1,-1],[1,0],[1,1]], // ㅗ
[[1,0],[0,0],[2,0],[1,1]], // ㅏ
[[1,0],[1,-1],[1,1],[2,0]], // ㅜ
[[0,0],[0,1],[1,0],[1,1]], // ㅁ 
[[0,0],[0,1],[1,0],[1,1]],
[[0,0],[0,1],[1,0],[1,1]],
[[0,0],[0,1],[1,0],[1,1]], // ㅁ 
[[1,0],[1,-1],[0,0],[0,1]],
[[1,0],[0,0],[1,1],[2,1]],
[[1,0],[1,-1],[0,0],[0,1]],
[[1,0],[0,0],[1,1],[2,1]],
[[1,0],[0,-1],[0,0],[1,1]], // Z
[[1,0],[0,0],[1,-1],[2,-1]],  
[[1,0],[0,-1],[0,0],[1,1]], // Z
[[1,0],[0,0],[1,-1],[2,-1]]     
];
//color저장하는 배열
let colorArray = [
    'rgb(219,18,18)',
    'rgb(65,219,18)',
    'rgb(219,219,18)',
    'rgb(31,18,219)',
    'rgb(219,18,185)'   
];
//점수
let score = 0;
let blockColor;
let nextBlockColor;
//y라인 기준으로 그 라인에 블록이 몇개 있는지
let blockLineSize = new Array();
//현재 생성된 블록의 모양이 무엇인지 저장
let blockType;
//다음 블록 모양
let nextBlockType;
//1초후 블록 밑으로 
let moveTime = 0;
//블록의 세로 크기
let blockHeight;
//맨처음 시작했을때
var fSelect = true; 
//블록 떨어지는 속도
let moveSpeed = 1000;
//속도 임시 저장 
let tmpMoveSpeed = 0;
var gameFieldWidth = 21;
var gameFieldHeight = 30;
let center = Math.round((gameFieldWidth-1)/2);
//현재 블록의 X 위치 저장하기 위한 변수
let X = center;
//현재 블록의 y 위치 저장하기 위한 변수
let Y = 0;
//setTimeout 함수 정지 시키기위해 id 저장
let moveThread = null;
//블록 각각의 id 저장
let blockIdList = new Array();
//다음 나올 블록 각각의 id 저장
let nextBlockIdList = new Array();
function drawField(){
    var drawView = '';
    drawView += '<tbody>'
    for(var i = 0;i < gameFieldHeight;i++){
        drawView += '<tr>';
        for(var j = 0;j < gameFieldWidth;j++){
            if(i == 0 || i == gameFieldHeight-1){
                drawView += '<td class="wall" id="' + String(i) + " " + String(j) + '"></td>';
            }else if(j == 0 || j == gameFieldWidth-1){
                drawView += '<td class="wall" id="' + String(i) + " " + String(j) + '"></td>';
            }else{
                drawView += '<td id="' + String(i) + " " + String(j) + '"></td>';
            }
           
        }   
        drawView += '</tr>';         
    }
    drawView += '</tbody>';
    document.getElementById('gameField').innerHTML = drawView;   
    //다음 블록 나오는 필드
    var drawView = '';
    drawView += '<tbody>'
    for(var i = 100; i < 111 ;i++){
        drawView += '<tr>';
        for(var j = 100; j < 111;j++){
            if(i == 100 || i == 110){
                drawView += '<td class="wall" id="' + String(i) + " " + String(j) + '"></td>';
            }else if(j == 100 || j == 110){
                drawView += '<td class="wall" id="' + String(i) + " " + String(j) + '"></td>';
            }else{
                drawView += '<td id="' + String(i) + " " + String(j) + '"></td>';
            }                   
        }   
        drawView += '</tr>';         
    }        
    drawView += '</tbody>';
    document.getElementById('nextField').innerHTML = drawView;       
}

drawField();
//blockLineSize배열 초기화
function arraySet(){
    for(var i = 0;i < gameFieldHeight-1;i++){
        blockLineSize[i] = 0;
    }
}
arraySet();
//랜덤으로 블록 모양 결정
function selectBlock(){     
    if(fSelect){
        fSelect = false;
        var rNum =  Math.round(Math.random()*(blockArray.length-1));
        blockType = rNum; 
    }else{
        blockType = nextBlockType;
    }          
    nextBlockType = Math.round(Math.random()*(blockArray.length-1));
}

//블록 색 랜덤으로 지정
function selectColor(){                  
    if(nextBlockColor != null){
        blockColor = nextBlockColor;
    }else{
        var rNum =  Math.round(Math.random()*(colorArray.length-1)); 
        blockColor = colorArray[rNum];
    }
    var nNum =  Math.round(Math.random()*(colorArray.length-1));
    nextBlockColor = colorArray[nNum];            
}
function drawColor(id,type){
    if(type == 0){
        id.style.backgroundColor = blockColor;
    }else{
        id.style.backgroundColor = nextBlockColor;
    }      
}

//블록 만들어주는 코드
function makeBlock(){
    if(blockIdList.length>1){
        eraseBlock(0);
    }       
    //블록 새로 그려줌
    var tBlock = blockArray[blockType];
    var xMove = 0;
    var yMove = 0;
    for(var i = 0;i < 4;i++){          
        xMove = tBlock[i][1];
        yMove = tBlock[i][0];
        var blockId = Y + yMove + ' ' + (X + xMove);
        blockIdList[i] = blockId;
        var id = document.getElementById(blockId);
        gameOverCheck(id);
        drawColor(id,0);
    }   
}
//그려진 블록 지우는 코드
function eraseBlock(type){
var array;
if(type == 0){
    array = blockIdList
}else{
    array = nextBlockIdList
}
for(idx in array){
    var data = document.getElementById(array[idx]);
    if(data != null){
        data.removeAttribute('style');
    }         
    }          
}
//블록 내려가는 코드
function downBlock(){ 
    //충돌체크
    if(downCrashCheck()){
        init();
    }else{
        Y++;   
        makeBlock();    
        moveThread = setTimeout(downBlock,moveSpeed);
    }
}      
//키 입력시 이벤트 처리(블록 이동)
document.addEventListener('keydown',keyPressed,false);
function keyPressed(e){
    switch(e.keyCode){
        //왼쪽으로             
        case 37 : if(!sideMoveCrashCheck(-1)) moveBlock(-1);                 
        break
        //블록 회전 윗방향키
        case 38 : changeBlock();
        break
        //오른쪽으로
        case 39 :if(!sideMoveCrashCheck(1)) moveBlock(1);                        
        break
        //블록 빠르게 내리기 아래 방향키
        case 40 : if(moveSpeed != 50 ) tmpMoveSpeed = moveSpeed ;
        moveSpeed = 50; 
        break
    }  
}
// 아래 방향키 누르는 이벤트 끝나면 원래 속도로
document.onkeyup = function(e){
    if(e.keyCode == 40){
        moveSpeed = tmpMoveSpeed;
    }         
}
//<-,-> 눌렸을때 이벤트 처리
function moveBlock(moveNum){
    X = X + moveNum;  
    makeBlock();        
}
//블록 회전 이벤트
function changeBlock(){
    if(!(16 <= blockType && blockType <=19)){
        var common = blockType;
        var num = blockType%4;
        if(num == 3){
            blockType += -3;
        }else if(num >= 0 && num < 3){
            blockType++;
        }
        var moveNum  = 0;
        if(blockType == 1 || blockType == 3){
            moveNum = stickBlockTurnCrashCheck();
        }else{
            moveNum = turnCrashCheck();
        }
        if(moveNum > 1){
            blockType = common;
            return;
        }else{
            X += moveNum;
        }       
        makeBlock();   
    }        
}
//다음 나올 블록
function nextBlock(){
    var x = 105;
    var y = 104;
    if(nextBlockIdList.length>1){
        eraseBlock(1);
    }       
    //블록 새로 그려줌
    var tBlock = blockArray[nextBlockType];
    var xMove = 0;
    var yMove = 0;
    for(var i = 0;i < 4;i++){          
        xMove = tBlock[i][1];
        yMove = tBlock[i][0];
        var blockId = y + yMove + ' ' + (x + xMove);
        nextBlockIdList[i] = blockId;
        var id = document.getElementById(blockId);
        drawColor(id,1);
    }   
}
//블록 세팅 초기화
function init(){
        blockColor = null;
        Y = 0;       
        X = center; 
        blockIdList = new Array();
        clearTimeout(moveThread);           
        selectBlock();
        selectColor();
        nextBlock();
        downBlock();               
}
//블록 회전시 충돌 이벤트 처리
function turnCrashCheck(){
    var moveNum = 0;
    var rMoveNum = 0;
    var lMoveNum = 0;
    var tBlock = blockArray[blockType];
    var xMove = 0;
    var yMove = 0;
    for(var i = 0;i < 4;i++){          
        xMove = tBlock[i][1];
        yMove = tBlock[i][0];
        var blockId = Y + yMove + ' ' + (X + xMove);
        var id = document.getElementById(blockId);
        if(id.className == 'wall' || id.getAttribute('name') =='stopBlock'){
          if(xMove + X > X){
            lMoveNum = -1;       
          }else if(xMove + X  < X){                  
              rMoveNum = 1;            
          }else if(xMove + X  == X){
            moveNum = 99;
          }
        }                   
    } 

    //왼쪽,오른족 둘다 충돌 하는지 체크
    if(rMoveNum == 1 && lMoveNum <= -1){
        moveNum = 99;
        return moveNum;
    }else if(moveNum != 99){
        moveNum = rMoveNum + lMoveNum;
    }

    //그냥 돌리면 충돌나서 옆으로 이동시켜줄 공간있는지 확인
    if(moveNum != 0){
        if(sideMoveCrashCheck(moveNum)){
            moveNum = 99;
        }   
    }    

    return moveNum;
}
// 일자 블록 회전 처리
function stickBlockTurnCrashCheck(){
    var tBlock = blockArray[blockType];
    var rMoveNum = 0;
    var lMoveNum = 0;
    var xMove = 0;
    var yMove = 0;
    for(var i = 0;i < 4;i++){          
        xMove = tBlock[i][1];
        yMove = tBlock[i][0];
        var blockId = Y + yMove + ' ' + (X + xMove);
        //게임 영역 밖으로 벋어났을때
        var id = document.getElementById(blockId);
        if(id == null){
            lMoveNum = -2;  
            continue;
        }
        if(id.className == 'wall' || id.getAttribute('name') =='stopBlock'){
        if(xMove + X > X){
            if(lMoveNum != -2){
                lMoveNum = -1; 
            }                          
        }else if(xMove + X  < X){                  
            rMoveNum = 1;            
        }else if(XMove + X  == X){
            moveNum = 99;
        }
        }         
    }
    //왼쪽,오른족 둘다 충돌 하는지 체크
    if(rMoveNum == 1 && lMoveNum <= -1){
        moveNum = 99;
        return moveNum;
    }else{
        moveNum = rMoveNum + lMoveNum;
    }
    //그냥 돌리면 충돌나서 옆으로 이동시켜줄 공간있는지 확인
    if(moveNum != 0){
        if(sideMoveCrashCheck(moveNum)){
            if(moveNum == -1){
                moveNum += moveNum;
            }     
            if(sideMoveCrashCheck(moveNum)){
            moveNum = 99;
        }  
        }   
    }  
    return moveNum;
}
//블록 내려갈떄 충돌 이벤트 처리
function downCrashCheck(){ 
    for(var i = 0;i < 4;i++){       
        var x = String(blockIdList[i]).split(' ')[1];   
        var y =  parseInt(String(blockIdList[i]).split(' ')[0]) + 1;
        var blockId = y + ' ' + x;
        var id = document.getElementById(blockId);
        //내려갈때 충돌 체크
        //다음 라인이 벽 or 블록이 이미 있을때
        if(id != null){
            if(id.className == 'wall' || id.getAttribute('name') =='stopBlock'){
                stopBlockSet();
                return true;
            }  
        }        
    } 
    return false;
}
//블록 좌우이동 충돌 이벤트 처리
function sideMoveCrashCheck(moveNum){
    var tBlock = blockArray[blockType];
    var xMove = 0;
    var yMove = 0;
    for(var i = 0;i < 4;i++){          
        xMove = tBlock[i][1];
        yMove = tBlock[i][0];
        var blockId = Y + yMove  + ' ' + (X + xMove + moveNum);
        var id = document.getElementById(blockId);
        if(id.className == 'wall' || id.getAttribute('name') =='stopBlock'){
            return true;
        }                   
    } 
    return false;
}
//블록 멈췄을때 이벤트 처리
function stopBlockSet(){
    var moveNum = 0;
    var deleteLine = 50;
    for(idx in blockIdList){
        document.getElementById(blockIdList[idx]).setAttribute('name','stopBlock');
        var yNum = parseInt(blockIdList[idx].split(' '));
        blockLineSize[yNum]++;   
        if(blockLineSize[yNum] == 19){
            blockLineCheck(yNum);
            deleteLine = Math.min(deleteLine,yNum);
            moveNum++;
        }
    }  
    if(moveNum > 0){
        moveLine(moveNum,deleteLine);
    }          
}
//게임종료 체크
function gameOverCheck(id){
    if(id.style.backgroundColor != ''){
        document.write('응개못해')
    }
}
//한 라인에 블록이 가득차면 그 라인 제거 
function blockLineCheck(y){
    blockLineSize[y] = 0;
    addScore(10000);
    for(var i = 1;i < gameFieldWidth-1;i++){
        var id = String(y + ' ' + i);
        document.getElementById(id).removeAttribute('style');
        document.getElementById(id).removeAttribute('name');
    }
}
//라인 한칸씩 밑으로 이동
function moveLine(moveNum,y){

    for(var i = y-1;i > 1;i--){
        if(blockLineSize[i] == 0){
            break;
        }
        blockLineSize[i+moveNum] = blockLineSize[i];
        blockLineSize[i] = 0;
        for(var j = 1;j < gameFieldWidth-1;j++){           
            var id =  document.getElementById(String(i) + ' ' + String(j));
            var nextLineId =  document.getElementById(String(i+moveNum) + ' ' + String(j));
            if(id.getAttribute('name') == 'stopBlock'){                      
                nextLineId.setAttribute('name','stopBlock');
                id.removeAttribute('name');
            }
            nextLineId.style.backgroundColor = id.style.backgroundColor;
            id.style.backgroundColor = '';
        }
    }
}
//점수 계산
function addScore(s){
    score += parseInt(s);
    document.getElementsByClassName('score')[0].innerHTML = '<h2>' + String(score) + '</h2>';
    if((score/10000)%5 == 0){
        if(moveSpeed > 100){
            levelUp();
        }            
    }
}
//일정 점수이상이면 속도 업
function levelUp(){
    moveSpeed += -200;
}
init();
function doReset(){
    alert('응없어');
}
function onRestart(){
    window.location.reload();
}
function onPause(){
    alert('임시');
}
function onResume(){

}
