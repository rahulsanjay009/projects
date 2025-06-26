import {
  IonBadge,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useParams, Outlet, useNavigate } from 'react-router-dom'; // Use Outlet for nested routing

import MobileResponsiveMenu from './MobileResponsiveMenu'
import useCategories from "../../../utils/useCategories";
import MobileContactUs from "../../ContactUs/MobileContactUs";
import { MdShoppingCart as ShoppingCartIcon} from 'react-icons/md';
import { useSelector } from "react-redux";

const MobileHomePage = () => {
  const { category } = useParams();  // Get category dynamically from the URL
  const { categories } = useCategories();
  const cartItemCount = useSelector((state) => state?.CartReducer?.products.length || 0); // Example reducer to manage cart item count
  const navigate = useNavigate();
  return (
    <>
      
      <MobileResponsiveMenu categories={categories}/>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar className="ion_toolbar">
            <IonButtons slot="start">
              <IonMenuButton className="ion_menu_button" />
            </IonButtons>
            <IonTitle>
              <div style={{  display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',  // or 'space-between' if needed
                gap: '10px',
                width: '100%'  }}>
                <div className="ion_title" >
                  <a href='/'> 
                  <img
                      src="https://res.cloudinary.com/dmm4awbwm/image/upload/f_auto,q_auto/tsee5mrm7cymclmefpic"
                      alt="Kitten"
                      height="35"
                      width="35"
                    />
                    </a>
                    <IonText style={{padding:'5px'}}>
                    {!category || category === '/ALL'
                      ? (
                          <>
                            Sri Krishna<br />
                            Party Rentals LLC
                          </>
                        )
                      : category.replace('/', '')
                    }
                  </IonText>
                </div>
                <div style={{position:'absolute', right:'15px'}}>
                    <div style={{ position: 'relative', display: 'inline-block', right:0 }} onClick={() => {navigate('/cart')}}>
                      <ShoppingCartIcon style={{ fontSize: '32px' }} />
                      {cartItemCount > 0 && (
                        <IonBadge
                          color="danger"
                          style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            fontSize: '0.7rem',
                            padding: '4px 6px',
                            borderRadius: '50%',
                            lineHeight: '1',
                          }}
                        >
                          {cartItemCount}
                        </IonBadge>
                      )}
                    </div>
                </div>
              </div>
              
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent scrollEvents={true}>
          <MobileResponsiveMenu categories={categories} />
          {/* The Outlet will render the nested routes based on the current category */}
          <Outlet />
          <MobileContactUs />
        </IonContent>
      </IonPage>
    </>
  );
};

export default MobileHomePage;
