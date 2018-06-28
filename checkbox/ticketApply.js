require('buyerCss/public.scss');
require('buyerCss/x_style.scss');
require('buyerCss/base.css');
require('buyerCss/m_style.scss');
require('buyerCss/Members/member_public.scss');
require('style/css/tempstyle.scss');
var $ = require("expose-loader?$!jquery");
// require('./applyTicket.js') 
require('../common/setCity.js')
require('../common/search');
require('../common/alert');
var initAsideCart = require('../common/asideCart');
initAsideCart(true);
var applyBtn = $('.apply-btn'), //取消申请
    invalidBtn = $('.invalid-btn'), //申请作废
    chboxAll = $('.chbox-all'), //全选
    chboxOne = $('.chbox-one');
applyBtn.on('click', function() {
    var msg = '是否取消申请？',
        url = '/Buyer/Invoice/cancelApply',
        type = applyBtn.data('type'),
        data={
            type: type,
            id : applyBtn.data('id'),
        };
    bAlert(msg, url,data);
    if (type != 1) {
        var str = '是否提交？<br/>已审核的发票申请需卖家取消审核';
        $('.m-content').html(str);
    }
})

invalidBtn.on('click', function() {
    var msg = '是否申请作废？',
        url = '/Buyer/Invoice/applyInvalidInvoice',
        id = invalidBtn.data('id');
    applyData(msg, url, id);
})

// 事件请求
function bAlert(msg, url,data) {
    $.bConfirm({
        title: '提示',
        content: msg,
        onConfirm: function onConfirm() {
            $.ajax({
                type: "post",
                url: url,
                data: data,
                success: function(data) {
                    var res = JSON.parse(data);
                    if (res.code == 1) {
                        $.bAlert(res.msg);
                        setTimeout(function() {
                            window.location.replace(res.url);
                        }, 1500)
                    } else {
                        $.bAlert(res.msg);
                    }
                }
            });
        },
        onHide: function onHide() {},
        onConfirmText: '确认',
        cancalText: '取消'
    })
}

// 全选
chboxAll.on('change', function() {
    if ($(this).prop('checked')) {
        chboxAll.prop('checked', true);
        chboxOne.prop('checked', true);
    } else {
        chboxAll.prop('checked', false);
        chboxOne.prop('checked', false);
    }
});
// 单个商品选中
chboxOne.on('change', function() {
    if ($(this).prop('checked')) {
        setCheckAll();
    } else {
        chboxAll.prop('checked', false);
    }
});
// 判断所是否全部选中
function setCheckAll() {
    var notCheck = $('.chbox-one:not(:checked)');
    if (notCheck.length <= 0) {
        chboxAll.prop('checked', true);
    } else {
        chboxAll.prop('checked', false);
    }
}

// 申请作废
function applyData(msg, url, id) {
    var arr = [],
        checked = $('.chbox-one:checked');

    if (checked.length <= 0) {
        return $.bAlert('请选择开票商品');
    }

    $.each(checked, function(n, elem) {
        arr.push(elem.value);
    });
    var data = {
        id:id,
        ids:arr
    }
    bAlert(msg, url, data);
}


// 邮寄单号保存
$('.keep').on('click', function() {
    var iPt = $(this).siblings('input'),
        _that = $(this),
        url = '/Buyer/Invoice/updateInvalidInvoice',
        arr1=[],
        arr2=[];
        arr1[0] = iPt.val() ;
        arr2[0] = _that.data('did');
    var data = {
            nums: arr1,
            id: _that.data('id'),
            ids: arr2
        }
    if (!iPt.val()) {
        return $.bAlert('邮寄单号有误');
    } 
    keepData(data,url);
})

function keepData(data,url) {
    $.ajax({
        type: "post",
        url: url,
        data: data,
        success: function (data) {
            var res = JSON.parse(data);
            if (res.code == 1) {
                $.bAlert(res.msg);
                setTimeout(function () {
                    window.location.replace(res.url);
                }, 1500)
            } else {
                $.bAlert(res.msg);
            }
        }
    });
}

// 查看发票
var x_main_img = $('.x-main-img');
$('.findInvoice').on('click',function(){
    if ($(this).data('src') != '') {
        x_main_img.show();
        x_main_img.find('img').prop('src', $(this).data('src'));
    }
})
x_main_img.find('p').find('span').on('click', function () {
    x_main_img.hide();
})