//线条的最大值最小值
var ctxLineWidthMax = 10, ctxLineWidthMin = 1;
//线条的默认值
var ctxLineWidthDefault = 2;
//鼠标滚动时候的变化快慢
var mouseScrollChange = 0.1;

//橡皮擦最大值最小值
var rubberWidthMin = 1, rubberWidthMax = 20;
//橡皮擦默认值
var rubberWidthDefault = 4;
//鼠标滚动时橡皮擦变化量
var rubberWidthChange = 0.5;
//橡皮图片偏移量
var eraserChange = 10;
var eraserHeight = 20

// canvas的长宽
var height = 580;
var width = 960;

//橡皮擦图片
var eraser = document.querySelector("#eraser");


//当前颜色
var color = "000000";
//保存颜色的rgb信息
var colorR = 255, colorG = 255, colorB = 255;

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
                            eraserHeight += rubberWidthChange;
                            eraserChange += rubberWidthChange / 2;
                            eraser.style.height = eraserHeight + "px"
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
                            eraserHeight -= rubberWidthChange;
                            eraserChange -= rubberWidthChange / 2;
                            eraser.style.height = eraserHeight + "px"
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
状态列表：0 color，1 size，2 pencil，3 line,4 circle,5square,6 area, 7 rubber
默认状态：2（笔）
 */
var buttons = document.querySelectorAll(".ToolsDiv input");
//基本状态
var mainArtBoardDiv = document.querySelector(".MainArtBoardDiv");
mainArtBoardDiv.boardState = 2;
buttons[2].className = "after";


//绑定事件
for (let i = 2; i <= 7; i++) {


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

var isOpen1 = false;
var isFill = document.querySelector("#isFill");
buttons[6].addEventListener("click", function () {
    if (isOpen1 === false) {
        isFill.id = "isFill1";
        isOpen1 = true;
    } else {
        isFill.id = "isFill";
        isOpen1 = false;
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

//根据笔的粗细来填充像素，
function fillPixel(x, y, w) {
    //除 2 便于遍历
    let half = Math.ceil(w / 2);
    for (let i = x - half; i <= x + half; i++) {
        for (let j = y - half; j <= y + half; j++) {
            //边界条件的判断

            if (i < 0 || j < 0 || i >= width || j >= height) {
                continue;
            }
            num[i][j] = 1;
        }
    }
}

function pushIntoNum() {
    let len = points.length;


    for (let i = 0; i < len - 1; i++) {
        //第一个点
        let x1 = points[i].x;
        let y1 = points[i].y;

        //第二个点
        let x2 = points[i + 1].x;
        let y2 = points[i + 1].y;

        let k = 0;
        //斜率不存在
        if (x1 === x2) {
            //确定 y1 为小的点
            if (y1 > y2) {
                //交换两个点的坐标
                let temp = y1;
                y1 = y2;
                y2 = temp;

                temp = x1;
                x1 = x2;
                x2 = temp;
            }
            for (let y = y1; y <= y2; y++) {
                fillPixel(x1, y, ctx.lineWidth);
            }

        } else {//斜率存在又有几种情况
            if (x1 > x2) {
                let temp = y1;
                y1 = y2;
                y2 = temp;

                temp = x1;
                x1 = x2;
                x2 = temp;
            }
            //上一个点
            let preY = y1;
            let preX = x1;
            //x从小到大遍历
            for (let x = x1; x <= x2; x++) {
                let y = k * (x - x1) + y1;

                //若高度差大于1则中间有空隙要补齐
                if (Math.abs(y - preY) > 1) {
                    if (y < preY) {
                        for (let j = y; j <= preY; j++) {
                            fillPixel(x, j, ctx.lineWidth);
                        }
                    } else {
                        for (let j = preY; j <= y; j++) {
                            fillPixel(x, j, ctx.lineWidth);
                        }
                    }

                } else {//斜率平缓没有空隙
                    if (x - preX > 1) {
                        for (let i = preX; i <= x; i++) {
                            y = k * (x - i) + y1;
                            fillPixel(i, y, ctx.lineWidth);
                        }
                    } else {
                        fillPixel(x, y, ctx.lineWidth);
                    }
                }
                preY = y;
                preX = x;
            }

        }

    }
}