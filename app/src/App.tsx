import { useEffect } from 'react';
import { MemoryRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { DemoStateProvider, useDemo } from './state/DemoState';
import Layout from './components/Layout';
import Home from './pages/Home';
import Learn from './pages/Learn';
import PracticeLibrary from './pages/PracticeLibrary';
import ScenarioPage from './pages/ScenarioPage';
import Facilitators from './pages/Facilitators';
import Institutions from './pages/Institutions';
import QuestionsSupport from './pages/QuestionsSupport';
import Evidence from './pages/Evidence';
import Quiz from './pages/Quiz';
import Why from './pages/Why';
import Educators from './pages/Educators';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

// Routes are held in memory (MemoryRouter) so the prototype works as a single static file
// on any host. Each view is mirrored to a plain #token so links can be shared,
// e.g. #practice or #practice.forwarded. Swap for BrowserRouter on a real server.

const pathToToken = (path: string) => path.replace(/^\//, '').replace(/\//g, '.');
const tokenToPath = (token: string) => '/' + token.replace(/^#/, '').replace(/\./g, '/');

function HashSync() {
  const loc = useLocation();
  const nav = useNavigate();

  // Open the view named in the hash on first load.
  useEffect(() => {
    const t = window.location.hash.replace(/^#/, '');
    if (t && /^[A-Za-z0-9._~-]+$/.test(t)) nav(tokenToPath(t), { replace: true });
    const onHash = () => {
      const h = window.location.hash.replace(/^#/, '');
      if (/^[A-Za-z0-9._~-]*$/.test(h)) nav(h ? tokenToPath(h) : '/');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      const token = pathToToken(loc.pathname);
      history.replaceState(null, '', token ? `#${token}` : window.location.pathname + window.location.search);
    } catch {
      /* some hosts disallow history changes; routing still works in memory */
    }
    if (!loc.state || !(loc.state as { keepScroll?: boolean }).keepScroll) window.scrollTo(0, 0);
  }, [loc.pathname, loc.state]);

  return null;
}

function SizedRoot() {
  const { textSize } = useDemo();
  useEffect(() => {
    document.documentElement.dataset.textSize = textSize;
  }, [textSize]);
  return (
    <>
      <HashSync />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/practice" element={<PracticeLibrary />} />
          <Route path="/practice/:scenarioId" element={<ScenarioPage />} />
          <Route path="/facilitators" element={<Facilitators />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/questions-support" element={<QuestionsSupport />} />
          <Route path="/evidence" element={<Evidence />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/why" element={<Why />} />
          <Route path="/educators" element={<Educators />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/support" element={<Navigate to="/questions-support" replace />} />
          <Route path="/practise" element={<Navigate to="/practice" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <DemoStateProvider>
      <MemoryRouter>
        <SizedRoot />
      </MemoryRouter>
    </DemoStateProvider>
  );
}
