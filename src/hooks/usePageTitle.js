import { useEffect } from 'react';

// Sets the browser tab title to "<heading> – GOV.UK", following the GOV.UK convention.
export default function usePageTitle(heading) {
  useEffect(() => {
    document.title = `${heading} – GOV.UK`;
  }, [heading]);
}
