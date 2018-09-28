import React, { Component } from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import Flickity from 'flickity';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import imagesloaded from 'imagesloaded';
import PropTypes from 'prop-types';

class FlickityComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flickityReady: false,
    };

    this.carousel = null;
    this.flkty = null;
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      children,
      options: { draggable, initialIndex },
      reloadOnUpdate,
    } = this.props;
    console.log('ham', this.props, this.state, this.flkty);
    const { flickityReady } = this.state;
    if (reloadOnUpdate || (!prevState.flickityReady && flickityReady)) {
      console.log('ham', 'check 1');
      this.flkty.deactivate();
      this.flkty.selectedIndex = initialIndex || 0;
      this.flkty.options.draggable =
        draggable === undefined
          ? children
            ? children.length > 1
            : false
          : draggable;
      this.flkty.activate();
    } else {
      console.log('ham', 'check 2');
      this.flkty.reloadCells();
    }
  }

  componentDidMount() {
    if (canUseDOM) {
      const { disableImagesLoaded, flickityRef, options } = this.props;
      const carousel = this.carousel;
      this.flkty = new Flickity(carousel, options);
      console.log('ham', this.flkty);
      if (disableImagesLoaded) {
        this.setState({ flickityReady: true });
      } else {
        const flickityEl = ReactDOM.findDOMNode(this);
        const images = [].forEach.call(flickityEl);
        if (images.length > 0) {
          imagesloaded(
            carousel,
            function () { this.setState({ flickityReady: true }).bind(this)
          );
        }
      }
      if (flickityRef) flickityRef(this.flkty);
    }
  }

  renderPortal() {
    if (!this.carousel) return null;

    const mountNode = this.carousel.querySelector('.flickity-slider');
    if (mountNode) {
      return createPortal(this.props.children, mountNode);
    }
  }

  render() {
    return React.createElement(
      this.props.elementType,
      {
        className: this.props.className,
        ref: c => {
          this.carousel = c;
        },
      },
      this.renderPortal()
    );
  }
}

FlickityComponent.propTypes = {
  disableImagesLoaded: PropTypes.bool,
  reloadOnUpdate: PropTypes.bool,
  options: PropTypes.object,
  className: PropTypes.string,
  elementType: PropTypes.string,
  children: PropTypes.array,
  flickityRef: PropTypes.func,
};

FlickityComponent.defaultProps = {
  disableImagesLoaded: false,
  reloadOnUpdate: false,
  options: {},
  className: '',
  elementType: 'div',
};

export default FlickityComponent;
