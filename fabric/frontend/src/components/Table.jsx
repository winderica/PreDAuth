import React from 'react';
import {
    AddBox,
    ArrowUpward,
    Check,
    ChevronLeft,
    ChevronRight,
    Clear,
    DeleteOutline,
    Edit,
    FilterList,
    FirstPage,
    LastPage,
    Remove,
    SaveAlt,
    Search,
    ViewColumn
} from '@material-ui/icons';
import MaterialTable from 'material-table';

const tableIcons = {
    Add: AddBox,
    Check,
    Clear,
    Delete: DeleteOutline,
    DetailPanel: ChevronRight,
    Edit,
    Export: SaveAlt,
    Filter: FilterList,
    FirstPage,
    LastPage,
    NextPage: ChevronRight,
    PreviousPage: ChevronLeft,
    ResetSearch: Clear,
    Search,
    SortArrow: ArrowUpward,
    ThirdStateCheck: Remove,
    ViewColumn
};

export const Table = (props) => {
    return (
        <MaterialTable
            icons={tableIcons}
            options={{
                search: false,
                headerStyle: {
                    padding: 16
                },
                grouping: true
            }}
            {...props}
        />
    );
};
