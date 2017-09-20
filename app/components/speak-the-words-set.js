import React from 'react';
import ReactDOM from 'react-dom';
import QuestionSet from './question-set/question-set';
import SolutionScreen from './solution-screen/solution-screen';
import IntroScreen from "./intro-screen/intro-screen";
import './speak-the-words-set.css';

/**
 * Speak the Words Set
 * Wraps multiple Speak the Words instances
 */
export default class SpeakTheWordsSet extends React.Component {

  constructor(props) {
    super(props);

    const initialState = props.parent.params.introduction.showIntroPage ? viewState.showingIntro
      : viewState.showingQuestions;
    this.state = {
      viewState: initialState,
      showingSolutions: false,
      answeredSlides: []
    };

    this.props.parent.eventStore.on('slide-answered', this.markSlideAsAnswered.bind(this));
    this.props.parent.eventStore.on('show-solution-screen', this.showSolutionScreen.bind(this));
  }

  componentDidUpdate() {
    this.props.parent.resizeWrapper();
  }

  exitIntroductionScreen() {
    this.setState({
      viewState: viewState.showingQuestions
    });
  }

  showSolutionScreen() {
    this.setState({
      viewState: viewState.showingSolutionScreen
    });
  }

  retry() {
    this.setState({
      viewState: viewState.showingQuestions,
      answeredSlides: [],
      showingSolutions: false
    });
    this.props.parent.eventStore.trigger('retry-set');
  }

  showSolutions() {
    this.setState({
      viewState: viewState.showingQuestions,
      showingSolutions: true
    });
    this.props.parent.eventStore.trigger('show-solutions');
  }

  markSlideAsAnswered(e) {
    const slideNumber = e.data.slideNumber;

    // Skip questions already marked as answered
    if (!this.state.answeredSlides.includes(slideNumber)) {
      const answeredSlides = this.state.answeredSlides.concat([slideNumber]);
      this.setState({
        answeredSlides: answeredSlides
      });

      // Check if all questions have been answered
      if (answeredSlides.length === this.props.parent.questionInstances.length) {
        this.props.parent.eventStore.trigger('answered-all');
      }
    }
  }

  render() {
    let introScreen = null;
    if (this.state.viewState === viewState.showingIntro) {
      introScreen = (
        <IntroScreen
          exitIntroductionScreen={this.exitIntroductionScreen.bind(this)}
          parent={this.props.parent}
        />
      )
    }

    let solutionScreen = null;
    if (this.state.viewState === viewState.showingSolutionScreen) {
      const currentScore = this.props.parent.questionInstances.reduce((val, question) => {
        return val + question.getScore();
      }, 0);

      solutionScreen = (
        <SolutionScreen
          currentScore={currentScore}
          maxScore={this.props.parent.params.questions.length}
          retry={this.retry.bind(this)}
          showingSolutions={this.state.showingSolutions}
          showSolutions={this.showSolutions.bind(this)}
          parent={this.props.parent}
        />
      )
    }

    return (
      <div>
        {introScreen}
        <QuestionSet
          showingQuestions={this.state.viewState === viewState.showingQuestions}
          answeredSlides={this.state.answeredSlides}
          parent={this.props.parent}
        />
        {solutionScreen}
      </div>
    );
  }
}

const viewState = {
  showingIntro: 0,
  showingQuestions: 1,
  showingSolutionScreen: 2
};