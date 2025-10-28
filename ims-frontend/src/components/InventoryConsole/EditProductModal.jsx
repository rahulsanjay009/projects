import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, Autocomplete, Chip, Button
} from '@mui/material';
import { useEffect, useState } from 'react';
import APIService from '../../services/APIService';
import React from 'react';

const ImagePreview = ({ image, onRemove, isMain, onSetMain }) => (
  <Box
    position="relative"
    width={100}
    height={100}
    mr={1}
    mb={1}
    border={isMain ? '3px solid green' : '2px solid #ccc'}
    borderRadius={2}
    overflow="hidden"
    sx={{ cursor: 'pointer' }}
    onClick={() => !isMain && onSetMain(image)}
    title={isMain ? 'Main Image' : 'Click to set as Main'}
  >
    <img
      src={image.preview}
      alt="Product"
      width={100}
      height={100}
      style={{ objectFit: 'cover' }}
    />
    <Button
      size="small"
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        minWidth: 0,
        padding: '2px 6px',
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: '0 0 0 6px',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onRemove(image);
      }}
    >
      ❌
    </Button>
  </Box>
);

const EditProductModal = ({ open, onClose, product, onSave }) => {
  const [editedProduct, setEditedProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    APIService().retrieveCategories().then((data) => {
      if (data?.success) setCategories(data.categories);
    });
  }, []);

  useEffect(() => {
    if (product) {
      const initialProduct = {
        ...product,
        categories: product.categories || [],
        image: product.image_url && product.image_public_id ? {
          type: 'existing',
          preview: product.image_url,
          public_id: product.image_public_id,
        } : null,
        additional_images: (product.additional_images || []).map((img) => ({
          type: 'existing',
          preview: img.image_url,
          public_id: img.image_public_id,
        })),
        removed_image_ids: [],
      };
      setEditedProduct(initialProduct);
    }
  }, [product]);

  const handleInputChange = (key, value) => {
    setEditedProduct((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryAdd = (category) => {
    if (!editedProduct.categories.find((c) => c.id === category.id)) {
      setEditedProduct((prev) => ({
        ...prev,
        categories: [...prev.categories, category],
      }));
    }
  };

  const handleCategoryRemove = (id) => {
    setEditedProduct((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat.id !== id),
    }));
  };

  const handleRemoveImage = (image) => {
    setEditedProduct((prev) => {
      const updated = { ...prev };
      const isMain = prev.image?.preview === image.preview;

      if (image.type === 'existing') {
        updated.removed_image_ids = [...(prev.removed_image_ids || []), image.public_id];
      }

      if (isMain) {
        updated.image = null;
      } else {
        updated.additional_images = prev.additional_images.filter(
          (img) => img.preview !== image.preview
        );
      }

      return updated;
    });
  };

  const handleSetMainImage = (image) => {
    setEditedProduct((prev) => {
      const updatedAdditional = [
        ...(prev.image ? [prev.image] : []),
        ...prev.additional_images.filter((img) => img.preview !== image.preview),
      ];
      return {
        ...prev,
        image,
        additional_images: updatedAdditional,
      };
    });
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newMainImage = {
        type: 'new',
        file,
        preview: URL.createObjectURL(file),
      };

      setEditedProduct((prev) => {
        const updated = { ...prev };

        if (prev.image?.type === 'existing') {
          updated.removed_image_ids = [...prev.removed_image_ids, prev.image.public_id];
        }

        updated.image = newMainImage;
        return updated;
      });
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      type: 'new',
      file,
      preview: URL.createObjectURL(file),
    }));

    setEditedProduct((prev) => ({
      ...prev,
      additional_images: [...prev.additional_images, ...files],
    }));
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append('id', editedProduct.id);
    formData.append('name', editedProduct.name);
    formData.append('description', editedProduct.description || '');
    formData.append('price', editedProduct.price);
    formData.append('total_qty', editedProduct.total_qty);
    formData.append('categories', JSON.stringify(editedProduct.categories));
    formData.append('removed_images', JSON.stringify(editedProduct.removed_image_ids || []));
    formData.append('s_no', editedProduct.s_no);
    if (editedProduct.image?.type === 'new') {
      formData.append('image', editedProduct.image.file);
    } else if (editedProduct.image?.type === 'existing') {
      formData.append('image_public_id', editedProduct.image.public_id);
    }

    editedProduct.additional_images?.forEach((img) => {
      if (img.type === 'new') {
        formData.append('additional_images', img.file);
      } else {
        formData.append('existing_additional_images[]', img.public_id);
      }
    });
    // for(const value of formData.entries()) {
    //   console.log(value[0], value[1]);}
    onSave(formData);
    onClose();
  };

  if (!editedProduct) return null;

  const selectableCategories = categories.filter(
    (cat) => !(editedProduct.categories || []).some((c) => c.id === cat.id)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} py={2}>
          <TextField
            label="S.NO"
            type='number'
            value={editedProduct.s_no}
            onChange={(e) => handleInputChange('s_no', e.target.value)}
          />
          <TextField
            label="Name"
            value={editedProduct.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
          <Autocomplete
            options={selectableCategories}
            getOptionLabel={(option) => option.name}
            onChange={(e, val) => val && handleCategoryAdd(val)}
            renderInput={(params) => <TextField {...params} label="Add Category" />}
          />
          <Box display="flex" flexWrap="wrap" gap={1}>
            {editedProduct.categories.map((category) => (
              <Chip key={category.id} label={category.name} onDelete={() => handleCategoryRemove(category.id)} />
            ))}
          </Box>
          <TextField
            label="Description"
            multiline
            rows={3}
            value={editedProduct.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
          <TextField
            label="Price"
            value={editedProduct.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
          />
          <TextField
            label="Total Quantity"
            value={editedProduct.total_qty}
            onChange={(e) => handleInputChange('total_qty', e.target.value)}
          />
          <Box>
            <Box fontWeight="bold" mb={1}>Upload Main Image</Box>
            <input type="file" accept="image/*" onChange={handleMainImageChange} />
            <Box mt={2}>
              {editedProduct.image ? (
                <ImagePreview image={editedProduct.image} onRemove={handleRemoveImage} isMain />
              ) : (
                <Box>No main image selected</Box>
              )}
            </Box>
          </Box>
          <Box>
            <Box fontWeight="bold" mb={1}>Upload Additional Images</Box>
            <input type="file" multiple accept="image/*" onChange={handleAdditionalImagesChange} />
            <Box mt={2}>
              <Box display="flex" flexWrap="wrap">
                {editedProduct.additional_images.length > 0 ? (
                  editedProduct.additional_images.map((img, i) => (
                    <ImagePreview
                      key={i}
                      image={img}
                      onRemove={handleRemoveImage}
                      isMain={false}
                      onSetMain={handleSetMainImage}
                    />
                  ))
                ) : (
                  <Box>No additional images selected</Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductModal;
