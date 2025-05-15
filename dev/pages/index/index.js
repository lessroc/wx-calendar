/*
 * @Description: Description
 * @Author: lishen
 * @Date: 2023-08-31 16:46:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-11-25 22:22:23
 */
const { WxCalendar } = require('@lspriv/wx-calendar/lib');
const { LunarPlugin, LUNAR_PLUGIN_KEY } = require('@lspriv/wc-plugin-lunar');
const { DisabledPlugin, DISABLED_PLUGIN_KEY } = require('@lspriv/wc-plugin-disabled');
const { MultiPlugin, MULTI_PLUGIN_KEY } = require('@lspriv/wc-plugin-multiple');
const { ICSPlugin, ICS_PLUGIN_KEY, ICSCnPreset } = require('@lspriv/wc-plugin-ics');

WxCalendar.use(LunarPlugin);
WxCalendar.use(MultiPlugin, {
  type: 'multi',
  bgColor: { light: '#409EFF', dark: '#409EFF' },
  textColor: { light: '#FFF', dark: '#E5E5E5' }
});
WxCalendar.use(DisabledPlugin);
// 使用ICSCnPreset预设
WxCalendar.use(ICSPlugin, ICSCnPreset);

Page({
  data: {
    padding: 0,
    markers: [
      { year: 2025, month: 5, day: 19, type: 'festival', text: '88', style: { color: '#f00' } },
      { year: 2025, month: 5, day: 20, type: 'festival', text: '99', style: { color: '#0f0' } }
    ]
  },
  onLoad() {
    // const { bottom } = wx.getMenuButtonBoundingClientRect();
    // this.setData({
    //   padding: bottom
    // });
  },
  handleLoad() {
    const calendar = this.selectComponent('#calendar');

    const disabledPlugin = calendar.getPlugin(DISABLED_PLUGIN_KEY);
    disabledPlugin.disable([
      // { year: 2025, month: 5, day: 7 }, // 禁用单个日期
      // 禁用一个范围的日期
      [
        { year: -1900, month: 1, day: 1 },
        { year: 2025, month: 5, day: 15 }
      ]
    ]);

    const ics = calendar.getPlugin(ICS_PLUGIN_KEY);
    ics.load('https://gitee.com/congqiu/ChineseHoliday/raw/master/holiday.ics');

    console.log('calendar-load', calendar);
  },
  handleClick({ detail }) {
    console.log('calendar-date-click', detail);
  },
  handleChange({ detail }) {
    console.log('calendar-date-change', detail);
  },
  handleViewChange({ detail }) {
    console.log('calendar-view-change', detail);
  }
});
