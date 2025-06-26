import { useEffect, useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonImg,
  IonRow,
  IonSpinner,
  IonText,
} from "@ionic/react";
import './ProductCatalog.css';
import IonIcon from "@reacticons/ionicons";
import AddRemoveProduct from "./AddRemoveProduct";

const BATCH_SIZE = 8;

const preloadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = resolve;
  });

const MobileProductCatalog = ({ products = [], relatedProducts = [] }) => {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [nextIndex, setNextIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNextBatch = async () => {
    if (nextIndex >= products.length) return;

    setLoading(true);
    const nextBatch = products.slice(nextIndex, nextIndex + BATCH_SIZE);

    const imageUrls = nextBatch
      .filter(p => p.image_url)
      .map(p => `${encodeURI(p.image_url)}?f_auto,q_auto,w_400`);

    await Promise.all(imageUrls.map(preloadImage));

    setVisibleProducts(prev => [...prev, ...nextBatch]);
    setNextIndex(prev => prev + BATCH_SIZE);
    setLoading(false);
  };

  useEffect(() => {
    setVisibleProducts([]);
    setNextIndex(0);
  }, [products]);

  // Start loading on mount or when index changes
  useEffect(() => {
    if (!loading && nextIndex < products.length) {
      loadNextBatch();
    }
  }, [nextIndex, products]);

  return (
    <>
      {visibleProducts.map((product, idx) => (
        <IonCard className="ion_card" key={`${product?.name}-${idx}`}>
          {product.image_url ? (
            <IonImg
              className="ion_img"
              src={`${encodeURI(product.image_url)}?f_auto,q_auto,w_600`}
              alt={product.name}
              style={{ width: '100%', height: '60vh', objectFit: 'contain' }}
            />
          ) : (
            <div style={{ height: '250px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#999' }}>No Image</p>
            </div>
          )}
          <IonCardContent>
            <IonRow>
              <IonText style={{fontSize:'18px', fontStyle:'bold', color:'black', marginBottom:'0.25rem'}}>{product.name}</IonText>              
            </IonRow>
            <IonRow>
              <IonText style={{ fontSize: '14px', color: '#666', marginBottom:'0.25rem' }}>
                {product?.description}
              </IonText>  
            </IonRow>  
            <IonRow style={{marginBottom:'0.25rem'}}>
              <IonText>
                {product.price == 0
                  ? "$0 - Contact for price"
                  : `$${product.price}`}
              </IonText>
              
            </IonRow>
            <IonRow style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{width:'50%'}}> <AddRemoveProduct productId={product.id}/> </div>
              <a
                    href={`https://wa.me/16692688087?phone=16692688087&text=${encodeURIComponent(
                      `Hi, I'm interested in this product:\n\n${product.name}\nPrice: ${
                        product.price == 0 ? "Contact for price" : `$${product.price}`
                      }\n\nImage: ${encodeURI(product.image_url)}?f_auto,q_auto,w_600\n\nIs this available?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    onClick={(e) => e.stopPropagation()}
                >
                    <IonIcon name="logo-whatsapp" style={{ height: '30px', width: '30px', color: '#25d366' }} />
                </a>
            </IonRow>          
          </IonCardContent>
        </IonCard>
      ))}

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
          <IonSpinner name="crescent" />
        </div>
      )}
    </>
  );
};

export default MobileProductCatalog;
