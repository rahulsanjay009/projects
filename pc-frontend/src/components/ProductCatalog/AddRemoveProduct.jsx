import  { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import { MdAddCircleOutline as AddCircleOutline, MdRemoveCircleOutline as RemoveCircleOutline} from 'react-icons/md';
import { useSelector, useDispatch } from "react-redux";
import { setProductQuantity } from "../../Redux/Reducers/CartReducer";

const AddRemoveProduct = ({ productId }) => {
  const dispatch = useDispatch();

  const addedProduct = useSelector((state) =>
    state.CartReducer?.products?.find((item) => item.product_id === productId)
  );

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (addedProduct) {
      setInputValue(String(addedProduct.quantity));
    }
  }, [addedProduct]);

  const handleChange = (e) => {
    const val = e.target.value;
    // Allow only digits or empty string
    if (/^\d*$/.test(val)) {
      setInputValue(val);
    }
  };

  const commitQuantity = () => {
    const qty = parseInt(inputValue, 10);
    if (!isNaN(qty)) {
      dispatch(setProductQuantity({ product_id: productId, quantity: qty }));
    } else {
      // fallback to previous Redux value if input invalid
      setInputValue(String(addedProduct.quantity || 1));
    }
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    const currentQty = addedProduct?.quantity || 0;
    dispatch(setProductQuantity({ product_id: productId, quantity: currentQty + 1 }));
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    const currentQty = addedProduct?.quantity || 0;
    if (currentQty > 0) {
      dispatch(setProductQuantity({ product_id: productId, quantity: currentQty - 1 }));
    }
  };

  if (!addedProduct) {
    return (
      <Box
        onClick={handleAdd}
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
      <IconButton >
        <RemoveCircleOutline onClick={handleRemove} color="success"/>
      </IconButton>
      <Input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onBlur={commitQuantity}
        onClick={(e) => e.stopPropagation()}
        inputProps={{ style: { textAlign: "center", width: "50px" } }}
      />
      <IconButton onClick={handleAdd} color="success">
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};

export default AddRemoveProduct;
