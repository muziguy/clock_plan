import lottie from 'lottie-miniprogram'

Page({
  data: {
    animationData_date: {},
    lastSelectedDate: "", // 上次选中的日期
    animationData_close: {},
    animationStarted: false,  // 控制动画是否开始的状态
    clicked: false,  // 新增的控制动画的状态
    animationData: {},
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
    all_tasks: {},
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

  onShow() {
    // 页面切换完成后再执行
    this.setData({ animationStarted: true });
    setTimeout(() => {
      if (this.data.animationStarted) {
        this.loadAnimation()
      }
    }, 1000);
  },

  loadAnimation: function() {
    wx.createSelectorQuery().selectAll('#c1').node(res => {
      const canvas = res[0].node
      const context = canvas.getContext('2d')

      canvas.width = 300
      canvas.height = 300

      lottie.setup(canvas)
      this.ani = lottie.loadAnimation({
        loop: true,
        autoplay: true,
        animationData: require('../../json/car-loading3-data.js'),
        rendererSettings: {
          context,
        },
      })
      this._inited = true
    }).exec()
    wx.createSelectorQuery().selectAll('#c2').node(res => {
      const canvas = res[0].node
      const context = canvas.getContext('2d')

      canvas.width = 300
      canvas.height = 300

      lottie.setup(canvas)
      this.ani = lottie.loadAnimation({
        loop: true,
        autoplay: true,
        animationData: require('../../json/car-loading6-data.js'),
        rendererSettings: {
          context,
        },
      })
      this._inited = true
    }).exec()
    wx.createSelectorQuery().selectAll('#c3').node(res => {
      const canvas = res[0].node
      const context = canvas.getContext('2d')

      canvas.width = 300
      canvas.height = 300

      lottie.setup(canvas)
      this.ani = lottie.loadAnimation({
        loop: true,
        autoplay: true,
        animationData: require('../../json/car-loading4-data.js'),
        rendererSettings: {
          context,
        },
      })
      this._inited = true
    }).exec()
    wx.createSelectorQuery().selectAll('#c4').node(res => {
      const canvas = res[0].node
      const context = canvas.getContext('2d')

      canvas.width = 300
      canvas.height = 300

      lottie.setup(canvas)
      this.ani = lottie.loadAnimation({
        loop: true,
        autoplay: true,
        animationData: require('../../json/car-loading5-data.js'),
        rendererSettings: {
          context,
        },
      })
      this._inited = true
    }).exec()
  },

  onLoad() {
    const tasks = wx.getStorageSync('tasks') || {};  // 获取缓存中的任务数据，如果没有则使用空对象
    const all_tasksData = wx.getStorageSync('all_tasks') || {};
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
      all_tasks: all_tasksData,
    });
    this.updateCalendar();
    // 处理 days 数组，去除 null，并截取前 7 天
    let filteredDays = this.data.days.filter(day => day !== null).slice(0, 7);
    this.setData({
      filteredDays: filteredDays, // 将处理后的数据存储到 data 中
    });
    this.setSelectedPeriod(0);  // 设置默认选中的周期
    let originalDate = this.data.selectedDate;

    // 使用正则表达式来提取年、月、日
    let match = originalDate.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);

    if (match) {
      // 通过正则匹配的结果来重构日期为 "YYYY-MM-DD" 格式
      let year = match[1];
      let month = match[2].padStart(2, '0'); // 确保月份是两位数
      let day = match[3].padStart(2, '0');   // 确保日期是两位数
      
      // 生成目标格式
      let formattedDate = `${year}-${month}-${day}`;
      this.setData({
        startDate: formattedDate,
        endDate: formattedDate
      });
    } else {
      console.log("日期格式不匹配");
    }
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
      showFullCalendar: !this.data.showFullCalendar,
    });
    if (!this.data.showFullCalendar) {
      this.setData({ animationStarted: true });
      this.loadAnimation()
    }
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
    const tasks = wx.getStorageSync('tasks') || {};  // 获取缓存中的任务数据，如果没有则使用空对象
    const all_tasks = wx.getStorageSync('all_tasks') || {};
    console.log("all_tasks1111",all_tasks)
    this.setData({
      tasks,
      all_tasks
    })
    const day = e.currentTarget.dataset.day;
    const newSelectedDate = e.currentTarget.dataset.day;  // 获取选中的日期
    const lastSelectedDate = this.data.selectedDate;  // 获取上次选中的日期
    console.log("new1111111:",newSelectedDate)
    // 如果选中的日期和上次日期不同，才触发切换效果
    if (newSelectedDate !== lastSelectedDate) {
      this.setData({
        lastSelectedDate: lastSelectedDate,  // 更新上次选中的日期
        selectedDate: this.data.currentMonth + newSelectedDate + "日", // 更新选中的日期
      });

      // 创建动画实例
      const animation = wx.createAnimation({
        duration: 500,  // 动画的持续时间，稍后会根据差值来动态修改
        timingFunction: 'ease-in-out',  // 动画缓动效果
      });

      // 计算日期差值，决定切换的次数
      const dateDiff = this.calculateDateDifference(lastSelectedDate, newSelectedDate);

      // 根据日期差值来设置切换的次数
      const switchTimes = Math.abs(dateDiff);  // 切换的次数，取差值的绝对值

      // 动画开始前清除当前动画
      animation.translateX(0).step();

      // 按照日期差异的天数进行循环切换
      for (let i = 0; i < switchTimes; i++) {
        // 判断切换的方向
        if (dateDiff > 0) {
          // 向右切换
          animation.translateX('100%').step();
        } else {
          // 向左切换
          animation.translateX('-100%').step();
        }
        // 动画返回
        animation.translateX(0).step();
      }

      // 更新动画数据
      this.setData({
        animationData_date: animation.export(),
      });
    }
    console.log("this.data.selectedDate",this.data.selectedDate)
    console.log(this.data.all_tasks[this.data.selectedDate])

    this.setData({
      selectedDate: `${this.data.currentMonth}${day}日`,
      dayInfo: `你选择的日期是：${day}号。`,
      tasks: this.data.all_tasks[this.data.selectedDate] || {}
    });
    console.log(this.data.selectedDate, this.data.tasks);
    // 使用正则表达式来提取年、月、日
    let match = this.data.selectedDate.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);

    if (match) {
      // 通过正则匹配的结果来重构日期为 "YYYY-MM-DD" 格式
      let year = match[1];
      let month = match[2].padStart(2, '0'); // 确保月份是两位数
      let day = match[3].padStart(2, '0');   // 确保日期是两位数
      
      // 生成目标格式
      let formattedDate = `${year}-${month}-${day}`;
      this.setData({
        startDate: formattedDate,
        endDate: formattedDate,
      });
    } else {
      console.log("日期格式不匹配");
    }
    console.log("tasks", this.data.tasks)
  },

  // 计算日期差异（天数差）
  calculateDateDifference: function(lastDate, newDate) {
    const lastDateObj = new Date(lastDate);
    const newDateObj = new Date(newDate);
    const timeDiff = newDateObj - lastDateObj;  // 时间差（毫秒）
    return timeDiff / (1000 * 3600 * 24);  // 转换为天数
  },

  // 点击编辑计划时，弹出弹窗
  onEditPlan(e) {
    // 创建一个动画实例
    const animation = wx.createAnimation({
      duration: 200, // 动画持续时间
      timingFunction: 'ease',
    });

    const section = e.currentTarget.dataset.section;
    if (section === 'task1') {
      animation.scale(0.95).translateY(5).step();  // task1 动画效果
    } else if (section === 'task2') {
      animation.rotate(45).scale(1.1).step();  // task2 动画效果
    } else if (section === 'task3') {
      animation.scale(1.1).translateX(5).step();  // task3 动画效果
    } else if (section === 'task4') {
      animation.scale(0.9).translateY(-5).step();  // task4 动画效果
    }    
    this.setData({
      currentSection: section,
      isModalVisible: true,
      animationData: animation.export(),
    });

    // 让元素恢复原始状态
    setTimeout(() => {
      if (section === 'task1') {
        // 还原 task1 动画状态
        animation.scale(1).translateY(0).step();
      } else if (section === 'task2') {
        // 还原 task2 动画状态
        animation.rotate(0).scale(1).step();
      } else if (section === 'task3') {
        // 还原 task3 动画状态
        animation.scale(1).translateX(0).step();
      } else if (section === 'task4') {
        // 还原 task4 动画状态
        animation.scale(1).translateY(0).step();
      }
      this.setData({
        animationData: animation.export(),
      });
    }, 200); // 恢复时间延迟
  },

  // 关闭弹窗
  closeModal() {
    // 创建动画实例
    const animation = wx.createAnimation({
      duration: 300,  // 动画持续时间
      timingFunction: 'ease-in-out',  // 动画的缓动效果
    });

    // 设置动画效果：缩小并透明
    animation.scale(0.5).opacity(0).step();
    this.setData({
      animationData_close: animation.export(),
    });

    // 动画结束后可进行其他操作（如关闭弹窗等）
    setTimeout(() => {
      // 创建一个还原动画实例
      const restoreAnimation = wx.createAnimation({
        duration: 300,  // 恢复动画的持续时间
        timingFunction: 'ease-in-out',  // 恢复动画的缓动效果
      });

      // 还原到原来的大小和不透明
      restoreAnimation.scale(1).opacity(1).step();
      // 在这里处理动画结束后的逻辑，例如关闭模态框等
      this.setData({
        animationData_close: restoreAnimation.export(),
        isModalVisible: false
      })
    }, 300); // 300ms后执行
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
            // 显示时间选择器
            this.setData({
              content: content,       // 存储任务内容
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
    const all_tasks = this.data.all_tasks;

    // 确保 tasks[section] 存在且是一个数组
    if (tasks[section]) {
      tasks[section].splice(index, 1); // 删除指定索引的任务
    }

    all_tasks[this.data.selectedDate] = tasks;

    // 更新任务数据到本地缓存
    wx.setStorageSync('tasks', tasks);
    wx.setStorageSync('all_tasks', all_tasks);

    this.setData({
      tasks,
      all_tasks
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
    const { startDate, startTime, endDate, endTime } = this.data;
    const content = this.data.content;
    const newTask = { content, startDate, startTime, endDate, endTime };
    const tasks = this.data.tasks;
    const section = this.data.currentSection;
    const all_tasks = this.data.all_tasks; // 获取 all_tasks 数据

    console.log(this.data);

    // 确保 tasks[section] 存在且是一个数组，如果不存在则初始化为空数组
    if (!tasks[section]) {
      tasks[section] = [];  // 初始化为空数组
    }

    tasks[section].push(newTask);  // 添加新任务

    console.log("all_tasks", all_tasks)
    all_tasks[this.data.selectedDate] = tasks;
    console.log('alltask',all_tasks)
    // 更新任务数据到本地缓存
    wx.setStorageSync('tasks', tasks);
    wx.setStorageSync('all_tasks', all_tasks);  // 更新 all_tasks 数据到本地缓存

    // 关闭弹窗
    this.setData({
      isModalTimeVisible: false,
      isModalVisible: true,
      tasks,
      all_tasks: all_tasks,  // 更新 all_tasks
    });
    console.log(this.data.all_tasks)
  },

  onInputChange: function (event) {
    // 更新输入框内容
    this.setData({
      newTaskContent: event.detail.value
    });
  },
});

