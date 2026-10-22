// Guides load on demand in the app (decision #38); the unit tests read them as if all were loaded, as before.
import { loadAllGuides } from '../../src/facts/guides';

await loadAllGuides();
