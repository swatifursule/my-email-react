import React, { Component } from 'react';

import './App.css';
import axios from 'axios'

const inputParsers = {
  date(input) {
    const split = input.split('/');
    const day = split[1]
    const month = split[0];
    const year = split[2];
    return `${year}-${month}-${day}`;
  },
  uppercase(input) {
    return input.toUpperCase();
  },
  number(input) {
    return parseFloat(input);
  },
};

class ShakingError extends React.Component {
	constructor() { super(); this.state = { key: 0 }; }

	componentWillReceiveProps() {
    // update key to remount the component to rerun the animation
  	this.setState({ key: ++this.state.key });
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

  handleSubmit(event) {
    event.preventDefault();

    if (!event.target.checkValidity()) {
    	this.setState({
        invalid: true,
        displayErrors: true,
      });
      return;
    }
    const form = event.target;

    var data = new FormData(form);

    for (let name of data.keys()) {
      const input = form.elements[name];
      const parserName = input.dataset.parse;
      console.log('parser name is', parserName);
      if (parserName) {
        const parsedValue = inputParsers[parserName](data.get(name))
        data.set(name, parsedValue);
      }
    }
    console.log("data  "+JSON.stringify(stringifyFormData(data), 4, 1));

    var object = {};
      data.forEach(function(value, key){
        object[key] = value;
      });
      var json = JSON.stringify(object);
      console.log("this is this element : "+json);

    this.setState({
    	res: stringifyFormData(data),
      invalid: false,
      displayErrors: false
    });
  console.log("this.state.res : "+JSON.stringify(object));
    var data1 = {
      "bccEmailAddresses": object.email_bcc.split(";"),
      "ccEmailAddresses": object.email_cc.split(";"),
      "toEmailAddresses": object.email_to.split(";"),
      "bodyData": object.email_body,
      "subjectData": object.email_subject,
      "sourceEmail": object.email_from,
      "replyToAddresses": object.email_from.split(";")
      }

    console.log("my data1 is "+JSON.stringify(data1,4,1));
    /*fetch('https://4puqpns0ze.execute-api.ap-southeast-2.amazonaws.com/dev/sendMail', {
       method: 'POST',
       body: data1,
     }).then(results => {
       console.log(results.json())
     }).catch(error => {
       console.log(error);
     });*/

     axios.post('https://4puqpns0ze.execute-api.ap-southeast-2.amazonaws.com/dev/sendMail', data1)
       .then(response => console.log(response))

  }

  render() {
  	const { res, invalid, displayErrors } = this.state;
    return (
    	<div>
        <form
          onSubmit={this.handleSubmit}
          noValidate
          className={displayErrors ? 'displayErrors' : ''}
         >
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            data-parse="uppercase"
          />

          <label htmlFor="email_from">From Email:</label>
          <input id="email_from" name="email_from" type="email" required />

          <label htmlFor="email_to">To Email:</label>
          <input id="email_to" name="email_to" type="email" required />

          <label htmlFor="email_cc">CC Email:</label>
          <input id="email_cc" name="email_cc" type="email" required />

          <label htmlFor="email_bcc">BCC Email:</label>
          <input id="email_bcc" name="email_bcc" type="email" required />

          <label htmlFor="email_subject">Subject:</label>
          <input
            id="email_subject"
            name="email_subject"
            type="text"
            placeholder="Subject"
            required
          />

          <label htmlFor="email_body">Email Body:</label>
          <input
            id="email_body"
            name="email_body"
            type="text"
            placeholder="Email Text Body"
            required
          />
          <label htmlFor="date">Birthdate:</label>
          <input
            id="birthdate"
            name="birthdate"
            type="text"
            data-parse="date"
            placeholder="MM/DD//YYYY"
            pattern="\d{2}\/\d{2}/\d{4}"
            required
          />

          <button>Send Email</button>
        </form>



        <div className="res-block">
          {invalid && (
            <ShakingError text="Form is not valid" />
          )}
          {!invalid && res && (
          	<div>
              <h3>Transformed data to be sent:</h3>
              <pre>FormData {res}</pre>
          	</div>
          )}
        </div>
    	</div>
    );
  }
}


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
