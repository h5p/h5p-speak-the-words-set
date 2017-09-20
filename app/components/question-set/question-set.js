import ReactDOM from 'react-dom';
import React from 'react';
import Question from './question/question';
import FooterNavigation from './navigation/footer-navigation';
import './question-set.css';

export default class QuestionSet extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentSlide: 0
    };

    // Reset slide index when retrying or showing solutions
    props.parent.eventStore.on('retry-set', () => {
      this.setState({
        currentSlide: 0
      });
    });

    props.parent.eventStore.on('show-solutions', () => {
      this.setState({
        currentSlide: 0
      });
    });
  }

  /**
   *
   * @param slideNumber
   */
  jumpToSlide(slideNumber) {

    // Skip if already on slide
    if (this.state.currentSlide !== slideNumber) {
      this.setState({
        currentSlide: slideNumber
      });
      this.props.parent.resizeWrapper();
    }
  }

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
              />)
          })
        }
        <FooterNavigation
          answeredSlides={this.props.answeredSlides}
          currentSlide={this.state.currentSlide}
          jumpToSlide={this.jumpToSlide.bind(this)}
          questions={this.props.parent.params.questions}
          eventStore={this.props.parent.eventStore}
        />
      </div>
    )
  }
}