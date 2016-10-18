// 所有数据以localStorage中为基准
// 如何获取用户点击的元素在数组DOM元素中的索引, 自定义属性中添加标识来获取元素索引
// hover事件待学习

// model
var todoList = {};

todoList.controler = {
    init: function() {
        // 初始化时，读取localStorage中任务数组，
        // 数组长度不为空，渲染taskList列表
        // 为空，隐去姓名，不显示列表内容和footer
        if (window.localStorage.getItem('taskList')) {
            taskList = JSON.parse(window.localStorage.getItem('taskList')); // 获取 taskList数组
            this.render(taskList, 'taskList');
        }
    },
    getLeft: function() {  // 获取未完成task数目
        var taskList = todoList.model.taskList;
        var num = 0;
        taskList.forEach(function(currentValue,index,arr) {
            num = currentValue.completed ? num : num + 1;
        });
        console.log(num);
        return num;
    },
    hasCompletedTask: function() {
        var taskList = todoList.model.taskList;
        for(var i = 0, len = taskList.length; i < len; i++) {
            if(taskList[i].completed === true) {
                return true;
            }
        }
        return false;
    },
    addTask: function(taskTxt) {
        var newTaskData = {};
        newTaskData.value = taskTxt;
        newTaskData.completed = false;
        newTaskData.id = getId();
        todoList.model.taskList.push(newTaskData);
        window.localStorage.setItem('taskList', JSON.stringify(todoList.model.taskList));
        todoList.view.render('.taskList');
        todoList.view.setLeft(this.getLeft());
    },
    completeTask: function(index) {
        // 修改localStorage和todoList.model.taskList
        var tmptaskList = todoList.model.taskList ;
        tmptaskList[index].completed = !tmptaskList[index].completed;
        todoList.model.taskList = tmptaskList;
        localStorage.setItem('taskList',JSON.stringify(tmptaskList));
        // 判断taskList中是否包含已完成task
        if(this.hasCompletedTask()) {  // 可以再判断一下deleteCompleted是否已经显示，无需再设置
            $(".deleteCompleted").css('display','inline-block');
        } else {
            $(".deleteCompleted").css('display','none');
        }
        todoList.view.render('.taskList');
        todoList.view.setLeft(this.getLeft());
    },
    showAll: function() {
        // 获取todoList
        var taskList = JSON.parse( window.localStorage.getItem('taskList') );
        todoList.view.render('.taskList',taskList);
        todoList.view.setLeft(this.getLeft());
    },
    showActive: function() {
        var taskList = JSON.parse(window.localStorage.getItem('taskList'));
        var result = [];
        // 处理数据，获取所有completed为false的task
        taskList.forEach(function(currentValue,index,arr) {
            if ( !currentValue.completed ) {
                result.push(currentValue);
            }
        });
        console.log(result);
        todoList.view.render('.taskList',result);
        todoList.view.setLeft(this.getLeft());
    },
    showCompleted:  function() {
        var taskList = JSON.parse(window.localStorage.getItem('taskList'));
        var result = [];
        // 处理数据，获取所有completed为false的task
        taskList.forEach(function(currentValue,index,arr) {
            if ( currentValue.completed ) {
                result.push(currentValue);
            }
        });
        console.log(result);
        todoList.view.render('.taskList',result);
        todoList.view.setLeft(this.getLeft());
    },
    clearCompleted: function() {
        var taskList = JSON.parse(window.localStorage.getItem('taskList'));
        var result = [];
        taskList.forEach(function(currentValue,index,arr) {
            if ( !currentValue.completed ) {
                result.push(currentValue);
            }
        });
        todoList.model.taskList = result;
        window.localStorage.setItem('taskList',JSON.stringify(result));
        todoList.view.render('.taskList');
        todoList.view.setLeft(this.getLeft());
    }
};


// view
todoList.view = {

    // 添加新的task
    add: function(taskTxt) {
        todoList.controler.addTask(taskTxt);
    },
    // 删除task,
    // task所在DOM元素数组中的索引与在taskList中的索引相同
    remove: function() {
        var index = 0;
        todoList.controler.removeTask();
    },
    complete: function(index) {
        todoList.controler.completeTask(index);
    },
    showAll: function() {
        todoList.controler.showAll();
    },
    showActive: function() {
        todoList.controler.showActive();
    },
    showCompleted: function() {
        todoList.controler.showCompleted();
    },
    clearCompleted: function() {
        todoList.controler.clearCompleted();
    },
    /**
     * [render description]
     * @method render
     * @param  {[Object]} taskList [根据taskList数组渲染ul.taskList]
     * @param  {[String]} context  [上下文，选择器]
     * @return {[type]}          [description]
     */
    render: function(context,taskList) {
        var taskList = taskList || todoList.model.taskList;
        var counter = 0 ; // 计数器，用于生成task的DOM元素时计数用
        $(context).html(''); // 清空之前的
        taskList.forEach(function(currentValue, index, arr) {
            var taskDOM = "<span><input class='toggle' type='checkbox' id='task_" + counter + " '><label class='content' for='task_" + counter + " '></label></span>";
            $(taskDOM).appendTo($(context)); // 插入模版
            $(context + ' span>.toggle').last().attr('data-index',counter);
            counter++;
            $(context + ' .content').last().text(currentValue.value); //获取插入的任务DOM节点并设置label内容
            // 在动态生成的元素创建后添加事件监听
            if (currentValue.completed == true) {
                $(context + ' .toggle').last().attr('checked', 'checked');
                $(context + ' .content').last().addClass('completed')
            }
        })
    },
    setLeft: function(num) {   // 设置显示的未完成task的数目
        $('.unCompletedNum').html(num);
    }
};

todoList.model = {
    taskList: [],
}

$('.newTask').keypress(function(event) {
    if (event.keyCode == 13) { // 回车符
        // 判断输入字符长度
        var inputTxt = event.target.value;
        if (inputTxt.length) {
            todoList.view.add(event.target.value);
        } else { // 用户输入为空，提示用户输入
            if (!$('header .prompt').length) {
                $('.newTask').after("<span class='prompt'>内容长度不能为0</span>");
            }
        }
        //执行完毕后需要清空输入框，防止用户错误重复回车
    }
})

/**
 * 修改task状态
 *
 */
$('.taskList').on('click','.toggle',function() {
    // 获取到索引 $(this).attr('data-index')
    todoList.view.complete($(this).attr('data-index'));

});


/**
 * hover触发显示隐藏removeTaskIcon
*/

addEvent($('.taskList')[0],'mouseover',function(event) {
    alert(event.target);
})

/**
 *  删除task
 */
$('.taskList').on('click','.removeIcon',function() {

})

/**
 *  显示全部
 */
$('.All').on('click',function() {
    todoList.view.showAll();
})
/**
 * 显示待完成
 */
$('.Active').on('click',function() {
    todoList.view.showActive();
})
/**
 * 显示已完成
 */
$('.Completed').on('click',function() {
    todoList.view.showCompleted();
})
/**
 * 删除已完成的
 */
$('.deleteCompleted').on('click',function() {
    todoList.view.clearCompleted();
    $(".deleteCompleted").css('display','none');
})

// 以下为helper函数

function addEvent(ele, type, handler) {
    if (window.addEventListener) {
        window.addEventListener(ele, type, handler);
    } else if (ele.attachEvent) {
        ele.attachEvent(type, handler);
    } else {
        ele['on' + type] = handler
    }
}

function getId() {
    return parseInt(10000000000 * Math.random());
}
