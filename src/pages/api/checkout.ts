import { stripe } from "@/lib/stripe";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {

  const {priceId} = request.body;

  if(request.method === 'POST'){
    return response.status(405).json({'error': 'METHOD NOT ALLOWED'});
  }
  if(!priceId){
    return response.status(400).json({'error': 'Price not found'})
  }
  
  const successUrl=`${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl=`${process.env.NEXT_URL}/success`

  const ckeckoutSession = await stripe.checkout.sessions.create({
    success_url: successUrl,
    cancel_url: cancelUrl,
    mode: "payment",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
  });

  return response.status(201).json({
    checkoutUrl: ckeckoutSession.url,
  })

}
