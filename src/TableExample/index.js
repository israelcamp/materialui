import React from 'react';
import Table from './table';
import { data } from './data';

export default function TableExample(props) {

  const cols = [
    {
      name: "Name",
      selector: "name",
    },
    {
      name: "Job",
      selector: "job",
    },
    {
      name: "Age",
      selector: "age",
      cell: row => <div>{row.age} years old</div>
    }
  ]

  return (
    <div style={{
      width: "40%",
      margin: "0 auto",
      padding: 50,
    }}>
      <Table
        data={data}
        columns={cols}
      />
    </div>
  )
}