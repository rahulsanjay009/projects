import { useParams } from "react-router-dom";
import MobileProductCatalog from "../../ProductCatalog/MobileProductCatalog";
import MobileProductSearchBar from '../../ProductSearchBar/MobileProductSearchBar';
import useProducts from "../../../utils/useProducts";
import { useEffect, useState } from "react";
import { IonLoading } from "@ionic/react";

const MobileCategoryContent = () => {
    const { category } = useParams();  // Get category from URL
    const { products, productsLoading } = useProducts(decodeURIComponent(category.replace('/','')));
    const [searchText, setSearchText] = useState("");
    // Filter products based on search text
    const filteredProducts = searchText.trim() === "" 
        ? products 
        : products.filter(product =>
            product.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchText.toLowerCase())
        );

    return (
        <div style={{position:'relative'}}>
            <IonLoading isOpen={productsLoading} message={'Loading products...'} />
            <div style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white', width: '100%' }}>
                <MobileProductSearchBar selectSearchText={setSearchText} />
            </div>        
            <MobileProductCatalog products={filteredProducts} relatedProducts={products} />
        </div>
    );
};

export default MobileCategoryContent;
