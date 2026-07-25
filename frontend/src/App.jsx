import { BrowserRouter } from 'react-router-dom';
import { VisitorProvider } from './context/VisitorContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <VisitorProvider>
        <AppRoutes />
      </VisitorProvider>
    </BrowserRouter>
  );
}

export default App;
