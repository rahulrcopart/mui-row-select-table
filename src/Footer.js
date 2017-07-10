import React, { Component, PropTypes } from 'react'
import cn from 'classnames'
import { TextField } from 'material-ui'
import range from './range'
import styles from './Footer.css'
import mdlComponent from './mdlComponent'

const KEY_G = 71

const PreviousPageButton = ({ onClick }) =>
  <button onClick={onClick} className={styles.pageStepButton}> <i className={cn('fa', 'fa-chevron-left', styles.arrowIcon)} aria-hidden="true" /></button>

const NextPageButton = ({ onClick }) =>
  <button onClick={onClick} className={styles.pageStepButton}><i className={cn('fa', 'fa-chevron-right', styles.arrowIcon)} aria-hidden="true" /></button>

const FirstPageButton = ({ onClick }) =>
  <button onClick={onClick} className={styles.pageStepButton}>1...</button>

const LastPageButton = ({ onClick, text }) =>
  <button onClick={onClick} className={styles.pageStepButton}>...{text}</button>

class RowSelectTableFooter extends Component {
  static get defaultProps() {
    return {
      'maxPage': 0,
      'currentPage': 0,
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      resultsPerPage: props && props.resultsPerPage ? props.resultsPerPage : 20,
      inputValue: '',
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.focusPageField, false)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.focusPageField)
  }

  focusPageField = (event) => {
    if (event.ctrlKey && event.keyCode === KEY_G) {
      window.scrollTo(0, document.body.scrollHeight)
      this.pageField.focus()
    }
  }

  pageChange = (page, resultsPerPage) => {
    const { maxPage } = this.props
    if (page < maxPage) {
      this.props.setPage({ page, resultsPerPage })
      const maybeNewResultsPerPage = resultsPerPage ? { resultsPerPage } : {}
      this.setState({ ...maybeNewResultsPerPage, inputValue: '' })
    }
  }

  updateInputValue = (e) => {
    this.setState({
      inputValue: e.target.value.replace(/\D|^0/g, ''),
    })
  }

  handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      e.nativeEvent.stopPropagation()
      if (this.state.inputValue === '') return
      this.pageChange(this.state.inputValue - 1)
    }
  }

  render() {
    const { currentPage, maxPage, pageSizeOptions } = this.props
    const { inputValue } = this.state

    const previousButton = currentPage > 0
      && <PreviousPageButton onClick={() => this.pageChange(currentPage - 1)} />
    const nextButton = currentPage !== (maxPage - 1)
      && <NextPageButton onClick={() => this.pageChange(currentPage + 1)} />
    const firstButton = <FirstPageButton onClick={() => this.pageChange(0)} />
    const lastButton = <LastPageButton text={maxPage} onClick={() => this.pageChange(maxPage - 1)} />

    let startIndex = Math.max(currentPage - 2, 0)
    const endIndex = Math.min(startIndex + 5, maxPage)
    if (maxPage >= 5 && (endIndex - startIndex) <= 4) {
      startIndex = endIndex - 5
    }
    const indices = range(startIndex, endIndex - 1)
    const options = indices.map((i) =>
      <button
        className={cn({ [styles.currentPageSelected]: currentPage === i }, styles.pageButton)}
        data-value={i}
        key={i}
        onClick={(e) => this.pageChange(parseInt(e.target.getAttribute('data-value'), 10))}
      >
        {i + 1}
      </button>
    )

    return (
      <div className={styles.mainPagerContent}>
        <div className={styles.showResults}>
          <span style={{ marginLeft: '5px', marginRight: '20px' }}>
            {'Show'}
            <button
              id="demo-menu-top-left"
              className="mdl-button mdl-js-button mdl-textfield__input"
              style={{ width: '12px', fontSize: '14px', color: 'white', backgroundColor: '#0D5DB8', display: 'inline-block', paddingTop: '1px', paddingLeft: '22px', marginLeft: '5px', marginRight: '5px' }}>
              {this.state.resultsPerPage}
            </button>
            <ul className="mdl-menu mdl-menu--top-left mdl-js-menu mdl-js-ripple-effect" htmlFor="demo-menu-top-left">
              {pageSizeOptions.map((pageSizeOption, i) =>
                <li
                  key={i}
                  className={cn('mdl-menu__item', { 'mdl-menu__item--full-bleed-divider': i === pageSizeOptions.length - 1 })}
                  onClick={() => this.pageChange(0, pageSizeOption)}
                >{pageSizeOption}</li>
              )}
            </ul>
            {'Results'}
          </span>
          <span>
            {'Go To Page'}
            <TextField
              ref={(node) => { this.pageField = node }}
              id="text-field-controlled"
              className={styles.textField}
              type="number"
              style={{ width: '56px', marginLeft: '5px', color: '#fff' }}
              value={inputValue}
              onChange={this.updateInputValue}
              onKeyUp={this.handleKeyUp}
              underlineStyle={{ width: '50px', backgroundColor: '#0D5DB8' }}
              inputStyle={{ backgroundColor: '#fff', height: '36px' }}
              underlineFocusStyle={{ borderColor: '#01579b' }}
            />
            <button
              className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect"
              style={{ backgroundColor: '#0D5DB8' }}
              type="submit"
              onClick={() => inputValue !== '' && this.pageChange(inputValue - 1)}
              disabled={inputValue > maxPage}
            >
            Go
            </button>
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
}

export default mdlComponent(RowSelectTableFooter)
