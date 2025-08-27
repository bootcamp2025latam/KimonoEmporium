// 4Geeks payment integration utilities

export const createPaymentLink = async (productId: string, email: string, cartItems: any[]) => {
  const response = await fetch('/api/create-payment-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId,
      email,
      cartItems
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create payment link');
  }

  return response.json();
};
