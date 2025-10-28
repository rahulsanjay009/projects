import { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Snackbar, Box } from '@mui/material';
import APIService from '../../services/APIService';
import CartPage from '../../../../pc-frontend/src/components/ProductCatalog/CartPage';

const CategoriesConsole = () => {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', image: null });
    const [showAddRow, setShowAddRow] = useState(false);
    const [message, setMessage] = useState('');
    const [loader,setLoader] = useState(false)

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        setLoader(true)
        APIService().retrieveCategories().then(res => {
            if (res.success) {
                setCategories(res.categories);
            }
            setLoader(false)
        });
    };

    const handleAddCategory = async () => {
        const formData = new FormData();
        formData.append('name', newCategory.name);
        if (newCategory.image) formData.append('image', newCategory.image);
        setLoader(true)
        const res = await APIService().addCategory(formData);
        if (res.success) {
            setMessage('Category added successfully!');
            setNewCategory({ name: '', image: null });
            setShowAddRow(false);
            fetchCategories();
        } else {
            setMessage(res.error);
        }
        setLoader(false)
    };

    const handleEdit = (category) => setEditingCategory({ ...category });
    const cancelEdit = () => setEditingCategory(null);

    const saveEdit = async () => {
        const formData = new FormData();
        formData.append('id', editingCategory.id);
        formData.append('name', editingCategory.name);
        formData.append('s_no', editingCategory.s_no);
        if (editingCategory.image) formData.append('image', editingCategory.image);
        setLoader(true)
        const res = await APIService().updateCategory(formData);
        if (res.success) {
            setMessage('Category updated successfully');
            setEditingCategory(null);
            fetchCategories();
        } else {
            setMessage(res.error);
        }
        setLoader(false)
        console.log(res?.error)
    };

    const deleteCategory = async (id) => {
        setLoader(true)
        const res = await APIService().deleteCategory(id);
        if (res.success) {
            setMessage('Category deleted');
            fetchCategories();
        } else {
            setMessage(res.error);
        }
        setLoader(false)
    };

    return (
        <div style={{ padding: '16px' }}>
            {loader && <div className="loader-overlay"><div className="loader" /></div>}
            <Button variant="contained" onClick={() => setShowAddRow(!showAddRow)}>
                {showAddRow ? 'Cancel' : 'Add Category'}
            </Button>

            {showAddRow && (
                <Box display="flex" gap={2} mt={2}>
                    <TextField
                        label="Category Name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    />
                    <input
                        type="file"
                        onChange={(e) => setNewCategory({ ...newCategory, image: e.target.files[0] })}
                    />
                    <Button variant="contained" onClick={handleAddCategory}>
                        Submit
                    </Button>
                </Box>
            )}

            <TableContainer component={Paper} sx={{ marginTop: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((cat, idx) => (
                            <TableRow key={cat.id}>
                                <TableCell>
                                    {editingCategory?.id === cat.id ? (
                                        <TextField
                                            value={editingCategory.s_no}
                                            type='number'
                                            onChange={(e) => setEditingCategory({ ...editingCategory, s_no: e.target.value })}
                                        />
                                    ) : (
                                        cat.s_no
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingCategory?.id === cat.id ? (
                                        <TextField
                                            value={editingCategory.name}
                                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                        />
                                    ) : (
                                        cat.name
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingCategory?.id === cat.id ? (
                                        <Box display={'flex'} alignItems={'center'}>
                                        <input
                                            type="file"
                                            onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.files[0] })}
                                            style={{margin:'10px'}}
                                        />
                                        <img src={encodeURI(cat.image_url)} height='50' width="50"/> 
                                        </Box>
                                    ) : (
                                        <img src={encodeURI(cat.image_url)} alt={cat.name} width="50" height="50" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingCategory?.id === cat.id ? (
                                        <>
                                            <Button onClick={saveEdit}>Save</Button>
                                            <Button onClick={cancelEdit}>Cancel</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button onClick={() => handleEdit(cat)}>Edit</Button>
                                            <Button onClick={() => deleteCategory(cat.id)}>Delete</Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar
                open={!!message}
                autoHideDuration={4000}
                onClose={() => setMessage('')}
                message={message}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
        </div>
    );
};

export default CategoriesConsole;
