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
import AddRemoveProduct from "../ProductCatalog/AddRemoveProduct";
import { useDispatch } from "react-redux";
import { clearProducts } from "../../Redux/Reducers/CartReducer";
import dayjs from "dayjs";

const CartPage = ({ cartItems }) => {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [totalDeliveryCharge, setTotalDeliveryCharge] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalDeliveryTime, setTotalDeliveryTime] = useState("N/A");
  const [message,setMessage] = useState('')
  const [form, setForm] = useState({
  name: "",
  phone: "",
  eventDate: "",
  address: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
  deliveryRequired: false,
  pickupDate: "",
  pickupTime: "",
  dropoffDate: "",
  dropoffTime: "",
});



  const totalPrice = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price || 0) * item.quantity,
    0
  );

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

  
  
  const calculateDistance = async (origin, destination) => {
    console.log("Calculating distance from:", origin, "to:", destination);
    // Mocked response, replace this with actual API logic (like Google Maps API)
    const apiKey_geocode = process.env.REACT_APP_GEOAPIFY_API_KEY_GEOCODE
    const apiKey_routing = process.env.REACT_APP_GEOAPIFY_API_KEY_ROUTING
    // console.log("API Key:", apiKey);
    // Helper function to get coordinates from address
    setLoader(true)
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
      const response = await fetch(url,{method:'GET'});
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
          ? `${Math.round(data.features[0].properties.time / 35)} mins`
          : "N/A";
        setLoader(false)
        setTotalDistance(parseFloat(distanceInMiles));
        setTotalDeliveryTime(time);
        return { distance: parseFloat(distanceInMiles), time };
      } else {
        setLoader(false)
        setChargeDetails("Unable to calculate distance. Please try again.");
        return { distance: 0, time: "N/A" };
      }
    } catch (error) {
      setLoader(false)
      setChargeDetails("Error calculating distance: " + error.message);
      return { distance: 0, time: "N/A" };
    }
  };

  const calculateDeliveryCharge = async (distanceInMiles,time) => {
    console.log("Calculating delivery charge for distance:", distanceInMiles, "miles and time:", time);
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

   // Normalize categories for substring matching
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
    if (time && time.split()[0] !== "N/A") {
      const minutes = time.split()[0] === "N/A" ? 0 : parseInt(time.split(" ")[0]);
      const hours = Math.ceil(minutes / 60);
      laborCharge = hours * 15;
      details += `Labor charge: $${laborCharge} (${hours} hour${hours > 1 ? "s" : ""})\n`;
    }

    const total = fuelCharge + handlingCharge + laborCharge;
    details += `Total delivery charge: $${total.toFixed(2)}`;

    setChargeDetails(details);
    setTotalDeliveryCharge(parseFloat(total.toFixed(2)));
    return parseFloat(total.toFixed(2))
  };

  // 2. Update handleChange to handle eventDate logic
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  if (name === "eventDate") {
    // Set pickup to previous day 6pm, dropoff to event day 6pm
    const eventDateObj = dayjs(value);
    setForm((prev) => ({
      ...prev,
      eventDate: value,
      pickupDate: eventDateObj.subtract(1, "day").format("YYYY-MM-DD"),
      pickupTime: "18:00",
      dropoffDate: value,
      dropoffTime: "18:00",
    }));
  } else {
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }
};

  const calculateTotalDelivery = async (address) => {
    if (!address || address.trim() === "") {
      setMessage("Please enter a valid address to calculate delivery.");
      return;
    }
    
    const {distance,time} = await calculateDistance(
      "2619 Cordelian Ln, Tracy, CA",
      address
    );
    calculateDeliveryCharge(distance,time);
    
    setDeliveryDialogOpen(false);
  };
  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.eventDate || !form.address || !form.dropoffDate || !form.pickupDate || !form.dropoffTime || !form.pickupTime) {
      setMessage("Please fill required fields: Name, Phone, Event Date, Pickup, Dropoff, Address.");
      return;
    }

    // let distance = 0, time = "N/A", deliveryCharge = totalDeliveryCharge;
    // if (totalDeliveryCharge === 0 || `${form.streetAddress}, ${form.city}, ${form.state}, ${form.zipCode}` !== form.address) {      
    //   const result = await calculateDistance(
    //   "2619 Cordelian Ln, Tracy, CA",
    //   form.address
    //   );
    //   distance = result.distance;
    //   time = result.time;
    //   deliveryCharge = await calculateDeliveryCharge(distance, time);
    // } else {
    //   deliveryCharge = totalDeliveryCharge;
    //   distance = totalDistance;
    //   time = totalDeliveryTime;
    // }

    const productDetails = cartItems
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.name}* - ${item.quantity} pcs @ $${item.price}\n${encodeURI(
            item.image_url
          )}`
      )
      .join("\n\n");

    const message =
      `New Order\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Event Date: ${dayjs(form.eventDate).format("DD MMM YYYY")}\n` +
      `Delivery Required: ${form.deliveryRequired ? "Yes" : "No"}\n` +
      `Delivery Address: ${form.address}\n` +
      `Pickup: ${form.pickupDate +" "+ form.pickupTime || "N/A"}\n` +
      `Dropoff: ${form.dropoffDate +" "+form.dropoffTime || "N/A"}\n` +
      // `Estimated Delivery Charge: $${deliveryCharge}\n\n` +
      `*Products*:\n${productDetails}\n\n` +
      `*Total Price*:${totalPrice}\n\n` 
      // `*Estimated Net Total:* $${(parseFloat(totalPrice) +parseFloat(deliveryCharge))?.toFixed(
      //   2
      // )}\n`;

    const whatsappURL = `https://wa.me/16692688087?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");
    setDialogOpen(false);
    setConfirmationOpen(true);
  };
  return (
    <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
          <Card key={item.id} sx={{ display: "flex", mb: 2, p: 2 }}>
            <CardMedia
              component="img"
              image={item.image_url}
              alt={item.name}
              sx={{ width: 140, height: 140, objectFit: "cover", mr: 3 }}
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="body2">{item.description}</Typography>
              <Typography mt={1} fontWeight="bold">
            ${item.price == 0? 'N/A':item.price} × {item.quantity}
              </Typography>
              <Box mt={1}>
            <AddRemoveProduct productId={item.id} />
              </Box>
            </CardContent>
          </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6">Cart Summary</Typography>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between" my={1}>
            <span>Total Items:</span>
            <b>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</b>
          </Box>
          <Box display="flex" justifyContent="space-between" my={1}>
            <span>Total Price:</span>
            <b>${totalPrice.toFixed(2)}</b>
          </Box>
          <Box textAlign="right" fontSize={12} color="text.secondary">
            The price shown is an estimate, may vary based on final order details and delivery
          </Box>
          {/* {(chargeDetails !== "") && (
            <Box mt={2} p={2} bgcolor="#f0f0f0" borderRadius={2}> 
              <Typography variant="body2" fontWeight="bold">
                Estimated Delivery Charges Breakdown:
              </Typography>
              <Typography variant="body2" fontStyle={"italic"} color="text.secondary">
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
          )} */}
          {/* <Box display="flex" justifyContent="space-between" my={1}>
            <span>Estimated Net Total: </span>
            <b>${(parseFloat(totalDeliveryCharge) + parseFloat(totalPrice)).toFixed(2)}</b>
          </Box> */}
          {/* <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 3 }}
            onClick={() => setDeliveryDialogOpen(true)}
          >
            Delivery Estimate
          </Button> */}
          <Button
            variant="contained"
            color="success"
            
            fullWidth
            sx={{ mt: 3 }}
            onClick={() => {setDialogOpen(true); console.log(form)}}
          >
            Submit Order via WhatsApp
          </Button>
            </Paper>
          </Grid>
        </Grid>
        {/* Delivery Estimate Dialog */}
      
      {/* <Dialog
        open={deliveryDialogOpen}
        sx={{zIndex: 1}}
        onClose={() => setDeliveryDialogOpen(false)}
      >
        <DialogTitle>Delivery Estimate</DialogTitle>      
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
          <Snackbar
          open={message !== ""}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          message="Please enter a valid address to calculate delivery."
          autoHideDuration={3000}
          onClose={() => {setMessage('')}}
        />
          <Typography>
            To get a delivery estimate, please enter your delivery address in the order form.
          </Typography>
          <TextField
            label="Street Address"
            name="streetAddress"
            value={form.streetAddress}
            onChange={handleAddressChange}
            fullWidth
            required
            sx={{ mt: 1 }}
            disabled = {loader}
          />
          <TextField
            label='City'
            name="city"
            value={form.city}
            onChange={handleAddressChange}            
            fullWidth
            required
            sx={{ mt: 1 }}
            disabled = {loader}
          />
          <TextField
            label='State'
            name="state"
            value={form.state}
            onChange={handleAddressChange}
            fullWidth
            required
            sx={{ mt: 1 }}
            disabled = {loader}
            slotProps={{ inputProps: { maxLength: 2 } }}
            />
          <TextField
            label='Zip Code'
            name="zipCode"
            value={form.zipCode}
            onChange={handleAddressChange}
            fullWidth
            type='number'
            required
            sx={{ mt: 1 }} 
            disabled = {loader}
            />
        </DialogContent>
          
            
        <DialogActions>
          <Button color='error' onClick={() => setDeliveryDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained" 
            color="success"
            disabled={loader}
            sx={{fontSize: 14}}
            onClick={() => {
                setForm((prev) => ({
                  ...prev,
                  address: `${form.streetAddress}, ${form.city}, ${form.state}, ${form.zipCode}`,
                })
                )
                calculateTotalDelivery(`${form.streetAddress}, ${form.city}, ${form.state}, ${form.zipCode}`);
              }}>
                {loader && <CircularProgress color='success' size={14} sx={{mr:1}}/>}
                Calculate
              </Button>
              </DialogActions>
            </Dialog> */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} sx={{zIndex: 1, width:'100%'}}>
              <DialogTitle>Enter your information</DialogTitle>
              <DialogContent
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
                mt: 2,
                width: { xs: "100%", md: 600 }
              }}
              >
              <TextField disabled={loader} label="Name" name="name" value={form.name} onChange={handleChange} required sx={{ gridColumn: { xs: "1", md: "1" }, mt:1 }} />
              <TextField disabled={loader} label="Phone Number" name="phone" value={form.phone} onChange={handleChange} required sx={{ gridColumn: { xs: "1", md: "2" }, mt:1 }} />
              <TextField
                label="Event Date"
                type="date"
                name="eventDate"
                slotProps={{inputLabel:{shrink: true}}}
                value={form.eventDate}
                onChange={handleChange}
                required
                disabled={loader}
                sx={{ gridColumn: { xs: "1", md: "1" } }}
              />
              <TextField
                label="Pickup Date"
                type="date"
                name="pickupDate"
                slotProps={{inputLabel:{shrink: true}}}
                value={form.pickupDate}
                onChange={handleChange}
                required
                disabled={loader}
                sx={{ gridColumn: { xs: "1", md: "2" } }}
              />
              <TextField
                label="Pickup Time"
                type="time"
                name="pickupTime"
                slotProps={{inputLabel:{shrink: true}}}
                value={form.pickupTime}
                onChange={handleChange}
                required
                disabled={loader}
                sx={{ gridColumn: { xs: "1", md: "1" } }}
              />
              <TextField
                label="Dropoff Date"
                type="date"
                name="dropoffDate"
                slotProps={{inputLabel:{shrink: true}}}
                value={form.dropoffDate}
                onChange={handleChange}
                required
                disabled={loader}
                sx={{ gridColumn: { xs: "1", md: "2" } }}
              />
              <TextField
                label="Dropoff Time"
                type="time"
                name="dropoffTime"
                slotProps={{inputLabel:{shrink: true}}}
                value={form.dropoffTime}
                onChange={handleChange}
                required
                disabled={loader}
                sx={{ gridColumn: { xs: "1", md: "1" } }}
              />
              <FormControlLabel
                control={<Checkbox name="deliveryRequired" checked={form.deliveryRequired} onChange={handleChange} />}
                label="Delivery Required?"
                sx={{ gridColumn: { xs: "1", md: "2" }, alignItems: "center" }}
              />
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
              />
              </DialogContent>
              <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="success" disabled={loader}>
                {loader && <CircularProgress color='success' size={14} sx={{mr:1}}/>}  Send via WhatsApp
              </Button>
              </DialogActions>
            </Dialog>

            {/* Confirmation Dialog */}
      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
        <DialogTitle>Order Submitted</DialogTitle>
        <DialogContent>
          <Typography>
            Your order was submitted via WhatsApp. We will reach out to you
            shortly for order confirmation.
          </Typography>
          <Typography fontSize={10} textAlign={'right'} color="warning">
            clicking on OK will clear the cart
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              dispatch(clearProducts());
              setConfirmationOpen(false);
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CartPage;
