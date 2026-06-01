const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Dialog = require('rc-dialog').default;

const DEFAULT_PREFIX = process.env.FAST_UI_PREFIX || 'fi';

const html = ReactDOMServer.renderToString(
  React.createElement(Dialog, { prefixCls: `${DEFAULT_PREFIX}-modal`, visible: true, title: 'Title', footer: 'Footer' }, 
    React.createElement('div', null, 'Content')
  )
);
console.log(html);
