var canvas = document.getElementById("Canvas");
var canvasCopy;
//添加偏移量
var artboardDiv = document.getElementsByClassName("MainArtBoardDiv")[0];
//画笔
var ctx = canvas.getContext("2d");



// 橡皮擦宽度
var toolsDiv = document.querySelector(".ToolsDiv");
toolsDiv.rubberWidth = rubberWidthDefault;
//判断鼠标是否按下
var mousePressed = false;
//判断是否为canvas中
var mouseIsInCanvas = true;
//以下为使用贝塞尔曲线画线的，平滑一些
//起始点
let startPoint = null;
//存放一次鼠标画线的数组
let points = [];


ctx.lineWidth = ctxLineWidthDefault;
ctx.fillStyle = "black";
ctx.strokeStyle = "none";


//添加事件
document.addEventListener("mouseup", mouseup, false);
document.addEventListener("mousedown", mousedown, false);
canvas.addEventListener("mousemove", mousemove, false);
canvas.addEventListener("mouseenter", mouseenter, false);
canvas.addEventListener("mouseleave", mouseleave, false);


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

//加载图片
function loadImage() {
    var img = new Image();

    img.src = url;
    ctx.drawImage(img, 0, 0, width, height);
}


//鼠标按下时
function mousedown(e) {
    mousePressed = true;
    const {x, y} = getPos(e);
    points.push({x, y});
    startPoint = {x, y};
    switch (mainArtBoardDiv.boardState) {
        case 2: {

            break;
        }
        case 3: {
            url = canvas.toDataURL();
            break;
        }
        case 7: {
            clearArc(startPoint, toolsDiv.rubberWidth, ctx);
        }
    }
}

//鼠标在canvas移动时
function mousemove(e) {
    if (mousePressed === false || mouseIsInCanvas === false) {
        return;
    }

    switch (mainArtBoardDiv.boardState) {
        //为画笔
        case 2: {
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
            break;
        }
        //直线段
        case 3: {
            const endPoint = getPos(e);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            loadImage();
            ctx.beginPath();
            ctx.moveTo(startPoint.x, startPoint.y);
            ctx.lineTo(endPoint.x, endPoint.y);
            ctx.stroke();
            ctx.closePath();
            break;
        }
        //橡皮擦
        case 7: {

            const {x, y} = getPos(e);
            clearArc({x, y});
            
        }
    }
}


//松开鼠标键时，画最后一个曲线
function mouseup(e) {
    if (mousePressed === false) {
        return;
    }
    switch (mainArtBoardDiv.boardState) {
        case 2: {
            const {x, y} = getPos(e);

            points.push({x, y});

            if (points.length > 3) {
                const lastTwoPoints = points.slice(-2);

                const controlPoint = lastTwoPoints[0];

                const endPoint = lastTwoPoints[1];

                drawLine(startPoint, controlPoint, endPoint);
            }
            break;
        }
        case 3: {
            //todo
        }

        //保存之前的状态方便撤销

        ctx.save();
        console.log(2);
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

