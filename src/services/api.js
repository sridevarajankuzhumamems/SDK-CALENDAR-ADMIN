const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/calendar';

export async function fetchMonth(year, month) {
  const res = await fetch(`${BASE_URL}/${year}/${month}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch month: ${res.statusText}`);
  }
  const json = await res.json();
  return json.days || [];
}

export async function fetchDay(year, month, day) {
  const res = await fetch(`${BASE_URL}/${year}/${month}/${day}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch day: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data;
}

export async function updateDay(year, month, day, data) {
  const res = await fetch(`${BASE_URL}/${year}/${month}/${day}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    throw new Error(`Failed to update day: ${res.statusText}`);
  }
  return await res.json();
}

export async function autoSequenceTamil(year, month, startTamilMonth, startTamilDay) {
  const res = await fetch(`${BASE_URL}/${year}/${month}/auto-sequence`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ startTamilMonth, startTamilDay })
  });
  if (!res.ok) {
    throw new Error(`Failed to auto-sequence: ${res.statusText}`);
  }
  const json = await res.json();
  return json.days;
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    throw new Error(`Failed to upload image: ${res.statusText}`);
  }
  return await res.json();
}

