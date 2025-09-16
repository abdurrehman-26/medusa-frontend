"use server"

import { cookies } from "next/headers"
import { createSessionedSdk } from "./sessionedSdk"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function startCheckOut() {
    const userCookies = await cookies()
    const cartId = userCookies.get("cartId")?.value

    if (!cartId) {
        // Handle case where there is no cart.
        // Maybe create one or redirect to a landing page.
        redirect("/cart") 
    }

    const sessionedSdk = await createSessionedSdk()
    const customerData = await sessionedSdk.store.customer.retrieve().catch(() => null)

    // Only fetch the cart if we have a cartId.
    const { cart } = await sessionedSdk.store.cart.retrieve(cartId)
    
    if (customerData?.customer && !cart.email) {
        // Update cart with customer email if missing.
        await sessionedSdk.store.cart.update(cartId, {
            email: customerData.customer.email,
        })
        revalidatePath("/", "layout")
    }

    // If all checks pass, redirect to the final delivery step.
    redirect("/checkout?step=address")
}