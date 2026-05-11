export function applyPrizeDiscount(prizeText, total, items = []) {
  if (!prizeText) return { total, items, discount: 0, label: null };
  const percentMatch = prizeText.match(/Скидка (\d+)%/);
  if (percentMatch) {
    const percent = parseInt(percentMatch[1]) / 100;
    return {
      total: Math.round(total * (1 - percent)),
      items,
      discount: percent,
      label: `${prizeText}`
    };
  }
  const promoMatch = prizeText.match(/Промокод на (\d+)₽/);
  if (promoMatch) {
    const amount = parseInt(promoMatch[1]);
    return {
      total: Math.max(0, total - amount),
      items,
      discount: 0,
      label: `${prizeText}`,
      promoAmount: amount
    };
  }

  return { total, items, discount: 0, label: null };
}