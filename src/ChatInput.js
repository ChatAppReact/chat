import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { sendUserMessage, sendCompMessage, clearChat, sendSystemMessage } from './thunkfunction';
import TextField from 'material-ui/TextField';
import Resources from './resources';
import RaisedButton from 'material-ui/RaisedButton';

class ChatInput extends React.Component {

    keyPressHandler;
    text;
    intervalFcn;
    firstPass = false;

    constructor(props) {
        super(props);
        this.keyPressHandler = this.keyPressHandler.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.state = {
            disableTextField: false
        }
    }

    componentWillMount() {
        this.firstPass = false;
        this.props.clearChat();
        setTimeout(() => {
            this.props.sendCompMessage(Resources.MESSAGE1);
        }, 2000);
        this.intervalFcn = setInterval(() => {
            this.firstPass = true;
            this.props.sendCompMessage(Resources.MESSAGE2);
            setTimeout(() => {
                this.props.sendSystemMessage(Resources.MESSAGE3);
                this.disableTextField();
                setTimeout(() => {
                    console.log('Close window')
                    this.closeWindow()
                    // window.close();
                }, 2500)
            }, 3000)
            clearInterval(this.intervalFcn);
        }, 10000)
    }

    keyPressHandler(e) {
        if (e.key === 'Enter') {
            this.sendMessageFcn();
        }
    }

    closeWindow() {
        this.props.history.push("/ended");
    }

    disableTextField() {
        this.setState({
            disableTextField: true
        })
    }

    clickHandler() {
        if (!this.state.disableTextField)
            this.sendMessageFcn();
    }

    sendMessageFcn() {
        this.props.sendUserMessage(this.text.value);
        this.text.value = "";
        clearInterval(this.intervalFcn);
        if (!this.firstPass) {
            setTimeout(() => {
                this.props.sendCompMessage(Resources.MESSAGE2);
            }, 4000)
            setTimeout(() => {
                this.props.sendSystemMessage(Resources.MESSAGE3);
                this.disableTextField();
                setTimeout(() => {
                    console.log('Close window')
                    this.closeWindow()
                    // window.close();
                }, 2500)
            }, 7000)
        }
    }

    render() {
        return (
            <div className="chat-input">
                Enter Message:
                <input disabled={this.state.disableTextField} className="chat-input-field" ref={c => this.text = c} onKeyPress={this.keyPressHandler} />
                <RaisedButton onClick={this.clickHandler} label="Send" style={{ marginLeft: 10 }} />
                {/* <TextField  className="chat-input-field" ref={c => this.text = c} onKeyPress={this.keyPressHandler} /> */}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return state;
}

function mapDispathToProps(dispatch) {
    return {
        sendUserMessage: bindActionCreators(sendUserMessage, dispatch),
        sendCompMessage: bindActionCreators(sendCompMessage, dispatch),
        sendSystemMessage: bindActionCreators(sendSystemMessage, dispatch),
        clearChat: bindActionCreators(clearChat, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispathToProps)(ChatInput));