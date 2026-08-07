import type { Product } from "./model";

export function mapCrmProducts(records: unknown): Product[];
export function selectCatalogForSync(currentCatalog: Product[], crmRecords: unknown): Product[];
