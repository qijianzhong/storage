/**
 * Public
 */
function responseHandler(res) {     // 加载服务器数据之前的处理程序，可以用来格式化数据。参数：res为从服务器请求到的数据。  
    if (res) {
        return {
            "rows": res.rows,
            "total": res.total
        };
    } else {
        return {
            "rows": [],
            "total": 0
        };
    }
}

function getNowFormatDate(timestamp) {     //时间戳转换为日期格式
    if (timestamp) {
        var date = new Date(timestamp);
    } else {
        var date = new Date();
    };
    var strMonth = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHour = date.getHours();
    var strMinutes = date.getMinutes();
    var strSeconds = date.getSeconds();
    if (strMonth >= 1 && strMonth <= 9) {
        strMonth = "0" + strMonth;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strHour >= 0 && strHour <= 9) {
        strHour = "0" + strHour;
    }
    if (strMinutes >= 0 && strMinutes <= 9) {
        strMinutes = "0" + strMinutes;
    }
    if (strSeconds >= 0 && strSeconds <= 9) {
        strSeconds = "0" + strSeconds;
    }
    var currentdate = date.getFullYear() + "-" + strMonth + "-" + strDate + " " + strHour + ":" + strMinutes + ":" + strSeconds;
    return currentdate;
};

function isArray(obj) {     //判断是否为数组
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function isContains(substr, str) {
    return new RegExp(substr).test(str);
}

function tableHeight(h) {   //表格高度
    if (!h || h == '' || isNaN(h)) {
        return $(window).height();
    } else {
        console.log("response:",$(window).height() - h);
        return $(window).height() - h;
    }
};

/**
 * Tour Beacon
 */
function formValidator_tourBeacon(formid) {    //输入验证
    $(formid).bootstrapValidator({
        message: 'This value is not valid',
        // feedbackIcons: {
        //     valid: 'glyphicon glyphicon-ok',
        //     invalid: 'glyphicon glyphicon-remove',
        //     validating: 'glyphicon glyphicon-refresh'
        // },
        submitButtons: 'button[type="submit"]',
        fields: {
            beaconid: {
                message: 'The beacon is not valid',
                threshold: 13,
                validators: {
                    notEmpty: {
                        message: 'The Beacon ID is required and can\'t be empty'
                    },
                    regexp: {
                        regexp: /^\d{10}$/,
                        message: 'The Beacon ID can only SAE Beacon format'
                    },
                    remote: {
                        url: '../beacon/validate',
                        message: 'Beacon ID already exist',
                        delay: 1000,
                        type: 'POST',
                        data: function (validator) {   /**自定义提交数据，默认值提交当前input value */
                            if (isContains('_add', formid)) return { beaconid: $('#form_tourbeacon_add input[name="beaconid"]').val(), type: "add" };
                            if (isContains('_edit', formid)) return { beaconid: $('#form_tourbeacon_edit input[name="beaconid"]').val(), type: "edit", beacon_id: $('#form_tourbeacon_edit input[name="beaconid_id"]').val() };
                        }
                    }
                }
            },
            model: {
                validators: {
                    notEmpty: {
                        message: 'The model is required'
                    }
                }
            },
            longitude: {
                validators: {
                    stringLength: {
                        max: 30,
                        message: 'The longitude must be less than 30 characters long'
                    }
                }
            },
            latitude: {
                validators: {
                    stringLength: {
                        max: 30,
                        message: 'The latitude must be less than 30 characters long'
                    }
                }
            },
            floor_id: {
                validators: {
                    notEmpty: {
                        message: 'The floor is required and can\'t be empty'
                    }
                }
            },
            point_x: {
                validators: {
                    stringLength: {
                        max: 30,
                        message: 'The filed must be less than 30 characters long'
                    }
                }
            },
            point_y: {
                validators: {
                    stringLength: {
                        max: 30,
                        message: 'The filed must be less than 30 characters long'
                    }
                }
            },
            status: {
                validators: {
                    notEmpty: {
                        message: 'The status is required and can\'t be empty'
                    }
                }
            },
            stability: {
                validators: {
                    notEmpty: {
                        message: 'The stability is required and can\'t be empty'
                    }
                }
            },
            description: {
                validators: {
                    stringLength: {
                        max: 60,
                        message: 'The filed must be less than 60 characters long'
                    }
                }
            },
        }
    })
}

function initTable_tourBeacon() {
    $("#tourbeacons").bootstrapTable({
        method: 'get',
        url: '../beacon/list',
        toggle: 'table',
        toolbar: '#tourbeacons_toolbar',                    //工具按钮用哪个容器
        classes: 'table table-hover',
        locale: langlocale,
        undefinedText: '-',
        cache: false,
        height: tableHeight(88),
        striped: true,
        pagination: true,
        queryParamsType: '',
        queryParams: queryParams,    //传递参数（*）
        sidePagination: 'server',
        pageSize: 100,
        pageList: [50, 100, 200],
        sortName: 'beaconid',
        sortOrder: 'desc',
        search: false,
        toolbarAlign: 'left',
        uniqueId: "id",
        showToggle: false,
        showColumns: false,
        showRefresh: true,
        minimumCountColumns: 2,
        clickToSelect: true,
        singleSelect: true,
        maintainSelected: true,
        showExport: true,                   //是否显示导出
        exportDataType: 'all',              //'basic', 'all', 'selected'.
        exportTypes: ['json', 'xml', 'csv', 'txt', 'excel'],
        responseHandler: responseHandler,
        rowStyle: function (row, index) {
            //这里有5个取值代表5中颜色['active', 'success', 'info', 'warning', 'danger'];
            var strclass = "";
            if (row.location == "-") {
                strclass = 'danger';//还有一个active
            }
            else if (row.location == "") {
                strclass = 'danger';
            }
            else {
                return {};
            }
            return { classes: strclass }
        },
        columns: [
            {
                title: no_title,//标题  可不加  
                width: 30,
                align: 'center',
                valign: 'middle',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'beaconid',
                title: id_title,
                align: 'left',
                valign: 'middle',
                sortable: 'true'
            }, {
                field: 'status',
                title: status_title,
                align: 'left',
                valign: 'middle',
                sortable: 'true',
                class:"text-capitalize",
                formatter: function (value, row, index) {
                    return value
                }
            }, {
                field: 'stability',
                title: stability_title,
                align: 'left',
                valign: 'middle',
                sortable: 'true',
                class:"text-capitalize",
                formatter: function (value, row, index) {
                    return value
                }
            }, {
                field: 'description',
                title: description_title,
                align: 'left',
                valign: 'middle',
                sortable: 'true'
            }, {
                title: attachment_title,
                align: 'center',
                valign: 'middle',
                formatter: function (value, row, index) {
                    return '<a class="primary" href="#" data-toggle="modal" data-target="#beaconAttachModal" data-id=' + row.id + '><i class="fa fa-file-text" aria-hidden="true"></i></a>'
                    + ' | <a class="primary" href="#" data-toggle="modal" data-target="#beaconPreviewModal" data-id=' + row.beaconid + '><i class="fa fa-eye" aria-hidden="true"></i></a>'
                }
            }, {
                field: 'source',
                title: source_title,
                align: 'left',
                valign: 'middle',
                sortable: 'true'
            }, {
                title: actions_title,
                align: 'center',
                valign: 'middle',
                formatter: function (value, row, index) {
                    return '<a class="primary" href="#" data-toggle="modal" data-target="#EditBeaconModal" data-id=' + row.id + '><i class="fa fa-edit" aria-hidden="true"></i></a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="#" class="primary" onclick="removeRow(\'' + row.id + '\')" ><i class="fa fa-trash-o" aria-hidden="true"></i></a>';
                }
            }
        ]
    });
};

function initTable_BeaconUploadExcel(data) {
    $('#beacontable').bootstrapTable({
        toggle: 'table',
        classes: 'table table-hover',
        locale: langlocale,
        undefinedText: '-',
        sortName: 'id',
        sortOrder: 'desc',
        contentType: "application/x-www-form-urlencoded",
        cache: false,
        height: 500,
        striped: true,
        pagination: false,
        search: false,
        toolbarAlign: 'left',
        showToggle: false,
        showColumns: false,
        showRefresh: false,
        minimumCountColumns: 3,
        clickToSelect: false,
        maintainSelected: true,
        showExport: false,                   //是否显示导出
        rowStyle: function (row, index) {
            //这里有5个取值代表5中颜色['active', 'success', 'info', 'warning', 'danger'];
            var strclass = "";
            if (!(row._id
                && row._status
                && row._stability
                && row._latlng
                && row.__floor
            )) {
                strclass = 'warning';
            }
            else {
                return {};
            }
            return { classes: strclass }
        },
        columns: [{
            visible: true,                  //是否显示复选框  
            checkbox: true,
            formatter: function (value, row, index) {   //有验证不通过（undefind） 就复选不可用
                if (!(row._id
                    && row._status
                    && row._stability
                    && row._latlng
                    && row.__floor
                ))
                    return {
                        disabled: true,     //设置复选不可用
                    };
                return value;
            },
        }, {
            //field: 'Number',//可不加  
            title: no_title,      //标题  可不加  
            align: 'center',
            valign: 'middle',
            formatter: function (value, row, index) {
                return index + 1;
            }
        }, {
            field: '_id',
            title: '_ID',
            // visible:false,  //数据不可见
            cellStyle: function (value, row, index) {
                var strclass = "";
                if (!row._equipment_id_id) {
                    strclass = 'danger';
                }
                else {
                    return {};
                }
                return { classes: strclass }
            }
        }, {
            field: '_status',
            title: '_Status',
            cellStyle: function (value, row, index) {
                var strclass = "";
                if (!row._company_id) {
                    strclass = 'danger';
                }
                else {
                    return {};
                }
                return { classes: strclass }
            }
        }, {
            field: '_stability',
            title: '_Stability',
        }, {
            field: '_latlng',
            title: '_LatLng',
            cellStyle: function (value, row, index) {
                var strclass = "";
                if (!row._manufacturer_id) {
                    strclass = 'danger';
                }
                else {
                    return {};
                }
                return { classes: strclass }
            }
        }, {
            field: '_floor',
            title: '_Floor',
            cellStyle: function (value, row, index) {
                var strclass = "";
                if (!row._department_id) {
                    strclass = 'danger';
                }
                else {
                    return {};
                }
                return { classes: strclass }
            }
        }, {
            field: '_description',
            title: '_Description',
        }],
        onLoadSuccess: function () {
            toastr.success('ֻ数据加载成功！');
        },
        onLoadError: function () {
            toastr.error('ֻ数据加载失败！');
        },
    });
    $('#beacontable').bootstrapTable("load", data);
}


/**
 * 分类设置之楼层管理（上传楼层图像）
 */
function upload_floor_image(fileinputid, path, config) {
    $(fileinputid).fileinput('destroy');
    $(fileinputid).fileinput({
        uploadUrl: "../upload/singleUpload",
        uploadAsync: true,
        minFileCount: 0,
        maxFileCount: 1,
        allowedFileExtensions: ['jpg', 'png', 'gif'],  //接收的文件后缀
        showUpload: false, //是否显示上传按钮
        showRemove: true,//是否显示删除按钮 
        showCaption: true,//是否显示输入框
        showPreview: true, //是否显示预览
        showCancel: true,
        showUploadedThumbs: true,
        browseClass: "btn btn-primary", //按钮样式
        // overwriteInitial: ture,  //覆盖已存在的图片
        dropZoneEnabled: true,//是否显示拖拽区域
        //minImageWidth: 50, //图片的最小宽度
        //minImageHeight: 50,//图片的最小高度
        //maxImageWidth: 1000,//图片的最大宽度
        //maxImageHeight: 1000,//图片的最大高度
        //maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
        // initialPreviewShowDelete:false,//删除预览框中的删除按钮
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        initialCaption: "please upload floor image",//文本框初始话value
        initialPreviewAsData: true,
        initialPreview: path,
        initialPreviewConfig: config,
        layoutTemplates: {
            actionZoom: '<button type="button" class="kv-file-zoom {zoomClass}" title="{zoomTitle}">{zoomIcon}</button>',
            preview: '<div class="file-preview {class}">\n' +
            '    <div class="{dropClass}">\n' +
            '    <div class="file-preview-thumbnails">\n' +
            '    </div>\n' +
            '    <div class="clearfix"></div>' +
            '    <div class="file-preview-status text-center text-success"></div>\n' +
            '    <div class="kv-fileinput-error"></div>\n' +
            '    </div>\n' +
            '</div>',
            footer: '<div class="file-thumbnail-footer">\n' +
            '    {actions}\n' +
            '</div>',
            actions: '<div class="file-actions">\n' +
            '    <div class="file-footer-buttons">\n' +
            '        {zoom}' +
            '    </div>\n' +
            '    <div class="clearfix"></div>\n' +
            '</div>',
        }
    }).off('filebatchselected').on('filebatchselected', function (event, files) {   //在预览中选择并显示一批文件后触发此事件。
        $(this).fileinput("upload");
    }).on('fileuploaded', function (event, data, previewId, index) {
        var floorimageurl = data.response;
        console.log("异步上传返回路径：" + floorimageurl);
        if (path == "") {
            $("#add_floor_img").val(floorimageurl);
        } else {
            $("#update_floor_img").val(floorimageurl);
        }
    });
};

/**
 * 获取图片的真实宽高
 */
function getImgNaturalDimensions(src, callback) {
    var image = new Image()
    image.src = src;
    image.onload = function () {
        callback(image.width, image.height);
    }
}

// function getImgNaturalDimensions(img, callback) {
//     var nWidth, nHeight;
//     if (img.naturalWidth) { // 现代浏览器
//         nWidth = img.naturalWidth;
//         nHeight = img.naturalHeight;
//     } else { // IE6/7/8
//         var imgae = new Image();
//         image.src = img.src;
//         image.onload = function() {
//             callback(image.width, image.height);
//         }
//     }
//     return [nWidth, nHeight]
// }

/**
 * 附件上传（音频）
 */
function upload_audio(fileinputid, path, config, hiddeninputid) {
    $(fileinputid).fileinput('destroy').fileinput({     //摧毁，清空上一个图片栏内容
        uploadUrl: "../upload/audio",
        uploadAsync: true,
        minFileCount: 0,
        maxFileCount: 1, //表示允许同时上传的最大文件个数
        // defaultPreviewContent: 1,
        autoReplace: true, //当上传文件达到maxFileCount限制并且一些新的文件被选择后，是否自动替换预览中的文件。如果maxFileCount值有效，那么这个参数会起作用。
        validateInitialCount: true,
        // theme: "explorer",
        overwriteInitial: true, //是否要覆盖最初的预览内容和标题设置
        allowedFileTypes: ['audio'],
        allowedFileExtensions: ["wav", "mp3", "ogg"],  //接收的文件后缀
        allowedPreviewTypes: ['audio'],
        showUpload: false, //是否显示上传按钮
        showRemove: false,//是否显示删除按钮 
        showCaption: true,//是否显示输入框
        showPreview: true, //是否显示预览
        showCancel: true,
        showUploadedThumbs: false,
        browseClass: "btn btn-primary", //按钮样式
        dropZoneEnabled: true,//是否显示拖拽区域
        // initialPreviewShowDelete:false,//删除预览框中的删除按钮
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        initialCaption: "please upload audio",//文本框初始话value
        initialPreviewFileType: "audio",
        initialPreview: path,
        initialPreviewAsData: true,
        initialPreviewConfig: config,
        layoutTemplates: {
            preview: '<div class="file-preview {class}">\n' +
            '    <div class="{dropClass}">\n' +
            '    <div class="file-preview-thumbnails">\n' +
            '    </div>\n' +
            '    <div class="clearfix"></div>' +
            '    <div class="file-preview-status text-center text-success"></div>\n' +
            '    <div class="kv-fileinput-error"></div>\n' +
            '    </div>\n' +
            '</div>',
        footer: '<div class="file-thumbnail-footer">\n' +
            '    <div class="file-caption-name" >{caption}</div>\n' +
            '     {actions}\n' +
            '</div>',
        actions: '<div class="file-actions">\n' +
            '    <div class="file-footer-buttons">\n' +
            '        {upload} {download} {delete} {zoom} {other}' +
            '    </div>\n' +
            '    <div class="file-upload-indicator" title="{indicatorTitle}">{indicator}</div>\n' +
            '    <div class="clearfix"></div>\n' +
            '</div>',
        },
    })
    .off('filebatchselected').on('filebatchselected', function (event, files) {   //在预览中选择并显示一批文件后触发此事件。
        $(this).fileinput("upload");
    })
    .off('fileuploaded').on('fileuploaded', function (event, data, previewId, index) {
        var audiourl = data.response;
        console.log("异步上传音频返回路径：" + audiourl);
        console.log("初始音频地址：" + path);

        var preaudioUrl = $(hiddeninputid).val();

        if(!path) path="";                      //没有path传入则将path赋空字符(因为隐藏表单会赋值value=""，所以不能改标签value)
        if(preaudioUrl != path){                //被替换的文件不是预览音频文件，则进行删除文件操作
            console.log("删除音频操作++:" ,preaudioUrl);
            $.ajax({                                        //删除对应文件
                url: '../beacon/uploadedAudio/Delete',
                type: 'post',
                data: { url: preaudioUrl },
                traditional: true,
                dataType: "json",
                success: function () {
                    toastr.success('上传音频删除成功！');
                },
                error: function () {
                    toastr.error('上传音频删除失败，请稍后再试！');
                }
            });

        }
        $("#" + previewId).attr("audiofileurl", audiourl)        //添加文件地址属性 处理完成后id属性会变为upload前缀名   用于上传预览remove的使用
        $(hiddeninputid).val(audiourl);
    })
    .off('filesuccessremove').on('filesuccessremove', function (event, id, key) {           //上传成功后删除上传预览音频文件
        console.log("上传成功的删除音频ID：", id);

        var deleteurl = $("#" + id).attr("audiofileurl");                               //获取需要删除的地址
        console.log("上传成功的删除音频deleteurl：", deleteurl);

        $.ajax({                                        //删除对应文件
            url: '../beacon/uploadedAudio/Delete',
            type: 'post',
            data: {url :deleteurl},
            traditional: true,
            dataType:"json",
            success: function () {
                toastr.success('上传音频删除成功！');
            },
            error: function () {
                toastr.error('上传音频删除失败，请稍后再试！');
            }
        });
    })
    .off('filepredelete').on('filepredelete', function (event, key) {     //初始化预览音频路径删除
        $(hiddeninputid).val('');

    });
};

/**
 * 附件上传（图片）
 */
function upload_images(fileinputid, path, config, hiddeninputid) {
    $(fileinputid).fileinput('destroy').fileinput({     //摧毁，清空上一个图片栏内容
        uploadUrl: "../upload/images",
        uploadAsync: true,
        minFileCount: 0,
        maxFileCount: 14, //表示允许同时上传的最大文件个数
        autoReplace: false, //当上传文件达到maxFileCount限制并且一些新的文件被选择后，是否自动替换预览中的文件。如果maxFileCount值有效，那么这个参数会起作用。
        validateInitialCount: true,
        overwriteInitial: false, //是否要覆盖最初的预览内容和标题设置
        allowedFileTypes: ['image'],
        allowedFileExtensions: ['jpg', 'png', 'gif'],  //接收的文件后缀
        allowedPreviewTypes: ['image'],
        showUpload: false, //是否显示上传按钮
        showRemove: false,//是否显示删除按钮 
        showCaption: true,//是否显示输入框
        showPreview: true, //是否显示预览
        showCancel: true,
        showUploadedThumbs: true,
        browseClass: "btn btn-primary", //按钮样式
        // overwriteInitial: ture,  //覆盖已存在的图片
        dropZoneEnabled: true,//是否显示拖拽区域
        //minImageWidth: 50, //图片的最小宽度
        //minImageHeight: 50,//图片的最小高度
        //maxImageWidth: 1000,//图片的最大宽度
        //maxImageHeight: 1000,//图片的最大高度
        //maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
        // initialPreviewShowDelete:false,//删除预览框中的删除按钮
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        initialCaption: "please upload images",//文本框初始话value
        initialPreview: path,
        initialPreviewAsData: true,
        initialPreviewConfig: config,
        layoutTemplates: {
            preview: '<div class="file-preview {class}">\n' +
                '    <div class="{dropClass}">\n' +
                '    <div class="file-preview-thumbnails">\n' +
                '    </div>\n' +
                '    <div class="clearfix"></div>' +
                '    <div class="file-preview-status text-center text-success"></div>\n' +
                '    <div class="kv-fileinput-error"></div>\n' +
                '    </div>\n' +
                '</div>',
            footer: '<div class="file-thumbnail-footer">\n' +
                '    {actions}\n' +
                '</div>',
            actions: '<div class="file-actions">\n' +
                '    <div class="file-footer-buttons">\n' +
                '      {drag} {delete} {zoom}' +
                '    </div>\n' +
                '    <div class="clearfix"></div>\n' +
                '</div>',
            actionDelete: '<button type="button" class="kv-file-remove {removeClass}" title="{removeTitle}"{dataUrl}{dataKey}>{removeIcon}</button>\n',
            actionZoom: '<button type="button" class="kv-file-zoom {zoomClass}" title="{zoomTitle}">{zoomIcon}</button>',
            actionDrag: ''
        },
    })
        .off('filebatchselected').on('filebatchselected', function (event, files) {   //在预览中选择并显示一批文件后触发此事件。
            $(this).fileinput("upload");
        })
        // .off('filepreupload').on('filepreupload', function (event, data, previewId, index) {
        //     var able = false;
        //     var filenames = data.filenames[0];
        //     if(filenames.indexOf(",") >= 0){
        //         able = true;
        //         toastr.error('图片名不能有 "," ！');
        //     }
        //     return able
        // })
        .off('fileuploaded').on('fileuploaded', function (event, data, previewId, index) {
            var url = data.response;
            $("#" + previewId).attr("fileurl", url[0])                          //添加文件地址属性 处理完成后id属性会变为upload前缀名
            var temp = $(hiddeninputid).val();
            var imgurl = null;
            temp ? (imgurl = temp + ',' + url) : (imgurl = url);
            $(hiddeninputid).val(imgurl);
            console.log("异步上传图片返回路径：" + url, "+++++\n", temp, "图片：" + imgurl);
            console.log("previewId图片：", previewId, "\n", index);
        })
        // .off('filecleared').on('filecleared', function(event) {              //清除图片时清空对应URL 并删除服务器上的文件
        //     console.log("event清除：");
        // })
        .off('filepredelete').on('filepredelete', function (event, key) {       //初始化预览图片路径删除
            var attachment_imgurlarr = $(hiddeninputid).val().split(",")
            var indexlocation = attachment_imgurlarr.indexOf(key);
            attachment_imgurlarr.splice(indexlocation, 1);
            $(hiddeninputid).val(attachment_imgurlarr);
        })
        // .off('filedeleted').on("filedeleted", function (event, key, data) {      //初始化图片的数据库文件删除
        //     // $(hiddeninputid).val(data.responseJSON.result);                   
        //     toastr.warning('删除图片成功！');
        // })
        .off('filesuccessremove').on('filesuccessremove', function (event, id, key) {  //上传成功后点击预览图的remove
            var deleteurl = $("#" + id).attr("fileurl");                               //获取需要删除的地址
            var attachment_imgurlarr = $(hiddeninputid).val().split(",")
            var indexlocation = attachment_imgurlarr.indexOf(deleteurl);
            attachment_imgurlarr.splice(indexlocation, 1);
            $(hiddeninputid).val(attachment_imgurlarr);

            var uploadurl = [];
            uploadurl.push(deleteurl);
            $.ajax({                                        //删除对应文件
                url: '../beacon/uploadedimages/delete',
                type: 'post',
                data: { urlarr: uploadurl },
                traditional: true,
                dataType: "json",
                success: function () {
                    toastr.success('上传图片删除成功！');
                },
                error: function () {
                    toastr.error('上传图片删除失败，请稍后再试！');
                }
            });
        });
};
