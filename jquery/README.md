TODO list MVC jquery版本

尝试自定义事件

MVC模式：

controler 保存控制逻辑
model 保存数据模型及其直接修改

MVC逻辑归纳：
view调用指令到controler
controler完成指定的业务逻辑后，修改model
model将新的数据发送给view，view更新用户界面



初始化：
获取localStorage中taskList数组是否存在数据，不存在则不做渲染，否则调用view的render方法

添加：
view层输入框回车触发事件，调用view的add指令到controler，
controler调用addTask方法，修改model的taskList数组
model的变化调用view的render方法，更新用户界面

删除：
view层删除按钮点击触发时间，调用view的remove指令到controler，
controler调用removeTask方法，修改model的taskList数组
model的变化调用view的render方法，更新用户界面

修改task状态为完成：
view层checkbox状态发生变化触发事件，调用view的complete指令到controler，
controler调用complete方法，修改model的taskList数组中对应task的状态
model的变化调用view的render方法，更新用户界面，同时修改统计数据

显示指定状态下的todoList(所有，活动，完成的)：
view层三种按钮点击触发事件，调用view的showAll/showActive/showCompleted 指令到controler，
controler调用 showAll/showActive/showCompleted 方法，获得all/active/completed数组
model中数组传入render方法，更新用户界面

清除完成的task:
view层点击clear completed按钮，触发事件，调用clearCompleted指令到controler，
controler调用clearCompleted方法，修改model的taskList数组
model的变化调用view的render方法，更新用户界面






事件委托可以使得还未创建的子节点出触发指定的事件

删除task 待分割代码到view和controler模块中

技术难点：

生成DOM节点，并可以触发mouseover事件
