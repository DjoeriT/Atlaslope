// The home page's only script: its styles, and the search field in the bar. The page itself is plain HTML (index.html), with no map and no React.
import './home.css';
import { initSearch } from './search';
import { initGuides } from './guides';

initSearch();
initGuides();
