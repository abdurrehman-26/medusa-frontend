import { sdk } from '@/lib/sdk'
import { createSessionedSdk } from '@/lib/sessionedSdk'
import CheckOutAddressForm from '@/modules/checkout/CheckOutAddressForm'
import DeliveryOptionFrom from '@/modules/checkout/DeliveryOptionForm'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

async function CheckoutPage({searchParams}: {searchParams: Promise<{step: string}>}) {
  const userCookies = await cookies()
  const cartId = userCookies.get("cartId")?.value
  if (!cartId) {
    redirect("/cart")
  }
  const sessionedSdk = await createSessionedSdk()
  const cartData = await sessionedSdk.store.cart.retrieve(cartId)
  const customerData =  await sessionedSdk.store.customer.retrieve().catch(() => null)
  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
    cart_id: cartId,
  })

  const shipping_prices_calculated: Record<string, number> = {}

  const calculatedOptions = shipping_options.filter(
    (opt) => opt.price_type === "calculated"
  )

  if (calculatedOptions.length) {
    const results = await Promise.allSettled(
      calculatedOptions.map((opt) =>
        sdk.store.fulfillment.calculate(opt.id, {
          cart_id: cartId,
          data: {}, // pass provider-specific data if needed
        })
      )
    )

    results.forEach((res) => {
      if (res.status === "fulfilled") {
        const { shipping_option } = res.value
        shipping_prices_calculated[shipping_option.id] = shipping_option.amount
      }
    })
  }

  const { payment_providers } = await sdk.store.payment.listPaymentProviders({
    region_id: cartData.cart.region_id || "",
  })
  console.log(payment_providers)
  
  const isLoggedIn = Boolean(customerData?.customer.id)

  const params = await searchParams
  
  if (params.step === "address") {
    return <CheckOutAddressForm loggedIn={isLoggedIn} />
  }
  if (params.step === "delivery") {
    if (!cartData.cart.shipping_address?.address_1) {
      redirect("/checkout?step=address")
    }
    return <DeliveryOptionFrom
              shipping_options={shipping_options}
              shipping_prices_calculated={shipping_prices_calculated}
              payment_providers={payment_providers}
            />
  }
}

export default CheckoutPage
