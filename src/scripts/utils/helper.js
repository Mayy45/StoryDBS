export function urlBase64ToUint8Array(base64String) {
  // Tambahkan padding '=' supaya panjang string kelipatan 4
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  // Ganti karakter URL-safe base64 menjadi base64 biasa
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  // Decode base64 menjadi string biner
  const rawData = atob(base64);
  // Buat Uint8Array dari kode ASCII setiap karakter
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
