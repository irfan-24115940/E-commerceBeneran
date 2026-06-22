import { formatRupiah } from './formatter.js';

/**
 * Membuat link WhatsApp untuk checkout
 * @param {Array} cartItems Daftar item di keranjang
 * @returns {string} URL WhatsApp API
 */
export const createWhatsAppCheckoutLink = (cartItems) => {
  const phoneNumber = '6281234567890'; // Ganti dengan nomor WhatsApp toko
  
  if (!cartItems || cartItems.length === 0) return '#';
  
  let message = 'Halo DHAN.CO, saya ingin memesan:\n\n';
  let total = 0;
  
  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    message += `${index + 1}. ${item.name} (${item.quantity}x) - ${formatRupiah(itemTotal)}\n`;
  });
  
  message += `\nTotal Belanja: ${formatRupiah(total)}\n\nMohon info ketersediaan dan ongkos kirim. Terima kasih.`;
  
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};
