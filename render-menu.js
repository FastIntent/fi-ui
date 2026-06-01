const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { default: Menu, SubMenu, MenuItem, ItemGroup } = require('./dist/components/Menu/index.js');

const el = React.createElement(
  Menu,
  { mode: 'inline', style: { width: 256 } },
  React.createElement(SubMenu, { key: 'sub1', title: 'Navigation One' },
    React.createElement(ItemGroup, { title: 'Item 1' },
      React.createElement(MenuItem, { key: '1' }, 'Option 1'),
      React.createElement(MenuItem, { key: '2' }, 'Option 2')
    )
  )
);

console.log(ReactDOMServer.renderToString(el));
