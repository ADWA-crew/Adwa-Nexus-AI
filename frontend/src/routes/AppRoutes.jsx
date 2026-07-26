import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Museums from '../pages/Museums';
import MuseumDetails from '../pages/MuseumDetails';
import Artifacts from '../pages/Artifacts';
import ArtifactDetails from '../pages/ArtifactDetails';
import RoutesList from '../pages/Routes';
import RouteDetails from '../pages/RouteDetails';
import VisitorProfile from '../pages/VisitorProfile';
import StartJourney from '../pages/StartJourney';
import ResearcherPage from '../pages/ResearcherPage';
import TouristPage from '../pages/TouristPage';
import ChildPage from '../pages/ChildPage';
import ExhibitPage from '../pages/ExhibitPage';
import NotFound from '../pages/NotFound';

const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/start-journey' element={<StartJourney />} />
    <Route path='/museums' element={<Museums />} />
    <Route path='/museums/:id' element={<MuseumDetails />} />
    <Route path='/artifacts' element={<Artifacts />} />
    <Route path='/artifacts/:id' element={<ArtifactDetails />} />
    <Route path='/routes' element={<RoutesList />} />
    <Route path='/progress' element={<RoutesList />} />
    <Route path='/routes/:id' element={<RouteDetails />} />
    <Route path='/profile' element={<VisitorProfile />} />
    <Route path='/researcher' element={<ResearcherPage />} />
    <Route path='/tourist' element={<TouristPage />} />
    <Route path='/child' element={<ChildPage />} />
    <Route path='/exhibit/:id' element={<ExhibitPage />} />
    <Route path='*' element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
