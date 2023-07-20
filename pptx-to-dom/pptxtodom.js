import { displayChart } from './support/chart'
import $ from 'jquery'
import html2canvas from 'html2canvas'

const cssStyle = `
.slide {
position: relative;
border: 1px solid #333;
border-radius: 10px;
overflow: hidden;
margin-bottom: 50px;
margin-left: auto;
margin-right: auto;
z-index: 100;
}
.slide div.block {
position: absolute;
top: 0;
left: 0;
width: 100%;
line-height: 1;
}
.slide div.content {
display: flex;
flex-direction: column;
}
.slide div.diagram-content{
display: flex;
flex-direction: column;
}
.slide div.content-rtl {
display: flex;
flex-direction: column;
direction: rtl;
}
.slide .pregraph-rtl{
direction: rtl;
}
.slide .pregraph-ltr{
direction: ltr;
}
.slide .pregraph-inherit{
direction: inherit;
}
.slide .slide-prgrph{
width: 100%;
}
.slide .line-break-br::before{
  content: "\\A";
  white-space: pre;
}
.slide div.v-up {
justify-content: flex-start;
}
.slide div.v-mid {
justify-content: center;
}
.slide div.v-down {
justify-content: flex-end;
}
.slide div.h-left {
justify-content: flex-start;
align-items: flex-start;
text-align: left;
}
.slide div.h-left-rtl {
justify-content: flex-end;
align-items: flex-end;
text-align: left;
}
.slide div.h-mid {
justify-content: center;
align-items: center;
text-align: center;
}
.slide div.h-right {
justify-content: flex-end;
align-items: flex-end;
text-align: right;
}
.slide div.h-right-rtl {
justify-content: flex-start;
align-items: flex-start;
text-align: right;
}
.slide div.h-just,
.slide div.h-dist {
text-align: justify;
}
.slide div.up-left {
justify-content: flex-start;
align-items: flex-start;
text-align: left;
}
.slide div.up-center {
justify-content: flex-start;
align-items: center;
}
.slide div.up-right {
justify-content: flex-start;
align-items: flex-end;
}
.slide div.center-left {
justify-content: center;
align-items: flex-start;
text-align: left;
}
.slide div.center-center {
justify-content: center;
align-items: center;
}
.slide div.center-right {
justify-content: center;
align-items: flex-end;
}
.slide div.down-left {
justify-content: flex-end;
align-items: flex-start;
text-align: left;
}
.slide div.down-center {
justify-content: flex-end;
align-items: center;
}
.slide div.down-right {
justify-content: flex-end;
align-items: flex-end;
}

.slide li.slide {
margin: 10px 0px;
font-size: 18px;
}
.slide table {
position: absolute;
}
.slide svg.drawing {
position: absolute;
overflow: visible;
}`

const bingStyle = '.bb-color-pattern{background-image:url(#00c73c;#fa7171;#2ad0ff;#7294ce;#e3e448;#cc7e6e;#fb6ccf;#c98dff;#4aea99;#bbbbbb;)}.bb svg{font-family:sans-serif,Arial,nanumgothic,Dotum;font-size:12px;line-height:1}.bb line,.bb path{fill:none;stroke:#c4c4c4}.bb .bb-button,.bb text{fill:#555;font-size:11px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.bb-axis,.bb-bars path,.bb-event-rect,.bb-legend-item-title,.bb-xgrid-focus,.bb-ygrid,.bb-ygrid-focus{shape-rendering:crispEdges}.bb-axis-y text,.bb-axis-y2 text{fill:#737373}.bb-event-rects{fill-opacity:1!important}.bb-event-rects .bb-event-rect{fill:transparent}.bb-event-rects .bb-event-rect._active_{fill:rgba(39,201,3,.05)}.tick._active_ text{fill:#00c83c!important}.bb-grid{pointer-events:none}.bb-grid line{stroke:#f1f1f1}.bb-xgrid-focus line,.bb-ygrid-focus line{stroke:#ddd}.bb-text.bb-empty{fill:#767676}.bb-line{stroke-width:1px}.bb-circle._expanded_{fill:#fff!important;stroke-width:2px;stroke:red}rect.bb-circle._expanded_,use.bb-circle._expanded_{stroke-width:1px}.bb-selected-circle{fill:#fff;stroke-width:2px}.bb-bar{stroke-width:0}.bb-bar._expanded_{fill-opacity:.75}.bb-candlestick{stroke-width:1px}.bb-candlestick._expanded_{fill-opacity:.75}.bb-circles.bb-focused,.bb-target.bb-focused{opacity:1}.bb-circles.bb-focused path.bb-line,.bb-circles.bb-focused path.bb-step,.bb-target.bb-focused path.bb-line,.bb-target.bb-focused path.bb-step{stroke-width:2px}.bb-circles.bb-defocused,.bb-target.bb-defocused{opacity:.3!important}.bb-circles.bb-defocused .text-overlapping,.bb-target.bb-defocused .text-overlapping{opacity:.05!important}.bb-region{fill:#4682b4;fill-opacity:.1}.bb-region.selected rect{fill:#27c903}.bb-brush .extent,.bb-zoom-brush{fill-opacity:.1}.bb-legend-item{user-select:none}.bb-legend-item-hidden{opacity:.15}.bb-legend-background{fill:#fff;stroke:#d3d3d3;stroke-width:1;opacity:.75}.bb-title{font-size:14px}.bb-chart-treemaps rect{stroke:#fff;stroke-width:1px}.bb-tooltip-container{font-family:sans-serif,Arial,nanumgothic,Dotum;user-select:none;z-index:10}.bb-tooltip{background-color:#fff;border:1px solid #999;border-collapse:separate;border-spacing:0;empty-cells:show;font-size:11px;text-align:left}.bb-tooltip th{border-bottom:1px solid #eee;font-size:12px;padding:4px 8px;text-align:left}.bb-tooltip td{background-color:#fff;padding:4px 6px}.bb-tooltip td:first-child{padding-left:8px}.bb-tooltip td:last-child{padding-right:8px}.bb-tooltip td>span,.bb-tooltip td>svg{border-radius:5px;display:inline-block;height:10px;margin-right:6px;vertical-align:middle;width:10px}.bb-tooltip td.value{border-left:1px solid transparent}.bb-tooltip .bb-tooltip-title{color:#aaa;display:inline-block;line-height:20px}.bb-tooltip .bb-tooltip-detail table{border-collapse:collapse;border-spacing:0}.bb-tooltip .bb-tooltip-detail .bb-tooltip-name,.bb-tooltip .bb-tooltip-detail .bb-tooltip-value{color:#444;font-size:11px;font-weight:400;line-height:13px;padding:4px 0 3px;text-align:left}.bb-tooltip .bb-tooltip-detail .bb-tooltip-value{font-size:12px;font-weight:800;padding-left:5px}.bb-area{stroke-width:0;opacity:.2}.bb-chart-arcs-title{dominant-baseline:middle;font-size:1.3em}text.bb-chart-arcs-gauge-title{dominant-baseline:middle;font-size:2.7em}.bb-chart-arcs .bb-chart-arcs-background{fill:#e0e0e0;stroke:none}.bb-chart-arcs .bb-chart-arcs-gauge-unit{fill:#000;font-size:16px}.bb-chart-arcs .bb-chart-arcs-gauge-max,.bb-chart-arcs .bb-chart-arcs-gauge-min{fill:#777}.bb-chart-arcs .bb-chart-arcs-title{fill:#000;font-size:16px!important;font-weight:600}.bb-chart-arcs path.empty{fill:#eaeaea;stroke-width:0}.bb-chart-arcs .bb-levels circle{fill:none;stroke:#848282;stroke-width:.5px}.bb-chart-arcs .bb-levels text{fill:#848282}.bb-chart-arc .bb-gauge-value{fill:#000}.bb-chart-arc path{stroke:#fff}.bb-chart-arc rect{stroke:#fff;stroke-width:1}.bb-chart-arc text{fill:#fff;font-size:13px}.bb-chart-radars .bb-levels polygon{fill:none;stroke:#848282;stroke-width:.5px}.bb-chart-radars .bb-levels text{fill:#848282}.bb-chart-radars .bb-axis line{stroke:#848282;stroke-width:.5px}.bb-chart-radars .bb-axis text{cursor:default;font-size:1.15em}.bb-chart-radars .bb-shapes polygon{fill-opacity:.2;stroke-width:1px}.bb-button{position:absolute;right:10px;top:10px}.bb-button .bb-zoom-reset{background-color:#fff;border:1px solid #ccc;border-radius:5px;cursor:pointer;padding:5px}'

const setSvgFromDoms = (dom) => {
  const svgElements = dom.querySelectorAll('svg')

  svgElements.forEach(function (item) {
    item.setAttribute('width', item.getBoundingClientRect().width)
    item.setAttribute('height', item.getBoundingClientRect().height)
    const divDom = document.createElement('div')
    const cloneItem = item.cloneNode(true)
    let index = 0
    while (true) {
      const attributeValue = item.style[`${index}`]
      if (attributeValue) {
        divDom.style[attributeValue] = item.style[attributeValue]
        index++
      } else {
        break
      }
    }
    divDom.style.position = 'absolute'
    divDom.style.top = item.style.top
    divDom.style.left = item.style.left
    divDom.style.width = item.style.width
    divDom.style.height = item.style.height
    divDom.style['z-index'] = item.style['z-index']
    divDom.style.transform = item.style.transform
    cloneItem.style = null
    cloneItem.removeAttribute('\'')
    divDom.appendChild(cloneItem)
    item.parentNode.appendChild(divDom)
    item.remove()
  })
}

export const parsingPPTX = async (buffer, options = {
  themeProcess: true,
  incSlide: {
    width: 0,
    height: 0
  }
}) => {
  return new Promise((resolve, reject) => {
    const pptxDom = document.createElement('div')
    const data = {
      isDone: false,
      thumbElement: null,
      worker: null,
      timer: null
    }
    const methods = {
      // 启动worker逻辑
      startWorker () {
        // 真实的web worker - 使用该方式，我们必须通过blob的方式进行通信
        if (data.worker) data.worker.terminate()
        if (data.timer) clearInterval(data.timer)
        const workerUrl = new URL('./worker/pptx.worker.js', import.meta.url)
        const worker = data.worker = new Worker(workerUrl, { type: 'module' })
        worker.addEventListener('message', event => {
          this.processMessage(event.data)
        }, false)
        worker.addEventListener('error', ev => {
          reject(ev)
        }, false)
        // 通知worker开始工作
        worker.postMessage({
          type: 'processPPTX',
          data: buffer,
          IE11: 'MSInputMethodContext' in window && 'documentMode' in document,
          options
        })
        // 定时检测执行情况，发现完成则及时关闭
        data.timer = setInterval(this.stopWorker, 500)
      },
      // 停止worker逻辑
      async stopWorker () {
        if (data.isDone) {
          data.worker?.terminate()
          if (data.timer) clearInterval(data.timer)
          resolve(pptxDom)
        }
      },
      // 核心处理逻辑
      processMessage (msg) {
        if (data.isDone) {
          return
        }
        const { thumbElement } = data
        switch (msg.type) {
          case 'slide':
            pptxDom.innerHTML += msg.data
            break
          case 'pptx-thumb':
            if (thumbElement) $(thumbElement).attr('src', `data:image/jpeg;base64,${msg.data}`)
            break
          case 'slideSize':
            break
          case 'globalCSS':
            pptxDom.innerHTML += `<style>${cssStyle}\n${bingStyle}\n${msg.data}</style>`
            break
          case 'ExecutionTime':
          case 'Done':
            displayChart(msg.charts)
            data.isDone = true
            break
          case 'WARN':
            console.warn('PPTX processing warning: ', msg.data)
            break
          case 'ERROR':
            data.isDone = true
            console.error('PPTX processing error: ', msg.data)
            reject(msg.data)
            break
          case 'DEBUG':
            console.debug('Worker: ', msg.data)
            break
          case 'INFO':
          default:
            console.info('Worker: ', msg.data)
        }
      }
    }

    methods.startWorker()
  })
}

export const domToImages = async (pptxDom) => {
  pptxDom.style.cssText = 'margin: 0 auto; max-width: 100%; position: absolute; left: -1000000px;'
  document.body.appendChild(pptxDom)
  const slides = pptxDom.getElementsByClassName('slide')
  const images = []
  for (let index = 0; index < slides.length; index++) {
    const element = slides[index]
    setSvgFromDoms(element)
    const canvas = await html2canvas(element, { logging: false })
    images.push(canvas.toDataURL())
  }
  pptxDom.remove()
  return images
}
