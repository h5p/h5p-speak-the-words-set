import React from 'react';
import ReactDOM from 'react-dom';
import './intro-screen.css';

export default class IntroScreen extends React.Component {

  constructor(props) {
    super(props);
    this.params = props.parent.params;
  }

  componentDidMount() {
    this.props.parent.resizeWrapper();
    this.introductionText.innerHTML = this.params.introduction.introductionText;
  }

  imageLoaded() {
    this.props.parent.resizeWrapper();
  }

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
          onLoad={this.imageLoaded.bind(this)}
          src={imgSrc}
        />);
    }

    let introductionTitle = null;
    if (this.params.introduction.introductionTitle) {
      introductionTitle = (
        <div className='introduction-title'>
          {this.params.introduction.introductionTitle}
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
