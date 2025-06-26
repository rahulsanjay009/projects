import {
  IonContent,
  IonPage,
  IonText,
  IonImg,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonGrid,
  IonRow,
} from "@ionic/react";
import { logoWhatsapp } from "ionicons/icons";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AddRemoveProduct from "./AddRemoveProduct"; // Ensure this is compatible with Ionic or rework as needed
import MobileLatestProductsCarousel from "../Carousel/MobileLatestProductsCarousel";
import Box from "@mui/material/Box";

const MobileDisplayProduct = () => {
  const location = useLocation();
  const { product, relatedProducts } = location.state || {};

  const [randomRelatedProducts, setRandomRelatedProducts] = useState([]);

  const getRandomItems = (products) => {
    if (!products || products.length <= 10) return products || [];
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 10);
  };

  useEffect(() => {
    if (relatedProducts && product) {
      const filtered = relatedProducts.filter((p) => p.id !== product.id);
      setRandomRelatedProducts(getRandomItems(filtered));
    }
  }, [product, relatedProducts]);

  if (!product) {
    return (
      <IonPage>
        <IonContent>
          <IonText color="danger">
            <h5>No product selected. Please go back and select a product.</h5>
          </IonText>
        </IonContent>
      </IonPage>
    );
  }


  return (
      < >
        <IonGrid>
          
            {/* Product Info */}
            
              <IonCard>
                <IonRow>
                <IonImg
                  src={`${encodeURI(product.image_url)}?f_auto,q_auto,w_600`}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "contain",
                    borderRadius: "10px",
                  }}
                />   
                </IonRow>           
                                                                                                            
                <IonCardContent>
                  <IonRow>
                  <IonCardTitle>{product.name}</IonCardTitle>
                  </IonRow>
                  <IonRow style={{marginTop:'0.3rem', display:'flex', flexWrap:'wrap', gap:'5px', alignItems:'center'}}>
                    {product.categories?.map((cat, index) => (                      
                        <IonText
                          style={{
                            fontSize: 10,
                            padding: "4px 8px",
                            background: "#eeeeee",
                            borderRadius: "12px",
                            display: "inline-block",
                          }}
                        >
                          {cat?.name}
                        </IonText>                      
                    ))}
                  </IonRow>
                  <IonRow>
                    <IonText>{product.description}</IonText>
                  </IonRow>
                  <Box sx={{ marginTop: "0.3rem", display: 'flex', alignItems:'center',justifyContent:'space-between' }}>
                      <Box width={'50%'}>
                      <AddRemoveProduct productId={product.id} />
                           </Box>             
                      <IonButton
                        fill="clear"
                        size="medium"
                        href={`https://wa.me/16692688087?text=${encodeURIComponent(
                          `Hi, I'm interested in this product:\n\n${product.name}\nCategory: ${product.category}\nPrice: ${
                            product.price === 0 ? "Contact for price" : `$${product.price}`
                          }\n\nImage: ${encodeURI(product.image_url)}?f_auto,q_auto,w_600\n\nIs this available?`
                        )}`}
                        target="_blank"                    
                      >
                        <IonIcon icon={logoWhatsapp} slot="icon-only" style={{color:'#075e54'}} />
                      </IonButton>
                    
                  </Box>
                </IonCardContent>
              </IonCard>
            
              
          
          
          <MobileLatestProductsCarousel productsData={randomRelatedProducts} />                        
          
        </IonGrid>
      </>
  );
};

export default MobileDisplayProduct;
