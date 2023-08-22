import React from 'react';
import ReactDOM from 'react-dom';
import './intro-screen.css';
import {decode} from 'he';

/**
 * Introduction Screen component.
 * Creates a screen with optional image, title and text.
 */
export default class IntroScreen extends React.Component {

  /**
   * Initializes introduction screen.
   *
   * @constructor
   * @param {Object} props
   * @param {function} props.exitIntroductionScreen
   * @param {WrapperClass} props.parent
   */
  constructor(props) {
    super(props);
    this.params = props.parent.params;
  }

  /**
   * Runs whenever component is initialized.
   * Sets introduction-text
   */
  componentDidMount() {
    this.introductionText.innerHTML = this.params.introduction.introductionText;
    this.props.parent.resizeWrapper();
  }

  /**
   * Resize wrapper when image has finished loading.
   */
  imageLoaded() {
    this.props.parent.resizeWrapper();
  } 

  /**
   * Process HTML escaped string for use as attribute value,
   * e.g. for alt text or title attributes.
   *
   * @param {string} value
   * @return {string} WARNING! Do NOT use for innerHTML.
   */
  massageAttributeOutput(value) {
    const dparser = new DOMParser().parseFromString(value, 'text/html');
    const div = document.createElement('div');
    div.innerHTML = dparser.documentElement.textContent;;
    return div.textContent || div.innerText || '';
  };

  /**
   * Render component whenever properties change.
   * @returns {XML}
   */
  render() {
    let image = null;
    const validImage = this.params.introduction
      && this.params.introduction.introductionImage
      && this.params.introduction.introductionImage.path;
    if (validImage) {
      const imgSrc = H5P.getPath(this.params.introduction.introductionImage.path, this.props.parent.contentId);
      image = (
        <img
          className='introduction-image'
          alt={this.massageAttributeOutput(this.params.introduction.introductionImageAltText)}
          onLoad={this.imageLoaded.bind(this)}
          src={imgSrc}
        />);
    }

    let introductionTitle = null;
    if (this.params.introduction.introductionTitle) {
      introductionTitle = (
        <div className='introduction-title'>
          {decode(this.params.introduction.introductionTitle)}
        </div>
      );
    }

    return (
      <div className='introduction'>
        {image}
        {introductionTitle}
        <div ref={introductionText => this.introductionText = introductionText}/>
        <button
          className='h5p-joubelui-button introduction-button'
          onClick={this.props.exitIntroductionScreen}
        >
          {this.params.l10n.introductionButtonLabel}
        </button>
      </div>
    );
  }
}
