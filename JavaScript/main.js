//线条的最大值最小值
var ctxLineWidthMax = 10, ctxLineWidthMin = 1;
//线条的默认值
var ctxLineWidthDefault = 2;
//鼠标滚动时候的变化快慢
var mouseScrollChange = 0.1;

//橡皮擦最大值最小值
var rubberWidthMin = 3, rubberWidthMax = 20;
//橡皮擦默认值
var rubberWidthDefault = 4;
//鼠标滚动时橡皮擦变化量
var rubberWidthChange = 0.5;
//橡皮图片偏移量
var eraserChange = 5;
var eraserHeight = 10

// canvas的长宽
var height = 580;
var width = 960;

//橡皮擦图片
var eraser = document.querySelector("#eraser");


//当前颜色
var color = "000000";
//保存颜色的rgb信息
var colorR = 0, colorG = 0, colorB = 0;

//粗细滑块
var widthRange = document.querySelector("#widthRange");

//表图层
var canvas = document.getElementById("Canvas");
//添加偏移量
var artboardDiv = document.getElementsByClassName("MainArtBoardDiv")[0];
//画笔
var ctx = canvas.getContext("2d");
//真正的图层
var realCanvas = document.getElementById("RealCanvas");
//真正的画笔
var realCtx = realCanvas.getContext("2d");

//撤回保存的栈
var ctxStack = [];
//栈的最大长度，超过则删除栈底元素
var stackMaxSize = 30;

//已经访问的像素点
let vis = new Array(width);
//初始化vis数组
for (let i = 0; i < width; i++) {
    vis[i] = new Array(height).fill(0);
}
//以画线的像素点
let num = new Array(width);
for (let i = 0; i < width; i++) {
    num[i] = new Array(height).fill(0);
}
//存储这一个封闭图形
let v = [];
//四个方向的遍历
var d = [[1, 0], [-1, 0], [0, 1], [0, -1]];


//贝塞尔曲线的采样率
var bezierStep = 100;
//num栈，保存标记信息，为了撤回和清空的功能
var numStack = [];

//文字功能相关
var textChange = document.querySelector("#textChange");
var textRange = document.querySelector("#textRange");

/*
*  添加鼠标滚轮事件，可以调整线条的粗细
* */
windowAddMouseWheel();
widthRange.value = ctx.lineWidth * 100;


function windowAddMouseWheel() {
    var scrollFunc = function (e) {
        widthRange.value = ctx.lineWidth * 100;
        e = e || window.event;
        if (e.wheelDelta) {  //chrome
            //向上滚动
            if (e.wheelDelta > 0) {
                switch (mainArtBoardDiv.boardState) {
                    case 2: {
                        ctx.lineWidth += mouseScrollChange;
                        if (ctx.lineWidth > ctxLineWidthMax) {
                            ctx.lineWidth = ctxLineWidthMax;
                        }
                        break;
                    }
                    case 3: {
                        ctx.lineWidth += mouseScrollChange;
                        if (ctx.lineWidth > ctxLineWidthMax) {
                            ctx.lineWidth = ctxLineWidthMax;
                        }
                        break;
                    }
                    case 4: {
                        ctx.lineWidth += mouseScrollChange;
                        if (ctx.lineWidth > ctxLineWidthMax) {
                            ctx.lineWidth = ctxLineWidthMax;
                        }
                        break;
                    }
                    case 5: {
                        ctx.lineWidth += mouseScrollChange;
                        if (ctx.lineWidth > ctxLineWidthMax) {
                            ctx.lineWidth = ctxLineWidthMax;
                        }
                        break;
                    }
                    case 7: {
                        //橡皮图片
                        //防止过于大的图片
                        toolsDiv.rubberWidth += rubberWidthChange;
                        if (toolsDiv.rubberWidth >= rubberWidthMax) {
                            toolsDiv.rubberWidth = rubberWidthMax;
                        } else {
                            eraserHeight = toolsDiv.rubberWidth * 2.5;
                            eraserChange = (toolsDiv.rubberWidth / 2) * 2.5;
                            eraser.style.height = eraserHeight + "px"

                            var pageX = e.pageX - eraserChange + 'px';
                            var pageY = e.pageY - eraserChange + 'px';
                            eraser.style.left = pageX;
                            eraser.style.top = pageY;
                        }
                        break;
                    }
                }
            }
            //向下滚动
            if (e.wheelDelta < 0) {
                switch (mainArtBoardDiv.boardState) {
                    case 2: {
                        ctx.lineWidth -= mouseScrollChange;
                        if (ctx.lineWidth < ctxLineWidthMin) {
                            ctx.lineWidth = ctxLineWidthMin;
                        }
                        break;
                    }
                    case 3: {
                        ctx.lineWidth -= mouseScrollChange;
                        if (ctx.lineWidth < ctxLineWidthMin) {
                            ctx.lineWidth = ctxLineWidthMin;
                        }
                        break;
                    }
                    case 4: {
                        ctx.lineWidth -= mouseScrollChange;
                        if (ctx.lineWidth < ctxLineWidthMin) {
                            ctx.lineWidth = ctxLineWidthMin;
                        }
                        break;
                    }
                    case 5: {
                        ctx.lineWidth -= mouseScrollChange;
                        if (ctx.lineWidth < ctxLineWidthMin) {
                            ctx.lineWidth = ctxLineWidthMin;
                        }
                        break;
                    }
                    case 7: {
                        //橡皮图片
                        //防止过于小的图片
                        toolsDiv.rubberWidth -= rubberWidthChange;

                        if (toolsDiv.rubberWidth <= rubberWidthMin) {
                            toolsDiv.rubberWidth = rubberWidthMin;
                        } else {
                            eraserHeight = toolsDiv.rubberWidth * 2.5;
                            eraserChange = (toolsDiv.rubberWidth / 2) * 2.5;
                            eraser.style.height = eraserHeight + "px"

                            var pageX = e.pageX - eraserChange + 'px';
                            var pageY = e.pageY - eraserChange + 'px';
                            eraser.style.left = pageX;
                            eraser.style.top = pageY;
                        }
                        break;
                    }
                }
            }
        }

    };
    //绑定鼠标滚动事件
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
    }
    //滚动滑轮触发scrollFunc方法
    window.onmousewheel = document.onmousewheel = scrollFunc;
}


/*
状态获取函数，通过网页上按钮的单击，判断当前的状态
一部分按下即使用的功能就不列状态了
状态列表：0 文字，1 size，2 pencil，3 line,4 circle,5square,6 area, 7 rubber
默认状态：2（笔）
 */
var buttons = document.querySelectorAll(".ToolsDiv input");
//基本状态
var mainArtBoardDiv = document.querySelector(".MainArtBoardDiv");
mainArtBoardDiv.boardState = 2;
buttons[2].className = "after";

//添加文字功能


//绑定事件
for (let i = 0; i <= 7; i++) {
    if(i===1){
        continue;
    }
    buttons[i].addEventListener("click", function changeState() {
        //点击事件
        //改变当前网页的state
        mainArtBoardDiv.boardState = i;
        //console.log(MainArtBoardDiv.boardState);

        //当使用橡皮擦的时候，指针变化为圆形
        if (mainArtBoardDiv.boardState === 7) {
            canvas.id = "Canvas_chosen";
        } else {
            canvas.id = "Canvas";
        }

        if(mainArtBoardDiv.boardState !== 0){
            textInsert.id = "textInsert";
            textChange.id = "textChange"
            textRange.id = "textRange"
        }else {
            textChange.id = "textChange1"
            textRange.id = "textRange1"
        }

        //改变css样式
        buttons[i].className = "after";
        for (let j = 0; j <= 7; j++) {
            if (j !== i) {
                buttons[j].className = "before";
            }
        }
    });
}


//下载图片
function downLoadImage() {
    //获得canvas
    var canvas = document.getElementById("Canvas");
    //创建a标签
    var a = document.createElement("a");

    var name = prompt("输入画作名");
    if (null === name) {
        return;
    }
    //toDataURL返回链接
    a.href = realCanvas.toDataURL();

    a.download = name;
    a.click();
}


//清空canvas
function clearCanvas() {
    //清空之前添加到栈中
    pushIntoStack();
    realCtx.clearRect(0, 0, width, height);
    ctx.clearRect(0, 0, width, height);

    num = new Array(width);
    for (let i = 0; i < width; i++) {
        num[i] = new Array(height).fill(0);
    }
}

//清空圆形区域
function clearArc(p) {
    //删除精度
    let step = 0.1;
    func(toolsDiv.rubberWidth);

    //递归清空圆形区域
    function func(r) {
        let width = r - step;
        let height = Math.sqrt(r * r - width * width);
        let x = p.x - width;
        let y = p.y - height;
        if (step <= r) {

            realCtx.clearRect(x, y, width * 2, height * 2);


            step += 0.1;
            func(r);
        }
    }
}


/*
使橡皮擦图片跟随指针
 */
canvas.addEventListener('mousemove', function (e) {
    if (mainArtBoardDiv.boardState === 7) {
        var pagex = e.pageX - eraserChange + 'px';
        var pagey = e.pageY - eraserChange + 'px';
        eraser.id = "eraser_chosen";
        //console.log(pagex,pagey);
        eraser.style.left = pagex;
        eraser.style.top = pagey;
    } else if (mainArtBoardDiv.boardState !== 7) {
        eraser.id = "eraser";
    }

});

//保存当前的表图层的图案到里图层
function saveImage() {
    const image = new Image();
    image.src = canvas.toDataURL();
    image.onload = function () {
        realCtx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
        ctx.clearRect(0, 0, width, height);
    }

}

buttons[8].addEventListener("click", function () {
    // if (isFirst) {
    //     ctxStack.pop();
    //     isFirst = false;
    // }
    if (ctxStack.length > 0) {
        const imageData = ctxStack.pop();
        realCtx.putImageData(imageData, 0, 0);
        ctx.clearRect(0, 0, width, height);

        num = numStack.pop();
    }

});

//加入栈中
function pushIntoStack() {
    if (ctxStack.length < stackMaxSize) {
        const x = realCtx.getImageData(0, 0, width, height);
        ctxStack.push(x);
    } else {
        ctxStack.shift();
        // console.log(ctxStack.length);
        const x = realCtx.getImageData(0, 0, width, height);
        ctxStack.push(x);
    }

}


/**
 * 下拉菜单的实现
 */
var isOpen = false;
var widthChange = document.querySelector("#widthChange");
var widthRange = document.querySelector("#widthRange")
buttons[1].addEventListener("click", function () {
    if (isOpen === false) {
        widthChange.id = "widthChange1";
        widthRange.id = "widthRange1"
        isOpen = true;
    } else {
        widthChange.id = "widthChange";
        widthRange.id = "widthRange";
        isOpen = false;
    }
})


/**
 * 粗细下滑菜单相关函数
 */

widthRange.addEventListener("input", function () {
    ctx.lineWidth = widthRange.value / 100;
})


function bfs(i, j) {
    var que = [];

    que.push({
        x: i,
        y: j
    });

    while (que.length !== 0) {
        var temp = que[0];
        que.shift();
        let x = temp.x;
        let y = temp.y;
        if (vis[x][y] === 1) {
            continue;
        }
        vis[x][y] = 1;
        if (num[x][y] === 1) {
            continue;
        }
        v.push({
            x: x,
            y: y
        })

        for (let i = 0; i < 4; i++) {
            let xx = x + d[i][0];
            let yy = y + d[i][1];

            if (xx < 0 || xx >= width || yy < 0 || yy >= height) {
                continue;
            }
            if (vis[xx][yy] === 1) {
                continue;
            }
            que.push({
                x: xx,
                y: yy
            });
        }
    }
}

let cnt = 0;

//根据笔的粗细来填充像素
function fillPixel(x, y) {
    //除 2 便于遍历
    var w = ctx.lineWidth;
    let half = Math.round(w / 4);
    for (let i = x - half; i <= x + half; i++) {
        for (let j = y - half; j <= y + half; j++) {
            //边界条件的判断
            if (i < 0 || j < 0 || i >= width || j >= height) {
                continue;
            }

            //确保为整数
            i = Math.round(i);
            j = Math.round(j);
            num[i][j] = 1;
        }
    }
}

//清楚圆形区域的num值
function clearArcNum(x, y) {
    let w = 2 * toolsDiv.rubberWidth - 1;

    for (let i = x - w + 1; i <= x + w; i++) {
        if (i < 0 || i >= width)
            continue;
        for (let j = y - w + 1; j <= y + w - 1; j++) {
            if (j < 0 || j >= height) {
                continue;
            }
            let temp = (x - i) * (x - i) + (y - j) * (y - j);

            if (temp < Math.pow(w / 2, 2)) {
                num[i][j] = 0;
            }
        }
    }
}

//两点贝塞尔获得曲线上的点
function getBezier(t, startpoint, controlpoint, endpoint) {
    var xx = (1 - t) * (1 - t) * startpoint.x + 2 * t * (1 - t) * controlpoint.x + t * t * endpoint.x;
    var yy = (1 - t) * (1 - t) * startpoint.y + 2 * t * (1 - t) * controlpoint.y + t * t * endpoint.y;

    return {
        x: Math.ceil(xx),
        y: Math.ceil(yy)
    }
}


//获得圆上的点坐标
function getArcPath(point, r) {
    var arr = [];

    //遍历圆的一周
    for (let i = 0; i < Math.PI * 2 * 1000; i++) {
        //弧度值
        let R = i / 1000;
        var x = point.x + Math.floor(r * Math.cos(R));
        var y = point.y + Math.floor(r * Math.sin(R));

        arr.push({
            x: x,
            y: y
        });

    }

    return arr;
}

//将画过的点标记为1
function pushIntoNum() {
    switch (mainArtBoardDiv.boardState) {
        case 2: {
            let len = points.length;
            //起始点
            var startpoint = points[0];
            //计算最后一个点之前的贝塞尔曲线值
            for (let i = 1; i < len - 2; i++) {
                var point1 = points[i];
                var point2 = points[i + 1];

                var endpoint = {
                    x: (point1.x + point2.x) / 2,
                    y: (point1.y + point2.y) / 2
                };
                for (let i = 1; i <= bezierStep; i++) {
                    var point = getBezier(i / bezierStep, startpoint, point1, endpoint);
                    fillPixel(point.x, point.y);
                }
                startpoint = endpoint;
            }
            var endpoint = points[len - 1];
            var controlpoint = points[len - 2];

            for (let i = 1; i <= bezierStep; i++) {
                var point = getBezier(i / bezierStep, startpoint, controlpoint, endpoint);
                fillPixel(point.x, point.y);
            }
            break;
        }
        case 3: {
            //乘一百是为了使采样点变多一点，直线的贝塞尔只有两个控制点
            for (let i = 1; i <= bezierStep * 100; i++) {
                var point = getBezier(i / (bezierStep * 100), startPoint, endPoint, endPoint);
                fillPixel(point.x, point.y);
            }
            break;
        }
        case 4: {
            //圆心
            var midPoint = {
                x: (startPoint.x + endPoint.x) / 2,
                y: (startPoint.y + endPoint.y) / 2
            };


            var radius = Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2)
                + Math.pow(startPoint.y - endPoint.y, 2)) / 2;


            //获得圆上点坐标
            var temp = getArcPath(midPoint, radius);

            let len = temp.length;
            //填充圆上点
            for (let i = 0; i < len; i++) {
                fillPixel(temp[i].x, temp[i].y);
            }

            break;
        }
        case 5: {
            //除了终止点其余两个点
            var point1 = {
                x: endPoint.x,
                y: startPoint.y
            };
            var point2 = {
                x: startPoint.x,
                y: endPoint.y
            };

            //对四条边进行标记
            for (let i = 1; i <= bezierStep * 100; i++) {
                var point = getBezier(i / (bezierStep * 100), startPoint, point1, point1);
                fillPixel(point.x, point.y);
            }
            for (let i = 1; i <= bezierStep * 100; i++) {
                var point = getBezier(i / (bezierStep * 100), startPoint, point2, point2);
                fillPixel(point.x, point.y);
            }

            for (let i = 1; i <= bezierStep * 100; i++) {
                var point = getBezier(i / (bezierStep * 100), endPoint, point1, point1);
                fillPixel(point.x, point.y);
            }
            for (let i = 1; i <= bezierStep * 100; i++) {
                var point = getBezier(i / (bezierStep * 100), endPoint, point2, point2);
                fillPixel(point.x, point.y);
            }
            break;
        }
        case 7: {
            clearArcNum(endPoint.x, endPoint.y);
            break;
        }
    }
}




//文字框追踪鼠标
var textfont = 16;
var textInsert = document.querySelector("#textInsert");
textRange.value=160;

textRange.addEventListener("input",function(){
    textfont = textRange.value/10;
})
var vertX;
var vertY;

canvas.addEventListener("mouseup",function(e){
    if(mainArtBoardDiv.boardState===0){
        textInsert.value = "";
        textInsert.id = "textInsert1";
        vertX = e.pageX - eraserChange;
        vertY = e.pageY - eraserChange;
        textInsert.style.left = vertX;
        textInsert.style.top = vertY;
        textInsert.style.height = textfont*1.25;
        textInsert.style.fontSize=textfont;
        
    }
})

textInsert.addEventListener("keyup",function(e){
    e = e || window.e;
    var keyN = e.keyCode;
    if(keyN === 13){
        ctx.font =  textfont+"px Arial";
        ctx.fillStyle = color;
        var y = vertY-150+textfont*0.99;
        ctx.fillText(textInsert.value,vertX-400,y);
        textInsert.id = "textInsert";
    }
})