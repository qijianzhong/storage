var fs = require('fs');
var path = require('path');

/**
 * async
 * 
 * mkdirs
 * 
 * @return {err,dirpath}
 */
var mkdirs = module.exports.mkdirs = function (dirpath, mode, callback) {
    if (typeof mode == 'function') {
        callback = mode;
        mode = 0777;
    }
    fs.exists(dirpath, function (exists) {
        if (exists) {
            callback(null, dirpath);
        } else {
            //尝试创建父目录，然后再创建当前目录
            mkdirs(path.dirname(dirpath), mode, function () {
                fs.mkdir(dirpath, mode, function (err) {
                    callback(err, dirpath);
                });
            });
        }
    });
};

/**
 * sync
 * 
 * mkdirs
 */
var mkdirsSync = module.exports.mkdirsSync = function (p, mode) {
    var mode = mode || 0777;
    p = path.resolve(p);
    try {
        fs.mkdirSync(p, mode);
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT':
                mkdirsSync(path.dirname(p), mode);
                mkdirsSync(p, mode);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = fs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }
    return true;
};