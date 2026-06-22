/**
 * Memformat angka menjadi format Rupiah
 * @param {number} number Angka yang akan diformat
 * @returns {string} String dengan format Rp
 */
export const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};
