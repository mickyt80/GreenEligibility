import usePageTitle from '../hooks/usePageTitle';
import { SERVICE_NAME } from './StartPage';

// The cookies page. It is empty for now.
export default function CookiesPage() {
  usePageTitle(SERVICE_NAME);
  return null;
}
