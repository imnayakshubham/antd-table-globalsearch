import React from 'react';
import './App.css';
import { CustomTable } from './CustomTable/CustomTable';

function App() {
  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: "id",
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
    {
      key: '3',
      name: 'Mike3',
      age: 32,
      address: "id",
    },
    {
      key: '4',
      name: 'John4',
      age: 42,
      address: ' John4 10 Downing Street',
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (text: string) => {
        return <p><div>{text}</div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas perspiciatis, facilis repellat possimus voluptas autem laudantium doloremque illo, veritatis quod obcaecati non eligendi numquam dolore delectus consectetur odio vero libero!</p>
      }
    },
  ];

  return (
    <div className="App">
      <CustomTable
        dataSource={dataSource}
        columns={columns}
        allowResizing={true}
        pagination={false}
        bordered={true}
        globalSearch={{
          allowGlobalSearch: true,
        }}
        hideColumns={true}
        size={'small'} />
    </div>
  );
}

export default App;
