"use client";
import React, { useMemo, useState } from 'react'
import { ProductCarousel } from '../ProductCarousel'
import { cn, formatPrice } from '@/lib/utils'
import { StoreProduct } from '@medusajs/types'
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { sdk } from '@/lib/sdk';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCart } from '@/features/cart/cartSlice';
import Link from 'next/link';

const ProductPageClient = ({product}: {product: StoreProduct}) => {

  const dispatch = useAppDispatch()

  const region = useAppSelector(state => state.region.regionData)

  const cartId = useAppSelector(state => state.cart.cartData?.id)

  const addToCartHandle = (variant_id?: string) => {

    if (!cartId || !variant_id) {
      return
    }

    sdk.store.cart.createLineItem(cartId, {
      variant_id,
      quantity: cartQuantity,
    })
    .then(({cart}) => {
      if (cart) {
        dispatch(setCart(cart))
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

  function cartQuantityChangeHandle(quantity: number) {
    if (quantity <= 0 || quantity > 999) {
      return
    }
    setCartQuantity(quantity)
  }

  return (
    <div className='grid grid-cols-12 sm:gap-5 pt-3 sm:pt-10'>
        <div className='col-span-12 sm:col-span-6'>
            <ProductCarousel slides={product.images} />
        </div>
        <div className='col-span-12 sm:col-span-6 max-sm:pt-3 flex flex-col divide-y divide-border'>
            <div className='mb-auto'>
              <p className='text-3xl font-bold max-sm:mt-5'>{product.title}</p>
              <Link className='text-accent-foreground' href={`/categories/${product.categories?.[0].handle}`}>{product.categories?.[0].name}</Link>
              <div className='py-2 flex gap-2'>
                  <p className={cn(`truncate text-xl text-foreground/70 font-bold`, selectedVariant?.calculated_price?.calculated_price?.price_list_type === 'sale' && "line-through")}>{formatPrice(selectedVariant?.calculated_price?.original_amount ?? 0, region.currency_code)}</p>
                  {selectedVariant?.calculated_price?.calculated_price?.price_list_type === 'sale' && <p className="truncate text-sm text-foreground/70">{formatPrice(selectedVariant?.calculated_price?.calculated_amount ?? 0, region.currency_code)}</p>}
              </div>
              <p className='pb-3'>{product.description}</p>
            </div>
            {(product.options?.length || 0) > 1 && (
              <ul className='divide-y divide-border'>
                {product.options!.map((option) => (
                  <li key={option.id} className='py-5'>
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
            <div className='flex gap-3 items-center py-5'>
              <div>
                <div className='flex'>
                  <button className='flex rounded bg-accent cursor-pointer' disabled={cartQuantity === 1} onClick={() => cartQuantityChangeHandle(cartQuantity - 1)}>
                    <Minus />
                  </button>
                    <input className='w-10 text-center outline-none' value={cartQuantity} onChange={(e) => cartQuantityChangeHandle(Number(e.target.value))} />
                  <button className='flex rounded bg-accent cursor-pointer' onClick={() => cartQuantityChangeHandle(cartQuantity + 1)}>
                    <Plus />
                  </button>
                </div>
              </div>
              <Button type='button' className='flex-grow rounded-full' size="lg" onClick={() => addToCartHandle(selectedVariant?.id)}>Add to cart</Button>
            </div>
        </div>
    </div>
  )
}

export default ProductPageClient
