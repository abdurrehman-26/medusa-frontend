import { listProducts } from "@/lib/data/products";
import ProductCard from "@/modules/Shared/ProductCard";
import { cookies as nextCookies } from "next/headers";

export default async function Home() {
  const cookies = await nextCookies()
  const region_id = cookies.get("region_id")?.value
  const productsResponse = await listProducts({
    regionId: region_id
  })
  return (
    <div className="font-sans py-10 min-h-screen">
      <main className="flex items-center justify-center flex-wrap gap-10 px-5">
        {productsResponse.response.products.map((product) => {
          return (
            <ProductCard key={product.id} product={product} />
          )
        })}
      </main>
    </div>
  );
}
