import { sdk } from "@/lib/sdk";
import ProductCard from "@/modules/Shared/ProductCard";
import { cookies as nextCookies } from "next/headers";

export default async function Home() {
  const cookies = await nextCookies()
  const region_id = cookies.get("region_id")?.value
  const productsResponse = await sdk.store.product.list({
    fields: `*variants.calculated_price`,
    region_id,
  })
  return (
    <div className="font-sans py-10 min-h-screen">
      <main className="flex items-center justify-center flex-wrap gap-10 px-5">
        {productsResponse.products.map((product) => {
          return (
            <ProductCard key={product.id} product={product} />
          )
        })}
      </main>
    </div>
  );
}
