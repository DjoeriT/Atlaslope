import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { applyDebugFlags } from './debug';
import './styles/app.css';
import './styles/ux.css';

applyDebugFlags(); // must run before the first render: ?fresh=1 clears what the first render reads
createRoot(document.getElementById('root')!).render(<App />);
