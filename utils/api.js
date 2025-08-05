// utils/api.js
const BASE_URL = "http://192.168.242.34:5000"; // Use this IP for Android Emulator

export const fetchItems = async () => {
  const res = await fetch(`${BASE_URL}/api/items`);
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
};