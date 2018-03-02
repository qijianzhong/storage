/*
 * jQuery File Upload Plugin JS Example
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/* global $, window */

$(function () {
  'use strict';

  // 初始化jQuery文件上传小部件:    单个上传
  // data-url="file/<%- type %>"
    $('#fileupload').fileupload({
        // 注释以下发送跨域Cookie：
        //xhrFields: {withCredentials: true},
        url: 'file/upload',
        uploadAsync: true,
        type: 'POST',
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4|mp3|wav)$/i,
        autoUpload:true,
        //maxFileSize:1024000 ,
        disableImageResize: /Android(?!.*Chrome)|Opera/
            .test(window.navigator.userAgent),
        //  maxFileSize: 999000,
        success: function (data) {
            var fileCunt = 0;
            var fileCunt_r = 0;
            var state ;
            var message;
            var style;
            for(var i = 0;i<data.files.length;i++)
            {   
                if(data.files[i].repetition == false) 
                    {
                        fileCunt=fileCunt+1;
                    }else{
                        fileCunt_r=fileCunt_r+1;
                    }
            };

            if( fileCunt == 0 )
            {   
                state = atten;
                message = chongfu;
                style ='warning';
            }else{
                state = chenggong;
                message = fileCunt + uploadSuccess;
                style ='success';
            };
            stateAlert(state,message,style);
            $(".uploadMsg",parent.document).html(' ');
            $("#reflashBtn",parent.document).click();
        },
        error:function(){
            stateAlert(cuowu,uploadFail,'danger');
        }
    });
});

 //返回状态 方法
 function stateAlert(state,massage,style){
    var styLe = "alert alert-"+style;
    var tag = $('#myAlert', parent.document);
    tag.attr("class",styLe);
    tag.find('#myState').text(state);
    tag.find('#myMassage').text(massage);
    tag.animate().show(function(){
    });
    setTimeout(function(){tag.hide()},4000);
}