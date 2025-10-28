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
import { v4 as uuidv4 } from "uuid";
import { FaSms, FaWhatsapp } from "react-icons/fa";
import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { MdOutlineEmail } from "react-icons/md";

const CartPage = ({ cartItems }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [totalDeliveryCharge, setTotalDeliveryCharge] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalDeliveryTime, setTotalDeliveryTime] = useState("N/A");
  const [message, setMessage] = useState('');
  const [chargeDetails, setChargeDetails] = useState('');
  const [orderConfirmation,setOrderConfirmation]=useState(false);
  const [isEmailPrompt, setIsEmailPrompt] = useState(false);
  const [orderConfirmationMessage,setOrderConfirmationMessage]=useState('');
  const [form, setForm] = useState({
    name: "",
    phone: "",
    // email:"",
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
    deliveryTip: 0,
    additionalNotes:"" // Default to 15%
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
  const [orderNumber,setOrderNumber]=useState('');
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

  const generateOrderNumber = () => {
    // Create a 10-digit numeric ID from UUID
    const num = Math.abs(uuidv4().hashCode() % 10000);
    return num.toString().padStart(4, "0");
  };

  // Polyfill since JS doesn't have String.hashCode()
  String.prototype.hashCode = function () {
    let hash = 0;
    for (let i = 0; i < this.length; i++) {
      hash = (hash << 5) - hash + this.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  };
  // Validate form and submit order via WhatsApp
  useEffect(()=>{
    const hasEmptyRequiredField =
    form.name &&
    form.phone &&
    form.eventDate &&
    form.address &&
    form.dropoffDate &&
    form.pickupDate &&
    form.dropoffTime &&
    form.pickupTime;
    if(hasEmptyRequiredField && message!=="")
        setMessage('');
  },[form])
  const handleSubmit = async (sendVia) => {
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
          `${idx + 1}. *${item.name}* - ${item.quantity} pcs @ $${item.price} = $${(parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2)}\n${encodeURI(item.image_url.includes("?")
  ? `${item.image_url}&preview=false`
  : `${item.image_url}?preview=false`)}`
      )
      .join("\n\n");
    const generatedOrderNumber = generateOrderNumber();
    setOrderNumber(generatedOrderNumber);
    // Create WhatsApp message with tip information
    let whatsappMessage = "";
    let smsMessage = "";
    if(!isMobile){
      whatsappMessage = "Click on \"Continue to WhatsApp Web\" to submit the order details.\n\n";
    }
      smsMessage= `New Order Request\nOrder #: ${generatedOrderNumber}\n\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Event Date: ${form.eventDate ? form.eventDate.format("DD MMM YYYY") : "N/A"}\n` +
      `Delivery Required: ${form.deliveryRequired ? "Yes" : "No"}\n` +
      `Event Address: ${form.address}\n` +
      `${form.deliveryRequired ? 'Delivery on: ' : 'Pick up by Self: '} ${form.pickupDate ? form.pickupDate.format("YYYY-MM-DD") : "N/A"} ${form.pickupTime ? form.pickupTime.format("HH:mm") : "N/A"}\n` +
      `${form.deliveryRequired ? 'Pickup on: ' : 'Drop off by Self: '} ${form.dropoffDate ? form.dropoffDate.format("YYYY-MM-DD") : "N/A"} ${form.dropoffTime ? form.dropoffTime.format("HH:mm") : "N/A"}\n\n` +
      `*Products* (Total Items: ${cartItems?.length}):\n${productDetails}\n\n` +
      // `*PRICING BREAKDOWN*:\n` +
      // `Items Total: $${totalPrice.toFixed(2)}\n` +
      // `${form.deliveryRequired ? `Delivery Charge: $${totalDeliveryCharge.toFixed(2)}\n` : ''}` +
      // `${form.deliveryRequired && form.deliveryTip > 0 ? `Tip (${form.deliveryTip}%): $${calculateTipAmount().toFixed(2)} 💝\n` : ''}` +
      `Additional Notes: ${form.additionalNotes}\n\n`+
      `*GRAND TOTAL: $${calculateGrandTotal().toFixed(2)}*\n\n`;
      whatsappMessage+=smsMessage;
      const whatsappURL = `https://wa.me/16692688087?text=${encodeURIComponent(whatsappMessage)}`;
      const smsUrl = `sms:16692688087?body=${encodeURIComponent(smsMessage)}`;
    
      
    // APIService().sendOrderToSQS(data).then((res)=>{
      
    //   if(res?.success){
    //     console.log(res?.messageId);
    //     setOrderConfirmation(true);
    //     setOrderNumber(generatedOrderNumber);
    //   }
    // }).catch((err) => {
    //   console.log(err?.error);
    // })
    if(sendVia==="whatsapp"){
      if(!isMobile)
        window.open(whatsappURL, "_blank");
      else
        window.open(whatsappURL, "_self");
      setOrderConfirmationMessage("Make sure you have sent the order via WhatsApp/Text Message and received a confirmation from us.");
    }
    else if(isMobile && sendVia==="text"){
       window.open(smsUrl, "_self");
      setOrderConfirmationMessage("Make sure you have sent the order via WhatsApp/Text Message and received a confirmation from us.");
    }       
    else if(sendVia==="email"){
        setIsLoadingMessage(true);
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
          orderNumber: generatedOrderNumber,
          additionalNotes:form.additionalNotes,
          products: cartItems?.map(p => ({
            productName: p.name,
            productQty: p.quantity.toString(),
            imageUrl: p.image_url,
            productPrice: p.price.toString()
          })),
          totalPrice: totalPrice.toFixed(2).toString(),
          totalItems: cartItems?.length.toString(),
      }
      APIService().sendOrderToSQS(data).then((res)=>{
        if(res?.success){
          // console.log(res?.messageId);
          setOrderConfirmationMessage("Check the order submission email in your inbox/Spam. We'll reach out to you shortly to confirm the order and payment details. For quick response, contact us directly on +1 (669) 268 8087 with your order details.");
          setIsLoadingMessage(false);
        }   
      }).catch((err) => {
        console.log(err?.error);
        setOrderConfirmationMessage("Something went wrong while sending the order email. Please try again or contact us directly on +1 (669) 268 8087.");
      }); 
    }
    setIsEmailPrompt(false);
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
                <span>Grand Total:</span>
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
                Place Order
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
          <DialogTitle>
            <Typography variant="h6">
              Enter Your Information
            </Typography>
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
          </DialogTitle>
          
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
              label="Full Name"
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
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, ""); // remove all non-digits
                if (value.length > 10) value = value.slice(0, 10); // max 10 digits

                // Format as xxx-xxx-xxxx
                if (value.length > 6) {
                  value = `${value.slice(0,3)}-${value.slice(3,6)}-${value.slice(6,10)}`;
                } else if (value.length > 3) {
                  value = `${value.slice(0,3)}-${value.slice(3)}`;
                }

                handleChange({ target: { name: "phone", value } });
              }}
              inputProps={{ inputMode: "numeric" }}
              required
              sx={{ gridColumn: { xs: "1", md: "2" }, mt: 1 }}
            />
           
{/* Delivery Address */}
            <TextField
              label="Event Venue Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              multiline
              rows={1}
              disabled={loader}
              sx={{ gridColumn: "1 / -1" }}
              placeholder="Enter your full event address"
            />
            

            {/* Event Date */}
            <DatePicker
              label="Event Date"
              value={form.eventDate}
              onChange={(value) => handleDateTimeChange("eventDate", value)}
              disabled={loader}
              sx={{ gridColumn: { xs: "1", md: "1" } }}
              slotProps={{
                textField: {
                  required: true
                }
              }}
            />

            {/* Delivery Required Checkbox */}
            <FormControl sx={{ gridColumn: { xs: "1", md: "2" } }}>
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
              label={form.deliveryRequired ? "Pickup from Venue Date" : "Drop Off Date"}
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
              label={form.deliveryRequired ? "Pickup from Venue Time" : "Drop Off Time"}
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

            

            <TextField
              label="Additional Notes"
              name="additionalNotes"
              value={form.additionalNotes}
              onChange={handleChange}
              multiline
              rows={1}
              disabled={loader}
              sx={{ gridColumn: "1 / -1" }}
              placeholder="Enter additional notes to the business"
            />

            
            <Box sx={{ gridColumn: "1 / -1" }} > 
              <Paper variant="outlined" sx={{ p: 2, fontSize: '0.75rem', lineHeight: 1.4 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  ⚠️ Terms & Conditions
                </Typography>
                <Typography variant="body2" gutterBottom>
                  • Your order will be confirmed only after advance payment is made.
                </Typography>
                <Typography variant="body2" gutterBottom>
                  • Rental prices apply for a 24-hour period.
                </Typography>
                <Typography variant="body2" gutterBottom>
                  • All orders are final — no cancellations, refunds, or exchanges will be accepted.
                </Typography>
                <Typography variant="body2" gutterBottom>
                  • Items must be returned in the same condition as received.
                </Typography>
                <Typography variant="body2" gutterBottom>
                  • You are responsible for any damages or liabilities during the rental period.
                </Typography>
                <Typography variant="body2" gutterBottom>
                  • Delivery charges are extra, based on distance and number of items.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                  By proceeding, you acknowledge that you have read and agree to these terms.
                </Typography>
              </Paper>
            </Box>
            <Stack
              direction={{ xs: "column", sm: "row" }} // vertical on mobile, horizontal on tablet+
              spacing={2}
              width="100%"
              alignItems="center"
              sx={{justifyContent: "center", display: 'flex', gridColumn: "1 / -1"}}
            >
              
              <Button
                onClick={() => handleSubmit("whatsapp")}
                variant="contained"
                color="success"
                disabled={loader}
                fullWidth
              >
                {loader ? <CircularProgress color="inherit" size={14} sx={{ mr: 1 }} /> : <>Place Order via WhatsApp <FaWhatsapp size={28} style={{marginLeft:'5px', alignSelf:'center'}}/></>}              
              </Button>
              {isMobile && <Button
                onClick={() => handleSubmit("text")}
                variant="contained"
                color="info"
                disabled={loader}
                fullWidth
              >
                {loader ? <CircularProgress color="inherit" size={14} sx={{ mr: 1 }} /> : <>Place Order via Text SMS <FaSms size={28} style={{marginLeft:'5px', alignSelf:'center'}}/></>}
              </Button>}
              <Button
                onClick={() => setIsEmailPrompt(true)}
                variant="contained"
                color=""
                disabled={loader}
                fullWidth
                sx={{
                  background: "#786c3fff",
                  color: "#fff",
                }}
              >
                {loader ? <CircularProgress color="inherit" size={14} sx={{ mr: 1 }} /> : <>Place Order via Email <MdOutlineEmail size={28} style={{marginLeft:'5px', alignSelf:'center'}}/></>}
              </Button>
              <Button variant="outlined" color='error' onClick={() => setDialogOpen(false)} disabled={loader}>
                Close
              </Button>
            </Stack>
          </DialogContent>
            
          
            
         
        </Dialog>

        {/* Order Confirmation Dialog */}
        <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
          <DialogTitle>{`🎉 Your order #${orderNumber} has been submitted successfully!`} </DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              {isLoadingMessage? <CircularProgress/>: orderConfirmationMessage}
            </Typography>
            <Typography variant="body2" color="warning.main" textAlign="right" mt={2}>
              Click <i>CLEAR CART</i> to clear all items from your cart. 
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {setConfirmationOpen(false); setMessage(''); }}>
              Close
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
        <Dialog open = {isEmailPrompt} onClose={() => setIsEmailPrompt(false)}>
          <DialogTitle variant="body1">Please enter your email to send us the order</DialogTitle>
          <DialogContent> 
            <TextField
              disabled={loader}
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mt:1 }}
            />
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" color="error" onClick={() => setIsEmailPrompt(false)}>
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  handleSubmit("email");
                }}
              >
                Send
              </Button>
            </DialogActions>
        </Dialog> 
      </Box>
    </LocalizationProvider>
  );
};

export default CartPage;