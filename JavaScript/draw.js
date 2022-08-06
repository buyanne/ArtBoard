//思考一下画板怎么写
//好的宝，但是现在有一个问题就是back

//位置数组
var position = [0];
//判断鼠标是否按下
var mousePressed = false;
var mouseIsInCanvas = true;
var canvas = document.getElementById("Canvas");

//画笔
var ctx = canvas.getContext("2d");


ctx.fillStyle = "black";
ctx.strokeStyle = "none";
ctx.lineWidth = 3;

//判断鼠标是否按下
document.onmousedown = (e) => {
    mousePressed = true;
    position[0] = e.clientX;
    position[1] = e.clientY;
}

//判断鼠标是否松开
document.onmouseup = (e) => {
    mousePressed = false;
}


//画线的函数
function draw(startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.closePath();
    ctx.stroke();
}


canvas.onmousemove = function (e) {
    if (mousePressed && mouseIsInCanvas) {
        //画线，然后记录位置
        draw(position[0], position[1], e.clientX, e.clientY);
        position[0] = e.clientX;
        position[1] = e.clientY;
    }
};
//在鼠标离开canvas时
canvas.onmouseleave = (e) => {
    mouseIsInCanvas = false;
}
//鼠标进入canvas时
canvas.onmouseenter = (e) => {
    mouseIsInCanvas = true;
    position[0] = e.clientX;
    position[1] = e.clientY;
}
