import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeatherDashboard from './components/WeatherDashboard';
import Detail from './components/Detail';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<WeatherDashboard />} />
          <Route path="/detail/:city" element={<Detail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
