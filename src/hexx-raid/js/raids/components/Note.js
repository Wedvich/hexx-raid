import React, { Component } from 'react';

const defaultWidth = 300;

export default class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTooltip: false,
      positionRelativeToCenter: 0,
      width: defaultWidth
    };
  }

  toggleTooltip(showTooltip) {
    this.setState({
      ...this.state,
      showTooltip: showTooltip !== null ? showTooltip : !this.state.showTooltip
    });
  }

  updatePositionRelativeToCenter(element) {
    if (!element) {
      return;
    }

    const boundingRect = element.getBoundingClientRect();
    const center = window.innerWidth / 2;
    const positionRelativeToCenter = boundingRect.left - center;

    const maxWidth = Math.min(defaultWidth, element.getElementsByClassName('text')[0].offsetWidth + 53);
    const width = Math.min(maxWidth, boundingRect.left - 5);

    if (this.state.positionRelativeToCenter !== positionRelativeToCenter) {
      this.setState({
        ...this.state,
        positionRelativeToCenter,
        width
      });
    }
  }

  render() {
    const showTooltip = this.state.showTooltip ? `show ${this.state.positionRelativeToCenter > 0 ? 'right' : 'left'}` : '';

    return <span className={`note ${showTooltip}`} ref="note"
                 onMouseEnter={this.toggleTooltip.bind(this, true)}
                 onMouseLeave={this.toggleTooltip.bind(this, false)}
                 onClick={this.toggleTooltip.bind(this, null)}
                 ref={this.updatePositionRelativeToCenter.bind(this)}>
      <span className="tooltip" style={{ width: this.state.width }}>
        <span className="icon"></span>
        <span className="text">{this.props.text}</span>
      </span>
    </span>;
  }
}
