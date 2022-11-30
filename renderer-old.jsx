class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dir: null,
      url: null,
      tab: 'start',
    };
    this.alter = this.alter.bind(this);
  }
  alter(dir, url) {
    if(this.state.tab === 'start') {
      this.setState({tab: 'view',});
      this.setState({dir: dir});
    }
  }
  render() {
    switch(this.state.tab) {
    case 'start':
      return (<StartScreen lift={this.alter} />);
      break;
    case 'view':
      return (<View dir={this.state.dir} />);
      break;
    default:
      return (<h1>Hello!</h1>);
    }
  }
}

class StartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'open',
    };
    this.alter=this.alter.bind(this);
    this.submit=this.submit.bind(this);
  }
  alter(e) {
    this.setState({
      mode: e.target.id,
    });
  }
  submit(e) {
    switch(this.state.mode) {
      case 'open':
      case 'init':
        const dir = this.querySelector('#dir');
        this.props.lift(dir.value, null);
        break;
        alert('init');
      case 'clone':
        alert('clone');
    }
  }
  renderRest() {
    if(this.state.mode==='open' || this.state.mode==='init')
      return (
        <div>
          <label htmlFor="dir">
            Repository path
          </label>
          <br/>
          <input id="dir" />
          <br/>
          <button onClick={this.submit}>
            Confirm
          </button>
        </div>
      );
    else if(this.state.mode==='clone')
      return (
        <div>
          <label htmlFor="dir">
            Repository path
          </label>
          <br/>
          <input id="dir" />
          <br/>
          <label htmlFor="url">
            Remote URL
          </label>
          <br/>
          <input id="url" />
          <br/>
          <button onClick={this.submit}>
            Confirm
          </button>
        </div>
      );
    else
      return null;
  }
  render() {
    return (
      <div>
        <button id="open" onClick={this.alter} disabled={this.state.mode==='open'}>OPEN</button>
        <button id="init" onClick={this.alter} disabled={this.state.mode==='init'}>INIT</button>
        <button id="clone" onClick={this.alter} disabled={this.state.mode==='clone'}>CLONE</button>
        {this.renderRest()}
      </div>
    );
  }
}

class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dir: props.dir,
    }
  }
  render() {
    return (
      <h1>{this.state.dir}</h1>
    );
  }
}

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
