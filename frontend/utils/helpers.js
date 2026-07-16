// FORMAT PRICE
export function formatPrice(price) {
  return `$${price}`;
}

// SHORT TEXT
export function shortText(
  text,
  maxLength = 50
) {
  if (text.length > maxLength) {
    return (
      text.substring(0, maxLength) +
      "..."
    );
  }

  return text;
}

// CAPITALIZE TEXT
export function capitalize(text) {
  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );
}