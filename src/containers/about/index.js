import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import styles from './about.css';

class About extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };
  }

  render() {
    return (
      <div className={styles.container}>
        About
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {};
}

module.exports = connect(mapStateToProps)(About);
