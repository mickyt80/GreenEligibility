import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  // Forget the journey's answers, so tests don't affect each other.
  window.sessionStorage.clear();
});
