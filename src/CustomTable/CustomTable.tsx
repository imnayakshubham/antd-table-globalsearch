import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, Table, TableProps } from 'antd';
import "./CustomTable.css"
type AnyObject = Record<PropertyKey, any>;

export interface CustomTableProps<RecordType extends AnyObject = AnyObject> extends TableProps<RecordType> {
    allowResizing?: boolean;
    globalSearch: {
        allowGlobalSearch?: boolean,
        onChange?: (e: any) => void
    },
    hideColumns?: boolean
}

export const CustomTable = <RecordType extends AnyObject = AnyObject>(
    props: CustomTableProps<RecordType>
) => {
    const { allowResizing = false,
        globalSearch: {
            allowGlobalSearch = false,
        },
        columns: initialColumns = [], ...restProps } = props;
    const [columns, setColumns] = useState(initialColumns);

    // const [columnNames, setColumnNames] = useState(() => columns.reduce((acc, curr: any) => {
    //     return { ...acc, [curr?.dataIndex]: true }
    // }, {}))

    const [resizingColumnIndex, setResizingColumnIndex] = useState<number | undefined>(0);
    const resizingColumnIndexRef = useRef<number | undefined>(resizingColumnIndex);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const tableId = useMemo(() => `table_${Math.random().toString(16).slice(2)}`, [])

    const [tableContent, setTableContent] = useState<string[]>([])

    // useEffect(() => {
    //     const data = document.getElementsByClassName("ant-table-cell")
    // }, [])

    const handleResize = useCallback((index: number, delta: number, event: MouseEvent) => {
        setColumns((prevColumns) => {
            const updatedColumns = [...prevColumns];
            const newWidth = Number(prevColumns[index]?.width ?? event.clientX ?? 150) + delta;
            updatedColumns[index] = { ...prevColumns[index], width: newWidth };
            return updatedColumns;
        });
    }, []);

    const resizeListener = useCallback((e: MouseEvent) => {
        e.stopPropagation()
        if (resizingColumnIndexRef.current !== undefined) {
            handleResize(resizingColumnIndexRef.current, e.movementX, e);
        }
        window.onmouseup = () => {
            window.removeEventListener('mousemove', resizeListener);
            setResizingColumnIndex(undefined);
        };
    }, [handleResize]);

    const renderResizableTitle = useCallback((column: any, columnIndex: number) => {
        return <div className="resizable-title" style={{ width: column.width }}>
            {column.title}
            {allowResizing && (
                <div
                    className="resizeHandle"
                    onMouseDown={() => {
                        setResizingColumnIndex(columnIndex);
                        resizingColumnIndexRef.current = columnIndex
                        window.addEventListener('mousemove', resizeListener, { passive: true });
                    }}
                />
            )}
        </div>
    }, [allowResizing, resizeListener])

    const customRenderedColumns = useMemo(() => columns.map((column, index) => {
        return {
            ...column,
            // hide_column: column ? columnNames[column?.dataIndex ?? column?.key] : false,
            ...(allowResizing && { title: renderResizableTitle(column, index) }),
        }
    }), [allowResizing, columns, renderResizableTitle]);

    const filteredDataSource = useMemo(() => props.dataSource?.filter((record: any, index) => {
        const recordContent = tableContent[index]?.toLowerCase()
        if (tableContent.length) {
            return recordContent.includes(searchTerm?.toLowerCase())
        }
        return true
    }), [props.dataSource, searchTerm, tableContent]);

    // const hideColumnsOverlay = () => {
    //     return (
    //         <Menu style={{ padding: 10, width: "max-content" }}>
    //             {Object.entries(columnNames).map(([key, value]: any) => (
    //                 <Menu.Item key={key}>
    //                     <Row
    //                         justify="space-between"
    //                         wrap={false}
    //                         style={{ height: "100%", alignItems: "center" }}
    //                     >
    //                         <Text>{key}</Text>
    //                         <Switch
    //                             style={{ marginLeft: 10 }}
    //                             checked={value}
    //                             onChange={(e: boolean) => {
    //                                 setColumnNames((prevState: any) => {
    //                                     prevState[key] = e;
    //                                     return { ...prevState };
    //                                 })
    //                             }
    //                             }
    //                         />
    //                     </Row>
    //                 </Menu.Item>
    //             ))}
    //             <Divider style={{ margin: "10px 0" }} />
    //             <Row justify="space-between">
    //                 <Button
    //                     onClick={() => {
    //                         setColumnNames((prevState: any) =>
    //                             Object.entries(prevState || {}).reduce(
    //                                 (obj: any, [key, value]: any) => ({ ...obj, [key]: false }),
    //                                 {},
    //                             ),
    //                         )
    //                         setColumns([])
    //                     }
    //                     }
    //                     type="default"
    //                     size="small"
    //                 >
    //                     {"Hide All"}
    //                 </Button>
    //                 <Button
    //                     onClick={() => {
    //                         setColumnNames((prevState: any) =>
    //                             Object.entries(prevState || {}).reduce(
    //                                 (obj: any, [key, value]: any) => ({ ...obj, [key]: true }),
    //                                 {},
    //                             ),
    //                         )
    //                         setColumns(initialColumns)
    //                     }
    //                     }
    //                     type="default"
    //                     size="small"
    //                 >
    //                     {"Show all"}
    //                 </Button>
    //             </Row>
    //         </Menu>
    //     );
    // };

    const accessAndStoreTableText = useCallback(() => {
        const table = document.getElementById(tableId);
        const cellTextArray = [];

        if (table) {
            const rows = Array.from(table.getElementsByTagName('tr'))?.slice(1);
            if (rows) {
                for (let j = 0; j < rows.length; j++) {
                    const cellText = rows[j].innerText.replaceAll("\t", " ").replaceAll("\n", "");
                    cellTextArray.push(cellText);
                }
            }
        }

        return cellTextArray;
    }, [tableId])

    useEffect(() => {
        const data = accessAndStoreTableText()
        setTableContent(data)
    }, [accessAndStoreTableText])


    return (
        <>
            <div className='table__action'>
                {allowGlobalSearch &&
                    <Input
                        className='custom__table__search'
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                }
                {/* {hideColumns && <Popover
                    placement="left"
                    content={hideColumnsOverlay}
                    trigger="click"
                >
                    {Object.values(columns || {}).every((res: any) => res) ? (
                        <Button type="text">
                            <Text strong>{"Hide columns"}</Text>
                        </Button>
                    ) : (
                        <Tag style={{ cursor: "pointer", padding: "5px 20px" }} color={"blue"}>
                            {`${Object.values(columns || {}).filter((res: any) => !res).length} Hidden Columns`}
                        </Tag>
                    )}
                </Popover>} */}
            </div >
            <Table
                id={tableId}
                {...restProps}
                columns={customRenderedColumns}
                dataSource={filteredDataSource}
            // {(!customRenderedColumns.length || !filteredDataSource.length) ? (
            //     { locale: { emptyText: "No data" } }
            // ) : (
            //     {}
            // )
            // }
            />
        </>
    );
};
