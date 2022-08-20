//调色盘的颜色分布
var sR = 255;
var sG = 0;
var sB = 255;

//调色盘的canvas和画笔
var paletteCanvas = document.getElementById("palette");
var paletteCtx = paletteCanvas.getContext("2d");

//色阶变化（不知道叫不叫这个，就是图片的细腻程度，当然1080p的感觉都没区别除非放大）
var colorStep = 256;
paletteCanvas.height = colorStep;
paletteCanvas.width = colorStep;

//偏移量
var colorDivOffsetLeft = $("#palette")[0].offsetLeft;
var colorDivOffsetTop = $("#palette")[0].offsetTop;

//颜色格子高宽
var xScale = paletteCanvas.width / colorStep;
var yScale = paletteCanvas.height / colorStep;

//颜色小格子的个数
var scaleWidth = paletteCanvas.width / xScale;
var scaleHeight = paletteCanvas.height / yScale;

var mousePressed = false;

//选中的颜色的cavans
var selectColorCanvas = document.getElementById("selectedColor");
var selectColorCtx = selectColorCanvas.getContext("2d");
//初始化颜色块
selectColorCtx.fillRect(0, 0, 300, 300);


/*
*   渐变条的变量
* */
//渐变色条的canvas
var paletteBarCanvas = document.getElementById("paletteBar");
//渐变色条的画笔
var paletteBarCtx = paletteBarCanvas.getContext("2d");

//bar的偏移量
var paletteBarLeft = paletteBarCanvas.offsetLeft;
var paletteBarTop = paletteBarCanvas.offsetTop;

//判断鼠标是否按下
var barMousePressed = false;
//判断鼠标是否在bar中
var mouseIsInBarCanvas = true;
//判断是否是从bar中点击的鼠标
var isInBarEnter = false;

//初始化宽高，方便后续使用
paletteBarCanvas.height = paletteBarCanvas.clientHeight;
paletteBarCanvas.width = paletteBarCanvas.clientWidth;


//获取某一个位置的rgb颜色信息
function getPosColor(x, y) {
    var r = g = b = 0;
    var max = Math.max(sR, sB, sG);
    var min = Math.min(sR, sB, sG);
    var mid = sR + sG + sB - max - min;

    var oneMaxXV = (255 - max) / scaleWidth;

    var oneMidXV = (255 - mid) / scaleWidth;

    var oneMinXV = (255 - min) / scaleWidth;


    var minColor = 255 - x * oneMinXV;
    var midColor = 255 - x * oneMidXV;
    var maxColor = 255 - x * oneMaxXV;

    var oneYTemp = midColor / scaleHeight;
    var midC = Math.floor(midColor - y * oneYTemp);

    oneYTemp = minColor / scaleHeight;
    var minC = Math.floor(minColor - y * oneYTemp);

    oneYTemp = maxColor / scaleHeight;
    var maxC = Math.floor(maxColor - y * oneYTemp);

    sR === max ? (r = maxC) : (sR === mid ? (r = midC) : (r = minC));
    sG === max ? (g = maxC) : (sG === mid ? (g = midC) : (g = minC));
    sB === max ? (b = maxC) : (sB === mid ? (b = midC) : (b = minC));
    return {
        r:r,
        g:g,
        b:b
    }
}


//画出当前颜色分布的调色盘
function drawPlatter() {
    var width = paletteCanvas.width;
    var height = paletteCanvas.height;
    //循环每一个色块并赋值颜色
    for (let i = 0; i < scaleWidth; i++) {
        for (let j = 0; j < scaleHeight; j++) {
            //填充色块的颜色
            var col = getPosColor(i, j);
            paletteCtx.fillStyle = 'rgb(' + col.r + ',' + col.g + ',' + col.b + ')';
            paletteCtx.fillRect(i * xScale, j * yScale, xScale, yScale);
        }
    }
}

//更新调色盘的颜色分布
function updatePlatter(r, g, b) {
    sR = r;
    sG = g;
    sB = b;
    drawPlatter();
}

function getMousePos(e) {
    return {
        x: e.clientX - colorDivOffsetLeft,
        y: e.clientY - colorDivOffsetTop
    };
}

paletteCanvas.onmousedown = function (e) {
    mousePressed = true;
    const point = getMousePos(e);
    var col = getPosColor(point.x, point.y);
    color='rgb(' + col.r + ',' + col.g + ',' + col.b + ')';

    //填充选中的颜色
    selectColorCtx.fillStyle = color;
    selectColorCtx.fillRect(0, 0, 300, 300);


}
//鼠标移动颜色也改变
paletteCanvas.onmousemove = function (e) {
    if (mousePressed) {
        const point = getMousePos(e);
        var col = getPosColor(point.x, point.y);
        color='rgb(' + col.r + ',' + col.g + ',' + col.b + ')';

        //填充选中的颜色
        selectColorCtx.fillStyle = color;
        selectColorCtx.fillRect(0, 0, 300, 300);
    }
}

//确定最终颜色
paletteCanvas.onmouseup = function (e) {
    const point = getMousePos(e);
    var col = getPosColor(point.x, point.y);
    color='rgb(' + col.r + ',' + col.g + ',' + col.b + ')';
    mousePressed = false;

    colorR=col.r;
    colorG=col.g;
    colorB=col.b;
    //填充选中的颜色
    selectColorCtx.fillStyle = color;

    selectColorCtx.fillRect(0, 0, 100, 100);
}

//初始化调色板
// drawPlatter();

//通过纵坐标获取得到的颜色，返回一个rgb属性对象
function getPaletteBarColor(y) {
    var h = paletteBarCanvas.height;
    var oneYV = 256 / (h / 6);

    var r = 255;
    var g = 0;
    var b = 0;
    //判断是在哪一块
    if (y <= h / 3) {
        if (y <= h / 6) {
            b = Math.floor(oneYV * y);
            if (b > 255) {
                b = 255;
            }
            r = 255;
        } else {
            r = 255 - Math.floor(oneYV * (y - h / 6));
            if (r < 0) {
                r = 0;
            }
            b = 255;
        }
        g = 0;
    } else if (y <= 2 * h / 3) {
        if (y < 3 * h / 6) {
            g = Math.floor(oneYV * (y - 2 * h / 6));
            if (g > 255) {
                g = 255;
            }
            b = 255;
        } else {
            b = 255 - Math.floor(oneYV * (y - 3 * h / 6));
            if (b < 0) {
                b = 0;
            }
            g = 255;
        }
        r = 0;
    } else {
        if (y < 5 * h / 6) {
            r = Math.floor(oneYV * (y - 4 * h / 6));
            if (r > 255) {
                r = 255;
            }
            g = 255;
        } else {
            g = 255 - Math.floor(oneYV * (y - 5 * h / 6));
            if (g < 0) {
                g = 0;
            }
            r = 255;
        }
        b = 0;
    }
    return {r: r, g: g, b: b};
}

//绘画出bar的初始形态
function drawPaletteBar() {
    var width = paletteBarCanvas.width;
    var height = paletteBarCanvas.height;
    for (let j = 0; j <= height; j++) {
        var col = getPaletteBarColor(j);
        paletteBarCtx.strokeStyle = 'rgb(' + col.r + ',' + col.g + ',' + col.b + ')';

        paletteBarCtx.beginPath();
        paletteBarCtx.moveTo(0, j);
        paletteBarCtx.lineTo(width, j);
        paletteBarCtx.stroke();
    }
}

//获得鼠标点击相对于bar的位置
function getPalettePos(e) {

    //确保返回的坐标在正确范围内
    var x = e.clientX - paletteBarLeft;
    if (x <= 0) {
        x = 0;
    }
    if (x >= paletteBarCanvas.width) {
        x = paletteBarCanvas.width;
    }

    var y = e.clientY - paletteBarTop;
    if (y <= 0) {
        y = 0;
    }
    if (y >= paletteBarCanvas.height) {
        y = paletteBarCanvas.height;
    }


    return {
        x: x,
        y: y
    }
}

//鼠标点击事件
paletteBarCanvas.onmousedown = function (e) {
    const point = getPalettePos(e);
    var col = getPaletteBarColor(point.y);
    updatePlatter(col.r, col.g, col.b);
    barMousePressed = true;
    isInBarEnter = true;
    mouseIsInBarCanvas = true;
}

document.onmousemove = function (e) {
    if (barMousePressed && isInBarEnter) {
        const point = getPalettePos(e);
        var col = getPaletteBarColor(point.y);
        updatePlatter(col.r, col.g, col.b);
    }
}

document.onmouseup = function (e) {
    barMousePressed = false;
    isInBarEnter = false;
    mouseIsInBarCanvas = false;
}

//初始化
// drawPaletteBar();

function init(){
    drawPlatter();
    drawPaletteBar();
}
init();
