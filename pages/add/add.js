Page({
  data: {
    todayDate: "2025年2月11日",
    currentMonth: "2025年2月", // 当前月份
    currentYear: "2025年", // 当前年份
    days: [], // 月份的天数
    selectedDate: null, // 选中的日期
    preselectedDate: null, // 之前选中的日期
    dayInfo: "", // 显示的附加信息
    today: null, // 当前日期
    year: 2025, // 当前年份
    month: 2, // 当前月份
    tasks: {
      "task1": [],
      "task2": [],
      "task3": [],
      "task4": []
    },
    newTaskContent: '', // 输入框内容
    isModalVisible: false,
    currentSection: "", // 当前操作的计划板块
    isModalTimeVisible: false,
    defaultDate: '',
    startDate: '2025-02-12',  // Default start date
    startTime: '12:00',        // Default start time
    endDate: '2025-02-12',  // Default start date
    endTime: '12:00',          // Default end time
    showFullCalendar: false,  // 是否展开显示所有日期
    currentPeriod: [],   // 当前显示的日期周期（7天）
    touchStartX: 0,      // 触摸开始时的X轴坐标
    touchEndX: 0,        // 触摸结束时的X轴坐标
    adjustDays: [],
  },

  onLoad() {
    const tasks = wx.getStorageSync('tasks') || {};  // 获取缓存中的任务数据，如果没有则使用空对象
    this.getCurrentMonth();
    this.generateCalendar();
    // 获取当前日期
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // 月份是从0开始的，所以需要加1
    const year = today.getFullYear();
    const todayDate = year + "年" + month + "月" + day + "日";
    this.setData({
      todayDate: todayDate, // 设置今天的日期
      today: day, // 设置当前日期
      month: month, // 设置当前月份
      year: year, // 设置当前年份
      currentYear: `${year}年`, // 设置当前显示的年份
      currentMonth: `${year}年${month}月`, // 设置当前显示的年月
      tasks,
    });
    this.updateCalendar();
    // 处理 days 数组，去除 null，并截取前 7 天
    let filteredDays = this.data.days.filter(day => day !== null).slice(0, 7);
    this.setData({
      filteredDays: filteredDays, // 将处理后的数据存储到 data 中
    });
    this.setSelectedPeriod(0);  // 设置默认选中的周期
  },

  // 设置当前周期（7天一周期）
  setSelectedPeriod: function(e) {
    console.log(this.data.selectedDate)
    let temp = 1;
    let today = 1;
    if (this.data.currentPeriod[6] + 1 <= 7){
      today = this.data.currentPeriod[6] + 1;
    }
    if (this.data.todayDate == this.data.currentMonth + this.data.today + "日") {
      temp = 0;
      today = this.data.today;
    } else if (e == 2 && (this.data.todayDate != this.data.currentMonth + this.data.today + "日")) {
      temp = 2;
      if (this.data.currentPeriod[0] <= 7) {
        today = this.data.days.length + this.data.currentPeriod[0] - 7;
      } else {
        today = this.data.currentPeriod[0] - 7;
      }
    }
    let startDate = 0;  // 获取当前日期所在周期的第一个日期
    if (!temp) {
      startDate = today - (today % 7) + 1;
    } else if (temp == 1) {
      startDate = today;
    } else {
      startDate = today;
    };
    let period = [];
    for (let i = startDate; i < startDate + 7; i++) {
      if (i <= this.data.days.length) {
        period.push(i);
      }
    }

    // 如果周期天数不足7天，自动补充下个月的日期，确保周期完整
    if (period.length < 7) {
      let remainingDays = 7 - period.length;
      let nextMonth = this.data.currentMonth + 1;
      if (nextMonth > 12) {
        nextMonth = 1;
        this.data.currentYear++;
      }

      for (let i = 1; i <= remainingDays; i++) {
        period.push(i);
      }
    }
    this.setData({
      preselectedDate: this.data.selectedDate,
      currentPeriod: period,
      selectedDate: this.data.currentMonth + period[0] + '日',  // 默认选中周期的第一个日期
    });
  },

  // 触摸开始事件
  onTouchStart: function(e) {
    this.setData({
      touchStartX: e.changedTouches[0].pageX,  // 记录触摸开始时的X轴坐标
    });
  },

  // 触摸结束事件
  onTouchEnd: function(e) {
    this.setData({
      touchEndX: e.changedTouches[0].pageX,    // 记录触摸结束时的X轴坐标
    });
    this.handleSwipe();
  },

  // 处理滑动方向
  handleSwipe: function() {
    const startX = this.data.touchStartX;
    const endX = this.data.touchEndX;

    if (endX - startX > 50) {
      // 向右滑动（上一周期）
      this.changePeriod('right');
    } else if (startX - endX > 50) {
      // 向左滑动（下一周期）
      this.changePeriod('left');
    }
  },

   // 更改日期周期
   changePeriod: function(direction) {
    let preselectedDate = this.data.selectedDate;
    let currentPeriodStart = this.data.currentPeriod[0];  // 获取当前周期的开始日期
    let newPeriodStart = direction === 'left' ? currentPeriodStart + 7 : currentPeriodStart - 7;

    // 防止 newPeriodStart 小于最小有效日期范围
    if (newPeriodStart < 1) {
      let day = parseInt(preselectedDate.match(/(\d+)日/)[0], 10);
      newPeriodStart = day;  // 如果超过最大日期，切换到上个月
    }

    // 防止 newPeriodStart 超过最大有效日期范围
    if (this.data.days.length % 7 != 0 && newPeriodStart > this.data.days.length) {
      let day = parseInt(preselectedDate.match(/(\d+)日/)[0], 10);
      newPeriodStart = day;  // 如果超过最大日期，切换到下个月
    } else if (this.data.days.length % 7 != 0 && newPeriodStart > this.data.days.length - (this.data.days.length % 7) + 1) {
      newPeriodStart = this.data.days.length - (this.data.days.length) + 1;  // 确保至少有7天
    } else if (this.data.days.length % 7 == 0 && newPeriodStart > this.data.days.length - 7) {
      newPeriodStart = this.data.days.length - 6;  // 确保至少有7天
    }

    let newPeriod = [];
    for (let i = newPeriodStart; i < newPeriodStart + 7; i++) {
      // 如果当前月份的日期还没有达到7天，开始补充下个月的日期
      if (i <= this.data.days.length) {
        newPeriod.push(i); // 当前月的日期
      } else {
        // 计算下个月的日期
        let nextMonthDay = i - this.data.days.length;
        let nextMonth = this.data.currentMonth + 1;  // 下一个月
        if (nextMonth > 12) {
          nextMonth = 1;  // 如果是12月，跳转到1月
          this.data.currentYear++;  // 年份加1
        }
        newPeriod.push(nextMonthDay);  // 下个月的日期
      }
    }

    // 如果周期天数不足7天，自动补充下个月的日期，确保周期完整
    if (newPeriod.length < 7) {
      let remainingDays = 7 - newPeriod.length;
      let nextMonth = this.data.currentMonth + 1;
      if (nextMonth > 12) {
        nextMonth = 1;
        this.data.currentYear++;
      }

      for (let i = 1; i <= remainingDays; i++) {
        newPeriod.push(i);
      }
    }

    this.setData({
      currentPeriod: newPeriod,
      selectedDate: this.data.currentMonth + newPeriod[0] + '日',  // 更新为新周期的第一个日期
    });

    let selectedDate = this.data.selectedDate

    // 判断是否需要切换到下个月
    if (direction === 'left' && (preselectedDate == selectedDate)) {
      this.switchToNextMonth();  // 只有在达到下个月时才会切换
      return;
    }

    // 判断是否需要切换到上个月
    if (direction === 'right' && (preselectedDate == selectedDate)) {
      this.switchToPreviousMonth();  // 切换到上个月
      return;
    }
  },

  // 切换到下个月
  switchToNextMonth: function() {
    // 切换到下一个月的逻辑
    const currentMonthArr = this.data.currentMonth.split('年');
    let currentYear = parseInt(currentMonthArr[0]);
    let currentMonth = parseInt(currentMonthArr[1].split('月')[0]);
    currentMonth += 1;  // 切换到下个月

    if (currentMonth > 12) {  // 如果当前月超过12月，切换到下一年
      currentMonth = 1;
      currentYear += 1;
    };

    const newMonth = currentYear + '年' + currentMonth + '月';
    const newYear = currentYear + '年';

    this.setData({
      currentMonth: newMonth,  // 更新当前月份
      currentYear: newYear,
      year: currentYear,
      month: currentMonth,
      days: this.updateDaysForNextMonth(currentMonth), // 获取下个月的日期
    });

    this.setSelectedPeriod(1);  // 更新下个月的周期
  },

  // 切换到上个月
  switchToPreviousMonth: function() {
    const currentMonthArr = this.data.currentMonth.split('年');
    let currentYear = parseInt(currentMonthArr[0]);
    let currentMonth = parseInt(currentMonthArr[1].split('月')[0]);

    currentMonth -= 1;  // 切换到上个月

    if (currentMonth < 1) {  // 如果当前月小于1月，切换到上一年
      currentMonth = 12;
      currentYear -= 1;
    }

    const newMonth = currentYear + '年' + currentMonth + '月';
    const newYear = currentYear + '年';

    this.setData({
      currentMonth: newMonth,  // 更新当前月份
      currentYear: newYear, 
      year: currentYear,
      month: currentMonth,
      days: this.updateDaysForPreviousMonth(currentMonth), // 获取上个月的日期
    });

    this.setSelectedPeriod(2);  // 更新上个月的周期
    this.updateCalendar();
  },

  // 获取下个月的日期
  updateDaysForNextMonth: function(month) {
    // 根据月份获取该月的天数，这里你需要提供逻辑来获取具体的天数
    // 例如，你可以根据月份判断天数（28天，30天，31天等）
    let daysInNextMonth = 30;  // 这个是示例，你可以根据具体的月份调整
    if (month === 2) {
      daysInNextMonth = 28;  // 2月处理
    } else if ([4, 6, 9, 11].includes(month)) {
      daysInNextMonth = 30;  // 4月、6月、9月、11月有30天
    } else {
      daysInNextMonth = 31;  // 其他月份有31天
    }

    let days = [];
    for (let i = 1; i <= daysInNextMonth; i++) {
      days.push(i);
    }
    this.onNextMonth();

    return days;
  },

  // 获取上个月的日期
  updateDaysForPreviousMonth: function(month) {
    let daysInPrevMonth = 30;  // 这个是示例，你可以根据具体的月份调整
    if (month === 2) {
      daysInPrevMonth = 28;  // 2月处理
    } else if ([4, 6, 9, 11].includes(month)) {
      daysInPrevMonth = 30;  // 4月、6月、9月、11月有30天
    } else {
      daysInPrevMonth = 31;  // 其他月份有31天
    }

    let days = [];
    for (let i = 1; i <= daysInPrevMonth; i++) {
      days.push(i);
    }

    return days;
  },
    
  // 更新日历显示
  updateCalendar() {
    const { year, month } = this.data;
    const firstDay = new Date(year, month - 1, 1); // 获取该月第一天
    const lastDay = new Date(year, month, 0); // 获取该月最后一天
    const daysInMonth = lastDay.getDate(); // 获取该月的天数
    const days = [];

    // 生成日期数组
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    this.setData({
      days: days, // 更新日期数组
    });

    const firstDayOfMonth = new Date(this.data.year, this.data.month - 1, 1);
    let firstDayWeek = firstDayOfMonth.getDay(); // 0 到 6，0是周日，1是周一，依此类推

    // 调整周的起始日为周六 (0: Saturday, 1: Sunday, 2: Monday, ...)
    firstDayWeek = (firstDayWeek + 1) % 7; // 将周日（0）转换为 1，周一（1）转换为 2 ...，周六（6）转换为 0

    // 获取上个月的最后一天
    let prevMonthLastDay = new Date(this.data.year, this.data.month - 1, 0).getDate();
    // 获取本月的总天数
    const currentMonthLastDay = new Date(this.data.year, this.data.month, 0).getDate();

    // 调整日期数组
    const adjustedDays = [];

    // 计算需要填充的上个月的天数
    const prevMonthDays = [];
    for (let i = prevMonthLastDay - firstDayWeek + 1; i <= prevMonthLastDay; i++) {
      prevMonthDays.push(i); // 填充上个月的日期
    }

    // 正序填充上个月的日期
    adjustedDays.push(...prevMonthDays); // 将上个月的日期按顺序填充到前面

    // 将本月的日期添加到 adjustedDays
    adjustedDays.push(...this.data.days);

    // 如果最后一行未满七天，填充下个月的日期
    const lastWeekDays = adjustedDays.length % 7;
    if (lastWeekDays !== 0) {
      const nextMonthDays = [];
      for (let i = 1; i <= 7 - lastWeekDays; i++) {
        nextMonthDays.push(i); // 填充下个月的日期
      }
      adjustedDays.push(...nextMonthDays);
    }

    // 输出调整后的日期数组
    console.log(adjustedDays);

    this.setData({
      adjustDays: adjustedDays,
    });
  },

  // 切换日历展开/折叠
  toggleCalendar() {
    this.setData({
      showFullCalendar: !this.data.showFullCalendar
    });
  },

  // 切换到上一年
  onPrevYear() {
    let { year, month } = this.data;
    year--;
    this.setData({
      year: year,
      currentYear: `${year}年`, // 更新显示的年份
      currentMonth: `${year}年${month}月`, // 更新显示的年月
    });
    this.updateCalendar();
  },

  // 切换到下一年
  onNextYear() {
    let { year, month } = this.data;
    year++;
    this.setData({
      year: year,
      currentYear: `${year}年`, // 更新显示的年份
      currentMonth: `${year}年${month}月`, // 更新显示的年月
    });
    this.updateCalendar();
  },

  // 切换到上一个月
  onPrevMonth() {
    let { year, month } = this.data;
    month--;
    if (month < 1) {
      month = 12;
      year--;
    }
    this.setData({
      year: year,
      month: month,
      currentMonth: `${year}年${month}月`,
    });
    this.updateCalendar();
  },

  // 切换到下一个月
  onNextMonth() {
    let { year, month } = this.data;
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
    this.setData({
      year: year,
      month: month,
      currentMonth: `${year}年${month}月`,
    });
    this.updateCalendar();
  },

  // 获取当前月份并生成日历
  getCurrentMonth() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    this.setData({
      currentMonth: `${year}年${month}月`
    });
  },

  // 生成当前月份的日历
  generateCalendar() {
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    this.setData({
      days: days
    });
  },

  // 处理点击日期事件
  onDayClick(e) {
    const day = e.currentTarget.dataset.day;
    this.setData({
      selectedDate: `${this.data.currentMonth}${day}日`,
      dayInfo: `你选择的日期是：${day}号。`
    });
  },

  // 点击编辑计划时，弹出弹窗
  onEditPlan(e) {
    const section = e.currentTarget.dataset.section;
    this.setData({
      currentSection: section,
      isModalVisible: true,
    });
  },

  // 关闭弹窗
  closeModal() {
    this.setData({
      isModalVisible: false
    });
  },

  // 关闭弹窗
  closeModalTime() {
    this.setData({
      isModalTimeVisible: false,
    });
  },

  // 新增计划
  addNewTask(e) {
    // 使用 wx.showModal 来获取用户输入
    wx.showModal({
      title: '请输入计划内容',
      editable: true,
      placeholderText: '请填写计划内容',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            isModalVisible: false,  // 隐藏任务输入蒙版
            isModalTimeVisible: true,  // 显示时间选择蒙版
          });
          const content = res.content;  // 获取用户输入
          if (content) {
            const { startDate, startTime, endDate, endTime } = this.data;
            const newTask = { content, startDate, startTime, endDate, endTime };
            const tasks = this.data.tasks;
            const section = this.data.currentSection;

            // 确保 tasks[section] 存在且是一个数组，如果不存在则初始化为空数组
            if (!tasks[section]) {
              tasks[section] = [];  // 初始化为空数组
            }

            tasks[section].push(newTask);  // 添加新任务

            // 更新任务数据到本地缓存
            wx.setStorageSync('tasks', tasks);

            // 显示时间选择器
            this.setData({
              content: content,       // 存储任务内容
              tasks,
            });
          } else {
            wx.showToast({
              title: '请输入内容',
              icon: 'none',
            });
          }
        }
      }
    });
  },

  // 删除任务
  deleteTask(e) {
    const index = e.currentTarget.dataset.index;
    const section = this.data.currentSection;
    const tasks = this.data.tasks;

    // 确保 tasks[section] 存在且是一个数组
    if (tasks[section]) {
      tasks[section].splice(index, 1); // 删除指定索引的任务
    }

    // 更新任务数据到本地缓存
    wx.setStorageSync('tasks', tasks);

    this.setData({
      tasks
    });
  },

  // Handle start date change
  onStartDateChange(e) {
    this.setData({
      startDate: e.detail.value
    });
  },

  // Handle start time change
  onStartTimeChange(e) {
    this.setData({
      startTime: e.detail.value
    });
  },

  // Handle end date change
  onEndDateChange(e) {
    this.setData({
      endDate: e.detail.value
    });
  },

  // Handle end time change
  onEndTimeChange(e) {
    this.setData({
      endTime: e.detail.value
    });
  },

  // 确认按钮，保存并关闭弹窗
  confirmSelection: function (event) {
    // 关闭弹窗
    this.setData({
      isModalTimeVisible: false,
      isModalVisible: true,
    });
  },

  onInputChange: function (event) {
    // 更新输入框内容
    this.setData({
      newTaskContent: event.detail.value
    });
  },
});

