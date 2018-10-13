import { Tree, Button, Input } from 'antd';
import React, { PureComponent } from 'react';

const TreeNode = Tree.TreeNode;
let addIndex = 1;

export default class TreeDemo extends PureComponent {
  state = {
    treeData: [
      { title: 'Expand to load', key: '0' },
      { title: 'Expand to load', key: '1' },
      { title: 'Tree Node', key: '2', isLeaf: true },
    ],
    loadedKeys: [],
    deleteKey: '',
  };

  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  changeTitle = (key, tree, title) => {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node && node.key == key) {
        node.title = title;
      } else {
        if (node && node.children) {
          this.changeTitle(key, node.children, title);
        }
      }
    }
  };

  handelOnSelect = (selectedKeys, { selected, selectedNodes, node, event }) => {
    let key = node.props.dataRef.key;
    this.changeTitle(key, this.state.treeData, '变更标题');
    this.setState({
      treeData: [...this.state.treeData],
    });
  };
  removeTreeNode = (key, tree) => {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node && node.key == key) {
        tree[i] = null;
      } else {
        if (node && node.children) {
          this.removeTreeNode(key, node.children);
        }
      }
    }
  };

  addTreeNode = (parentKey, treeNode, tree) => {
    if (!parentKey) {
      tree.push(treeNode);
    } else {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].key == parentKey) {
          tree[i].children == tree.children || [];
          tree[i].children.push(treeNode);
        } else if (tree[i].children) {
          this.addTreeNode(parentKey, treeNode, tree[i].children);
        }
      }
    }
  };

  handelAddTreeNode = () => {
    //TODOS 若没有展开可直接不执行这个操作
    addIndex = addIndex + 1;
    if (!this.state.loadedKeys.includes(this.state.deleteKey)) {
      console.log('========未加载不必更新本地======');
      return;
    }
    this.addTreeNode(this.state.deleteKey, {
      title: `新增-${addIndex}`,
      key: `add-${addIndex}`,
    }, this.state.treeData);
    console.log(this.state.treeData);
    this.setState({
      treeData: [...this.state.treeData],
    });
  };

  onLoadData = (treeNode) => {
    console.log('onLoadData:' + this.state.loadedKeys);
    const { loadedKeys } = this.state;
    return new Promise((resolve) => {
      if (treeNode.props.children && loadedKeys.find(val => val == treeNode.props.dataRef.key)) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.props.dataRef.children = [
          { title: `${treeNode.props.eventKey}-0`, key: `${treeNode.props.eventKey}-0`, isLeaf: false },
          { title: `${treeNode.props.eventKey}-1`, key: `${treeNode.props.eventKey}-1`, isLeaf: false },
        ];
        loadedKeys.push(treeNode.props.dataRef.key);
        this.setState({
          treeData: [...this.state.treeData],
          loadedKeys: [...loadedKeys],
        });
        resolve();
      }, 100);
    });
  };

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item) {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode {...item} dataRef={item}/>;
      }
    });
  };
  deleteLoadedKey = () => {
    const { loadedKeys } = this.state;
    const newLoadedKeys = loadedKeys.filter(val => val != '0-0');
    console.log('newLoadedKeys:' + newLoadedKeys);
    this.setState({
      loadedKeys: [...newLoadedKeys],
    });
  };

  handelRemoveTreeNode = () => {
    this.removeTreeNode(this.state.deleteKey, this.state.treeData);
    this.setState({
      treeData: [...this.state.treeData],
    });
  };
  handelChange = (e) => {
    this.setState({
      deleteKey: e.target.value,
    });
  };

  render() {
    const { loadedKeys } = this.state;
    console.log('loadedKeys:' + loadedKeys);
    return (
      <div>
        <Input placeholder="节点ID" value={this.state.deleteKey} onChange={this.handelChange}/>
        <Button type="danger" onClick={this.handelRemoveTreeNode}>删除已加载节点</Button>
        <Button type="primary" onClick={this.handelAddTreeNode}>添加节点</Button>
        <Tree loadData={this.onLoadData} loadedKeys={loadedKeys} onSelect={this.handelOnSelect}>
          {this.renderTreeNodes(this.state.treeData)}
        </Tree>
      </div>
    );
  }
}
