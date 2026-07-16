import { $ } from '../utils/dom-helper.js';

/**
 * Menampilkan notifikasi sederhana
 * @param {string} message Pesan yang ingin ditampilkan
 */
export const showToast = (message) => {
  let container = $('#toast-container');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  container.appendChild(toast);
  
  // Tampilkan dengan animasi
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Hilangkan setelah 3 detik
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 3000);
};
