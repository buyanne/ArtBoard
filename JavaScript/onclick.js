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
    var canvas = document.getElementById("Canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
}