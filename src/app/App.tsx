import { FirstRun } from './FirstRun';
import { MapMount } from './MapMount';
import { TopBar } from './TopBar';
import { useTheme } from './theme';

export function App() {
  const [theme, toggleTheme] = useTheme();
  return (
    <>
      <MapMount />
      <TopBar theme={theme} onToggleTheme={toggleTheme} />
      <FirstRun />
    </>
  );
}
