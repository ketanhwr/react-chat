import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import styles from './App.css';

var socket = io();

class MessageForm extends Component {

  constructor(props) {
    super(props);
    this.state = {text: ''};

    this.submit = this.submit.bind(this);
    this.change = this.change.bind(this);
  }

  submit(e) {
    e.preventDefault();
    var message = {
      type : 'message',
      text : this.state.text,
      time : 0
    }
    this.props.onMessageSubmit(message);  
    this.setState({ text: '' });
  }

  change(e) {
    this.setState({ text : e.target.value });
  }

  render() {

    return (
      <form onSubmit={this.submit}>
        <input onChange={this.change} value={this.state.text} />
        <input type="submit" value="send" />
      </form>
    );
  }
}

class MessageBox extends Component {

  render() {

    return (

      <div className={styles.messageBox}>
        <div className={styles.messageText}> {this.props.text} </div>
        <div className={styles.messageTime}> {this.props.time} </div>
      </div>

    );
  }
}

class StatusBox extends Component {

  render() {

    return (

      <div className={styles.statusBox}>
        {this.props.status} <br/>
        {this.props.count}
      </div>

    );
  }
}

class MessageList extends Component {

	render() {

    const listItems = this.props.messagelist.map((message, i) => 
          {
            if(message.type == 'message') return (
              <MessageBox key={i} text={message.text} time={message.time} />
            );
            else return (
              <StatusBox key={i} status={message.status} count={message.count} />
            );
          }
      );

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
    this.state = {messages : [], userid : 0, users : 0};

    this.userAccept = this.userAccept.bind(this);
    this.userJoin = this.userJoin.bind(this);
    this.userLeft = this.userLeft.bind(this);
    this.messageReceive = this.messageReceive.bind(this);
  }

  componentDidMount() {
    socket.emit('user:request');
    socket.on('user:accept', this.userAccept);
    socket.on('user:join', this.userJoin);
    socket.on('user:left', this.userLeft);
    socket.on('send:message', this.messageReceive);
  }

  componentWillUnmount() {
    socket.emit('user:left');
  }

  userAccept(msg) {
    this.setState({ userid : msg.id });
    this.setState({ users : msg.users });

    var newMessages = this.state.messages;
    newMessages.push( { 'type' : 'status', 'status' : 'You joined', 'count' : msg.users} );
    this.setState( {messages : newMessages} );
  }

  userJoin() {
    this.setState((prevState, props) => ({ users: prevState.users + 1 }));

    var newMessages = this.state.messages;
    newMessages.push( { 'type' : 'status', 'status' : 'Someone joined', 'count' : this.state.users} );
    this.setState( {messages : newMessages} );
  }

  userLeft() {
    this.setState((prevState, props) => ({ users: prevState.users - 1 }));

    var newMessages = this.state.messages;
    newMessages.push( { 'type' : 'status', 'status' : 'Someone left', 'count' : this.state.users} );
    this.setState( {messages : newMessages} );
  }

  messageReceive(msg) {
    var newMessages = this.state.messages;
    newMessages.push(msg);
    this.setState( {messages : newMessages} );

  }

  messageSend(message) {
    socket.emit('send:message', message);
  }

  render() {

    return (

      <div className={styles.app}>
        <div className={styles.heading}>Chat Application!</div>
        <MessageList messagelist={this.state.messages} />
        <MessageForm onMessageSubmit={this.messageSend} />
      </div>

    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
