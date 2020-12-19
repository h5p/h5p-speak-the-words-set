import React from 'react';
import ReactDOM from 'react-dom';
import SpeakTheWordsSet from '../components/speak-the-words-set';
import Util from '../components/speak-the-words-set-util';
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

    params = Util.extend({
      behaviour: {
        enableSolutionsButton: true, // @see {@link https://h5p.org/documentation/developers/contracts#guides-header-8}
        enableRetry: true // @see {@link https://h5p.org/documentation/developers/contracts#guides-header-9}
      }
    }, params);

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

    /**
     * Check if input has been given.
     * @return {boolean} True, if answer was given.
     * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-1}
     */
    this.getAnswerGiven = () => {
      return this.speakTheWordsSet.state.answeredSlides.length > 0;
    };

    /**
     * Get latest score.
     * @return {number} latest score.
     * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-2}
     */
    this.getScore = () => {
      return this.speakTheWordsSet.getScore();
    };

    /**
     * Get maximum possible score.
     * @return {number} Maximum possible score.
     * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-3}
     */
    this.getMaxScore = () => {
      return this.speakTheWordsSet.getMaxScore();
    };

    /**
     * Show solutions for all sentences.
     * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-4}
     */
    this.showSolutions = () => {
      this.speakTheWordsSet.showSolutions();
    };

    /**
     * Reset task.
     * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-5}
     */
    this.resetTask = () => {
      this.speakTheWordsSet.retry();
    };

    /**
     * Get xAPI data.
     * @return {object} XAPI statement.
     * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-6}
     */
    this.getXAPIData = () => {
      return this.speakTheWordsSet.getXAPIData();
    };

    /**
     * Get reference to SpeakTheWordsSet object.
     * @param {object} SpeakTheWordsSet object.
     */
    this.handleInitialized = (speakTheWordsSet) => {
      this.speakTheWordsSet = speakTheWordsSet;
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
        <SpeakTheWordsSet
          parent={this}
          onInitialized={this.handleInitialized}
        />
      ), this.questionWrapper);
    }
  }

  // Inheritance
  WrapperClass.prototype = Object.create(Question.prototype);
  WrapperClass.prototype.constructor = WrapperClass;

  return WrapperClass;
}(H5P.Question));
