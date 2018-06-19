import React from 'react';
import ReactDOM from 'react-dom';
import './footer-navigation.css';

/**
 * Footer Navigation component.
 * Displays a dot for each question in it's properties.
 */
export default class FooterNavigation extends React.Component {

  /**
   * Initializes component
   *
   * @constructor
   * @param {Object} props
   * @param {Array} props.answeredSlides Array with indexes of already answered slides
   * @param {number} props.currentSlide Index of currently active slide
   * @param {function} props.jumpToSlide
   * @param {Array} props.questions Array of questions that navigation should be created from
   * @param {WrapperClass} props.parent
   */
  constructor(props) {
    super(props);
    this.l10n = this.props.parent.params.l10n;
  }

  /**
   * Handles action when navigation
   * @param {number} idx Index of question that should be navigated to
   * @param {Event} e Click event
   */
  handleNavigationAction(idx, e) {
    // Prevent scrolling browser
    if (e) {
      e.preventDefault();
    }

    this.props.jumpToSlide(idx);
  }

  /**
   * Renders component whenever properties change.
   * @returns {XML}
   */
  render() {
    return (
      <div className="footer-navigation">
        <ol>
          {this.props.questions.map((question, idx) => {
            let classes = 'progress-dot';
            let title = this.l10n.navigationBarTitle.replace(':num', (idx + 1).toString());
            let ariaLabel = title;

            if (idx === this.props.currentSlide) {
              classes += ' active';
              ariaLabel += ', ' + this.l10n.activeSlideAriaLabel;
            }
            if (this.props.answeredSlides.includes(idx)) {
              classes += ' answered';
              ariaLabel += ', ' + this.l10n.answeredSlideAriaLabel;
            }

            return (
              <li
                key={question.subContentId}
              >
                <a href='#'
                   className={classes}
                   title={title}
                   aria-label={ariaLabel}
                   onClick={this.handleNavigationAction.bind(this, idx)}
                >
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
}
