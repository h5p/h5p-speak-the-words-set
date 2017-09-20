import React from 'react';
import './question.css';

export default class Question extends React.Component {

  /**
   *
   * @param props
   * @param props.question Question parameters
   * @param props.slideIndex Index of the slide that this question is on
   * @param props.parent Reference to parent
   * @param props.jumpToSlide Jump to given slide number
   *
   */
  constructor(props) {
    super(props);

    // Initializes instance of question, attached when component is mounted
    this.instance = H5P.newRunnable(props.question, props.parent.contentId, undefined, false, {
      parent: props.parent
    });

    props.parent.questionInstances.push(this.instance);

    // Add navigation buttons
    this.lastIndex = props.parent.params.questions.length - 1;
    const showFinishButton = props.slideIndex === this.lastIndex;
    const showNextButton = !showFinishButton;
    const showPreviousButton = props.slideIndex !== 0;

    if (showFinishButton) {
      this.instance.addButton('finish', 'Finish', () => {
        this.props.parent.eventStore.trigger('show-solution-screen');
      }, false);

      props.parent.eventStore.on('answered-all', () => {
        this.instance.showButton('finish');
      });

      props.parent.eventStore.on('retry-set', () => {
        this.instance.hideButton('finish');
      });
    }

    if (showNextButton) {
      this.instance.addButton('next', '', () => {
          props.jumpToSlide(props.slideIndex + 1)
        }, true,
        {
          href: '#', // Use href since this is a navigation button
          'aria-label': 'Next'
        });
    }

    if (showPreviousButton) {
      this.instance.addButton('previous', '', () => {
          props.jumpToSlide(props.slideIndex - 1)
        }, true,
        {
          href: '#', // Use href since this is a navigation button
          'aria-label': 'Previous'
        });
    }
  }

  componentDidMount() {
    // Integrate with Question instance
    const $questionContainer = H5P.jQuery(this.el);
    this.instance.attach($questionContainer);

    // Listen for resize event and propagate them to parent
    this.instance.on('resize', this.props.parent.resizeWrapper);

    // Listen for user interactions on instance and enhance them
    this.instance.on('xAPI', this.enhanceXAPIEvent.bind(this));

    this.props.parent.eventStore.on('retry-set', () => {
      this.instance.resetTask();
      this.props.parent.resizeWrapper();
    });

    this.props.parent.eventStore.on('show-solutions', () => {
      this.instance.showSolutions();
      this.props.parent.resizeWrapper();
    });
  }

  componentDidUpdate() {
    // Resize Question every time it is updated
    this.instance.trigger('resize');
  }

  enhanceXAPIEvent(event) {
    // Mark slide as answered
    const shortVerb = event.getVerb();
    const isAnswered = ['interacted', 'answered', 'attempted'].includes(shortVerb);
    if (isAnswered) {
      this.props.parent.eventStore.trigger('slide-answered', {slideNumber: this.props.slideIndex});
    }

    // Add slide number to xAPI data
    let context = event.data.statement.context;
    if (context.extensions === undefined) {
      context.extensions = {};
    }
    context.extensions['http://id.tincanapi.com/extension/ending-point'] = this.props.slideIndex + 1;
  }

  render() {
    let classes = 'question';
    if (this.props.currentSlideIndex !== this.props.slideIndex) {
      classes += ' hidden';
    }

    return (
      // Store a reference to element and make third party lib maintain this element
      <div className={classes}>
        <div ref={el => this.el = el}/>
      </div>
    )
  }
}
