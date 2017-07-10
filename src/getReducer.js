const camelToSnake = (camelCase) => camelCase.match(/(([A-Z]|^)[^A-Z]*)/g)
  .map((component) => component.toUpperCase())
  .join('_')

const getInitialState = (baseReducer, initialPageSize, initialSortColumn) => ({
  ...baseReducer(undefined, {}),
  isLoading: false,
  results: [],
  resultCount: 0,
  maxPage: 0,
  currentPage: 0,
  sortAscending: false,
  filter: '',
  sortColumn: initialSortColumn,
  pageSize: initialPageSize,
})

const getRowSelectTableReducer = (reducer, camelCaseName, initialPageSize, initialSortColumn) => {
  const snakeCaseName = camelToSnake(camelCaseName)
  const LOAD = `${snakeCaseName}_LOAD`
  const READY = `${snakeCaseName}_READY`
  const FAILED = `${snakeCaseName}_FAILED`
  const CLEAR = `${snakeCaseName}_CLEAR`
  const SET_PAGE = `${snakeCaseName}_SET_PAGE`
  const CHANGE_SORT = `${snakeCaseName}_CHANGE_SORT`
  const SET_FILTER = `${snakeCaseName}_SET_FILTER`

  return (baseState = getInitialState(reducer, initialPageSize, initialSortColumn), action) => {
    const state = reducer(baseState, action)

    switch (action.type) {
      case LOAD:
        return {
          ...state,
          isLoading: true,
        }
      case READY: {
        return {
          ...state,
          results: action.results,
          resultCount: action.resultCount,
          maxPage: action.maxPage,
          isLoading: false,
          currentPage: action.currentPage,
        }
      }
      case FAILED:
        return {
          ...state,
          isLoading: false,
          error: action.error,
        }
      case CLEAR:
        return {
          ...state,
          results: [],
          resultCount: 0,
          maxPage: 1,
        }
      case SET_PAGE: {
        const pageSize = action.pageSize || state.pageSize
        return {
          ...state,
          currentPage: action.page,
          pageSize,
          maxPage: Math.ceil(state.resultCount / pageSize),
        }
      }
      case CHANGE_SORT:
        return {
          ...state,
          currentPage: 0,
          sortAscending: action.sortAscending,
          sortColumn: action.sortColumn,
        }
      case SET_FILTER:
        return {
          ...state,
          filter: action.filter,
        }
      default:
        return state
    }
  }
}

export default getRowSelectTableReducer
