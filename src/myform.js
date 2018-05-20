const Form = React.createClass({
  render: () => {
    return (
      <form action="/" method="post">
        <div className="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Email" />
        </div>
        <div className="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
        </div>
        <div className="form-group">
          <label for="exampleInputFile">File input</label>
          <input type="file" id="exampleInputFile" />
          <p className="help-block">Example block-level help text here.</p>
        </div>
        <div className="checkbox">
          <label>
            <input type="checkbox" />Check me out
          </label>
        </div>
        {/* render the button component! */}
        <Button />
        <hr />
      </form>
    );  
  }
});

const Button = React.createClass({
  
  handleClick: function(e) {
    e.preventDefault();
    alert("your form was submitted!");
  },
                                 
  render: function() {
    return (
      <button type="submit" className="btn btn-default" 
              onClick={this.handleClick}>
        Submit
      </button>
    );
  }
});

ReactDOM.render(
  <Form />, document.getElementById('form')
);


////////////////////////////////////////////////////////////////////
const Input = React.createClass({
  
  getInitialState: function() {
    return { userInput: '' };
  },
  
  handleUserInput: function(e) {
    this.setState({ userInput: e.target.value });
  },
  
  render: function () {
    return (
      <div className="form-group">
        <label>Type yo comments in heeya!</label><br />
        <input type="text" 
               className="form-control"
               onChange={this.handleUserInput}
               value={this.state.userInput} />
        <h3>{this.state.userInput}</h3>
      </div>
    );
  }
});

ReactDOM.render(
	<Input />,
	document.getElementById('app')
);
