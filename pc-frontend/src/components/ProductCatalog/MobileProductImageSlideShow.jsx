import React, { useState } from 'react';
import { IonImg, IonButton, IonIcon } from '@ionic/react';
import { chevronBack, chevronForward, colorFill } from 'ionicons/icons';
import './ProductCatalog.css'
const MobileProductImageSlideshow = ({ product }) => {
  const images = [{image_url: product?.image_url, image_public_id: product?.image_public_id},...product?.additional_images] || [];
  const [current, setCurrent] = useState(0);

  const showPrev = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const showNext = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  if (images.length === 0) {
    return (
      <div style={{
        height: '250px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: '#999' }}>No Image</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IonButton onClick={showPrev} style={{ position: 'absolute', left: 0, zIndex: 2 }} className='custom-chevron' fill="clear">
        <IonIcon icon={chevronBack} />
      </IonButton>
      <IonImg
        className="ion_img"
        src={`${encodeURI(images[current]?.image_url)}?f_auto,q_auto,w_600`}
        alt={product.name}
        style={{ width: '100%', height: '60vh', objectFit: 'contain' }}
      />
      <IonButton onClick={showNext} style={{ position: 'absolute', right: 0, zIndex: 2 }} className='custom-chevron' fill="clear">
        <IonIcon icon={chevronForward} />
      </IonButton>
      <div style={{ position: 'absolute', bottom: 20, right: 20, color: 'black', background: 'rgba(255,255,255,0.7)', borderRadius: 5, padding: '2px 6px', fontSize: 13 }}>
        {current + 1} / {images.length}
      </div>
    </div>
  );
};

export default MobileProductImageSlideshow;
