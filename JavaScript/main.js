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

