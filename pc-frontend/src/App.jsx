import './App.css';
import { useWindowSize } from './utils/useWindowSize';
import { IonApp, setupIonicReact } from '@ionic/react';
import { HashRouter as Router } from 'react-router-dom';

/* Ionic Core CSS */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/core.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import DesktopRoutes from './Routes/DesktopRoutes'; // Ensure DesktopRoutes is correctly defined
import MobileRoutes from './Routes/MobileRoutes';


setupIonicReact();

function App() {
  const windowSize = useWindowSize();

  return (
    <IonApp>
      <Router>
        {windowSize < 768 ? (
          <MobileRoutes/>
        ) : (
          <DesktopRoutes />
        )}
      </Router>
    </IonApp>
  );
}

export default App;
