import {
  AdminPostPriceListsPriceListPriceListReq,
  AdminPostPriceListsPriceListReq,
  PriceList,
} from "@medusajs/medusa"
import xorObjFields from "../../../../utils/xorObjFields"
import {
  CreatePriceListFormValues,
  CreatePriceListPricesFormValues,
  PriceListFormValues,
  PriceListStatus,
  PriceListType,
} from "../types"

type ExtendedPriceListFields = {
  applied_start_date: string;
  applied_end_date: string
}

export const mapPriceListToFormValues = (
  priceList: PriceList & ExtendedPriceListFields
): PriceListFormValues => {
  return {
    description: priceList.description,
    type: priceList.type,
    name: priceList.name,
    ends_at: priceList.ends_at ? new Date(priceList.ends_at) : null,
    starts_at: priceList.starts_at ? new Date(priceList.starts_at) : null,
    applied_start_date: priceList.applied_start_date ? new Date(priceList.applied_start_date) : null,
    applied_end_date: priceList.applied_end_date ? new Date(priceList.applied_end_date) : null,
    prices: priceList.prices.map((p) => ({
      amount: p.amount,
      max_quantity: p.max_quantity,
      min_quantity: p.min_quantity,
      variant_id: p.variant_id,
      currency_code: p.currency_code,
      region_id: p.region_id,
    })),
    customer_groups: priceList.customer_groups.map((pl) => ({
      label: pl.name,
      value: pl.id,
    })),
    includes_tax: priceList.includes_tax,
  }
}

export const mapFormValuesToCreatePriceList = (
  values: CreatePriceListFormValues,
  status: PriceListStatus
): AdminPostPriceListsPriceListReq & { applied_start_date?: Date, applied_end_date?: Date} => {
  let prices
  if (values.prices) {
    prices = Object.entries(values.prices)
      .map(([variantId, price]) =>
        price.map((pr) => ({
          variant_id: variantId,
          amount: pr.amount,
          ...xorObjFields(pr, "currency_code", "region_id"),
          min_quantity: pr.min_quantity,
          max_quantity: pr.max_quantity,
        }))
      )
      .flat(1)
  }

  return {
    description: values.description!,
    name: values.name!,
    type: PriceListType.SALE,
    status,
    customer_groups: values.customer_groups
      ? values.customer_groups.map((cg) => ({ id: cg.value }))
      : undefined,
    ends_at: values.ends_at || undefined,
    starts_at: values.starts_at || undefined,
    applied_start_date: values.applied_start_date || undefined,
    applied_end_date: values.applied_end_date || undefined,
    prices,
  }
}

export const mapFormValuesToUpdatePriceListDetails = (
  values: PriceListFormValues
): AdminPostPriceListsPriceListPriceListReq & { applied_start_date?: Date, applied_end_date?: Date} => {
  return {
    name: values.name || undefined,
    description: values.description || undefined,
    customer_groups: values.customer_groups
      ? values.customer_groups.map((cg) => ({ id: cg.value }))
      : [],
    ends_at: values.ends_at,
    starts_at: values.starts_at,
    applied_start_date: values.applied_start_date || undefined,
    applied_end_date: values.applied_end_date || undefined,
    type: values.type || undefined,
  }
}

export const mapFormValuesToUpdatePriceListPrices = (
  values: PriceListFormValues & { prices: CreatePriceListPricesFormValues }
): AdminPostPriceListsPriceListPriceListReq | void => {
  let prices
  if (values.prices) {
    prices = Object.entries(values.prices)
      .map(([variantId, price]) =>
        price.map((pr) => ({
          variant_id: variantId,
          amount: pr.amount,
          ...xorObjFields(pr, "currency_code", "region_id"),
          min_quantity: pr.min_quantity,
          max_quantity: pr.max_quantity,
        }))
      )
      .flat(1)

    return {
      prices,
    }
  }
}
