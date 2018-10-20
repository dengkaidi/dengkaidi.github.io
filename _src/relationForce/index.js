import React, { Fragment } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/graph';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/graphic';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/axis';
import tooltipDiv from './component/tooltipDiv';
import PageHeaderLayout from './../../layouts/PageHeaderLayout';
import * as graph from './person.json';

const Option = Select.Option;

const categories = [{ name: '主角' }, { name: '配角' }, { name: '演员' }];

for (const node of graph.nodes) {
  node.symbolSize = node.degree - 60;
}

class RelationForce extends React.Component {
  constructor() {
    super();
    this.nodes = {};
    this.height = 500;
    this.width = 500;
    this.centerOfNode = '高育良';
    this.state = {
      layout: 'force',
      level: 1,
    };
    this.changeLevel = this.changeLevel.bind(this);
    // this.curry = this.curry.bind(this);
  }
  componentWillMount() {
    this.nodes = this.getGraphData(this.state.level);
  }
  componentDidMount() {
    const option = this.state.layout === 'force' ? this.getOption()
      : this.state.layout === 'center' ?
        this.getCenterLayoutOption() : this.getCircularOption();
    this.initChart('mountNode', option);
  }
  componentDidUpdate() {
    const option = this.state.layout === 'force' ? this.getOption()
      : this.state.layout === 'circular' ?
        this.getCircularOption() : this.getCenterLayoutOption();
    this.initChart('mountNode', option);
  }
  getOption = () => {
    const option = {
      tooltip: {
        formatter: (x) => {
          if (x.data.category !== undefined) {
            return tooltipDiv('基本信息', [
              ['名字：', x.data.name],
              ['详细信息：', x.data.des],
            ]);
          }
          return tooltipDiv('关系', [
            ['关系：', x.data.name],
          ]);
        },
      },
      toolbox: {
        feature: {
          saveAsImage: {
            type: 'png',
            name: '保存图片',
          },
        },
      },
      color: ['#e18826', '#002a67', '#b30000'],
      legend: [{
        // selectedMode: 'single',
        data: categories.map((category) => {
          return category.name;
        }),
        orient: 'vertical',
        bottom: 15,
        left: 10,
      }],
      series: [
        {
          type: 'graph',
          layout: 'force',
          roam: true,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          focusNodeAdjacency: true,
          categories,
          edgeLabel: {
            normal: {
              show: true,
              textStyle: {
                fontSize: 14,
              },
              formatter: (x) => {
                return x.data.name;
              },
            },
          },
          force: {
            repulsion: 2500,
            edgeLength: [10, 50],
          },
          draggable: true,
          lineStyle: {
            normal: {
              width: 2,
              color: '#4b565b',
            },
          },
          label: {
            normal: {
              show: true,
              textStyle: {},
            },
          },
          // data: this.nodes,
          data: this.nodes,
          links: graph.edges,
          // links: this.getGraphData(this.state.level).edges,
        },
      ],
    };
    return option;
  };
  getCircularOption = () => {
    const optiontmp = {
      tooltip: {
        formatter: (x) => {
          if (x.data.category !== undefined) {
            return tooltipDiv('基本信息', [
              ['名字：', x.data.name],
              ['详细信息：', x.data.des],
            ]);
          }
          return tooltipDiv('关系', [
            ['关系：', x.data.name],
          ]);
        },
      },
      color: ['#e18826', '#002a67', '#b30000'],
      legend: [{
        // selectedMode: 'single',
        data: categories.map((category) => {
          return category.name;
        }),
        orient: 'vertical',
        bottom: 15,
        left: 10,
      }],
      series: [
        {
          type: 'graph',
          layout: 'circular',
          roam: true,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          // focusNodeAdjacency: true,
          categories,
          edgeLabel: {
            normal: {
              show: true,
              textStyle: {
                fontSize: 14,
              },
              formatter: (x) => {
                return x.data.name;
              },
            },
          },
          lineStyle: {
            normal: {
              width: 2,
              color: '#4b565b',
            },
          },
          label: {
            normal: {
              show: true,
              textStyle: {},
            },
          },
          data: this.nodes,
          links: graph.edges,
        },
      ],
    };
    return optiontmp;
  };
  getCenterLayoutOption = () => {
    const data = this.generatorNodeXY();
    const option = {
      tooltip: {
        formatter: (x) => {
          if (x.data.category !== undefined) {
            return tooltipDiv('基本信息', [
              ['名字：', x.data.name],
              ['详细信息：', x.data.des],
            ]);
          }
          return tooltipDiv('关系', [
            ['关系：', x.data.name],
          ]);
        },
      },
      color: ['#e18826', '#002a67', '#b30000'],
      legend: [{
        // selectedMode: 'single',
        data: categories.map((category) => {
          return category.name;
        }),
        orient: 'vertical',
        bottom: 15,
        left: 10,
      }],
      series: [
        {
          type: 'graph',
          layout: 'none',
          roam: true,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          // focusNodeAdjacency: true,
          categories,
          edgeLabel: {
            normal: {
              show: true,
              textStyle: {
                fontSize: 14,
              },
              formatter: (x) => {
                return x.data.name;
              },
            },
          },
          draggable: false,
          lineStyle: {
            normal: {
              width: 2,
              color: '#4b565b',
            },
          },
          label: {
            normal: {
              show: true,
              textStyle: {},
            },
          },
          // data: this.nodes,
          data: data,
          links: graph.edges,
        },
      ],
    };
    return option;
  };
  getGraphData(level) {
    // 层级过滤
    const ids = new Set();
    ids.add(this.centerOfNode);
    for (let i = 0; i < level; i++) {
      const es = graph.edges.filter(item => {
        return ids.has(item.target) || ids.has(item.source);
      });
      es.forEach(item => {
        ids.add(item.target);
        ids.add(item.source);
      });
    }
    const sourceNodes = graph.nodes.filter(item => { return ids.has(item.name); });
    this.nodes = sourceNodes;
    return sourceNodes;
  }
  initChart(id, option) {
    let myChart = echarts.getInstanceByDom(document.getElementById(id));
    if (myChart === undefined) {
      myChart = echarts.init(document.getElementById(id));
    }
    myChart.setOption(option);
    const data = option.series[0].data;
    if (this.state.layout === 'custom') {
      myChart.setOption({ // option.series[0].data
        // 声明一个 graphic component，里面有若干个 type 为 'circle' 的 graphic elements。
        // 这里使用了 echarts.util.map 这个帮助方法，其行为和 Array.prototype.map 一样，但是兼容 es5 以下的环境。
        // 用 map 方法遍历 data 的每项，为每项生成一个圆点。
        graphic: echarts.util.map(data, (dataItem, dataIndex) => {
          return {
            // 'circle' 表示这个 graphic element 的类型是圆点。
            id: dataIndex,
            type: 'circle',
            cursor: 'move',
            shape: {
              // 圆点的半径。
              r: 10,
            },
            style: {
              stroke: '#1edf5c',
              fill: 'rgba(128, 128, 128, 0.1)',
            },
            // 用 transform 的方式对圆点进行定位。position: [x, y] 表示将圆点平移到 [x, y] 位置。
            // 这里使用了 convertToPixel 这个 API 来得到每个圆点的位置，下面介绍。
            position: myChart.convertToPixel({ seriesIndex: 0 }, [dataItem.x, dataItem.y]),

            // 这个属性让圆点不可见（但是不影响他响应鼠标事件）。
            invisible: true,
            // 这个属性让圆点可以被拖拽。
            draggable: true,
            // 把 z 值设得比较大，表示这个圆点在最上方，能覆盖住已有的折线图的圆点。
            z: 100,
            // 此圆点的拖拽的响应事件，在拖拽过程中会不断被触发。下面介绍详情。
            // 这里使用了 echarts.util.curry 这个帮助方法，意思是生成一个与 onPointDragging
            // 功能一样的新的函数，只不过第一个参数永远为此时传入的 dataIndex 的值。
            ondrag: echarts.util.curry(onPointDragging, dataIndex),
          };
        }),
        series: [
          {
            roam: true,
            draggable: false,
          },
        ],
      });

      myChart.on('dataZoom', updatePosition);
      myChart.on('graphRoam', updatePosition);
      window.addEventListener('resize', updatePosition);
    } else {
      myChart.setOption({
        graphic: echarts.util.map(data, (dataItem, dataIndex) => {
          return {
            id: dataIndex,
            $action: 'remove',
          };
        }),
      });
      myChart.off('dataZoom', updatePosition);
      myChart.off('graphRoam', updatePosition);
      window.removeEventListener('resize', updatePosition);
    }
    myChart.dispatchAction({
      type: 'restore',
    });
    // 拖拽某个圆点的过程中会不断调用此函数。
    // 此函数中会根据拖拽后的新位置，改变 data 中的值，并用新的 data 值，重绘关系图，从而使关系图同步于被拖拽的隐藏圆点。
    function onPointDragging(dataIndex) {
      if (myChart.getOption().graphic[0].elements.length < 1) {
        return;
      }
      // 这里的 data 就是本文最初的代码块中声明的 data，在这里会被更新。
      // 这里的 this 就是被拖拽的圆点。this.position 就是圆点当前的位置。
      const position = myChart.convertFromPixel({ seriesIndex: 0 }, this.position);
      data[dataIndex].x = position[0];
      data[dataIndex].y = position[1];
      // 用更新后的 data，重绘关系图。
      myChart.setOption({
        series: [{
          data: data,
        }],
      });
      updatePosition();
    }
    function updatePosition() {
      // 判断是否配置了graphic属性，没有直接return
      if (myChart.getOption().graphic[0].elements.length < 1) {
        return;
      }
      myChart.setOption({
        graphic: echarts.util.map(data, (item) => {
          return {
            position: myChart.convertToPixel({ seriesIndex: 0 }, [item.x, item.y]),
          };
        }),
      });
    }
  }
  changeLevel = (value) => {
    this.setState({ level: value });
    this.getGraphData(value);
  }
  // 中心布局使用自定义节点坐标实现
  generatorNodeXY = () => {
    if (this.nodes.length < 1) {
      return;
    }
    // 确定圆心(x0, y0)
    const x0 = this.width / 2;
    const y0 = this.height / 2;
    // 将nodes进行深拷贝
    const newNodes = JSON.parse(JSON.stringify(this.nodes));
    if (this.nodes.length === 1) {
      newNodes[0].x = x0;
      newNodes[0].y = y0;
      return newNodes;
    }
    // 确定弧度间隔
    const unitAngle = 360 / (this.nodes.length - 1);
    // 半径
    const radius = Math.min(this.width, this.height) / 2;
    let step = 1;
    // 给每个node附上坐标
    for (const node of newNodes) {
      if (node.name === this.centerOfNode) {
        node.x = x0;
        node.y = y0;
      } else {
        node.x = x0 + radius * Math.cos(unitAngle * step * Math.PI / 180);
        node.y = y0 + radius * Math.sin(unitAngle * step * Math.PI / 180);
        step += 1;
      }
    }
    return newNodes;
  }
  render() {
    return (
      <PageHeaderLayout>
        <Fragment>
          <Select value={this.state.level} onChange={this.changeLevel} style={{ marginLeft: '5px', marginRight: '5px' }}>
            <Option value={1}>第一层级</Option>
            <Option value={2}>第二层级</Option>
            <Option value={3}>第三层级</Option>
            <Option value={4}>第四层级</Option>
          </Select>
          <Select value={this.state.layout} onChange={(value) => this.setState({ layout: value })} style={{ marginLeft: '15px', marginRight: '5px' }}>
            <Option value="force"> 智能布局 </Option>
            <Option value="circular">环形布局</Option>
            <Option value="center">中心布局</Option>
            <Option value="custom">自定义布局</Option>
          </Select>
          <div id="mountNode" style={{ backgroundColor: 'rgb(229, 221, 209)', height: this.height, width: this.width }} />
        </Fragment>
      </PageHeaderLayout>
    );
  }
}

export default connect()(RelationForce);

