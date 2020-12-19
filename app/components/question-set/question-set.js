import ReactDOM from 'react-dom';
import React from 'react';
import Question from './question/question';
import FooterNavigation from './navigation/footer-navigation';
import './question-set.css';

/**
 * Question Set component.
 * Contains a set of questions and a footer navigation.
 */
export default class QuestionSet extends React.Component {

  /**
   * Question Set constructor
   *
   * @constructor
   * @param {Object} props
   * @param {boolean} props.showingQuestions Whether questions are currently visible
   * @param {Array} props.answeredSlides Currently answered slides/questions
   * @param {WrapperClass} props.parent
   */
  constructor(props) {
    super(props);

    this.state = {
      currentSlide: 0
    };

    // Reset slide index when retrying or showing solutions
    props.parent.eventStore.on('retrySet', () => {
      this.setState({
        currentSlide: 0
      });
      this.scores = {};
    });

    props.parent.eventStore.on('showSolutions', () => {
      this.setState({
        currentSlide: 0
      });
    });

    this.queueFocus = false;
    this.questionInstances = [];
    this.scores = {};

    props.onInitialized(this);
  }

  /**
   * Runs every time the component updated
   */
  componentDidUpdate() {
    if (this.queueFocus) {
      this.props.parent.progressAnnouncers[this.state.currentSlide].focus();
      this.queueFocus = false;
    }
  }

  /**
   * Jump to a given slide
   * @param {number} slideNumber
   */
  jumpToSlide(slideNumber) {

    // Skip if already on slide
    if (this.state.currentSlide !== slideNumber) {
      // Stop listening for input on previous slide
      const currentInstance = this.props.parent.questionInstances[this.state.currentSlide];
      if (currentInstance.stop) {
        currentInstance.stop();
      }

      this.props.parent.resizeWrapper();
      this.queueFocus = true;
      this.setState({
        currentSlide: slideNumber
      });
    }
  }

  /**
   * Get current score.
   * @return {number} Current score.
   */
  getScore() {
    return this.questionInstances.reduce((sum, instance) => {
      return sum + instance.getScore();
    }, 0);
  }

  /**
   * Get maximum score.
   * @return {number} Maximum score.
   */
  getMaxScore() {
    return this.questionInstances.reduce((sum, instance) => {
      return sum + instance.getMaxScore();
    }, 0);
  }

  /**
   * Get xAPI data from children.
   * @return {object} XAPIData from children.
   */
  getXAPIDataFromChildren() {
    return this.questionInstances
      .map(child => {
        if (typeof child.getXAPIData === 'function') {
          return child.getXAPIData();
        }
      })
      .filter(data => !!data);
  }

  /**
   * Handle question instance initialized.
   * @param {H5P.SpeakTheWords} Question instance.
   */
  handleQuestionInitialized(question) {
    this.questionInstances.push(question);
  }

  /**
   * Renders component every time properties or state changes.
   * @returns {XML}
   */
  render() {
    let classes = 'questions';
    if (!this.props.showingQuestions) {
      classes += ' hidden';
    }

    return (
      <div className={classes}>
        {
          this.props.parent.params.questions.map((question, idx) => {
            return (
              // Create questions
              <Question
                question={question}
                slideIndex={idx}
                currentSlideIndex={this.state.currentSlide}
                showSolutionScreen={this.props.showSolutionScreen}
                jumpToSlide={this.jumpToSlide.bind(this)}
                parent={this.props.parent}
                key={question.subContentId}
                onInitialized={this.handleQuestionInitialized.bind(this)}
              />);
          })
        }
        <FooterNavigation
          answeredSlides={this.props.answeredSlides}
          currentSlide={this.state.currentSlide}
          jumpToSlide={this.jumpToSlide.bind(this)}
          questions={this.props.parent.params.questions}
          parent={this.props.parent}
        />
      </div>
    );
  }
}
