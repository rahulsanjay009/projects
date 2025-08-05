import { useState, useEffect, useCallback } from "react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import { MdAddCircleOutline, MdRemoveCircleOutline } from 'react-icons/md';
import { useSelector, useDispatch } from "react-redux";
import { setProductQuantity } from "../../Redux/Reducers/CartReducer";

const AddRemoveProduct = ({ productId }) => {
  const dispatch = useDispatch();

  const product = useSelector((state) =>
    state.CartReducer?.products?.find((item) => item.product_id === productId)
  );

  const [quantityInput, setQuantityInput] = useState("");

  // Sync input state with Redux on load or product change
  useEffect(() => {
    if (product) {
      setQuantityInput(String(product.quantity));
    }
  }, [product]);

  // Handle manual input change
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setQuantityInput(val);
    }
  };

  // Commit the manual input to Redux on blur
  const handleBlur = () => {
    const parsed = parseInt(quantityInput, 10);
    if (!isNaN(parsed)) {
      dispatch(setProductQuantity({ product_id: productId, quantity: parsed }));
    } else if (product) {
      setQuantityInput(String(product.quantity)); // Reset invalid input
    }
  };

  // Increment and decrement actions
  const increment = useCallback((e) => {
    e.stopPropagation()
    dispatch(setProductQuantity({
      product_id: productId,
      quantity: (product?.quantity || 0) + 1,
    }));
  }, [dispatch, product?.quantity, productId]);

  const decrement = useCallback((e) => {
    e.stopPropagation()
    const currentQty = product?.quantity || 0;
    if (currentQty > 0) {
      dispatch(setProductQuantity({
        product_id: productId,
        quantity: currentQty - 1,
      }));
    }
  }, [dispatch, product?.quantity, productId]);

  // Render initial "Add" button if not in cart yet
  if (!product) {
    return (
      <Box
        onClick={increment}
        sx={{
          backgroundColor: 'success.main',
          color: 'white',
          textAlign: 'center',
          py: 1,
          borderRadius: 1,
          cursor: 'pointer',
          fontWeight: 500,
          width: '100%',
        }}
      >
        Add
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" width="100%">
      <IconButton onClick={decrement} color="success">
        <MdRemoveCircleOutline />
      </IconButton>
      <Input
        type="text"
        value={quantityInput}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onClick={(e) => e.stopPropagation()}
        inputProps={{ style: { textAlign: "center", width: "50px" } }}
      />
      <IconButton onClick={increment} color="success">
        <MdAddCircleOutline />
      </IconButton>
    </Box>
  );
};

export default AddRemoveProduct;
