import { getRegion } from "@/lib/data/regions";
import { sdk } from "@/lib/sdk";
import CollectionsSection from "@/modules/Home/CollectionsSection";
import { Carousel } from "@/modules/Shared/Carousel";
import { cookies as nextCookies } from "next/headers";

export default async function Home() {
  const cookies = await nextCookies()
  const defaultRegion = await getRegion(process.env.NEXT_PUBLIC_MEDUSA_DEFAULT_REGION!)
  const region_id = cookies.get("region_id")?.value || defaultRegion?.id
  const productCollections = (await sdk.store.collection.list()).collections
  const SLIDES = [
    {
      imageurl:
        "https://res.cloudinary.com/dxpjusmf7/image/upload/v1753705937/8d6efb0d-35ac-4611-9664-13404fd5b796_PK-1976-688.jpg_2200x2200q80.jpg__bytjb2.webp",
    },
    {
      imageurl:
        "https://res.cloudinary.com/dxpjusmf7/image/upload/v1753705982/99887c7a-ecb6-4010-be8b-44f54e295193_PK-1976-688.jpg_2200x2200q80.jpg__qltbnz.webp",
    },
    {
      imageurl:
        "https://res.cloudinary.com/dxpjusmf7/image/upload/v1753705997/a2e8a274-cfb1-41fe-9dee-3b543cde1f75_PK-1976-688.jpg_2200x2200q80.jpg__smr1sj.webp",
    },
    {
      imageurl:
        "https://res.cloudinary.com/dxpjusmf7/image/upload/v1753706004/ca544c06-44d7-40bf-914c-1d0b54c90c91_PK-1976-688.jpg_2200x2200q80.jpg__fwbhtr.webp",
    },
  ];
  return (
    <div>
      <div className="py-5 sm:py-10 flex justify-center w-full">
        <Carousel slides={SLIDES} />
      </div>
      <main>
        <CollectionsSection collections={productCollections} regionId={region_id!} />
      </main>
    </div>
  );
}
