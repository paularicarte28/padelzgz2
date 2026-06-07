export function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function formatPrice(price) {
  return `${Number(price).toFixed(2)} €`;
}

export function formatRating(rating) {
  return Number(rating).toFixed(1);
}

export function getStatusLabel(status) {
  return status === 'confirmed' ? 'Confirmada' : 'Cancelada';
}

export function getStatusClass(status) {
  return status === 'confirmed' ? 'status-confirmed' : 'status-cancelled';
}

export function getTypeLabel(type) {
  return type === 'indoor' ? 'Cubierta' : 'Exterior';
}
