import React from 'react';
import ReactDOM from 'react-dom';
import './solution-screen.css';

/**
 * Solution Screen component.
 */
export default class SolutionScreen extends React.Component {

  /**
   * Solution screen
   *
   * @constructor
   * @param {Object} props
   * @param {WrapperClass} props.parent
   * @param {number} props.currentScore
   * @param {number} props.maxScore
   * @param {function} props.retry
   * @param {function} props.showSolutions
   * @param {boolean} props.showingSolutions
   */
  constructor(props) {
    super(props);
    this.l10n = this.props.parent.params.l10n;
  }

  /**
   * Runs whenever component is initialized.
   */
  componentDidMount() {
    this.props.parent.resizeWrapper();
    this.scoreBarInstance = H5P.JoubelUI.createScoreBar(this.props.maxScore);
    this.scoreBarInstance.appendTo(H5P.jQuery(this.scoreBar));

    if (this.scoreBarInstance) {
      this.scoreBarInstance.setScore(this.props.currentScore);
      this.scoreBarInstance.updateVisuals();
    }

    // Dispatch xAPI event if not viewing solutions
    if (!this.props.showingSolutions) {
      this.props.parent.eventStore.trigger('xAPIanswered');
    }
  }

  /**
   * Updates component whenever properties change
   * @returns {XML}
   */
  render() {
    const feedback = H5P.Question.determineOverallFeedback(
      this.props.parent.params.overallFeedback, this.props.currentScore / this.props.maxScore
    );

    return (
      <div className="solution-screen">
        <div className='greeting'>{this.l10n.solutionScreenResultsLabel}</div>
        <div className='score-bar' ref={el => this.scoreBar = el} />
        <div className='feedback-text'>{feedback}</div>
        <div className="solution-screen-button-bar">
          <button
            className='h5p-joubelui-button show-solution-button'
            onClick={this.props.showSolutions}
          >
            {this.l10n.showSolutionsButtonLabel}
          </button>
          <button
            className='h5p-joubelui-button retry-button'
            onClick={this.props.retry}
          >
            {this.l10n.retryButtonLabel}
          </button>
        </div>
      </div>
    );
  }
}
