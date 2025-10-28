import { useEffect, useState } from 'react';
import styles from './InventoryConsole.module.css'
import AddIcon from '@mui/icons-material/Add';
import { TableCell, TableContainer, TableHead, TableRow, Paper, Table, TableBody, Button, Snackbar, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import APIService from '../../services/APIService';
import SearchFilterAddInventory from './SearchFilterAddInventory';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';

const InventoryConsole = () => {
    const [editingProduct, setEditingProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [originalProducts,setOriginalProducts] = useState([]);
    const [showAddProductModal,setShowAddProductModal] = useState(false);
    const [showAddCategory,setShowAddCategory] = useState(false);
    const [message, setMessage] = useState('');
    const [loader,setLoader] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [categories, setCategories] = useState([]);


    useEffect(() => {
        setLoader(true);
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        APIService().fetchCategories().then((data) => {
            if (data?.success) setCategories(data.categories);
        }).catch((err) => console.log(err));
    }

    const fetchProducts = () => {
        APIService().fetchProducts().then((res) => {
            if(res.success){
                setProducts(res.products);
                setOriginalProducts(res.products);
            }
        }).catch((err) => console.log(err)).finally(() => {
            setLoader(false);
        });
    };

    const addProductModal = (value) => {
        setShowAddProductModal(value);
    };

    const retrieveAvailability = (fromDate, toDate) => {
        setLoader(true);
        APIService().fetchAvailability(fromDate, toDate).then((res) => {
            if(res.success){
                const availabilityDict = res.availableProducts.reduce((acc, item) => {
                    acc[item.product_id] = item.available_qty;
                    return acc;
                }, {});
                const updatedProducts = products.map(product => {
                    const availableQty = availabilityDict[product.id] || 0;
                    return { ...product, available_qty: availableQty < 0 ? 0 : availableQty };
                });
                setProducts(updatedProducts);
                setMessage('Availability retrieved');
            } else {
                setMessage(res.error);
            }
        }).catch((err) => console.log(err)).finally(() => { setLoader(false); });
    };

    const handleCategoryFilter = (categoryName) => {
        // console.log(categoryId)
        setSelectedCategory(categoryName);

        if (categoryName.toUpperCase() === "ALL CATEGORIES") {
            setProducts(originalProducts);
            return;
        }

        const filtered = originalProducts.filter(product =>
            product.categories.some(cat => cat.name === categoryName)
        );
        setProducts(filtered);
    };

    const handleEditProduct = (product) => {
        setEditingProduct({ ...product });
        setShowEditModal(true);
    };

    const saveEditedProduct = (formData) => {
        setLoader(true);
        // const formData = new FormData();
        // formData.append('id', updatedProduct.id);
        // formData.append('name', updatedProduct.name);
        // formData.append('description', updatedProduct.description || '');
        // formData.append('price', updatedProduct.price);
        // formData.append('total_qty', updatedProduct.total_qty);
        // formData.append('categories', JSON.stringify(updatedProduct.categories));

        // if (updatedProduct.imageFile) {
        //     formData.append('image', updatedProduct.imageFile);
        // }
       
        APIService().editProduct(formData)
            .then((res) => {
                if (res.success) {
                    const updatedProduct = res.product;
                    const updatedProducts = products.map((product) =>{
                        if (product.id === updatedProduct.id) return updatedProduct;
                        if (res?.swapped_with?.product_id === product.id)
                            return { ...product, s_no: res.swapped_with.s_no };
                        return product;
                    });
                    setProducts(updatedProducts);
                    setMessage('Item details saved...');
                    setShowEditModal(false);
                } else {
                    setMessage(res.error);
                }
            })
            .catch((err) => console.log(err))
            .finally(() => {setLoader(false); setEditingProduct(null);
                    });
    };

    const handleDeleteProduct = (productId) => {
        setLoader(true);
        APIService().deleteProduct(productId).then((res) => {
            if (res.success) {
                setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
                setMessage('Item Deleted');
            } else {
                setMessage(res.error);
            }
        }).catch((err) => console.log(err)).finally(() => { setLoader(false); });
    };

    const filterProducts = (filteredProducts) => {
        if(filteredProducts.length === 0)
            setProducts(originalProducts);
        else
            setProducts(originalProducts.filter((product) => filteredProducts.some((item) => item.id === product.id)));
    };

    const addProductToDB = (formData) => {
        setLoader(true);
        APIService().saveProduct(formData).then((res) => {
            if (res.success) {
                setProducts((prevProducts) => [...prevProducts, res.product]);
                setOriginalProducts((prevProducts) => [...prevProducts, res.product]);
                setMessage('Product added successfully');
                setShowAddProductModal(false);
            } else {
                setMessage(res.message || res.error);
            }
        }).catch((err) => console.log(err)).finally(() => { setLoader(false);  });
       
    }
    return (
        <div>
            <SearchFilterAddInventory addProductModal={addProductModal} retrieveAvailability={retrieveAvailability} products={originalProducts} filteredProducts={filterProducts} />

            {showAddProductModal && (
                <div className={styles.modal} onClick={() => setShowAddProductModal(false)}>
                    <AddProductModal type='product' updateMessage={setMessage} updateShowAddCategory={setShowAddProductModal} addProductToDB={addProductToDB}/>
                </div>
            )}

            {showAddCategory && (
                <div className={styles.modal} onClick={() => setShowAddCategory(false)}>
                    <AddProductModal type='category' updateMessage={setMessage} updateShowAddCategory={setShowAddCategory} />
                </div>
            )}

            <Snackbar
                open={message !== ''}
                autoHideDuration={5000}
                onClose={() => setMessage('')}
                message={message}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />

            <div className={styles.inventory_layout}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650, overflow: 'auto' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell> S.NO </TableCell>
                                <TableCell> Product </TableCell>
                                <TableCell className={styles.category_cell}>
                                    {/* Category
                                    <Button onClick={() => setShowAddCategory(true)}><AddIcon className={styles.plus_icon} /> </Button> */}
                                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                                        <FormControl size="small" sx={{ minWidth: 200 }}>
                                            <InputLabel id="category-filter-label">Filter by Category</InputLabel>
                                            <Select
                                            labelId="category-filter-label"
                                            value={selectedCategory??""}
                                            label="Filter by Category"
                                            onChange={(e) =>{handleCategoryFilter(e.target.value);}}
                                            >
                                            <MenuItem value="All Categories">
                                                <em>All Categories</em>
                                            </MenuItem>
                                            {categories.map((cat) => (
                                                <MenuItem key={cat.name} value={cat.name}>
                                                {cat.name}
                                                </MenuItem>
                                            ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </TableCell>
                                <TableCell> Description </TableCell>
                                <TableCell> Image </TableCell>
                                <TableCell> Price per unit </TableCell>
                                <TableCell> Total Qty </TableCell>
                                <TableCell> Available Qty </TableCell>
                                <TableCell> Actions </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((item, idx) => (
                                <TableRow key={item.id}>
                                    <TableCell> {item.s_no} </TableCell>
                                    <TableCell> {item.name} </TableCell>
                                    <TableCell>
                                        <Box display={'flex'} flexWrap={'wrap'} whiteSpace={'nowrap'} gap={'5px'}>
                                            {item.categories?.map((ele) => (
                                                <Box 
                                                    boxShadow={3} 
                                                    borderRadius={8} 
                                                    p={1} 
                                                    fontSize={10} 
                                                    key={ele?.id} 
                                                    sx={{ backgroundColor: '#f0f0f0', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {ele?.name}
                                                </Box>
                                                ))} 
                                        </Box>                                         
                                    </TableCell>
                                    <TableCell> {item.description} </TableCell>
                                    <TableCell>
                                        <img src={encodeURI(item.image_url)} alt={item?.image_public_id} height='75' width='75' />
                                        <Box>
                                            {(item.additional_images || []).map((img, index) => (
                                                <img src={encodeURI(img.image_url)} alt={img?.image_public_id} height='25' width='25' />
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell> {item.price} </TableCell>
                                    <TableCell> {item.total_qty} </TableCell>
                                    <TableCell> {item.available_qty} </TableCell>
                                    <TableCell>
                                        <Box display={'flex'} gap={'10px'}>
                                            <Button onClick={() => handleEditProduct(item)}>Edit</Button>
                                            <Button onClick={() => handleDeleteProduct(item.id)} color='error'>Delete</Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <EditProductModal
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                product={editingProduct}
                onSave={saveEditedProduct}
            />

            {loader && <div className='loader-overlay'> <div className='loader'> </div> </div>}
        </div>
    );
};

export default InventoryConsole;
