import React from 'react';
import styles from './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {test: 'foo'};
  }
  render() {
    return (
      <div className={styles.app}>
        Chat Application!
      </div>
    );
  }
}

export default App;