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


//保存一个使用橡皮擦之前的图片
const vet = [];


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
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
    ctx.closePath();
    ctx.stroke();
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
    const point = getPos(e);
    startPoint = point;

    if (point.x >= 0 && point.x < width && point.y >= 0 && point.y < height) {
        points.push(startPoint);
    }
    switch (mainArtBoardDiv.boardState) {
        case 2: {
            if (point.x >= 0 && point.x < width && point.y >= 0 && point.y < height) {
                num[point.x][point.y] = 1;
            }
            break;
        }

        //填充当前的封闭图形
        case 6: {
            if (point.x >= 0 && point.x < width && point.y >= 0 && point.y < height) {
                bfs(point.x, point.y);
                const image = ctx.getImageData(0, 0, width, height);
                //封闭区域像素点的个数
                let len = v.length;

                //替换封闭区域的颜色
                for (let i = 0; i < len; i++) {
                    let x = v[i].x;
                    let y = v[i].y;
                    //降维度
                    let index = (y * width + x) * 4;
                    image.data[index] = colorR;
                    image.data[index + 1] = colorG;
                    image.data[index + 2] = colorB;
                    image.data[index + 3] = 255;
                }

                //画布更新
                ctx.putImageData(image, 0, 0);
                //清空数组和已经访问的信息
                for (let i = 0; i < 960; i++) {
                    vis[i] = new Array(580).fill(0);
                }
                v = [];
            }

            break;
        }
        case 7: {

            //添加橡皮擦使用前的图像
            const temp = realCtx.getImageData(0, 0, width, height);
            vet.push(temp);
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
            const point = getPos(e);

            points.push(point);


            // num[point.x][point.y]=1;

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
            // 传统直线画法
            // ctx.beginPath();
            // ctx.lineCap="round";
            // ctx.clearRect(0, 0, width, height);
            // ctx.moveTo(startPoint.x, startPoint.y);
            // ctx.lineTo(endPoint.x, endPoint.y);
            // ctx.stroke();
            // ctx.closePath();

            //调用贝塞尔曲线的画法
            ctx.clearRect(0, 0, width, height);
            drawLine(startPoint, endPoint, endPoint);
            break;
        }
        //圆形
        case 4: {
            //这是第一种画法，起点是圆心
            // const endPoint = getPos(e);
            //
            // var radius = Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2));
            //
            // ctx.beginPath();
            // ctx.clearRect(0, 0, width, height);
            //
            // ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
            // ctx.stroke();
            // ctx.closePath();


            const endPoint = getPos(e);

            var x = (startPoint.x + endPoint.x) >> 1;
            var y = (startPoint.y + endPoint.y) >> 1;

            var radius = Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2)
                + Math.pow(startPoint.y - endPoint.y, 2)) / 2;

            ctx.beginPath();
            ctx.clearRect(0, 0, width, height);
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = color;
            ctx.closePath();
            //图形的填充颜色
            // ctx.fillStyle='red';
            // ctx.fill();
            //图形的边框
            ctx.stroke();

            break;
        }

        //矩形
        case 5: {
            const endPoint = getPos(e);

            ctx.beginPath();
            ctx.clearRect(0, 0, width, height);

            //顺时针画一个矩形
            ctx.moveTo(startPoint.x, startPoint.y);

            ctx.lineJoin = "round";

            ctx.lineTo(endPoint.x, startPoint.y);
            ctx.lineTo(endPoint.x, endPoint.y);
            ctx.lineTo(startPoint.x, endPoint.y);
            ctx.lineTo(startPoint.x, startPoint.y);
            ctx.closePath();
            ctx.strokeStyle = color;
            ctx.stroke();

            break;
        }

        //橡皮擦
        case 7: {
            clearArc(getPos(e));
        }

    }
}


//松开鼠标键时，画最后一个曲线
function mouseup(e) {
    if (mousePressed === false) {
        return;
    }
    if (mouseIsInCanvas) {
        switch (mainArtBoardDiv.boardState) {
            case 2: {
                const point = getPos(e);
                // num[point.x][point.y]=1;
                points.push(point);
                if (points.length > 3) {
                    const lastTwoPoints = points.slice(-2);
                    const controlPoint = lastTwoPoints[0];
                    const endPoint = lastTwoPoints[1];
                    drawLine(startPoint, controlPoint, endPoint);
                }
                saveImage();
                pushIntoStack();
                pushIntoNum(points);

                break;
            }
            case 3: {
                saveImage();
                pushIntoStack();
                break;
            }
            case 4: {
                saveImage();
                pushIntoStack();
                break;
            }
            case 5: {
                saveImage();
                pushIntoStack();
                break;
            }
            case 6: {
                saveImage();
                pushIntoStack();
                break;
            }
            case 7: {
                const temp = vet.pop();
                //限制最大长度
                if (ctxStack.length <= stackMaxSize) {
                    ctxStack.push(temp);
                } else {
                    ctxStack.shift();
                    ctxStack.push(temp);
                }
                break;
            }
        }
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

