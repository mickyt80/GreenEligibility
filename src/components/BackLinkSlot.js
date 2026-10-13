import { createContext } from 'react';

// The place at the top of the page, on the same row as the language navigation, where a
// page's "Back" link is drawn. App provides it; BackLink draws into it.
export const BackLinkSlot = createContext(null);
