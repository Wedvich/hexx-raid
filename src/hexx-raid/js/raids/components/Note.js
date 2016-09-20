import React, { Component } from 'react';

export default class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTooltip: false,
      positionRelativeToCenter: 0
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
    const positionRelativeToCenter = element.getBoundingClientRect().left - window.innerWidth / 2;
    if (this.state.positionRelativeToCenter !== positionRelativeToCenter) {
      this.setState({
        ...this.state,
        positionRelativeToCenter
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
      <span className="tooltip">
        <span className="icon"></span>
        {this.props.text}
      </span>
    </span>;
  }
}
