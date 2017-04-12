import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import styles from './App.css';

var socket = io();

class MessageBox extends Component {

  render() {

    return (

      <div className={styles.messageBox}>
        <span className={styles.messageText}> {this.props.text} </span>
        <span className={styles.messageTime}> {this.props.time} </span>
      </div>

    );
  }
}

class MessageList extends Component {

	render() {

    const listItems = this.props.messagelist.map((message, i) => message.text);

		return (

			<div className={styles.messageList}>
				{listItems}
			</div>

		);
	}
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {messages:[{'text':'hello', 'time':'0'}]};
  }

  render() {

    return (

      <div className={styles.app}>
        Chat Application!
        <MessageList messagelist={this.state.messages} />
      </div>

    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
