import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import APIService from "../../services/APIService";

// Material UI & pickers imports
import {
  Container,
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Alert,
  Link,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const FIELD_LABELS = {
  username: "Customer",
  email: "Email",
  phone: "Phone",
  address: "Address",
  eventDate: "Event Date",
  pickUpDate: "Pickup Date",
  dropOffDate: "Dropoff Date",
  deliveryRequired: "Delivery Required",
};

const OrderDetailPage = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [editingFields, setEditingFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Products editing states
  const [editingProductIdx, setEditingProductIdx] = useState(null);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    productQty: 1,
    productPrice: "",
    productImageUrl: "",
  });

  useEffect(() => {
    if (!orderNumber) return;
    setLoading(true);
    APIService()
      .fetchOrder(orderNumber)
      .then((res) => {
        setOrder(res);
        setEditOrder(res);
      })
      .catch(() => {
        setError("Failed to fetch order. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [orderNumber]);

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "—";

  const startEditField = (field) =>
    setEditingFields({ ...editingFields, [field]: true });
  const cancelEditField = (field) => {
    setEditOrder({ ...editOrder, [field]: order[field] });
    setEditingFields({ ...editingFields, [field]: false });
  };
  const handleFieldChange = (field, value) =>
    setEditOrder({ ...editOrder, [field]: value });

  const saveOrder = async () => {
    setSaving(true);
    setError("");
    try {
      const updatedOrder = await APIService().updateOrder(orderNumber, editOrder);
      setOrder(updatedOrder);
      setEditOrder(updatedOrder);
      setEditingFields({});
    } catch (e) {
      setError("Failed to save changes.");
    }
    setSaving(false);
  };

  const startEditProduct = (idx) => setEditingProductIdx(idx);
  const cancelEditProduct = () => setEditingProductIdx(null);

  const handleEditProductChange = (idx, key, value) => {
    const updatedProducts = [...editOrder.products];
    updatedProducts[idx] = { ...updatedProducts[idx], [key]: value };
    setEditOrder({ ...editOrder, products: updatedProducts });
  };

  const saveEditProduct = (idx) => {
    setEditingProductIdx(null);
  };

  const removeProduct = (idx) => {
    const updatedProducts = [...editOrder.products];
    updatedProducts.splice(idx, 1);
    setEditOrder({ ...editOrder, products: updatedProducts });
  };

  const handleAddProductChange = (key, value) =>
    setNewProduct({ ...newProduct, [key]: value });

  const addNewProduct = () => {
    if (!newProduct.productName || !newProduct.productImageUrl) return;
    setEditOrder({
      ...editOrder,
      products: [...editOrder.products, newProduct],
    });
    setNewProduct({
      productName: "",
      productQty: 1,
      productPrice: "",
      productImageUrl: "",
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
          Back to Search
        </Button>
        <Typography variant="h4" mt={2} mb={2}>
          Order Details
        </Typography>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {order && editOrder && (
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="subtitle1">
              <b>Order Number:</b> {order.orderNumber}
            </Typography>
            {Object.keys(FIELD_LABELS).map((field) => (
              <Box key={field} display="flex" alignItems="center" mb={1}>
                <Typography sx={{ minWidth: 160 }}>
                  <b>{FIELD_LABELS[field]}:</b>
                </Typography>
                {editingFields[field] ? (
                  (field === "pickUpDate" || field === "dropOffDate") ? (
                    <>
                      <DateTimePicker
                        label={FIELD_LABELS[field]}
                        value={editOrder[field] ? new Date(editOrder[field]) : null}
                        onChange={(newValue) =>
                          handleFieldChange(
                            field,
                            newValue ? newValue.toISOString() : ""
                          )
                        }
                        renderInput={(params) => (
                          <TextField {...params} size="small" sx={{ mr: 1, width: 240 }} />
                        )}
                      />
                      <IconButton onClick={saveOrder} disabled={saving} color="success"><SaveIcon /></IconButton>
                      <IconButton onClick={() => cancelEditField(field)} color="error"><CancelIcon /></IconButton>
                    </>
                  ) : field === "deliveryRequired" ? (
                    <>
                      <Select
                        value={editOrder[field] === true ? "true" : "false"}
                        onChange={e => handleFieldChange(field, e.target.value === "true")}
                        size="small"
                        sx={{ mr: 1, width: 120 }}
                      >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                      <IconButton onClick={saveOrder} disabled={saving} color="success"><SaveIcon /></IconButton>
                      <IconButton onClick={() => cancelEditField(field)} color="error"><CancelIcon /></IconButton>
                    </>
                  ) : field.toLowerCase().includes("date") ? (
                    <>
                      <TextField
                        type="date"
                        value={editOrder[field] ? editOrder[field].slice(0,10) : ""}
                        onChange={e => handleFieldChange(field, e.target.value)}
                        size="small"
                        sx={{ mr: 1, width: 140 }}
                      />
                      <IconButton onClick={saveOrder} disabled={saving} color="success"><SaveIcon /></IconButton>
                      <IconButton onClick={() => cancelEditField(field)} color="error"><CancelIcon /></IconButton>
                    </>
                  ) : (
                    <>
                      <TextField
                        value={editOrder[field] ?? ""}
                        onChange={e => handleFieldChange(field, e.target.value)}
                        size="small"
                        sx={{ mr: 1, width: 200 }}
                      />
                      <IconButton onClick={saveOrder} disabled={saving} color="success"><SaveIcon /></IconButton>
                      <IconButton onClick={() => cancelEditField(field)} color="error"><CancelIcon /></IconButton>
                    </>
                  )
                ) : (
                  <>
                    <Typography sx={{ mr: 1 }}>
                      {field === "deliveryRequired" ? (order[field] ? "Yes" : "No") 
                        : field === "pickUpDate" || field === "dropOffDate"
                        ? formatDate(order[field]) 
                        : field.toLowerCase().includes("date")
                        ? formatDate(order[field])
                        : order[field]}
                    </Typography>
                    <IconButton onClick={() => startEditField(field)} color="info" size="small"><EditIcon /></IconButton>
                  </>
                )}
              </Box>
            ))}
            <Typography variant="h6" mt={3}>
              Products Ordered
            </Typography>
            <Table size="small" sx={{ mt: 1, mb: 2 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell>Image</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {editOrder.products?.map((product, idx) =>
                  editingProductIdx === idx ? (
                    <TableRow key={idx}>
                      <TableCell>
                        <TextField
                          value={product.productImageUrl}
                          onChange={e => handleEditProductChange(idx, "productImageUrl", e.target.value)}
                          size="small"
                          placeholder="Image URL"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={product.productName}
                          onChange={e => handleEditProductChange(idx, "productName", e.target.value)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={product.productQty}
                          min={1}
                          onChange={e => handleEditProductChange(idx, "productQty", Number(e.target.value))}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={product.productPrice}
                          min={0}
                          onChange={e => handleEditProductChange(idx, "productPrice", Number(e.target.value))}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => saveEditProduct(idx)} color="success"><SaveIcon /></IconButton>
                        <IconButton onClick={cancelEditProduct} color="error"><CancelIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={idx}>
                      <TableCell>
                        {product.productImageUrl ? (
                          <Link href={product.productImageUrl} target="_blank" rel="noopener">
                            <Avatar
                              variant="square"
                              src={product.productImageUrl}
                              alt={product.productName}
                              sx={{ width: 48, height: 48 }}
                            />
                          </Link>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.productQty}</TableCell>
                      <TableCell>${product.productPrice ?? "—"}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => startEditProduct(idx)} color="info" size="small"><EditIcon /></IconButton>
                        <IconButton onClick={() => removeProduct(idx)} color="error" size="small"><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  )
                )}
                {/* Add new product row */}
                <TableRow>
                  <TableCell>
                    <TextField
                      size="small"
                      placeholder="Image URL"
                      value={newProduct.productImageUrl}
                      onChange={e => handleAddProductChange("productImageUrl", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      placeholder="Product Name"
                      value={newProduct.productName}
                      onChange={e => handleAddProductChange("productName", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      placeholder="Qty"
                      min={1}
                      value={newProduct.productQty}
                      onChange={e => handleAddProductChange("productQty", Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      placeholder="Price"
                      min={0}
                      value={newProduct.productPrice}
                      onChange={e => handleAddProductChange("productPrice", Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={addNewProduct} color="primary" size="small"><AddIcon /></IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={saveOrder}
              disabled={saving}
              startIcon={<SaveIcon />}
              sx={{ mt: 2 }}
            >
              {saving ? "Saving..." : "Save All Changes"}
            </Button>
          </Paper>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default OrderDetailPage;
