import { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddRemoveProduct from "../ProductCatalog/AddRemoveProduct";
import { useDispatch } from "react-redux";
import { clearProducts } from "../../Redux/Reducers/CartReducer";
import dayjs from "dayjs";
import APIService from "../../services/APIService";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";

const CartPage = ({ cartItems }) => {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [totalDeliveryCharge, setTotalDeliveryCharge] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalDeliveryTime, setTotalDeliveryTime] = useState("N/A");
  const [message, setMessage] = useState('');
  const [chargeDetails, setChargeDetails] = useState('');
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email:"",
    eventDate: null,
    address: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    deliveryRequired: false,
    pickupDate: null,
    pickupTime: null,
    dropoffDate: null,
    dropoffTime: null,
    deliveryTip: 15, // Default to 15%
  });

  // Calculate total price from cart items
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price || 0) * item.quantity,
    0
  );

  // Calculate tip amount
  const calculateTipAmount = () => {
    if (!form.deliveryTip || !form.deliveryRequired) return 0;
    const estimatedTotal = totalPrice + totalDeliveryCharge;
    return (estimatedTotal * (form.deliveryTip / 100));
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    return totalPrice + totalDeliveryCharge + calculateTipAmount();
  };

  // Handle address field changes and auto-build full address
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((frm) => {
      const updatedForm = {
        ...frm,
        [name]: value,
      };

      return {
        ...updatedForm,
        address: `${updatedForm.streetAddress}, ${updatedForm.city}, ${updatedForm.state}, ${updatedForm.zipCode}`,
      };
    });
  };

  // Calculate distance between two addresses using Geoapify API
  const calculateDistance = async (origin, destination) => {
    const apiKey_geocode = process.env.REACT_APP_GEOAPIFY_API_KEY_GEOCODE;
    const apiKey_routing = process.env.REACT_APP_GEOAPIFY_API_KEY_ROUTING;
    
    setLoader(true);
    
    // Helper function to get coordinates from address
    const getCoordinates = async (address) => {
      const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey_geocode}`;
      const response = await fetch(geoUrl);
      const data = await response.json();
      if (data.features && data.features[0] && data.features[0].geometry) {
        return `${data.features[0].geometry.coordinates[1]},${data.features[0].geometry.coordinates[0]}`;
      }
      throw new Error("Unable to geocode address");
    };

    try {
      const originCoords = await getCoordinates(origin);
      const destCoords = await getCoordinates(destination);
      const url = `https://api.geoapify.com/v1/routing?waypoints=${originCoords}|${destCoords}&mode=drive&apiKey=${apiKey_routing}`;
      const response = await fetch(url, { method: 'GET' });
      const data = await response.json();
      
      if (
        data.features &&
        data.features[0] &&
        data.features[0].properties &&
        data.features[0].properties.distance
      ) {
        const distanceInMeters = data.features[0].properties.distance;
        const distanceInMiles = (distanceInMeters / 1609.34).toFixed(2);
        const time = data.features[0].properties.time
          ? `${Math.round(data.features[0].properties.time / 60)} mins`
          : "N/A";
        
        setLoader(false);
        setTotalDistance(parseFloat(distanceInMiles));
        setTotalDeliveryTime(time);
        return { distance: parseFloat(distanceInMiles), time };
      } else {
        setLoader(false);
        setChargeDetails("Unable to calculate distance. Please try again.");
        return { distance: 0, time: "N/A" };
      }
    } catch (error) {
      setLoader(false);
      setChargeDetails("Error calculating distance: " + error.message);
      return { distance: 0, time: "N/A" };
    }
  };

  // Calculate delivery charges based on distance and cart items
  const calculateDeliveryCharge = async (distanceInMiles, time) => {
    let details = ``;
    let fuelCharge = 0;
    let handlingCharge = 0;
    let laborCharge = 0;

    // Fuel charge: assume $5/gallon, 20 miles/gallon
    const fuelRate = 5;
    const milesPerGallon = 20;
    if (distanceInMiles > 0) {
      const gallonsNeeded = distanceInMiles / milesPerGallon;
      fuelCharge = gallonsNeeded * fuelRate;
      details += `Fuel charge: $${fuelCharge.toFixed(2)} (for ~${distanceInMiles} miles)\n`;
    }

    // Check for heavy items that require additional handling
    const heavyCategories = ["chairs", "seating", "tables", "tents", "canopies", "canopy"];
    const hasHeavy = cartItems.some(
      (item) =>
        item?.categories &&
        item.categories.some((category) =>
          heavyCategories.some((cat) =>
            category?.name?.toLowerCase().includes(cat)
          )
        )
    );
    if (hasHeavy) {
      handlingCharge = 20;
      details += `Handling charge: $${handlingCharge} (for heavy/lifting items)\n`;
    }

    // Labor charge: $15/hour, round up to nearest hour
    if (time && time.split(' ')[0] !== "N/A") {
      const minutes = time.split(' ')[0] === "N/A" ? 0 : parseInt(time.split(" ")[0]);
      const hours = Math.ceil(minutes / 60);
      laborCharge = hours * 15;
      details += `Labor charge: $${laborCharge} (${hours} hour${hours > 1 ? "s" : ""})\n`;
    }

    const total = fuelCharge + handlingCharge + laborCharge;
    details += `Total delivery charge: $${total.toFixed(2)}`;

    setChargeDetails(details);
    setTotalDeliveryCharge(parseFloat(total.toFixed(2)));
    return parseFloat(total.toFixed(2));
  };

  // Handle regular form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle date and time field changes
  const handleDateTimeChange = (name, value) => {
    if (name === "eventDate") {
      // Auto-set pickup and dropoff times when event date is selected
      const eventDateObj = dayjs(value);
      setForm((prev) => ({
        ...prev,
        eventDate: eventDateObj,
        pickupDate: eventDateObj.subtract(1, "day"),
        pickupTime: dayjs().hour(18).minute(0),
        dropoffDate: eventDateObj,
        dropoffTime: dayjs().hour(18).minute(0),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Calculate delivery charges for a given address
  const calculateTotalDelivery = async (address) => {
    if (!address || address.trim() === "") {
      setMessage("Please enter a valid address to calculate delivery.");
      return;
    }

    const { distance, time } = await calculateDistance(
      "2619 Cordelian Ln, Tracy, CA",
      address
    );
    calculateDeliveryCharge(distance, time);
  };

  // Validate form and submit order via WhatsApp
  const handleSubmit = async () => {
    // Validate required fields
    if (!form.name || !form.phone || !form.eventDate || !form.address || 
        !form.dropoffDate || !form.pickupDate || !form.dropoffTime || !form.pickupTime) {
      setMessage("Please fill required fields: Name, Phone, Event Date, Pickup, Dropoff, Address.");
      return;
    }

    // Format product details for WhatsApp message
    const productDetails = cartItems
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.name}* - ${item.quantity} pcs @ $${item.price} = $${(parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2)}\n${encodeURI(item.image_url)}`
      )
      .join("\n\n");

    // Create WhatsApp message with tip information
    const whatsappMessage =
      `New Order\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Event Date: ${form.eventDate ? form.eventDate.format("DD MMM YYYY") : "N/A"}\n` +
      `Delivery Required: ${form.deliveryRequired ? "Yes" : "No"}\n` +
      `Delivery Address: ${form.address}\n` +
      `${form.deliveryRequired ? 'Delivery on: ' : 'Pick up by Self: '} ${form.pickupDate ? form.pickupDate.format("YYYY-MM-DD") : "N/A"} ${form.pickupTime ? form.pickupTime.format("HH:mm") : "N/A"}\n` +
      `${form.deliveryRequired ? 'Pickup on: ' : 'Drop off by Self: '} ${form.dropoffDate ? form.dropoffDate.format("YYYY-MM-DD") : "N/A"} ${form.dropoffTime ? form.dropoffTime.format("HH:mm") : "N/A"}\n` +
      `*Products*:\n${productDetails}\n\n` +
      `*PRICING BREAKDOWN*:\n` +
      `Items Total: $${totalPrice.toFixed(2)}\n` +
      `${form.deliveryRequired ? `Delivery Charge: $${totalDeliveryCharge.toFixed(2)}\n` : ''}` +
      `${form.deliveryRequired && form.deliveryTip > 0 ? `Tip (${form.deliveryTip}%): $${calculateTipAmount().toFixed(2)} 💝\n` : ''}` +
      `*GRAND TOTAL: $${calculateGrandTotal().toFixed(2)}*\n\n`;

    // const whatsappURL = `https://wa.me/16692688087?text=${encodeURIComponent(whatsappMessage)}`;
      const data = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        eventDate: form.eventDate?.format("YYYY-MM-DD"),
        eventTime: form.eventTime?.format("HH:mm"),
        pickupDate: form.pickupDate?.format("YYYY-MM-DD"),
        pickupTime: form.pickupTime?.format("HH:mm"),
        dropoffDate: form.dropoffDate?.format("YYYY-MM-DD"),
        dropoffTime: form.dropoffTime?.format("HH:mm"),
        deliveryRequired: form.deliveryRequired,
        products: cartItems?.map(p => ({
          productName: p.name,
          productQty: p.quantity.toString(),
          imageUrl: p.image_url,
          productPrice: p.price.toString()
        }))
      }
    APIService().sendOrderToSQS(data).then((res)=>{
      
      if(res?.success){
        console.log(res?.messageId);
      }
    }).catch((err) => {
      console.log(err?.error);
    })
    // window.open(whatsappURL, "_blank");
    setDialogOpen(false);
    setConfirmationOpen(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Cart Items Section */}
          <Grid item xs={12} md={8}>
            {cartItems.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Your cart is empty
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Add some items to get started!
                </Typography>
              </Paper>
            ) : (
              cartItems.map((item) => (
                <Card key={item.id} sx={{ display: "flex", mb: 2, p: 2 }}>
                  <CardMedia
                    component="img"
                    image={item.image_url}
                    alt={item.name}
                    sx={{ width: 140, height: 140, objectFit: "cover", mr: 3 }}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Typography mt={1} fontWeight="bold" fontStyle="italic" fontSize="small">
                      ${item.price === 0 ? 'N/A' : item.price} × {item.quantity}
                    </Typography>
                    <Typography mt={1} fontWeight="bold" fontSize="small">
                      ${item.price === 0 ? 'N/A' : (parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2)}
                    </Typography>
                    <Box mt={1}>
                      <AddRemoveProduct productId={item.id} />
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Grid>

          {/* Cart Summary Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6">Cart Summary</Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box display="flex" justifyContent="space-between" my={1}>
                <span>Total Items:</span>
                <b>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</b>
              </Box>
              
              <Box display="flex" justifyContent="space-between" my={1}>
                <span>Items Total:</span>
                <b>${totalPrice.toFixed(2)}</b>
              </Box>

              {form.deliveryRequired && totalDeliveryCharge > 0 && (
                <Box display="flex" justifyContent="space-between" my={1}>
                  <span>Delivery Charge:</span>
                  <b>${totalDeliveryCharge.toFixed(2)}</b>
                </Box>
              )}

              {form.deliveryRequired && form.deliveryTip > 0 && (
                <Box display="flex" justifyContent="space-between" my={1}>
                  <span>Tip ({form.deliveryTip}%):</span>
                  <b>${calculateTipAmount().toFixed(2)}</b>
                </Box>
              )}

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between" my={1} sx={{ fontSize: '1.1em' }}>
                <span><strong>Grand Total:</strong></span>
                <b>${calculateGrandTotal().toFixed(2)}</b>
              </Box>
              
              <Box textAlign="right" fontSize={12} color="text.secondary" mt={2}>
                The price shown is an estimate and may vary based on final order details and delivery requirements.
              </Box>

              {/* Delivery Charge Details */}
              {chargeDetails !== "" && (
                <Box mt={2} p={2} bgcolor="#f0f0f0" borderRadius={2}>
                  <Typography variant="body2" fontWeight="bold">
                    Estimated Delivery Charges Breakdown:
                  </Typography>
                  <Typography variant="body2" fontStyle="italic" color="text.secondary">
                    {`To: ${form.address || "N/A"}`}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {chargeDetails.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </Typography>
                </Box>
              )}

              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => setDialogOpen(true)}
                disabled={cartItems.length === 0}
              >
                Submit Order via WhatsApp
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Order Form Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)} 
          sx={{ zIndex: 1}}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Enter Your Information</DialogTitle>
          <DialogContent
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mt: 2
            }}
          >
            {/* Basic Information */}
            <TextField
              disabled={loader}
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              sx={{ gridColumn: { xs: "1", md: "1" }, mt:1 }}
            />
            
            <TextField
              disabled={loader}
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              sx={{ gridColumn: { xs: "1", md: "2" }, mt:1 }}
            />

            <TextField
              disabled={loader}
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              sx={{ gridColumn: { xs: "1", md: "1" } }}
            />

            {/* Event Date */}
            <DatePicker
              label="Event Date"
              value={form.eventDate}
              onChange={(value) => handleDateTimeChange("eventDate", value)}
              disabled={loader}
              sx={{ gridColumn: { xs: "1", md: "2" } }}
              slotProps={{
                textField: {
                  required: true
                }
              }}
            />

            {/* Delivery Required Checkbox */}
            <FormControl sx={{ gridColumn: { xs: "1", md: "1" } }}>
              <FormLabel>Delivery Required?</FormLabel>
              <RadioGroup
                row
                name="deliveryRequired"
                value={form.deliveryRequired ? "yes" : "no"}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "deliveryRequired",
                      value: e.target.value === "yes",
                    },
                  })
                }
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            {/* Pickup/Delivery Date and Time */}
            <DatePicker
              label={form.deliveryRequired ? "Delivery Date" : "Pick Up Date"}
              value={form.pickupDate}
              onChange={(value) => handleDateTimeChange("pickupDate", value)}
              disabled={loader}
              sx={{ gridColumn: { xs: "1", md: "1" } }}
              slotProps={{
                textField: {
                  required: true
                }
              }}
            />

            <TimePicker
              label={form.deliveryRequired ? "Delivery Time" : "Pick Up Time"}
              value={form.pickupTime}
              onChange={(value) => handleDateTimeChange("pickupTime", value)}
              disabled={loader}
              sx={{ gridColumn: { xs: "1", md: "2" } }}
              slotProps={{
                textField: {
                  required: true
                }
              }}
            />

            {/* Return/Dropoff Date and Time */}
            <DatePicker
              label={form.deliveryRequired ? "Pickup from Home Date" : "Drop Off Date"}
              value={form.dropoffDate}
              onChange={(value) => handleDateTimeChange("dropoffDate", value)}
              disabled={loader}
              sx={{ gridColumn: { xs: "1", md: "1" } }}
              slotProps={{
                textField: {
                  required: true
                }
              }}
            />

            <TimePicker
              label={form.deliveryRequired ? "Pickup from Home Time" : "Drop Off Time"}
              value={form.dropoffTime}
              onChange={(value) => handleDateTimeChange("dropoffTime", value)}
              disabled={loader}
              sx={{ gridColumn: { xs: "1", md: "2" } }}
              slotProps={{
                textField: {
                  required: true
                }
              }}
            />

            {/* Delivery Address */}
            <TextField
              label="Delivery Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              multiline
              rows={3}
              disabled={loader}
              sx={{ gridColumn: "1 / -1" }}
              placeholder="Enter your full delivery address"
            />

            {/* Enhanced Delivery Tip Section */}
            {form.deliveryRequired && (
              <Box 
                sx={{ 
                  gridColumn: "1 / -1",
                  p: 3,
                  bgcolor: "success.50",
                  border: "1px solid",
                  borderColor: "success.200",
                  borderRadius: 2,
                  mt: 2,
                  background: "linear-gradient(135deg, rgba(46, 125, 50, 0.05) 0%, rgba(102, 187, 106, 0.05) 100%)"
                }}
              >
                {/* Header with icon and title */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="success.dark" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ fontSize: '1.2em' }}>💰</span>
                    Delivery Tip (Optional)
                  </Typography>
                </Box>
                
                {/* Description */}
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Show appreciation for our delivery service. Your tip helps support our drivers and ensures excellent service!
                </Typography>
                
                {/* Main tip input and display */}
                <Grid container spacing={3} alignItems="stretch">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      disabled={loader}
                      label="Tip Percentage"
                      name="deliveryTip"
                      type="number"
                      value={form.deliveryTip || ''}
                      onChange={handleChange}
                      fullWidth
                      inputProps={{ min: 0, max: 50, step: 1 }}
                      InputProps={{
                        endAdornment: (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">%</Typography>
                          </Box>
                        )
                      }}
                      placeholder="15"
                      helperText="Suggested: 15-20% for excellent service"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'success.main',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 2.5, 
                        bgcolor: "background.paper",
                        textAlign: "center",
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: '1px solid',
                        borderColor: 'success.200',
                        transition: 'all 0.2s',
                        '&:hover': {
                          elevation: 4,
                          borderColor: 'success.main'
                        }
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        💡 Tip Amount
                      </Typography>
                      <Typography variant="h5" color="success.main" fontWeight="bold" sx={{ mb: 0.5 }}>
                        ${calculateTipAmount().toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Based on order total + delivery
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                
                {/* Quick tip selection buttons */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ⚡ Quick select:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {[10, 15, 20, 25].map((percentage) => (
                      <Button
                        key={percentage}
                        size="small"
                        variant={form.deliveryTip === percentage ? "contained" : "outlined"}
                        color="success"
                        onClick={() => setForm(prev => ({ ...prev, deliveryTip: percentage }))}
                        sx={{ 
                          minWidth: 'auto', 
                          px: 2,
                          fontWeight: form.deliveryTip === percentage ? 'bold' : 'normal',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: 2
                          }
                        }}
                      >
                        {percentage}%
                      </Button>
                    ))}
                    <Button
                      size="small"
                      variant={form.deliveryTip === 0 ? "contained" : "outlined"}
                      color="inherit"
                      onClick={() => setForm(prev => ({ ...prev, deliveryTip: 0 }))}
                      sx={{ 
                        minWidth: 'auto', 
                        px: 2,
                        fontWeight: form.deliveryTip === 0 ? 'bold' : 'normal',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: 1
                        }
                      }}
                    >
                      No Tip
                    </Button>
                  </Box>
                </Box>

                {/* Tip breakdown if tip is selected */}
                {form.deliveryTip > 0 && (
                  <Box 
                    sx={{ 
                      mt: 2, 
                      p: 2, 
                      bgcolor: 'rgba(46, 125, 50, 0.08)', 
                      borderRadius: 1,
                      border: '1px dashed',
                      borderColor: 'success.300'
                    }}
                  >
                    <Typography variant="caption" color="success.dark" display="block" gutterBottom>
                      <strong>💝 Thank you for your generosity!</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" fontSize='small'>
                        Order Total: ${totalPrice.toFixed(2)} + Delivery: ${totalDeliveryCharge.toFixed(2)} = ${(totalPrice + totalDeliveryCharge).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5}}>
                      <Typography variant="body2" color="success.dark" fontSize='small'>
                        {form.deliveryTip}% tip on ${(totalPrice + totalDeliveryCharge).toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="success.main" fontWeight="bold" fontSize='small'>
                        ${calculateTipAmount().toFixed(2)}
                      </Typography>
                    </Box>                    
                  </Box>
                )}
                <Box sx={{ display: 'flex', p: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="success.dark" >
                    Net Total including Tip:
                  </Typography>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    ${(calculateTipAmount() + totalPrice).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Error Message Display */}
            {message && (
              <Box 
                sx={{ 
                  gridColumn: "1 / -1", 
                  p: 2, 
                  bgcolor: "error.light", 
                  color: "error.contrastText", 
                  borderRadius: 1 
                }}
              >
                <Typography variant="body2">{message}</Typography>
              </Box>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} disabled={loader}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="success"
              disabled={loader}
            >
              {loader && <CircularProgress color="inherit" size={14} sx={{ mr: 1 }} />}
              Send via WhatsApp
            </Button>
          </DialogActions>
        </Dialog>

        {/* Order Confirmation Dialog */}
        <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
          <DialogTitle>Order Submitted Successfully</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              Your order has been submitted via WhatsApp. We will contact you shortly 
              for order confirmation and to finalize the details.
            </Typography>
            <Typography variant="body2" color="warning.main" textAlign="right" mt={2}>
              Clicking OK will clear your cart
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmationOpen(false)}>
              Keep Cart
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                dispatch(clearProducts());
                setConfirmationOpen(false);
                setMessage('');
              }}
            >
              Clear Cart
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default CartPage;