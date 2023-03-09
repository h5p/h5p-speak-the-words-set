import React from 'react';
import ReactDOM from 'react-dom';
import SpeakTheWordsSet from '../components/speak-the-words-set';
import './dist.css';

/**
 * Wrapper function for H5P functionality
 */
H5P.SpeakTheWordsSet = (function (Question) {
  "use strict";

  /**
   * @typedef {Object} Parameters
   * @property {IntroductionSettings} [introduction]
   * @property {Object} [questions] Questions settings
   * @property {Object} [overallFeedback] Feedback ranges
   * @property {Localizations} l10n
   */

  /**
   * @typedef {Object} IntroductionSettings
   * @property {Object} introductionImage
   * @property {string} introductionImageAltText
   * @property {string} introductionTitle
   * @property {string} introductionText
   */

  /**
   * @typedef {Object} Localizations
   * @property {string} introductionButtonLabel
   * @property {string} solutionScreenResultsLabel
   * @property {string} showSolutionsButtonLabel
   * @property {string} retryButtonLabel
   * @property {string} finishButtonLabel
   * @property {string} nextQuestionAriaLabel
   * @property {string} previousQuestionAriaLabel
   * @property {string} navigationBarTitle
   * @property {string} answeredSlideAriaLabel
   * @property {string} activeSlideAriaLabel
   */

  /**
   * Implements required functionality to comply with H5P core.
   *
   * @param {Parameters} params
   * @param {number} contentId
   * @constructor
   */
  function WrapperClass(params, contentId) {
    this.questionWrapper = document.createElement('div');
    this.questionWrapper.className = 'h5p-speak-the-words-set';

    Question.call(this, 'speak-the-words-set');
    this.contentId = contentId;
    this.params = params;
    this.eventStore = new H5P.EventDispatcher();
    this.questionInstances = [];
    this.progressAnnouncers = [];

    /**
     * Resize wrapper
     */
    this.resizeWrapper = () => {
      this.trigger('resize');
    };

    /**
     * Implements the registerDomElements interface required by H5P Question
     */
    this.registerDomElements = () => {
      this.setContent(this.questionWrapper);
    };

    // No questions
    if (!params.questions || !params.questions.length) {
      ReactDOM.render((
        <div>Please supply at least one Question.</div>
      ), this.questionWrapper);
    }
    // No speech recognition engine
    else if (!window.annyang) {
      ReactDOM.render((
        <div className='unsupported-browser-error'>
          <div>It looks like your browser does not support speech recognition.</div>
          <div>Please try again in a browser like Chrome.</div>
        </div>
      ), this.questionWrapper);
    }
    else {
      ReactDOM.render((
        <SpeakTheWordsSet parent={this} />
      ), this.questionWrapper);
    }
  }

  // Inheritance
  WrapperClass.prototype = Object.create(Question.prototype);
  WrapperClass.prototype.constructor = WrapperClass;

  return WrapperClass;
}(H5P.Question));
