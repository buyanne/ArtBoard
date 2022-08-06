

//思考一下画板怎么写

var canvas = document.getElementById("Canvas");

//画笔
var ctx = canvas.getContext("2d");
ctx.fillStyle = "black";
ctx.strokeStyle = "none";
ctx.lineWidth = 3;
//位置数组

var position = [0];

canvas.onmousedown = function (e) {
    //当鼠标按下的时候flag为true，然后记录位置
    flag = true;
    position[0] = e.clientX;
    position[1] = e.clientY;
};
canvas.onmousemove = function (e) {
    if (flag) {
    //画线，然后记录位置
        draw(position[0], position[1], e.clientX, e.clientY);
        position[0] = e.clientX;
        position[1] = e.clientY;
    }
};
canvas.onmouseup = function () {
    flag = false;
};

//画线的函数
function draw(starX, starY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(starX, starY);
    ctx.lineTo(endX, endY);
    ctx.closePath();
    ctx.stroke();
}