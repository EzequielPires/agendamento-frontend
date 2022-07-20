import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-calendar/dist/Calendar.css';
import { LoadingProvider } from 'src/context/LoadingContext';
import { AuthProvider } from 'src/context/AuthContext';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { BusinessProvider } from 'src/context/BusinessContext';

function MyApp({ Component, pageProps }) {
  return (
    <LoadingProvider>
      <AuthProvider>
        <BusinessProvider>
          <ReactNotifications />
          <Component {...pageProps} />
        </BusinessProvider>
      </AuthProvider>
    </LoadingProvider>
  )
}

export default MyApp
