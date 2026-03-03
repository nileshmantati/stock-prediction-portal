import { useState } from 'react';
import './assets/css/style.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  )
}

export default App
