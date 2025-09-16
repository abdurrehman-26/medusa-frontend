"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/lib/countries-list';
import { sdk } from '@/lib/sdk';
import { useAppSelector } from '@/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner';
import z from 'zod';

const CheckAddressFormFieldSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  address_1: z.string().min(1, "Address line 1 is required"),
  company: z.string().optional().nullable(),
  postal_code: z.string().min(1, "Postal code is required"),
  city: z.string().min(1, "City is required"),
  country_code: z.string().min(1, "Country is required"),
  province: z.string().min(1, "Province is required"),
  phone: z.string().min(1, "Phone is required"),
});

type CheckAddressFormFields = z.infer<typeof CheckAddressFormFieldSchema>

function CheckOutAddressForm({loggedIn}: {loggedIn: boolean}) {
  const cartId = useAppSelector(state => state.cart.cartData?.id)
  const router = useRouter()
  const {register, handleSubmit, formState, control} = useForm<CheckAddressFormFields>({
      resolver: zodResolver(CheckAddressFormFieldSchema), // ✅ Use Zod for validation
      defaultValues: {
        first_name: "",
        last_name: "",
        address_1: "",
        company: "",
        postal_code: "",
        city: "",
        country_code: "pk",
        province: ""
      }
    });
  async function updateAddress(data: CheckAddressFormFields) {
    if (!cartId) {
      return
    }
    try {
      await sdk.store.cart.update(cartId, {
        ...(data.email && {email: data.email}),
        shipping_address: {
          first_name: data.first_name,
          last_name: data.last_name,
          address_1: data.address_1,
          address_2: data.address_1,
          company: data.company ? data.company : undefined,
          postal_code: data.postal_code,
          city: data.city,
          country_code: data.country_code,
          province: data.province,
          phone: data.phone
        }
      })
      router.push("/checkout?step=delivery")
    } catch {
      toast.error("failed to update cart address")
      return
    }
  }
  return (
    <form className='grid grid-cols-12 gap-5' onSubmit={handleSubmit((updateAddress))}>
      <div className="space-y-5 flex flex-col col-span-12 md:col-span-8 mt-5">
        {!loggedIn && <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          <p className="text-xs text-red-600">{formState.errors.email?.message}</p>
        </div>}
        <div className="grid gap-3">
          <Label htmlFor="first_name">First name</Label>
          <Input id="first_name" type="text" {...register("first_name")} />
          <p className="text-xs text-red-600">{formState.errors.first_name?.message}</p>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="last_name">Last name</Label>
          <Input id="last_name" type="text" {...register("last_name")} />
          <p className="text-xs text-red-600">{formState.errors.last_name?.message}</p>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="address_1">Address line 1</Label>
          <Input id="address_1" type="text" {...register("address_1")} />
          <p className="text-xs text-red-600">{formState.errors.address_1?.message}</p>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="company">Company</Label>
          <Input id="company" type="text" {...register("company")} />
          <p className="text-xs text-red-600">{formState.errors.company?.message}</p>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="postal_code">Postal code</Label>
          <Input id="postal_code" type="text" {...register("postal_code")} />
          <p className="text-xs text-red-600">{formState.errors.postal_code?.message}</p>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="city">City</Label>
          <Input id="city" type="text" {...register("city")} />
          <p className="text-xs text-red-600">{formState.errors.city?.message}</p>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="country_code">Country</Label>
          <Controller
            control={control}
            name="country_code"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <div className="max-h-50 overflow-auto">
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            )}
          />
          <p className="text-xs text-red-600">{formState.errors.country_code?.message}</p>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="province">Province</Label>
          <Input id="province" type="text" {...register("province")} />
          <p className="text-xs text-red-600">{formState.errors.province?.message}</p>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="text" {...register("phone")} />
          <p className="text-xs text-red-600">{formState.errors.phone?.message}</p>
        </div>
      </div>
      <div className='space-y-5 flex flex-col col-span-12 md:col-span-4 mt-5'>
        <Button type='submit'>Continue to delivery</Button>
      </div>
    </form>
  )
}

export default CheckOutAddressForm
