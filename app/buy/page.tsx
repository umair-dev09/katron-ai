import { Suspense } from "react"
import BuyPageContent from "@/components/buy/buy-page-content"
import BuyPageLoading from "@/components/buy/buy-page-loading"

export default function BuyPage() {
  return (
    <Suspense fallback={<BuyPageLoading />}>
      <BuyPageContent />
    </Suspense>
  )
}
