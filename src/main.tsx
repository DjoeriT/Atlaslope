import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { applyDebugFlags } from './debug';
import { loadGuide } from './facts/guides';
import { hashAt } from './paths';
import { parseSelection } from './url';
import './styles/app.css';
import './styles/ux.css';
import './styles/motion.css';
import './styles/site.css';

applyDebugFlags(); // must run before the first render: ?fresh=1 clears what the first render reads
// A link to a guide page or one of its fly-theres opens with that guide already loaded (guides load on demand, decision #38).
const first = parseSelection(hashAt(location.pathname, location.hash));
const ready = first.kind === 'place' ? loadGuide(first.id).catch(() => undefined) : Promise.resolve();
ready.then(() => createRoot(document.getElementById('root')!).render(<App />));
