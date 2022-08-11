/*
*  添加鼠标滚轮事件，可以调整线条的粗细
* */
var color = document.getElementById("color");

windowAddMouseWheel();
function windowAddMouseWheel() {
    var scrollFunc = function (e) {
        e = e || window.event;
        if (e.wheelDelta) {  //chrome
            //向上滚动
            if (e.wheelDelta > 0) {
                ctx.lineWidth+=mouseScrollChange;
                if(ctx.lineWidth>ctxLineWidthMax){
                    ctx.lineWidth=ctxLineWidthMax;
                }
            }
            //向下滚动
            if (e.wheelDelta < 0) {
                ctx.lineWidth-=mouseScrollChange;
                if(ctx.lineWidth<ctxLineWidthMin){
                    ctx.lineWidth=ctxLineWidthMin;
                }
            }
        }
        //好像可以适配其他的浏览器
        //这里就不适配了吧
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
状态列表：0 color，1 size，2 pencil，3 line,4 circle,5square,6 area, 8 rubber
默认状态：2（笔）
 */

var buttons = document.querySelectorAll(".ToolsDiv input")
//基本状态
var MainArtBoardDiv = document.querySelector(".MainArtBoardDiv")
buttons[2].className="after";
//console.log(buttons)


//绑定事件
for(let i=0;i<=8;i++){
    if(i !== 7){
        buttons[i].addEventListener("click",function changeState(){
            //点击事件
            
            //改变当前网页的state
            MainArtBoardDiv.boardState = i;
            //console.log(MainArtBoardDiv.boardState);
            
            //改变css样式
            buttons[i].className="after";
            for(let j = 0;j<=8;j++){
                if(j!==7&&j!==i){
                    buttons[j].className="before";
                }
            }
        });
    }
    
}


