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
//橡皮图片偏移量
var eraserChange = 10;
var eraserHeight = 20;

// canvas的长宽
let height = 580;
let width = 960;

//橡皮擦图片
var eraser = document.querySelector("#eraser");

var colorChange = document.querySelector("#colorChange");



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
                        //橡皮图片
                        eraserHeight +=rubberWidthChange;
                        eraserChange += rubberWidthChange/2;
                        eraser.style.height =eraserHeight+"px"

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
                        //橡皮图片
                        eraserHeight -=rubberWidthChange;
                        eraserChange -= rubberWidthChange/2;
                        eraser.style.height =eraserHeight+"px"
                        


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

/*
当使用橡皮擦的时候，指针变化为圆形
 */
var Canvas = document.querySelector("#Canvas");



//绑定事件
for (let i = 2; i <= 7; i++) {

    buttons[i].addEventListener("click", function changeState() {
        //点击事件
        //改变当前网页的state
        mainArtBoardDiv.boardState = i;
        //console.log(MainArtBoardDiv.boardState);

        //当使用橡皮擦的时候，指针变化为圆形
        if(mainArtBoardDiv.boardState === 7){
            Canvas.id = "Canvas_chosen";
        }else{
            Canvas.id = "Canvas";
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




/*
使橡皮擦图片跟随指针
 */

Canvas.addEventListener('mousemove',function(e){
    if(mainArtBoardDiv.boardState===7){
    var pagex = e.pageX-eraserChange+'px';
    var pagey = e.pageY-eraserChange+'px';
    eraser.id="eraser_chosen";
    //console.log(pagex,pagey);
    eraser.style.left = pagex;
    eraser.style.top = pagey;
    }else if(mainArtBoardDiv.boardState!==7){
        eraser.id="eraser";
    }
    
})


/**
 *  撤销之前的绘画操作
 */
var ctxStack = [];

Canvas.addEventListener("mouseup",function(){
    //保存之前的绘画状态
    const ctxData = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
    ctxStack.push(ctxData);
    console.log(2);
})

buttons[8].addEventListener("click",function(){
    //恢复到之前的绘画状态
    const ctxData= ctxStack.pop();
    ctx.putImageData(ctxData,0,0)
    
    console.log(1)
})