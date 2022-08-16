var sR = 255;
var sG = 0;
var sB = 255;


//调色盘的canvas和画笔
var paletteCanvas = document.getElementById("palette");
var paletteCtx = paletteCanvas.getContext("2d");

//偏移量
var colorDivOffsetLeft = $(".Colors")[0].offsetLeft;
var colorDivOffsetTop = $(".Colors")[0].offsetTop;

//颜色格子高宽
var xScale = Math.ceil(paletteCanvas.width / 128);
var yScale = Math.ceil(paletteCanvas.height / 128);

//颜色小格子的个数
var scaleWidth = paletteCanvas.width / xScale;
var scaleHeight = paletteCanvas.height / yScale;

function getPosColor(x, y) {
    var r = g = b = 0;
    var max = Math.max(sR, sB, sG);
    var min = Math.min(sR, sB, sG);
    var mid = sR + sG + sB - max - min;


    var oneMaxXV = (255 - max) / scaleWidth;
    // var oneMaxYV = (255 - max) / h;

    var oneMidXV = (255 - mid) / scaleWidth;
    // var oneMidYV = (255 - mid) / h;

    var oneMinXV = (255 - min) / scaleWidth;
    // var oneMinYV = (255 - min) / h;


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

    return {r: r, g: g, b: b};
}


function drawPlatter() {
    var width = paletteCanvas.width;
    var height = paletteCanvas.height;

    for (let i = 0; i < scaleWidth; i++) {
        for (let j = 0; j < scaleHeight; j++) {
            var temp = getPosColor(i, j);
            paletteCtx.fillStyle="rgb(" + temp.r + "," + temp.g + "," + temp.b + ")";
            paletteCtx.fillRect(i*xScale,j*yScale,xScale,yScale);

        }
    }

}

drawPlatter();
