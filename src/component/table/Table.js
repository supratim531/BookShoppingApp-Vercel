import React from "react";
import DataTable from "react-data-table-component";

function Table(props) {
  return (
    <div>
      <DataTable
        columns={props.columns}
        data={props.data}
      />
    </div>
  );
}

export default Table;
