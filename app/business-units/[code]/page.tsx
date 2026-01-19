import { BusinessUnitEditLayout } from "@/components/business-unit-edit-layout"

const businessUnits = [
  { code: "ELB", name: "電気設備ビジネスユニット", allowableArea: 75000, header: "" },
  { code: "PPB", name: "プラントビジネスユニット", allowableArea: 45000, header: "" },
  { code: "ELA", name: "エネルギーソリューションユニット", allowableArea: 60000, header: "" },
  { code: "ELC", name: "環境システムユニット", allowableArea: 35000, header: "" },
]

export async function generateStaticParams() {
  return businessUnits.map((unit) => ({
    code: unit.code,
  }))
}

export default async function BusinessUnitEditPage({ params }: { params: { code: string } }) {
  return <BusinessUnitEditLayout code={params.code} />
}
