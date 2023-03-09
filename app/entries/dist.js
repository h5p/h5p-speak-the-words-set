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

    // Set defaults
    this.params = WrapperClass.extend({
      introduction: {
        showIntroPage: false
      },
      questions: [],
      l10n: {
        introductionButtonLabel: 'Start Course!',
        solutionScreenResultsLabel: 'Your results:',
        showSolutionsButtonLabel: 'Show solution',
        retryButtonLabel: 'Retry',
        finishButtonLabel: 'Finish',
        nextQuestionAriaLabel: 'Next question',
        previousQuestionAriaLabel: 'Previous question',
        navigationBarTitle: 'Slide :num',
        answeredSlideAriaLabel: 'Answered',
        activeSlideAriaLabel: 'Currently active'
      }
    }, params);

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

  /*
   * Extend an array just like JQuery's extend.
   *
   * @returns {object} Merged objects.
   */
  WrapperClass.extend = function () {
    for (let i = 1; i < arguments.length; i++) {
      for (let key in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
          if (
            typeof arguments[0][key] === 'object' &&
            typeof arguments[i][key] === 'object'
          ) {
            this.extend(arguments[0][key], arguments[i][key]);
          }
          else {
            arguments[0][key] = arguments[i][key];
          }
        }
      }
    }
    return arguments[0];
  };

  // Inheritance
  WrapperClass.prototype = Object.create(Question.prototype);
  WrapperClass.prototype.constructor = WrapperClass;

  return WrapperClass;
}(H5P.Question));
