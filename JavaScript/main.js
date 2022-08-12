/*
*   线条的最大值最小值
*   线条的默认值
*   鼠标滚动时候的变化快慢
* */
var ctxLineWidthMax = 10, ctxLineWidthMin = 1;
var ctxLineWidthDefault = 4;
var mouseScrollChange = 0.1;


var rubberWidthMin = 1, rubberWidthMax = 20;
var rubberWidthDefault = 4;
var rubberWidthChange = 0.5;

// canvas的长宽
let height = 580;
let width = 960;

/*
*  添加鼠标滚轮事件，可以调整线条的粗细
* */
windowAddMouseWheel();

function windowAddMouseWheel() {
    var scrollFunc = function (e) {

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
                    case 7: {
                        toolsDiv.rubberWidth += rubberWidthChange;
                        if (toolsDiv.rubberWidth >= rubberWidthMax) {
                            toolsDiv.rubberWidth = rubberWidthMax;
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
                    case 7: {
                        toolsDiv.rubberWidth -= rubberWidthChange;
                        if (toolsDiv.rubberWidth <= rubberWidthMin) {
                            toolsDiv.rubberWidth = rubberWidthMin;
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
//console.log(buttons)


//绑定事件
for (let i = 2; i <= 7; i++) {

    buttons[i].addEventListener("click", function changeState() {
        //点击事件
        //改变当前网页的state
        mainArtBoardDiv.boardState = i;
        //console.log(MainArtBoardDiv.boardState);

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
    a.href = canvas.toDataURL();

    a.download = name;
    a.click();
}


//清空canvas
function clearCanvas() {
    $("#Canvas").getCon
    var canvas = document.getElementById("Canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
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
            ctx.clearRect(x, y, width * 2, height * 2);
            step += 0.1;
            func(r);
        }
    }
}





