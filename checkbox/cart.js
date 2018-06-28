require('buyerCss/base.css');
require('buyerCss/public.scss');
require('buyerCss/m_public.scss');
require('buyerCss/x_style.scss'); 
require('buyerCss/x_media.scss');
require('buyerCss/public_media.scss');
require('buyerCss/x_table_col.scss');

var $ = require("expose-loader?$!jquery"); 
require("lib/jquery.form.min"); 
require('lib/jquery.lazyload');
require('lib/jquery.ellipsis');
require('../common/page');
var util = require('../common/util');
require('../common/search'); 
require('../common/alert');
require('../common/setCity');


$("img.lazy").lazyload({
    effect: "fadeIn",
    threshold: 180
});

$('.ellipsis-two').ellipsis({
    row: 2
});

$('.ellipsis-one').ellipsis();
 

var cartForm = $('#cart-form'), // 购物车表单
    checkAll = $('.check-all', cartForm),
    partCheckAll = $('.part-check-all', cartForm),
    checkOne = $('.check-one', cartForm),
    stockLess = $('#stock-less', cartForm), // 库存不足
    totalNum = $('.total-select-num', cartForm),  // 全部数量
    totalPrice = $('.total-price', cartForm); // 合计价格

// 全选
checkAll.on('change', function() {
    if ($(this).prop('checked')) {
        partCheckAll.prop('checked', true);
        checkOne.prop('checked', true);
        checkAll.prop('checked', true);
    } else {
        partCheckAll.prop('checked', false);
        checkOne.prop('checked', false);
        checkAll.prop('checked', false);
    }
    setTotalNum();
    setTotalPrice();
});

// 部分全选
partCheckAll.on('change', function() {
    var target = $(this).data('target'); // 所有的子商品
    if ($(this).prop('checked')) {
        $('.' + target).prop('checked', true);
        setCheckAll();
    } else {
        $('.' + target).prop('checked', false);
        checkAll.prop('checked', false);
    }
    setTotalNum();
    setTotalPrice();
});

// 单个商品选中
checkOne.on('change', function() {
    if ($(this).prop('checked')) {
        setCheckAll(); 
    } else {
        checkAll.prop('checked', false);
        setPartCheckAll();
    }
    setTotalNum();
    setTotalPrice();
});

// 判断所有商品是否全部选中
function setCheckAll() {
    var notCheck = $('.check-one:not(:checked)', cartForm);
    if (notCheck.length <= 0) {
        partCheckAll.prop('checked', true); 
        checkAll.prop('checked', true);
    } else {
        checkAll.prop('checked', false);
        setPartCheckAll();
    }
}

// 判断部分子商品是否全部选中
function setPartCheckAll() {
    $.each(partCheckAll, function(n, elem) {
        var target = $(elem).data('target'),
            notCheck = $('.' + target + ':not(:checked)', cartForm);

        if (notCheck.length <= 0) {
            $(elem).prop('checked', true);
        } else {
            $(elem).prop('checked', false);
        }
    });
}

// 设置库存不足的数量
function setStockLess() {
    num = 0;
    $.each(checkOne, function(n, elem) {
        if ($(elem).parents('tr').find('.stock').hasClass('stock-less')) {
            console.log(elem.text());
            num++;
        }
    });

    stockLess.text('（'+ num +'）');
}

// 设置选中商品数量
function setTotalNum() {
    var len = $('.check-one:checked', cartForm).length; 
    totalNum.text(len);
}

// 设置合计价格
function setTotalPrice() {
    var checked = $('.check-one', cartForm),
        priceAll = 0; 

    $.each(checked, function(n, elem) {
        var input = $(elem).parents('tr').find('.num-input'),
            num = +input.val(),
            price = +input.data('price'),
            trPrice = num * price;

        $(elem).parents('tr').find('.tr-total-price').text('￥' + trPrice.toFixed(2));

        if ($(elem).prop('checked')) {
            priceAll += trPrice;        
        }
    });

    totalPrice.text('￥' + priceAll.toFixed(2));
}

// 监听数量变化
$('.num-input').on('input propertychange', function() {
    var num = $(this).val(),
        preNum = $(this).data('pre'),
        stock = +$(this).data('stock'),
        stockElem = $(this).siblings('.stock');

    preNum = preNum ? preNum : 0;

    if (!/^(?:|[0-9]{1,}\d*)$/.test(num)) {
       $(this).val(preNum); 
       num = preNum;
    } else { 
        $(this).data('pre', num);
    }

    // if (num <= stock) {
    //     stockElem.removeClass('stock-less');
    // } else {
    //     stockElem.addClass('stock-less');
    // } 
    // 输入框输入的数量 > 库存时，值直接变成最大库存
    if (num > stock) {
        $(this).val(stock);
        $(this).data('pre', stock);
    }
    setStockLess();
    setTotalPrice();
});

// 为数量input框绑定change事件， 请求后台保存数量
$('.num-input').on('change', function() {
    var num = $(this).val(),
        mid = $(this).parents('tr').find('.check-one').val();

    if (num == '') {
        $(this).val(1);
        num = 1;
        $(this).trigger('input');
        $(this).trigger('propertychange');
    }

    $.ajax({
        type: 'post',
        url: '/Buyer/Cart/shopCartCut',
        data: {mid: mid, num: num},
        dataType: 'json',
        success: function(json) {
            if (json.code != 1) {
                $.bAlert('设置数量失败');
            } 
        },
        error: function() {
            $.bAlert('设置数量失败');
        }
    });
});


// 下单操作
var options = {  
       success: success,      //提交后的回调函数  
       error: error, 
       dataType: 'json',           //html(默认), xml, script, json...接受服务端返回的类型  
       clearForm: false,          //成功提交后，清除所有表单元素的值  
       resetForm: false,          //成功提交后，重置所有表单元素的值  
       timeout: 10000               //限制请求的时间，当请求大于10秒后，跳出请求  
    };
// 下单成功
function success(json) {  
    if (json.code == 1) {
        window.location.href = json.url; 
    } else {
        $.bAlert(json.msg);
    }
}

// 下单失败
function error() {  
    $.bAlert('保存失败', 'error');
}

function validate() { 
    var checked = $('.check-one:checked'),
        stockLess = checked.parents('tr').find('.stock-less'),
        status = true;
    if (checked.length <= 0) {
       $.bAlert('请选择要购买的商品');
        return false; 
    } 
 
    for (var i = 0, len = checked.length; i < len; i++) {
        var elem = checked.eq(i),
            num = elem.parents('tr').find('.num-input').val();

        if (num <= 0) {
            status = false;
            window.scrollTo(0, elem.offset().top);
            break;
        }
    }

     // 校验是否选中了库存不足的商品
    if (stockLess.length > 0) {  
        window.scrollTo(0, stockLess.eq(0).offset().top - 100);
        $.bAlert('部分选中的商品库存不足！');
        status = false;
    } 
    return status;
}

$('.confirm-order').on('click', function() {
    if (validate()) {
        // cartForm.ajaxSubmit(options);.0   00.+
        // 
        var items = $('.check-one', cartForm);

        $.each(items, function(n, item) {
            if (!$(this).prop('checked')) {
                $(this).parents('tr').find('.num-input').prop('disabled', true);
            }
        });

        cartForm.submit();
    }
});



// 删除操作
var delGoods = $('.del-goods'); // 删除购物车操作
delGoods.on('click', function() {
    var id = $(this).data('id');
    if (id) {
        delCartGoods(id);
    }
});

// 批量删除
$('.del-goods-all').on('click', function() {
    var arr = [],
        checked = $('.check-one:checked');

    if (checked.length <= 0) {
        return $.bAlert('请至少选择一条商品');
    }    

    $.each(checked, function(n, elem) {
        arr.push(elem.value);
    });

    arr = arr.join(',');
    delCartGoods(arr);
});

/**
 * 删除购物车商品
 * @param  {[string]} id [购物车商品id ‘，’链接]
 * @return {[type]}    [description]
 */
function delCartGoods(id) {
    $.ajax({
        type: 'post',
        url: '/Buyer/Cart/shopCartDel',
        dataType: 'json',
        timeout: 10000,
        data: {mids: id},
        success: function(json) {
            if (json.code == 1) { 
                location.reload(true);
            } else {
                $.bAlert('删除失败');
            }
        },
        error: function() {}
    });
}

  