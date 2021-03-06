import React from 'react';
import Table from './table';
import { data } from './data';

export default function TableExample(props) {
  const cols = [
    {
      name: 'Name',
      selector: 'name'
    },
    {
      name: 'Job',
      selector: 'job'
    },
    {
      name: 'Age',
      selector: 'age',
      cell: row => <div>{`${row.age} years old`}</div>
    }
  ];

  const Chill = props => {
    const { selected } = props;
    return <div>I can be what I want</div>;
  };

  return (
    <div
      style={{
        width: '60%',
        margin: '0 auto',
        padding: 50
      }}
    >
      <Table withCheckbox data={data} columns={cols}>
        <Chill />
      </Table>
    </div>
  );
}
