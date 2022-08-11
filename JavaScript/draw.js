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


/*
*   线条的最大值最小值
*   线条的默认值
*   鼠标滚动时候的变化快慢
* */
var ctxLineWidthMax = 10, ctxLineWidthMin = 1;
var ctxLineWidthDefault = 4;
var mouseScrollChange = 0.1;


// canvas的长宽
let height=580;
let width=960;

ctx.lineWidth = ctxLineWidthDefault;
ctx.fillStyle = "black";
ctx.strokeStyle = "none";

/*
// 按键选择的值，以此类推
var colorButton = 1,
    lineSizeButton = 2,
    pencilButton = 3;
var selectedButton = pencilButton;

/!*
*   基本的画线函数
*
* *!/
//判断鼠标是否按下
document.onmousedown = (e) => {
    mousePressed = true;
    position[0] = e.clientX;
    position[1] = e.clientY;
}

//判断鼠标是否松开
document.onmouseup = (e) => {
    mousePressed = false;
    stk.push(ctx.getImageData(0,0,960,580));
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
        if (selectedButton === pencilButton) {
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
}*/


//以下为使用贝塞尔曲线画线的，平滑一些

//起始点
let startPoint = null;
//存放一次鼠标画线的数组
let points = [];

//添加事件
document.addEventListener("mouseup", mouseup, false);
document.addEventListener("mousedown", mousedown, false);
canvas.addEventListener("mousemove", mousemove, false);
canvas.addEventListener("mouseleave", mouseleave, false);
canvas.addEventListener("mouseenter", mouseenter, false);

//获取当前的鼠标位置（相对于canvas的）
function getPos(e) {
    return {
        x: e.clientX - artboardDiv.offsetLeft,
        y: e.clientY - artboardDiv.offsetTop
    }
}

//画贝塞尔曲线
function drawLine(startPoint, controlPoint, endPoint) {
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
    ctx.stroke();
    ctx.closePath();
}

//鼠标按下时
function mousedown(e) {
    mousePressed = true;
    const {x, y} = getPos(e);
    points.push({x, y});
    startPoint = {x, y};
}

//鼠标在canvas移动时
function mousemove(e) {
    if (mousePressed === false || mouseIsInCanvas === false) {
        return;
    }

    const {x, y} = getPos(e);
    points.push({x, y});

    if (points.length > 3) {
        const lastTwoPoints = points.slice(-2);

        const controlPoint = lastTwoPoints[0];

        const endPoint = {
            x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
            y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
        }

        drawLine(startPoint, controlPoint, endPoint);

        startPoint = endPoint;
    }
}


//松开鼠标键时，画最后一个曲线
function mouseup(e) {
    if (mousePressed === false) {
        return;
    }

    const {x, y} = getPos(e);

    points.push({x, y});

    if (points.length > 3) {
        const lastTwoPoints = points.slice(-2);

        const controlPoint = lastTwoPoints[0];

        const endPoint = lastTwoPoints[1];

        drawLine(startPoint, controlPoint, endPoint);
    }
    startPoint = null;
    mousePressed = false;
    points = [];
}

//当鼠标进入canvas
function mouseenter(e) {
    mouseIsInCanvas = true;
    startPoint = getPos(e);
}

//当鼠标离开canvas
function mouseleave(e) {
    mouseIsInCanvas = false;
    points = [];
}