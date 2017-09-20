import React from 'react';
import ReactDOM from 'react-dom';
import './footer-navigation.css';

export default class FooterNavigation extends React.Component {

  constructor(props) {
    super(props);
  }

  handleNavigationAction(idx, e) {
    // Prevent scrolling browser
    if (e) {
      e.preventDefault();
    }

    this.props.jumpToSlide(idx);
  }

  render() {
    return (
      <div className="footer-navigation">
        <ul>
          {this.props.questions.map((question, idx) => {
            let classes = 'progress-dot';
            if (idx === this.props.currentSlide) {
              classes += ' active';
            }
            if (this.props.answeredSlides.includes(idx)) {
              classes += ' answered';
            }

            return (
              <a href='#'
                 className={classes}
                 title={`Slide ${idx}`}
                 onClick={this.handleNavigationAction.bind(this, idx)}
                 key={question.subContentId}
              >
              </a>
            )
          })}
        </ul>
      </div>
    );
  }
}
