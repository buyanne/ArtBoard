function downLoadImage(){
    //获得canvas
    var canvas = document.getElementById("Canvas");
    //创建a标签
    var a = document.createElement("a");
    //toDataURL返回链接
    a.href = canvas.toDataURL();
    a.download = "画作名";
    a.click();
}