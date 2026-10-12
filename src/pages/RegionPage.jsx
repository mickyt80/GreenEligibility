import usePageTitle from '../hooks/usePageTitle';
import { SERVICE_NAME } from './StartPage';

// The next page of the journey. It is empty until its question is written.
export default function RegionPage() {
  usePageTitle(SERVICE_NAME);
  return null;
}
