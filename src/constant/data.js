// 元素集合
const elementList = []
for (let i = 1; i < 132;i++){
  elementList.push({
    value: i,
    label: `SEG${i}`,
  })
}

// 状态列表
const statusList = [
  {
    value: 'black',
    label: '刷黑',
  },{
    value: 'white',
    label: '刷白',
  },{
    value: 'wait',
    label: '等待',
  },
]

export {
  elementList,
  statusList
}
