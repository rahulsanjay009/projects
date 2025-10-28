import {
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonMenuToggle,
  IonMenu,
  IonContent
} from '@ionic/react';
import {  useNavigate } from 'react-router-dom'; // Add Link to navigate

const MobileResponsiveMenu = ({ categories}) => {
  const navigate = useNavigate()
  const handleCategoryChange = (category) => {
    navigate(encodeURIComponent(`/${category}`));
    window.location.reload();
  };

  return (
    <IonMenu contentId="main-content">
      <IonContent>
        {/* Home */}
        <IonMenuToggle>
          <IonItem button onClick={() => navigate('/Home')}>
            <IonLabel>Home</IonLabel>
          </IonItem>
        </IonMenuToggle>

     

        {/* Accordion for Categories */}
        <IonAccordionGroup>
          <IonAccordion value="categories">
            <IonItem slot="header">
              <IonLabel>Categories</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <IonMenuToggle>
                <IonItem button onClick={() => handleCategoryChange('ALL')}>
                  <IonLabel>All Pictures</IonLabel>
                </IonItem>
              </IonMenuToggle>

              {categories.map((cat, index) => (
                <IonMenuToggle key={index}>
                  <IonItem button onClick={() => handleCategoryChange(cat?.name)}>
                    <IonLabel>{cat?.name}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              ))}
            </div>
          </IonAccordion>
        </IonAccordionGroup>
           {/* About Us */}
           <IonMenuToggle>
          <IonItem button onClick={() => navigate('/about')}>
            <IonLabel>
              About Us
            </IonLabel>
          </IonItem>
        </IonMenuToggle>
      </IonContent>
    </IonMenu>
  );
};

export default MobileResponsiveMenu;
