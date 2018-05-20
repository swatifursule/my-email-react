import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

const serverUrl= "https://4puqpns0ze.execute-api.ap-southeast-2.amazonaws.com/dev";

class ShakingError extends React.Component {
	constructor() { super(); this.state = { key: 0 }; }

	componentWillReceiveProps() {
    // update key to remount the component to rerun the animation
  	this.setState({ key: ++this.getState().key });
  }

  render() {
  	return <div key={this.state.key} className="bounce">{this.props.text}</div>;
  }
}

class MyForm extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  clearFormData = () => {
    this.setState({});
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!event.target.checkValidity()) {
    	this.setState({
        invalid: true,
        displayErrors: true,
      });
      return;
    }
    var form = event.target;

    var data = new FormData(form);

    for (let name of data.keys()) {
      const input = form.elements[name];
      const parserName = input.dataset.parse;
      if (parserName) {
        const parsedValue = data.get(name);//inputParsers[parserName](data.get(name))
        data.set(name, parsedValue);
      }
    }
    var object = {};
      data.forEach(function(value, key){
        object[key] = value;
      });

    this.setState({
    	res: stringifyFormData(data),
      invalid: false,
      displayErrors: false,
      output: ""
    });
    var emailData = {};
      if (object.email_bcc.length){
        emailData.bccEmailAddresses= object.email_bcc.split(";");
      }
      if (object.email_cc.length){
        emailData.ccEmailAddresses=object.email_cc.split(";");
      }

      emailData.toEmailAddresses = object.email_to.split(";");
      emailData.bodyData= object.email_body;
      emailData.bodySubject=object.email_subject;
      emailData.sourceEmail= object.email_from;
      emailData.replyToAddresses= object.email_from.split(";");


    /*fetch('https://4puqpns0ze.execute-api.ap-southeast-2.amazonaws.com/dev/sendMail', {
       method: 'POST',
       body: data1,
     }).then(results => {
       console.log(results.json())
     }).catch(error => {
       console.log(error);
     });*/
     axios.post(serverUrl+'/sendMail', emailData)
       .then(response =>
         {
           this.setState({
           	 res: {},
             invalid: false,
             displayErrors: true,
             output: response.data.message
           });
           console.log(response)
         })

  }
  render() {
  	const { res, invalid, displayErrors, output } = this.state;
    return (
    	<div>
        <form
          onSubmit={this.handleSubmit}
          noValidate
          className={displayErrors ? 'displayErrors' : ''}
         >
          <h1> Email Service </h1>
          <label htmlFor="email_from">From Email:</label>
          <input id="email_from" name="email_from" type="email" placeholder="Enter From Email" required />

          <label htmlFor="email_to">To Email: <small> Use semicolon to separate multiple emailid</small></label>
          <input id="email_to" name="email_to" type="text" placeholder="Enter To Email" required />

          <label htmlFor="email_cc">CC Email:<small> Use semicolon to separate multiple emailid</small></label>
          <input id="email_cc" name="email_cc" type="text" placeholder="Enter CC Email"/>

          <label htmlFor="email_bcc">BCC Email:<small> Use semicolon to separate multiple emailid</small></label>
          <input id="email_bcc" name="email_bcc" type="text"  placeholder="Enter BCC Email"/>

          <label htmlFor="email_subject">Subject:</label>
          <input
            id="email_subject"
            name="email_subject"
            type="text"
            placeholder="Subject"
            required
          />

          <label htmlFor="email_body">Email Body:</label>
          <textarea id="email_body" name="email_body" placeholder="Email Body"></textarea>

          <button>Send Email</button>

        </form>
        <div>
          {invalid && (
            <ShakingError text="Form is not valid" />
          )}
          {!invalid && res && (
          	<div>
              <label>Email Sent successfully {output} </label>
          	</div>
          )}
        </div>
    	</div>
    );
  }
};


function stringifyFormData(fd) {
  const data = {};
	for (let key of fd.keys()) {
  	data[key] = fd.get(key);
  }
  return JSON.stringify(data, null, 2);
}
class App extends Component {
  render() {
    return (
      <MyForm />
    );
  }
}

export default App;
