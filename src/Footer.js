import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { TextField, Menu, MenuItem, Popover, RaisedButton } from 'material-ui'
import range from './range'
import styles from './Footer.css'

const KEY_G = 71

const PreviousPageButton = ({ onClick }) => (
  <button onClick={onClick} className={styles.pageStepButton}>
    {' '}
    <i className={cn('fa', 'fa-chevron-left', styles.arrowIcon)} aria-hidden="true" />
  </button>
)

const NextPageButton = ({ onClick }) => (
  <button onClick={onClick} className={styles.pageStepButton}>
    <i className={cn('fa', 'fa-chevron-right', styles.arrowIcon)} aria-hidden="true" />
  </button>
)

const FirstPageButton = ({ onClick }) => (
  <button onClick={onClick} className={styles.pageStepButton}>
    1...
  </button>
)

const LastPageButton = ({ onClick, text }) => (
  <button onClick={onClick} className={styles.pageStepButton}>
    ...{text}
  </button>
)

class RowSelectTableFooter extends Component {
  static get defaultProps() {
    return {
      maxPage: 0,
      currentPage: 0,
      footerLabels: {
        showing: 'Showing',
        results: 'Results',
        go: 'Go',
        of: 'Of',
        goToPage: 'Go To Page'
      }
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      resultsPerPage: props && props.resultsPerPage ? props.resultsPerPage : 20,
      inputValue: '',
      popover: false
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.focusPageField, false)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.focusPageField)
  }

  focusPageField = event => {
    if (event.ctrlKey && event.keyCode === KEY_G) {
      window.scrollTo(0, document.body.scrollHeight)
      this.pageField.focus()
    }
  }

  handleTouchTap = event => {
    event.preventDefault()
    this.setState({
      popover: true,
      anchorEl: event.currentTarget
    })
  }

  handleRequestClose = () => this.setState({ popover: false })

  handleChange = (event, index, value) => {
    this.setState({ popover: false })
    this.pageChange(0, this.props.pageSizeOptions[value])
  }

  pageChange = (page, resultsPerPage) => {
    this.props.setPage({ page, resultsPerPage })
    const maybeNewResultsPerPage = resultsPerPage ? { resultsPerPage } : {}
    this.setState({ ...maybeNewResultsPerPage, inputValue: '' })
  }

  updateInputValue = e => {
    const input = e.target.value.replace(/\D|^0/g, '')
    if (!input.length) {
      this.setState({ inputValue: '' })
      return
    }
    this.setState({
      inputValue: Math.max(1, Math.min(input, this.props.maxPage))
    })
  }

  handleKeyUp = e => {
    if (e.key === 'Enter') {
      e.nativeEvent.stopPropagation()
      if (this.state.inputValue === '') return
      // this.pageChange(this.state.inputValue - 1)
      this.pageChange(Math.min(this.state.inputValue, this.props.maxPage) - 1)
    }
  }

  render() {
    const { currentPage, maxPage, pageSizeOptions, resultCount, footerLabels } = this.props
    const { inputValue } = this.state
    const resultCountText = this.props.resultCount ? ` ${footerLabels.of} ${resultCount}` : ''
    const previousButton = currentPage > 0 && <PreviousPageButton onClick={() => this.pageChange(currentPage - 1)} />
    const nextButton = currentPage !== maxPage - 1 && (
      <NextPageButton onClick={() => this.pageChange(currentPage + 1)} />
    )
    const firstButton = <FirstPageButton onClick={() => this.pageChange(0)} />
    const lastButton = <LastPageButton text={maxPage} onClick={() => this.pageChange(maxPage - 1)} />

    let startIndex = Math.max(currentPage - 2, 0)
    const endIndex = Math.min(startIndex + 5, maxPage)
    if (maxPage >= 5 && endIndex - startIndex <= 4) {
      startIndex = endIndex - 5
    }
    const indices = range(startIndex, endIndex - 1)
    const options = indices.map(i => (
      <button
        className={cn({ [styles.currentPageSelected]: currentPage === i }, styles.pageButton)}
        data-value={i}
        key={i}
        onClick={e => this.pageChange(parseInt(e.target.getAttribute('data-value'), 10))}
      >
        {i + 1}
      </button>
    ))

    return (
      <div className={styles.mainPagerContent}>
        <div className={styles.showResults}>
          <span style={{ marginLeft: '5px', marginRight: '20px' }}>
            <span className={styles.showing}> {`${footerLabels.showing}`} </span>
            <RaisedButton
              label={this.state.resultsPerPage}
              labelPosition="before"
              backgroundColor="#1D5AB9"
              labelStyle={{ color: 'white' }}
              onClick={this.handleTouchTap}
              style={{ minWidth: '82px' }}
              icon={
                <i className="material-icons" style={{ color: 'white', marginRight: '5px' }}>
                  keyboard_arrow_down
                </i>
              }
            />
            <Popover
              open={this.state.popover}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
              targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              onRequestClose={this.handleRequestClose}
            >
              <Menu onItemTouchTap={this.handleChange}>
                {pageSizeOptions.map((pageSizeOption, i) => (
                  <MenuItem value={i} key={i} primaryText={pageSizeOption} />
                ))}
              </Menu>
            </Popover>
            <span className={styles.results}>{`${footerLabels.results}${resultCountText}`}</span>
          </span>
          <span>
            {`${footerLabels.goToPage}`}
            <TextField
              ref={node => {
                this.pageField = node
              }}
              id="text-field-controlled"
              className={styles.textField}
              value={inputValue}
              onChange={this.updateInputValue}
              onKeyUp={this.handleKeyUp}
              type="number"
              style={{
                marginLeft: '5px',
                marginRight: '5px',
                width: '60px',
                height: '36px',
                border: '1px solid #999',
                borderRadius: '3px'
              }}
              underlineFocusStyle={{ width: '50px', borderColor: '#01579b' }}
              min={1}
              max={maxPage}
              underlineShow={false}
              inputStyle={{ padding: 5 }}
            />
            <RaisedButton
              label={`${footerLabels.go}`}
              backgroundColor="#1D5AB9"
              labelStyle={{ color: 'white' }}
              style={{ minWidth: '82px' }}
              onClick={() => inputValue !== '' && this.pageChange(Math.min(inputValue, maxPage) - 1)}
            />
          </span>
        </div>
        <div className={styles.pagerContent}>
          {previousButton}
          {indices.includes(0) || firstButton}
          {options}
          {indices.includes(maxPage - 1) || lastButton}
          {nextButton}
        </div>
      </div>
    )
  }
}

RowSelectTableFooter.propTypes = {
  maxPage: PropTypes.number,
  currentPage: PropTypes.number,
  setPage: PropTypes.func,
  resultsPerPage: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  footerLabels: PropTypes.shape({
    showing: PropTypes.string,
    results: PropTypes.string,
    go: PropTypes.string,
    of: PropTypes.string,
    goToPage: PropTypes.string
  })
}

export default RowSelectTableFooter
