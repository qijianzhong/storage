var FImageSize = function (url, cb) {
    var img = new Image();
    img.src = url;
    img.onload = function () {
        cb({
            width: this.width,
            height: this.height
        });
    }
}