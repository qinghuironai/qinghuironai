export const modeData = [
  {
    value: 'zonghe',
    text: '综合',
    children: [
      { text: '日排行', value: 'day' },
      { text: '周排行', value: 'week' },
      { text: '月排行', value: 'month' },
      { text: '男性日排行', value: 'male' },
      { text: '女性日排行', value: 'female' }
    ]
  },
  {
    value: 'manhua',
    text: '漫画',
    children: [
      { text: '日排行', value: 'day_manga' },
      { text: '周排行', value: 'week_manga' },
      { text: '月排行', value: 'month_manga' },
      { text: '新秀周排行', value: 'week_rookie_manga' }
    ]
  }
]

export const color = ['rgb(47, 48, 53)', 'rgb(70, 105, 164)', 'rgb(189, 172, 166)', 'rgb(63, 41, 32)', 'rgb(49, 46, 44)', 'rgb(51, 62, 79)', 'rgb(208, 185, 177)', 'rgb(168, 112, 76)']

export const IMG_PREFIX = 'https://test.img.cheerfun.dev/get/'
