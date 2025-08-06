import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = "http://192.168.242.34:5000";
// export const BASE_URL = "https://silent-auction-backend-0bdi.onrender.com";

export const fetchItems = async () => {
  const res = await fetch(`${BASE_URL}/api/items`);
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
};

export const fetchBidsForItem = async (itemId, token) => {
  const res = await fetch(`${BASE_URL}/api/bids/item/${itemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch bids');
  return data;
};

export const placeBidForItem = async (itemId, amount, token) => {
  const res = await fetch(`${BASE_URL}/api/bids`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      item_id: itemId,
      bid_amount: parseFloat(amount),
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to place bid');
  return data;
};

export const fetchMyBids = async () => {
  const token = await AsyncStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/bids/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch bids');
  return data;
};


export const fetchMyUploadedItems = async () => {
  const token = await AsyncStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/items/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch uploaded items");
  return data;
};

export const fetchNotifications = async () => {
  const token = await AsyncStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Failed to load notifications');
  return data;
};

export const fetchUserProfile = async () => {
  const token = await AsyncStorage.getItem("token");
  const user = JSON.parse(await AsyncStorage.getItem("user"));
  const userId = user._id || user.id;

  const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

  return {
    ...data,
    profile_image: data.profile_image ? `${BASE_URL}/${data.profile_image}?t=${Date.now()}` : null,
  };
};

export const updateProfileImage = async (userId, uri) => {
  const token = await AsyncStorage.getItem("token");
  const formData = new FormData();
  formData.append("profileImage", {
    uri,
    name: "profile.jpg",
    type: "image/jpeg",
  });

  const res = await fetch(`${BASE_URL}/api/users/${userId}/upload-profile-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to upload image");

  const imageUrl = `${BASE_URL}/${data.profile_image}?t=${Date.now()}`;

  // Update local cache
  const currentUser = JSON.parse(await AsyncStorage.getItem("user"));
  await AsyncStorage.setItem(
    "user",
    JSON.stringify({ ...currentUser, profile_image: data.profile_image })
  );

  return imageUrl;
};

export const updateUserProfile = async (userId, updates) => {
  const token = await AsyncStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update profile");

  return data;
};

export const getImageUrl = (path) => {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Otherwise, it's a local path - prepend BASE_URL and add cache buster
  return `${BASE_URL}/${path}`;
};