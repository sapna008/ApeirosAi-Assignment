import { database } from '../firebase/config';
import { ref, push, set, get } from 'firebase/database';

// Get all products from the Fake Store API
export const getProducts = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get a single product by ID
export const getProductById = async (id) => {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!response.ok) throw new Error('Product not found');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

// Save an order to Firebase
export const saveOrder = async (orderData) => {
  try {
    const ordersRef = ref(database, 'orders');
    const newOrderRef = push(ordersRef);
    await set(newOrderRef, orderData);
    return newOrderRef.key;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

// Get an order by ID
export const getOrderById = async (orderId) => {
  try {
    const orderRef = ref(database, `orders/${orderId}`);
    const snapshot = await get(orderRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Save customer data
export const saveCustomer = async (customerData) => {
  try {
    const customersRef = ref(database, 'customers');
    const newCustomerRef = push(customersRef);
    await set(newCustomerRef, customerData);
    return newCustomerRef.key;
  } catch (error) {
    console.error('Error saving customer:', error);
    throw error;
  }
};