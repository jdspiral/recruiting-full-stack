import React, { useState, useEffect } from 'react'
import { ThemeContext } from './theme-context'

function App() {
  const apiUrl = 'http://localhost:8000/webservice.php'
  const [data, setData] = useState()
  const { theme, toggle, dark } = React.useContext(ThemeContext)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const getNodes = () => {
      fetch(apiUrl)
        .then(res => res.json())
        .then((json) => {
          setData(json)
        })
    }
    getNodes()
  }, [])

  function handleClick(node) {
    const updatedData = {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: node.id,
        collapsed: !node.collapsed,
      }),
    }

    fetch(apiUrl, updatedData)
      .then(response => response.json())
      .then(responseJson => console.log('response:', responseJson))
      .catch(error => console.error(error))
  }

  // eslint-disable-next-line react/prop-types
  function ListItem({ node }) {
    // eslint-disable-next-line react/prop-types
    const [collapsed, setCollapsed] = useState(node.collapsed)
    // eslint-disable-next-line react/prop-types
    const nestedNodes = (node.children || []).map(newNode => <ListItem key={newNode.id} node={newNode} type="child" />)

    return (
    // eslint-disable-next-line react/prop-types
      <div className={`node-wrapper ${node.collapsed ? 'show' : 'hidden'}`}>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <div
          className={`node ${node.children.length > 0 ? 'show' : 'hidden'}`}
          onClick={() => {
            setCollapsed(!collapsed)
            // eslint-disable-next-line react/prop-types
            handleClick(node)
          }}
        >
          {/* eslint-disable-next-line react/prop-types */}
          <img src={node.thumbnail.href} alt={node.thumbnail.description} title={node.thumbnail.description} width="50" height="50" />
          {/* eslint-disable-next-line react/prop-types */}
          <span className="name">{node.name}</span>
          {/* eslint-disable-next-line react/prop-types */}
          <span className={node.children.length > 0 ? 'display-arrow' : 'display-none'}>
            +
          </span>
        </div>
        {/* eslint-disable-next-line react/prop-types */}
        {!collapsed && node.children
          && (
          <div className="node-children">
            {nestedNodes}
          </div>
          )}
      </div>
    )
  }

  function modifyNodeArray(nodes, parent = null) {
    const nestedNodes = []

    Object.values(nodes).forEach((node) => {
      // parent can be a string or a number
      /* eslint-disable-next-line eqeqeq */
      if (node.parent == parent) {
        const children = modifyNodeArray(nodes, node.id)

        if (children.length) {
          /* eslint-disable-next-line no-param-reassign */
          node.children = children
        }

        nestedNodes.push(node)
      }
    })

    return nestedNodes
  }

  let nodes
  if (data) {
    const nodeTree = modifyNodeArray([...data.nodes])
    nodes = nodeTree.map(node => (
      <ListItem key={node.id} node={node} onClick={() => handleClick(node.id)} />
    ))
  }
  return (
    <div className="app" style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>
      <button
        type="button"
        onClick={toggle}
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.color,
          outline: 'none',
        }}
      >
        Toggle to
        {!dark ? 'Dark' : 'Light'}
        theme
      </button>
      <div className="node-list">
        {nodes}
      </div>
    </div>
  )
}
export default App
