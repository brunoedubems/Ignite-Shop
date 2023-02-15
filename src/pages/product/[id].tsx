import { stripe } from "@/lib/stripe"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import Stripe from "stripe";
import {ImageContainer, ProductContainer, ProductDetails} from '../../styles/pages/product'
import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import Head from "next/head";

interface ProductProps{
    product: {
        id: string;
        name: string;
        imageUrl: string;
        price: string;
        description: string;
        defaultPriceId: string;
      
    }
}

export default function Product({ product }:ProductProps){
// const { isFallback} = useRouter()
// if(isFallback){
//     return <p>Loading...</p>
// }
const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)

async function handleBuyProduct(){
    try{
        setIsCreatingCheckoutSession(true);
const response = await axios.post('/api/checkout', {
    priceId: product.defaultPriceId,
})
const { checkoutUrl} = response.data;

window.location.href = checkoutUrl;

    } catch(err){
        //contect com uma ferramenta de observabilidade (Datadog / sentry)
        alert('falha ao redirecionar ao checkout')
        setIsCreatingCheckoutSession(false)
    }
}

    return(
        <>
        <Head>
          <title>{product.name} | Ignite Shop</title> 
        </Head>
        
       <ProductContainer>
        <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt=""/>
        </ImageContainer>
        <ProductDetails>
            <h1>{product.name}</h1>
            <span>{product.price}</span>
            <p>{product.description}</p>
        <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>
            comprar agora
        </button>
        </ProductDetails>
       </ProductContainer> 
</>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
      paths: [
        { params: { id: 'prod_MLH5Wy0Y97hDAC' } },
      ],
      fallback: 'blocking',
    }
  }


export const getStaticProps: GetStaticProps<any, { id: string }> = async ({params}) => {
    const productId = params.id;
    
    const product = await stripe.products.retrieve(productId, {
        expand:['default_price']
    });
    
    const price = product.default_price as Stripe.Price;
    
    return{
        props: {
        product: {
            id: product.id,
            name: product.name,
            imageUrl: product.images[0],
            price: new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format((price.unit_amount as number) / 100),
            description: product.description,
            defaultPriceId: price.id,
        }
        },
        revalidate: (60 * 60 * 1), 
    }

}