"use client"

import { HttpTypes, StoreCartShippingOption, StorePaymentProvider } from "@medusajs/types"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { formatPrice } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { Button } from "@/components/ui/button"
import { paymentInfoMap } from "@/lib/payments-info"
import { useForm, Controller } from "react-hook-form"
import { sdk } from "@/lib/sdk"
import { clearCart, setCart } from "@/features/cart/cartSlice"
import Cookies from "js-cookie"
import { toast } from "sonner"

type DeliveryFormValues = {
  shipping_option_id: string
  payment_provider_id: string
}

function DeliveryOptionFrom({
  shipping_options,
  shipping_prices_calculated,
  payment_providers,
}: {
  shipping_options: StoreCartShippingOption[]
  shipping_prices_calculated: Record<string, number>
  payment_providers: StorePaymentProvider[]
}) {
  const cartData = useAppSelector((state) => state.cart.cartData)
  const dispatch = useAppDispatch()

  const { handleSubmit, control } = useForm<DeliveryFormValues>({
    defaultValues: {
      shipping_option_id: shipping_options[0]?.id ?? "",
      payment_provider_id: payment_providers[0]?.id ?? "",
    },
  })

  const getShippingOptionPrice = (shippingOption: HttpTypes.StoreCartShippingOption) => {
    if (!shipping_prices_calculated[shippingOption.id] || !cartData?.currency_code) {
      return
    }

    if (shippingOption.price_type === "flat") {
      return formatPrice(shippingOption.amount, cartData.currency_code)
    }

    return formatPrice(shipping_prices_calculated[shippingOption.id], cartData.currency_code)
  }

  const onSubmit = async (data: DeliveryFormValues) => {
    if (!cartData) {
      return
    }

    await sdk.store.cart.addShippingMethod(cartData.id, {
      option_id: data.shipping_option_id,
    })

    await sdk.store.payment.initiatePaymentSession(cartData, {
      provider_id: data.payment_provider_id,
    })
    
    const {cart} = await sdk.store.cart.retrieve(cartData.id)
    dispatch(setCart(cart))
    console.log(cart?.payment_collection?.
    payment_sessions?.[0].data.client_secret)

    await sdk.store.cart.complete(cart.id)
    .then((data) => {
      if (data.type === "cart" && data.cart) {
        console.log(data)
        toast.error("An error occured")
      } else if (data.type === "order" && data.order) {
        // TODO redirect to order success page
        alert("Order placed.")
        console.log(data.order)
        // unset cart ID from Cookies
        Cookies.remove("cartId")
        dispatch(clearCart())
      }
    })

  }

  return (
    <form
      className="grid grid-cols-12 gap-5 py-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-5 flex flex-col col-span-12 md:col-span-8 mt-5">
        {/* Shipping Method */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Select shipping method</h2>
          <Controller
            control={control}
            name="shipping_option_id"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
              >
                {shipping_options.map((shipping_option) => (
                  <div
                    key={shipping_option.id}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={shipping_option.id}
                      id={shipping_option.id}
                    />
                    <Label
                      className="flex justify-between flex-1"
                      htmlFor={shipping_option.id}
                    >
                      <p>{shipping_option.name}</p>
                      <p>{getShippingOptionPrice(shipping_option)}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Select payment method</h2>
          <Controller
            control={control}
            name="payment_provider_id"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
              >
                {payment_providers.map((payment_provider) => (
                  <div
                    key={payment_provider.id}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={payment_provider.id}
                      id={payment_provider.id}
                    />
                    <Label
                      className="flex justify-between flex-1"
                      htmlFor={payment_provider.id}
                    >
                      <p>{paymentInfoMap[payment_provider.id].title}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="space-y-5 flex flex-col col-span-12 md:col-span-4 mt-5">
        <Button type="submit">Continue to Payment</Button>
      </div>
    </form>
  )
}

export default DeliveryOptionFrom
