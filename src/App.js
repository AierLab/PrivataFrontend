// import logo from './logo.svg';
import './App.css';
import LoginForm from './components/loginform';

function App() {
  
  return (
    <div id="app">
      <div className="page">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

      <LoginForm />
    </div>
    </div>
    
  );
}

export default App;
