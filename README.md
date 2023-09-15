# Antd Table Search

Antd Table Search is a React component library built for Ant Design (antd) table that enables global search functionality when `allowGlobalSearch` is set to true. This package provides a simple and convenient way to enhance your Ant Design tables with global search capabilities.

## Installation

You can install Antd Table Search via npm or yarn:

```bash
npm install antd-table-with-search
# or
yarn add antd-table-with-search
```
## Usage
Here's how you can use HelloWorld in your React project:

```javascript
import React from 'react';
import CustomTable from 'antd-table-with-search';

const dataSource = /* your data source */;
const columns = /* your column configuration */;

const App = () => {
  return (
    <div>
      <HelloWorld dataSource={dataSource} columns={columns} allowGlobalSearch={true} />
    </div>
  );
};

export default App;
```

## Additional Props
allowGlobalSearch: boolean