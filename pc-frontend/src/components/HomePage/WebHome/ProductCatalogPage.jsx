import { useState } from 'react';
import  Box  from '@mui/material/Box';
import ProductSearchBar from '../../ProductSearchBar/ProductSearchBar';
import ProductCatalog from '../../ProductCatalog/ProductCatalog';
import useProducts from '../../../utils/useProducts';
import { useParams } from 'react-router-dom';

const ProductCatalogPage = () => {
    const { category } = useParams();
    const decodedCategory = decodeURIComponent(category || 'Home');
    const { products } = useProducts(decodedCategory);
    const [searchText, setSearchText] = useState('');
    const filteredProducts = searchText.trim()
        ? products.filter(
            (product) =>
                product.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchText.toLowerCase())
        )
        : products;
    return (
        <Box sx={{position:'relative'}}>        
        {/* { productsLoading && <div className='loader-overlay'> <div className='loader'> </div> </div>} */}
            <Box sx={{ display: 'flex', gap: 2, p: 1, alignItems: 'center', zIndex:1, backgroundColor:'white',position: 'sticky', top:0 }}>
                <ProductSearchBar selectSearchText={setSearchText} />
            </Box>
            <Box sx={{width: "100%", mb: 2}}>
                <ProductCatalog products={filteredProducts} relatedProducts={products}/>
            </Box>
        </Box>
    );
};

export default ProductCatalogPage;
