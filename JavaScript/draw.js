//位置数组
var position = [0];
//判断鼠标是否按下
var mousePressed = false;
//判断是否为canvas中
var mouseIsInCanvas = true;
var canvas = document.getElementById("Canvas");
//添加偏移量
var artboardDiv = document.getElementsByClassName("MainArtBoardDiv")[0];
//画笔
var ctx = canvas.getContext("2d");

// 按键选择的值，以此类推
var colorButton=1,
    lineSizeButton=2,
    pencilButton=3;
var selectedButton=pencilButton;


/*
*   线条的最大值最小值
*   线条的默认值
*   鼠标滚动时候的变化快慢
* */
var ctxLineWidthMax=10,ctxLineWidthMin=1;
var ctxLineWidthDefault=4;
var mouseScrollChange=0.1;


ctx.lineWidth = ctxLineWidthDefault;
ctx.fillStyle = "black";
ctx.strokeStyle = "none";


/*
*   基本的画线函数
*
* */
//判断鼠标是否按下
document.onmousedown = (e) => {
    mousePressed = true;
    position[0] = e.clientX;
    position[1] = e.clientY;
}

//判断鼠标是否松开
document.onmouseup = (e) => {
    mousePressed = false;
}

//画线的函数
function draw(startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX - artboardDiv.offsetLeft, startY - artboardDiv.offsetTop);
    ctx.lineTo(endX - artboardDiv.offsetLeft, endY - artboardDiv.offsetTop);
    ctx.closePath();
    ctx.stroke();
}

canvas.onmousemove = function (e) {
    if (mousePressed && mouseIsInCanvas) {
        //通过单击不同的按键来实现不同的画图功能
        if(selectedButton===pencilButton){
            //画线，然后记录位置
            draw(position[0], position[1], e.clientX, e.clientY);
            position[0] = e.clientX;
            position[1] = e.clientY;
        }
    }
};
//在鼠标离开canvas时
canvas.onmouseleave = (e) => {
    mouseIsInCanvas = false;
}
//鼠标进入canvas时
canvas.onmouseenter = (e) => {
    mouseIsInCanvas = true;
    position[0] = e.clientX;
    position[1] = e.clientY;
}









