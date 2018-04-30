import React, { Component } from 'react'
import * as PropTypes from 'prop-types'
import cn from 'classnames'
import { CircularProgress } from 'material-ui'
import { ASCENDING, DESCENDING } from './getActions'
import Footer from './Footer'
import { headerCell, sortableColumnHeaderCell, selectedRow, row, cell, table, circularProgress } from './RowSelectTable.css'

export const RowSelectTableSortIcon = ({ direction }) =>
  <span className={cn('fa', `fa-sort-alpha-${direction}`)} style={{ paddingLeft: '.5em' }} />

export const RowSelectTableHeader = ({ columnMetadata, sortColumnName, sortDirection, changeSort, onSelectAllRows = null, isAllRowsSelected = null, rowSelectionEnabled = null }) =>
  <thead>
    <tr>
      { rowSelectionEnabled ?
        (<th className={cn(headerCell)} >
          <input checked={isAllRowsSelected} onClick={(e) => onSelectAllRows(e)} type="checkbox" />
        </th>) : null}

        {columnMetadata.map(({ headerCellContent, name, sortable }) =>
          <th key={name} name={name} className={cn(headerCell, { [sortableColumnHeaderCell]: sortable })} onClick={() => sortable && changeSort(name)}>
            {(headerCellContent || headerCellContent === '') ? headerCellContent : name}
            { sortable && sortColumnName === name && <RowSelectTableSortIcon direction={sortDirection} />}
          </th>
        )}
    </tr>
  </thead>

export const RowSelectTableRow = ({
  data: rowData,
  onClick,
  columnMetadata,
  onMouseEnter,
  selectedLotId,
  onClickHold,
  getRowId,
  className = null,
  onSelectRow = null,
  isRowSelected = null,
  rowSelectionEnabled = null,
  selectRowStyle = (rowData) => { },
  selectableRow = () => true,
}) => {
  const id = getRowId(rowData)
  return (
    <tr
      style={Object.assign({}, selectRowStyle(rowData))}
      id={id}
      onMouseEnter={() => onMouseEnter(id)}
      onClick={(e) => onClick(e, rowData)}
      className={cn({ [selectedRow]: selectedLotId === id }, className, row)}
      name={id}
    >
      {rowSelectionEnabled ? (
        <td className={cn(cell)}>
          <input checked={isRowSelected(rowData)} disabled={selectableRow(rowData)} onClick={(e) => onSelectRow(e, rowData)} type="checkbox" />
        </td>) : null}

        {columnMetadata.map(({ name, display = (x) => x, tdClassName, customComponent: CustomComponent }, i) => (
          CustomComponent ? <CustomComponent name={rowData.name} id={id} /> :
          <td onMouseDown={() => onClickHold(id, i)} className={cn(cell, tdClassName)}>
            {display(rowData[name], rowData)}
          </td>
        ))}
    </tr>
  )
}

/**
 * A Component for displaying large lists of tabular data from an external API.
 *
 * @class RowSelectTable
 * @extends React.Component
 * @param props {Object}
 * @param props.results {Object[]} The data used to populate the rows.
 * @param props.columnMetadata {RowSelectTable~ColumnMetadataObject[]} Information about how to display each column.
 * @param props.getRowId {function} For helping React generate a unique key for each row. This function is called once with each object in props.results.
 * @param props.onRowClick {function} A function that is called with an object from props.results when the corresponding row is clicked (or when the Enter is pressed while selected).
 * @param props.changeSort {function} Takes a sortColumn and sortAscending value as parameters--called when a sortable column's header is clicked.
 * @param props.setPage {function} Takes an object with page property (and optionally, pageSize) to change the currentPage and pageSize props.
 * @param props.maxPage {number} The last available page in your results. (For pagination in footer.)
 * @param props.pageSize {number} The number of rows per page. (For pagination in footer.)
 * @param props.pageSizeOptions {number[]} The different options the user should be able to set for pageSize. (For pagination in footer)
 * @param props.currentPage {number} The current page. (For pagination in footer)
 * @param props.isLoading {bool} Whether or not to display a spinner. Set this value to false when your AJAX request resolves.
 * @param props.sortColumn {string} The column currently being used to sort the results. (For sort icon in header.)
 * @param props.sortAscending {bool} True for ascending, false for descending. (For sort icon in header)
 * @param props.noDataMessage {function} A function that returns a component to be displayed when there is no data available. Should be customised from Parent.
 */
 /**
  * Configuration for your columns.
  * @typedef RowSelectTable~ColumnMetadataObject
  * @prop columnName {string} A key that matches a key in your props.results objects.
  * @prop headerCellContent {(string | number | React.Element)} The content of this column's header cell.
  * @prop {function} [display=(val) => val] An optional function to transform your data in results before displaying it in the table. Should return a valid React node.
  * @prop {bool} [sortable=false] Whether to allow sorting by clicking the column header.
 */
class RowSelectTable extends Component {
  static defaultProps = {
    noDataMessage: () => <span>There is no data to display.</span>,
    listenKeyboard: true,
    showFooter: true,
    // showHeader: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedLotId: '',
      selectedIndex: 0,
      held: false,
    }
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyup)
  }

  componentWillReceiveProps(nextProps) {
    const { results, getRowId } = this.props
    if (results.length === 0) {
      return
    }
    const selectedIndex = Math.min(nextProps.results.length - 1, this.state.selectedIndex)
    const selectedLotId = (nextProps.results && nextProps.results.length && nextProps.results[selectedIndex]) ? getRowId(nextProps.results[selectedIndex]) : ''
    this.setState({ selectedLotId, selectedIndex })
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyup)
  }

  clickHoldTimer = null

  handleKeyup = (e) => {
    const { results, getRowId, listenKeyboard } = this.props

    if (document.activeElement !== document.body || !listenKeyboard) {
      return
    }
    const currentSelectedIndex = this.state.selectedIndex
    switch (e.keyCode) {
      case 13: // enter key
        return this.state.selectedLotId !== '' && this.props.onRowClick(results.find((result) => getRowId(result) === this.state.selectedLotId))
      case 38: // up
        return this.state.selectedIndex > 0
          && this.setState({
            selectedIndex: currentSelectedIndex - 1,
            selectedLotId: getRowId(results[currentSelectedIndex - 1]),
          })
      case 40: // down
        return this.state.selectedIndex < (this.props.pageSize - 1) // suppose the pageSize is 20, so the maximum accessible index would be 19
          && this.setState({
            selectedIndex: currentSelectedIndex + 1,
            selectedLotId: getRowId(results[currentSelectedIndex + 1]),
          })
      default:
    }
  }

  selectDOMNodeContents = (node) => {
    const selection = document.getSelection()
    const range = document.createRange()
    range.selectNodeContents(node)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  handleMouseDown(lotId, tdIndex) {
    let tableDataIndex = tdIndex
    if (this.props.rowSelectionEnabled) {
      tableDataIndex += 1
    }
    this.clickHoldTimer = window.setTimeout(() => {
      const tData = document.getElementById(lotId).children[tableDataIndex]
      this.selectDOMNodeContents(tData)
      this.setState({
        held: true,
      })
    }, 500)
  }

  handleRowClick = (e, rowData) => {
    window.clearTimeout(this.clickHoldTimer)
    if (!this.state.held) {
      e.preventDefault()
      this.props.onRowClick(rowData, e)
    }
    this.setState({
      held: false,
    })
  }

  handleRowMouseEnter = (rowId) => {
    if (this.state.selectedLotId !== rowId) {
      let indexNumber = 0
      this.props.results.map((result, i) => {
        if (this.props.getRowId(result) === rowId) {
          indexNumber = i
        }
      })
      this.setState({
        selectedIndex: indexNumber,
        selectedLotId: rowId,
      })
    }
  }

  handleRowClickHold = (lotId, tdIndex) => this.handleMouseDown(lotId, tdIndex)

  changeSort = (newSortColumn) => {
    const { sortColumn, sortAscending, changeSort } = this.props

    const newSortAscending = newSortColumn === sortColumn ? !sortAscending : true

    changeSort(newSortColumn, newSortAscending)
  }

  render() {
    const {
      results, maxPage, setPage, isLoading, pageSize, currentPage, pageSizeOptions,
      getRowId, columnMetadata, sortColumn, sortAscending, noDataMessage: NoDataMessage,
      rowSelectionEnabled, onSelectAllRows, isAllRowsSelected, onSelectRow, isRowSelected,
      showFooter, footerLabels, selectRowStyle, selectableRow
    } = this.props
    const pagerProps = { maxPage, setPage, resultsPerPage: pageSize, currentPage, pageSizeOptions, footerLabels }
    const searchReturnsResults = !isLoading && results && results.length !== 0 && showFooter
    // <Griddle {...this.griddleProps()} ref={(g) => this._griddle = window._griddle = g} />

    const displayResults = results.length === 0
      ? <tr><td className={cell} colSpan={columnMetadata.length}><NoDataMessage /></td></tr>
      : results.map((r, i) =>
        <RowSelectTableRow
          key={i}
          data={r}
          getRowId={getRowId}
          onMouseEnter={this.handleRowMouseEnter}
          onClickHold={this.handleRowClickHold}
          onClick={this.handleRowClick}
          selectedLotId={this.state.selectedLotId}
          columnMetadata={columnMetadata}
          rowSelectionEnabled={rowSelectionEnabled}
          onSelectRow={onSelectRow}
          isRowSelected={isRowSelected}
          selectRowStyle={selectRowStyle}
          selectableRow={selectableRow}
        />
      )

    return (
      <div style={{ overflowX: 'auto', overflowY: 'hidden', width: '100%' }}>
        <table className={table}>
          <RowSelectTableHeader
            columnMetadata={columnMetadata}
            sortColumnName={sortColumn}
            sortDirection={sortAscending ? ASCENDING : DESCENDING}
            changeSort={this.changeSort}
            rowSelectionEnabled={rowSelectionEnabled}
            onSelectAllRows={onSelectAllRows}
            isAllRowsSelected={isAllRowsSelected}
          />
          <tbody>
            {isLoading
              ? <tr><td className={cell} colSpan={columnMetadata.length}>
                <CircularProgress className={circularProgress} color="#073473" />
              </td></tr>
              : displayResults}
          </tbody>
        </table>
        {searchReturnsResults && <Footer {...pagerProps} />}
      </div>
    )
  }
}
RowSelectTable.propTypes = {
  columnMetadata: PropTypes.arrayOf(PropTypes.object),
  results: PropTypes.arrayOf(PropTypes.any),
  setPage: PropTypes.func.isRequired,
  changeSort: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
  maxPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  sortColumn: PropTypes.string.isRequired,
  selectRowStyle: PropTypes.func,
  // sortDirection: PropTypes.oneOf([DESCENDING, ASCENDING]).isRequired,
  sortAscending: PropTypes.bool.isRequired,
  getRowId: PropTypes.func.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  noDataMessage: PropTypes.func, // expects a component in noDataMessage prop, otherwise displays from default Props
  rowSelectionEnabled: PropTypes.bool.isRequired,
  isAllRowsSelected: PropTypes.bool,
  onSelectAllRows: PropTypes.func,
  isRowSelected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  listenKeyboard: PropTypes.bool,
  showFooter: PropTypes.bool,
  selectableRow: PropTypes.func,
}

export default RowSelectTable
