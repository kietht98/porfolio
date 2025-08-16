import { Table } from "@radix-ui/themes";
import React from "react";

type ColumnProps = {
  title: string;
  key: string;
  keyIndex: string;
};

type DataTableProps = {
  keyIndex: string;
  [key: string]: any;
};
type TableProps = {
  columns: ColumnProps[];
  data: DataTableProps[];
};

const TableComps = (props: TableProps) => {
  const { columns, data } = props;
  return (
    <div>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            {columns.map((col) => {
              return <Table.Cell key={col.key}>{col.title}</Table.Cell>;
            })}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map((item) => {
            return (
              <Table.Row key={item.keyIndex}>
                {Object.keys(item).map((itm) => {
                  return <Table.Cell key={`${itm[0]}`}>{itm}</Table.Cell>;
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default TableComps;
