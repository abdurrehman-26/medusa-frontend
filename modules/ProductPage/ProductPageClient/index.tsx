"use client";
import React, { useMemo, useState } from 'react'
import { ProductCarousel } from '../ProductCarousel'
import { cn, formatPrice } from '@/lib/utils'
import { StoreProduct } from '@medusajs/types'
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { sdk } from '@/lib/sdk';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useAppDispatch } from '@/store/hooks';
import { setCart } from '@/features/cart/cartSlice';

const ProductPageClient = ({product}: {product: StoreProduct}) => {

  const dispatch = useAppDispatch()

  const addToCartHandle = (variant_id?: string) => {
    const cartId = Cookies.get("cartId")

    if (!cartId || !variant_id) {
      return
    }

    sdk.store.cart.createLineItem(cartId, {
      variant_id,
      quantity: cartQuantity,
    })
    .then(({cart}) => {
      if (cart.items) {
        dispatch(setCart(cart.items))
        toast.success("Product added to cart")
      }
    })
  }

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    product.options?.forEach((opt) => {
      if (opt.id && opt.values?.[0]?.value) {
        initial[opt.id] = opt.values[0].value
      }
    })
    return initial
  })


  const selectedVariant = useMemo(() => {
    if (
      !product?.variants ||
      !product.options || 
      Object.keys(selectedOptions).length !== product.options?.length
    ) {
      return
    }

    return product.variants.find((variant) =>
      variant.options?.every((optionValue) =>
        optionValue.value === selectedOptions[optionValue.option_id!]
      )
    )
  }, [selectedOptions, product])

  const [cartQuantity, setCartQuantity] = useState<number>(1)

  return (
    <div className='grid grid-cols-12 sm:gap-5 pt-3 sm:pt-10'>
        <div className='col-span-12 sm:col-span-6'>
            <ProductCarousel slides={product.images} />
        </div>
        <div className='col-span-12 sm:col-span-6 max-sm:pt-3'>
            <p className='text-3xl font-bold max-sm:mt-5'>{product.title}</p>
            <div className='py-2 flex gap-2'>
                <p className={cn(`truncate text-xl text-foreground/70 font-bold`, selectedVariant?.calculated_price?.calculated_price?.price_list_type === 'sale' && "line-through")}>{formatPrice(selectedVariant?.calculated_price?.original_amount ?? 0)}</p>
                {selectedVariant?.calculated_price?.calculated_price?.price_list_type === 'sale' && <p className="truncate text-sm text-foreground/70">{formatPrice(selectedVariant?.calculated_price?.calculated_amount ?? 0)}</p>}
            </div>
            <p className='pb-3 border-b border-border'>{product.description}</p>
            {(product.options?.length || 0) > 1 && (
              <ul>
                {product.options!.map((option) => (
                  <li key={option.id} className='py-5 border-b border-border'>
                    <p className='mb-2'>{option.title}</p>
                    <div className='flex flex-wrap gap-3'>
                      {option.values?.map((optionValue) => (
                        <Button 
                          key={optionValue.id}
                          className='rounded-full'
                          variant={selectedOptions[option.id!] === optionValue.value ? "default" : "outline"}
                          onClick={() => {
                            setSelectedOptions((prev) => {
                              return {
                                ...prev,
                                [option.id!]: optionValue.value!,
                              }
                            })
                          }}
                        >
                          {optionValue.value}
                        </Button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className='py-3 flex gap-3'>
              <div className='flex bg-accent p-1 rounded-full'>
                <button type='button' onClick={() => setCartQuantity(cartQuantity - 1)}>
                  <Minus />
                </button>
                  <input type="text" value={cartQuantity} className='max-w-10 outline-none text-center' onChange={(e) => setCartQuantity(Number(e.target.value))} />
                <button type='button' onClick={() => setCartQuantity(cartQuantity + 1)}>
                  <Plus />
                </button>
              </div>
              <Button type='button' className='flex-grow rounded-full' onClick={() => addToCartHandle(selectedVariant?.id)}>Add to cart</Button>
            </div>
        </div>
    </div>
  )
}

export default ProductPageClient
