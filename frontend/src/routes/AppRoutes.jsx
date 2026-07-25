import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Museums from '../pages/Museums';
import MuseumDetails from '../pages/MuseumDetails';
import Artifacts from '../pages/Artifacts';
import ArtifactDetails from '../pages/ArtifactDetails';
import RoutesList from '../pages/Routes';
import RouteDetails from '../pages/RouteDetails';
import VisitorProfile from '../pages/VisitorProfile';
import ResearcherPage from '../pages/ResearcherPage';
import NotFound from '../pages/NotFound';

const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/museums' element={<Museums />} />
    <Route path='/museums/:id' element={<MuseumDetails />} />
    <Route path='/artifacts' element={<Artifacts />} />
    <Route path='/artifacts/:id' element={<ArtifactDetails />} />
    <Route path='/routes' element={<RoutesList />} />
    <Route path='/routes/:id' element={<RouteDetails />} />
    <Route path='/profile' element={<VisitorProfile />} />
    <Route path='/researcher' element={<ResearcherPage />} />
    <Route path='*' element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
