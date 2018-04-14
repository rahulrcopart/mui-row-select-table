export const ASCENDING = 'asc'
export const DESCENDING = 'desc'

const snakeCaseCaps = camelCaseString =>
  camelCaseString
    .match(/(([A-Z]|^)[^A-Z]*)/g)
    .map(component => component.toUpperCase())
    .join('_')

const getActions = camelCaseGriddleName => {
  const snakeCaseName = snakeCaseCaps(camelCaseGriddleName)
  const LOAD = `${snakeCaseName}_LOAD`
  const READY = `${snakeCaseName}_READY`
  const FAILED = `${snakeCaseName}_FAILED`
  const CLEAR = `${snakeCaseName}_CLEAR`
  const SET_PAGE = `${snakeCaseName}_SET_PAGE`
  const CHANGE_SORT = `${snakeCaseName}_CHANGE_SORT`
  const SET_FILTER = `${snakeCaseName}_SET_FILTER`

  return {
    load: () => ({ type: LOAD }),

    ready: (results, resultCount, maxPage, currentPage) => ({
      type: READY,
      results,
      resultCount,
      maxPage,
      currentPage
    }),

    failed: (error, place) => ({ type: FAILED, error: console.error(error) || error, place }), // eslint-disable-line no-console

    clear: () => ({
      type: CLEAR
    }),

    setPage: (page, pageSize) => ({
      type: SET_PAGE,
      page,
      pageSize
    }),

    changeSort: (sortColumn, sortAscending) => ({
      type: CHANGE_SORT,
      sortColumn,
      sortAscending
    }),

    setFilter: filter => ({ type: SET_FILTER, filter })
  }
}

export default getActions
