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
import { selectTotalCount } from "../../../Redux/Reducers/CartReducer";
import HeaderTitle from "./HeaderTitle";

const MobileHomePage = () => {
  const { category } = useParams();  // Get category dynamically from the URL
  const { categories } = useCategories();
  const cartItemCount = useSelector(selectTotalCount); // Example reducer to manage cart item count
  const navigate = useNavigate();
  return (
    <>
      
      <MobileResponsiveMenu categories={categories}/>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar className="ion_toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IonButtons slot="start">
            <IonMenuButton className="ion_menu_button" />
          </IonButtons>

          <HeaderTitle category={category} />

          <IonButtons slot="end" style={{ position: 'relative' }}>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', marginRight:"5px" }}
              onClick={() => navigate('/cart')}
              aria-label="Go to cart"
            >
              <ShoppingCartIcon size={32} color='white'/>
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
            </button>
          </IonButtons>
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
