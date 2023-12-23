import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import Layout from './pages/Layout';
import NoPage from './pages/NoPage';
import Drug from './pages/Drug';
import ReleaseForm from './pages/ReleaseForm'
import Manufacturer from './pages/Manufacturer'
import Availability from './pages/Availability'
import Pharmacy from './pages/Pharmacy'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="drug" element={<Drug />} />
          <Route path="release-form" element={<ReleaseForm />} />
          <Route path="manufacturer" element={<Manufacturer />} />
          <Route path="availability" element={<Availability />} />
          <Route path="pharmacy" element={<Pharmacy />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);