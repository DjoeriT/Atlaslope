// The plain pages' one script: a link with ?tours (the Guides page's "only guides with a map tour" line) turns the country page's filter on.
export const initGuides = (): void => {
  const box = document.getElementById('tours') as HTMLInputElement | null;
  if (box && new URLSearchParams(location.search).has('tours')) box.checked = true;
};
