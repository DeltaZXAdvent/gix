const CHK_EMPTY = 1,
  CHK_REPO = 2,
  INIT = 3,
  CLONE = 4;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {screen: StartScreen};
    this.openRepo = this.openRepo.bind(this);
  }
  openRepo(path) {
    this.options = {path: path};
    this.setState({screen: RepoScreen});
  }
  render() {
    switch (this.state.screen) {
      case StartScreen:
        return <StartScreen openRepo={this.openRepo} />
      case RepoScreen:
        return <RepoScreen path={this.options.path} />
      default:
        return;
    }
  }
}
class StartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {view: OpenView};
    this.view = React.createRef();
  }
  changeView(v) {
    this.setState({view: v});
  }
  openRepo(path) {
    gix(CHK_REPO, path)
      .then(
        () => this.props.openRepo(path),
        () => alert(`Repo is not acessible`)
      );
  }
  render() {
    return (
      <React.Fragment>
        <button onClick={() => this.changeView(CloneView)} disabled={this.state.view === CloneView}>Clone</button>
        <button onClick={() => this.changeView(InitView)} disabled={this.state.view === InitView}>Init</button>
        <button onClick={() => this.changeView(OpenView)} disabled={this.state.view === OpenView}>Open</button>
        <br />
        <this.state.view ref={this.view}/>
        <br />
        <button
          onClick={() => {
            const view = this.view.current;
            switch(this.state.view) {
              case CloneView:
                gix(CHK_EMPTY, view.path)
                  .then(
                    (res) => {
                      if (res) {
                        gix(CLONE, view.url, view.path)
                          .then(
                            () => this.openRepo(view.path),
                            () => alert(`clone failed`)
                          );
                      } else alert(`Directory is not empty`);
                    },
                    () => alert(`Cannot access directory`)
                  );
                return;
              case InitView:
                gix(CHK_EMPTY, view.path)
                  .then(
                    (result) => {
                      if (result) {
                        gix(INIT, view.path)
                          .then(
                            () => this.openRepo(view.path),
                            () => alert(`Init failed`)
                          );
                      } else alert(`Directory is not empty`);
                    },
                    () => alert(`Cannot access directory`)
                  );
                return;
              case OpenView:
                this.openRepo(view.path);
                return;
              default:
                return;
            }
          }}
        >
        Confirm
        </button>
      </React.Fragment>
    );
  }
}
class RepoScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <h1>{this.props.path}</h1>;
  }
}
class CloneView extends React.Component {
  constructor(props) {
    super(props);
    this.url = "";
    this.path = "";
  }
  render() {
    return (
      <React.Fragment>
        <label>
          Remote URL
          <input onChange={(e) => this.url = e.target.value} />
        </label>
        <br />
        <label>
          Repo path
          <input onChange={(e) => this.path = e.target.value} />
        </label>
      </React.Fragment>
    );
  }
}
class InitView extends React.Component {
  constructor(props) {
    super(props);
    this.path = "";
  }
  render() {
    return (
      <React.Fragment>
        <label>
          Repo path
          <input onChange={(e) => this.path = e.target.value} />
        </label>
      </React.Fragment>
    );
  }
}
class OpenView extends React.Component {
  constructor(props) {
    super(props);
    this.path = "";
  }
  render() {
    return (
      <label>
        Repo path
        <input onChange={(e) => this.path = e.target.value} />
      </label>
    );
  }
}

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
