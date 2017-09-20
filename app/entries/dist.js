import React from 'react';
import ReactDOM from 'react-dom';
import SpeakTheWordsSet from '../components/speak-the-words-set';

/**
 * Wrapper function for H5P functionality
 */
H5P.SpeakTheWordsSet = (function (Question) {
  "use strict";

  /**
   * Implements required functionality to comply with H5P core.
   *
   * @param params
   * @param contentId
   * @constructor
   */
  function WrapperClass(params, contentId) {
    this.questionWrapper = document.createElement('div');
    this.questionWrapper.className = 'h5p-speak-the-words-set';

    // Check for question existence
    if (!params.questions || !params.questions.length) {
      ReactDOM.render((
        <div>Please supply at least one Question.</div>
      ), this.questionWrapper);
      return;
    }

    Question.call(this, 'speak-the-words-set');
    this.contentId = contentId;
    this.params = params;
    this.eventStore = new H5P.EventDispatcher();
    this.questionInstances = [];

    this.resizeWrapper = () => {
      this.trigger('resize');
    };

    /**
     * Implements the registerDomElements interface required by H5P Question
     */
    this.registerDomElements = () => {
      this.setContent(this.questionWrapper);
    };

    ReactDOM.render((
      <SpeakTheWordsSet parent={this} />
    ), this.questionWrapper);
  }

  // Inheritance
  WrapperClass.prototype = Object.create(Question.prototype);
  WrapperClass.prototype.constructor = WrapperClass;

  return WrapperClass;
}(H5P.Question));
