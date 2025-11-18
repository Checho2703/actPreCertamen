import React from 'react';
import "./css/bootstrap.min.css";
import RegalosTable from './components/RegalosTable';
import ComidaTable from './components/ComidaTable';
import AdornosTable from './components/AdornosTable';

function App() {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Listas de Firebase</h1>

      <div className="row">
        <div className="col-lg-4 mb-4">
          <RegalosTable />
        </div>
        <div className="col-lg-4 mb-4">
          <ComidaTable />
        </div>
        <div className="col-lg-4 mb-4">
          <AdornosTable />
        </div>
      </div>
    </div>
  );
}

export default App;