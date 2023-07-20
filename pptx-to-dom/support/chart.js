import $ from 'jquery'
import { format } from 'd3'
import bb, { area, bar, line, pie, scatter } from 'billboard.js'

/**
 * 显示图表
 */
export const displayChart = (charts) => {
  processMsgQueue(charts.MsgQueue)
  setNumericBullets($('.block'))
  setNumericBullets($('table td'))
}

function processMsgQueue (queues) {
  queues.forEach((queue) => processSingleMsg(queue?.data))
}

const generalAxis = (data, cb = (a) => {
}) => {
  const modifier = (data) => {
    cb(data)
    return data
  }
  return {
    axis: modifier({
      x: {
        tick: {
          format (index) {
            return data[0].xlabels[index] || index
          }
        }
      }
    })
  }
}

function processSingleMsg (d) {
  if (!d) return
  const { chartID, chartType, chartData } = d
  const chart = {
    bindto: `#${chartID}`
  }
  switch (chartType) {
    case 'lineChart':
      Object.assign(chart, {
        data: {
          columns: chartData.map((c) => [c.key, ...c.values.map(({ y }) => y)]),
          type: line()
        },
        ...generalAxis(chartData),
        interaction: { enabled: true }
      })
      break
    case 'barChart':
      Object.assign(chart, {
        data: {
          columns: chartData.map((c) => [c.key, ...c.values.map(({ y }) => y)]),
          type: bar()
        },
        ...generalAxis(chartData, (axis) => {
          axis.x.tick.multiline = true
          return axis
        })
      })
      break
    case 'pieChart':
    case 'pie3DChart':
      Object.assign(chart, {
        data: {
          columns: Object.values(chartData[0].xlabels).map((v, i) => [v, chartData[0].values[i].y]),
          type: pie()
        }
      })
      break
    case 'areaChart':
      Object.assign(chart, {
        data: {
          columns: chartData.map((c) => [c.key, ...c.values.map(({ y }) => y)]),
          type: area()
        },
        interaction: { enabled: true },
        ...generalAxis(chartData)
      })
      break
    case 'scatterChart':
      Object.assign(chart, {
        data: {
          xs: {
            y: 'x'
          },
          columns: chartData.map((c, i) => [i ? 'y' : 'x', ...c]),
          type: scatter()
        },
        axis: {
          x: {
            label: 'X',
            showDist: true,
            tick: {
              format: format('.02f')
            }
          },
          y: {
            label: 'Y',
            showDist: true,
            tick: {
              format: format('.02f')
            }
          }
        }
      })
      break
    default:
  }
  if (chart.data) {
    bb.generate(chart)
  }
}

function setNumericBullets (elem) {
  const prgrphsArry = elem
  for (let i = 0; i < prgrphsArry.length; i++) {
    const buSpan = $(prgrphsArry[i]).find('.numeric-bullet-style')
    if (buSpan.length > 0) {
      let prevBultTyp = ''
      let prevBultLvl = ''
      let buletIndex = 0
      const tmpArry = []
      let tmpArryIndx = 0
      const buletTypSrry = []
      for (let j = 0; j < buSpan.length; j++) {
        const bultTyp = $(buSpan[j]).data('bulltname')
        const bultLvl = $(buSpan[j]).data('bulltlvl')
        if (buletIndex === 0) {
          prevBultTyp = bultTyp
          prevBultLvl = bultLvl
          tmpArry[tmpArryIndx] = buletIndex
          buletTypSrry[tmpArryIndx] = bultTyp
          buletIndex++
        } else {
          if (bultTyp === prevBultTyp && bultLvl === prevBultLvl) {
            prevBultTyp = bultTyp
            prevBultLvl = bultLvl
            buletIndex++
            tmpArry[tmpArryIndx] = buletIndex
            buletTypSrry[tmpArryIndx] = bultTyp
          } else if (bultTyp !== prevBultTyp && bultLvl === prevBultLvl) {
            prevBultTyp = bultTyp
            prevBultLvl = bultLvl
            tmpArryIndx++
            tmpArry[tmpArryIndx] = buletIndex
            buletTypSrry[tmpArryIndx] = bultTyp
            buletIndex = 1
          } else if (bultTyp !== prevBultTyp && Number(bultLvl) > Number(prevBultLvl)) {
            prevBultTyp = bultTyp
            prevBultLvl = bultLvl
            tmpArryIndx++
            tmpArry[tmpArryIndx] = buletIndex
            buletTypSrry[tmpArryIndx] = bultTyp
            buletIndex = 1
          } else if (bultTyp !== prevBultTyp && Number(bultLvl) < Number(prevBultLvl)) {
            prevBultTyp = bultTyp
            prevBultLvl = bultLvl
            tmpArryIndx--
            buletIndex = tmpArry[tmpArryIndx] + 1
          }
        }
        const numIdx = getNumTypeNum(buletTypSrry[tmpArryIndx], buletIndex)
        $(buSpan[j]).html(numIdx)
      }
    }
  }
}

function getNumTypeNum (numTyp, num) {
  let rtrnNum = ''
  switch (numTyp) {
    case 'arabicPeriod':
      rtrnNum = num + '. '
      break
    case 'arabicParenR':
      rtrnNum = num + ') '
      break
    case 'alphaLcParenR':
      rtrnNum = alphaNumeric(num, 'lowerCase') + ') '
      break
    case 'alphaLcPeriod':
      rtrnNum = alphaNumeric(num, 'lowerCase') + '. '
      break

    case 'alphaUcParenR':
      rtrnNum = alphaNumeric(num, 'upperCase') + ') '
      break
    case 'alphaUcPeriod':
      rtrnNum = alphaNumeric(num, 'upperCase') + '. '
      break
    case 'romanUcPeriod':
      rtrnNum = romanize(num) + '. '
      break
    case 'romanLcParenR':
      rtrnNum = romanize(num) + ') '
      break
    case 'hebrew2Minus':
      rtrnNum = hebrew2Minus.format(num) + '-'
      break
    default:
      rtrnNum = String(num)
  }
  return rtrnNum
}

function romanize (num) {
  if (!+num) { return false }
  const digits = String(+num).split('')
  const key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
    '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
    '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']
  let roman = ''
  let i = 3
  while (i--) { roman = (key[+(digits.pop() ?? '') + (i * 10)] || '') + roman }
  return Array(+digits.join('') + 1).join('M') + roman
}

const hebrew2Minus = archaicNumbers([
  [1000, ''],
  [400, 'ת'],
  [300, 'ש'],
  [200, 'ר'],
  [100, 'ק'],
  [90, 'צ'],
  [80, 'פ'],
  [70, 'ע'],
  [60, 'ס'],
  [50, 'נ'],
  [40, 'מ'],
  [30, 'ל'],
  [20, 'כ'],
  [10, 'י'],
  [9, 'ט'],
  [8, 'ח'],
  [7, 'ז'],
  [6, 'ו'],
  [5, 'ה'],
  [4, 'ד'],
  [3, 'ג'],
  [2, 'ב'],
  [1, 'א'],
  [/יה/, 'ט״ו'],
  [/יו/, 'ט״ז'],
  [/([א-ת])([א-ת])$/, '$1״$2'],
  [/^([א-ת])$/, '$1׳']
])

function archaicNumbers (arr) {
  // eslint-disable-next-line no-unused-vars
  const arrParse = arr.slice().sort(function (a, b) {
    return b[1].length - a[1].length
  })
  return {
    format: function (n) {
      let ret = ''
      $.each(arr, function () {
        const num = this[0]
        if (parseInt(num) > 0) {
          for (; n >= num; n -= num) ret += this[1]
        } else {
          ret = ret.replace(num, this[1])
        }
      })
      return ret
    }
  }
}

function alphaNumeric (num, upperLower) {
  num = Number(num) - 1
  let aNum = ''
  if (upperLower === 'upperCase') {
    aNum = (((num / 26 >= 1) ? String.fromCharCode(num / 26 + 64) : '') + String.fromCharCode(num % 26 + 65)).toUpperCase()
  } else if (upperLower === 'lowerCase') {
    aNum = (((num / 26 >= 1) ? String.fromCharCode(num / 26 + 64) : '') + String.fromCharCode(num % 26 + 65)).toLowerCase()
  }
  return aNum
}
