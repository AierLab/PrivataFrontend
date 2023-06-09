import React from 'react';
import { createRoot }from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import UsbVerification from './components/usbVerification';
import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/usbKey.html" element={<UsbVerification />} />
    </Routes>
  </Router>,);
// ReactDOM.render(
//   <Router>
//     <Routes>
//       <Route path="/" exact component={App} />
//       <Route path="/usbKey.html" component={UsbVerification} />
//     </Routes>
//   </Router>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
