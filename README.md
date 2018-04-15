## Introduction

A Component for displaying large lists of tabular data from an external API.

## Installation

`yarn add mui-row-select-table`

## Code Example

**Component**

```js
import React from 'react'
import RowSelectTable from 'mui-row-select-table'

const column = (name, headerCellContent, other = {}) => ({
  name,
  headerCellContent,
  sortable: true,
  ...other
})

const results = [
  { id: 0, first_name: 'Leia', last_name: 'Skywalker', home_planet: 'Naboo' },
  { id: 1, first_name: 'Darth', last_name: 'Vader', home_planet: 'Tatooine' },
  {
    id: 2,
    first_name: 'Luke',
    last_name: 'Skywalker',
    home_planet: 'Tatooine'
  },
  { id: 3, first_name: 'Han', last_name: 'Solo', home_planet: 'Unknown' },
  { id: 4, first_name: 'Rey', last_name: '', home_planet: 'Jakku' },
  { id: 5, first_name: 'Kylo', last_name: 'Ren', home_planet: 'Unknown' }
]

const renderAction = () => <i className="material-icons">remove_red_eye</i>

const getColumnMetadata = () => [
  column('first_name', 'First Name', {}),
  column('last_name', 'Last Name', {}),
  column('home_planet', 'Home Planet', {})
]

const RowSelectTableExample = () => (
  <RowSelectTable
    columnMetadata={getColumnMetadata()}
    getRowId={rowData => rowData.id}
    noDataMessage={'No results found.'}
    setPage={() => {}}
    onRowClick={(rowData, e) => console.log('Row Clicked')}
    results={results}
    isLoading={false}
    changeSort={() => {}}
    setFilter={() => {}}
    maxPage={2}
    pageSize={20}
    currentPage={0}
    pageSizeOptions={[20, 40, 100]}
  />
)

export default RowSelectTableExample
```

**Actions File**

```js
import { getActions } from 'mui-row-select-table'

// Actions can be used to dispatch to Redux on the respective events.
const { ready, load, clear, failed, setPage, changeSort, setFilter } = getActions('componentName')
```

**Reducers File**

```js
import { getReducer } from 'mui-row-select-table'

const componentReducer = (state = {}, action ) => {
	default:
		return state
}

export default getReducer(componentReducer, 'componentName', 20, '')
```

## Props

| Param                 | Type                                                                                     | Description                                                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| props                 | <code>Object</code>                                                                      |                                                                                                                                                  |
| props.results         | <code>Array.&lt;Object&gt;</code>                                                        | The data used to populate the rows.                                                                                                              |
| props.columnMetadata  | <code>[Array.&lt;ColumnMetadataObject&gt;](#RowSelectTable..ColumnMetadataObject)</code> | Information about how to display each column.                                                                                                    |
| props.getRowId        | <code>function</code>                                                                    | For helping React generate a unique key for each row. This function is called once with each object in props.results.                            |
| props.onRowClick      | <code>function</code>                                                                    | A function that is called with an object from props.results when the corresponding row is clicked (or when the Enter is pressed while selected). |
| props.changeSort      | <code>function</code>                                                                    | Takes a sortColumn and sortAscending value as parameters--called when a sortable column's header is clicked.                                     |
| props.setPage         | <code>function</code>                                                                    | Takes an object with page property (and optionally, pageSize) to change the currentPage and pageSize props.                                      |
| props.maxPage         | <code>number</code>                                                                      | The last available page in your results. (For pagination in footer.)                                                                             |
| props.pageSize        | <code>number</code>                                                                      | The number of rows per page. (For pagination in footer.)                                                                                         |
| props.pageSizeOptions | <code>Array.&lt;number&gt;</code>                                                        | The different options the user should be able to set for pageSize. (For pagination in footer)                                                    |
| props.currentPage     | <code>number</code>                                                                      | The current page. (For pagination in footer)                                                                                                     |
| props.isLoading       | <code>bool</code>                                                                        | Whether or not to display a spinner. Set this value to false when your AJAX request resolves.                                                    |
| props.sortColumn      | <code>string</code>                                                                      | The column currently being used to sort the results. (For sort icon in header.)                                                                  |
| props.sortAscending   | <code>bool</code>                                                                        | True for ascending, false for descending. (For sort icon in header)                                                                              |
| props.noDataMessage   | <code>function</code>                                                                    | A function that returns a component to be displayed when there is no data available. Should be customised from Parent.                           |
| props.footerLabels    | <code>Object</code>                                                                      | Object containing footer labels that are displayed in the Footer Section.                                                                        |

getActions('ComponentName') returns to you set of Actions that are component specific and allow you to dispatch unique actions and have multiple RowSelectTables throughout the application.

getReducer(componentReducer, componentName, initalPageSize, initialSortColumn )

<a name="RowSelectTable..ColumnMetadataObject"></a>

### RowSelectTable~ColumnMetadataObject

Configuration for your columns.

**Kind**: inner typedef of <code>[RowSelectTable](#RowSelectTable)</code>
**Properties**

| Name              | Type                                                                             | Default                      | Description                                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| columnName        | <code>string</code>                                                              |                              | A key that matches a key in your props.results objects.                                                                     |
| headerCellContent | <code>string</code> &#124; <code>number</code> &#124; <code>React.Element</code> |                              | The content of this column's header cell.                                                                                   |
| display           | <code>function</code>                                                            | <code>(val) =&gt; val</code> | An optional function to transform your data in results before displaying it in the table. Should return a valid React node. |
| sortable          | <code>bool</code>                                                                | <code>false</code>           | Whether to allow sorting by clicking the column header.                                                                     |

## Contributions

Contributions are welcome, create a Pull Request for any improvements/fixes.
