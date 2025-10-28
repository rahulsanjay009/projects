
const APIService = () => {
  const API_END_POINT = 'http://localhost:8000';
  // const API_END_POINT='https://backend.srikrishnapartyrentalsllc.com'
  const SECRET_API_KEY = import.meta.env.VITE_SECRET_API_KEY;
  const makeRequest = async (url, method, body = null, isFormData = false) => {
    const options = {
      method: method.toUpperCase(),
      headers: {
      'x-api-key': SECRET_API_KEY,
      },
    };

    if (body) {
      if (isFormData) {
        options.body = body; // FormData handles its own content-type
      } else {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
      }
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, error: error.message || error.error };
    }
  };

  // Product endpoints
  const fetchProducts = async () => makeRequest(`${API_END_POINT}/inventory/products`, 'GET');

  const saveProduct = async (productFormData) =>
    makeRequest(`${API_END_POINT}/inventory/create_product`, 'POST', productFormData, true);

  const editProduct = async (productFormData) =>
    makeRequest(`${API_END_POINT}/inventory/edit_product`, 'POST', productFormData, true);

  const deleteProduct = async (product_id) =>
    makeRequest(`${API_END_POINT}/inventory/delete_product`, 'POST', { product_id });

  // Category endpoints
  const saveCategory = async (category) =>
    makeRequest(`${API_END_POINT}/inventory/create_category`, 'POST', { category });

  const fetchCategories = async () =>
    makeRequest(`${API_END_POINT}/inventory/categories`, 'GET');

  // Order endpoints
  const saveOrder = async (order) =>
    makeRequest(`${API_END_POINT}/inventory/create_order`, 'POST', order);

  const fetchOrders = async (input) =>
    makeRequest(`${API_END_POINT}/inventory/orders?type=${input}`, 'GET');

  const fetchAvailability = async (from, to) =>
    makeRequest(`${API_END_POINT}/inventory/check_product_availability`, 'POST', { from, to });

  const saveOrderToDB = async (order) =>
    makeRequest(`${API_END_POINT}/inventory/update_order`, 'POST', order);

  const deleteOrder = async (order_id) =>
    makeRequest(`${API_END_POINT}/inventory/erase_order`, 'POST', { order_id });

  // Email + Return
  const sendConfirmation = async (email, order_id) =>
    makeRequest(`${API_END_POINT}/inventory/send_order_confirmation`, 'POST', { order_id, email });

  const confirmReturn = async (order_id) =>
    makeRequest(`${API_END_POINT}/inventory/confirm_order_return`, 'POST', { order_id });

  const fetchRecentEvents = async () => {
    const url = `${API_END_POINT}/inventory/recent_events`;
    return await makeRequest(url, 'GET');
  };
  
  const createRecentEvent = async (formData) => {
    const url = `${API_END_POINT}/inventory/create_recent_event`;
    return makeRequest(url,'POST',formData,true)
  };
  
  const updateRecentEvent = async (formData,id) => {
    const url = `${API_END_POINT}/inventory/update_recent_event`;
    return makeRequest(url,'POST',formData,true)
  };
  
  const deleteRecentEvent = async (id) => {
    const url = `${API_END_POINT}/inventory/delete_recent_event`;
    return await makeRequest(url, 'POST', { id });
  };
  
  const retrieveCategories = async () => {
    const url = `${API_END_POINT}/inventory/fetch_categories`;
    return await makeRequest(url, 'GET');
  }

  const deleteCategory = async (id) => {
    const url = `${API_END_POINT}/inventory/delete_category`;
    return await makeRequest(url, 'POST',{id});
  }

  const updateCategory = async (formData) => {
    const url = `${API_END_POINT}/inventory/update_category`;
    return await makeRequest(url, 'POST',formData,true);
  }

  const addCategory = async (formData) => {
    const url = `${API_END_POINT}/inventory/new_category`;
    return await makeRequest(url, 'POST',formData,true);
  }

  // const authorizeAdmin = async (token) => {
  //   const url = `${API_END_POINT}/inventory/authorize_admin`;
  //   if(token === "abc")
  //     return {success:true};
  //   // return await makeRequest(url, 'POST', { token });
  //   return {success:false};
  // }

  return {
    fetchProducts,
    saveProduct,
    saveCategory,
    fetchCategories,
    saveOrder,
    fetchOrders,
    fetchAvailability,
    saveOrderToDB,
    editProduct,
    deleteProduct,
    sendConfirmation,
    confirmReturn,
    deleteOrder,
    deleteRecentEvent,
    updateRecentEvent,
    createRecentEvent,
    fetchRecentEvents,
    retrieveCategories,
    deleteCategory,
    updateCategory,
    addCategory,
    // authorizeAdmin
  };
};

export default APIService;
