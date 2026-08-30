import type { Product } from "./model";

export function mapCrmProducts(records: unknown): Product[];
export function selectCatalogForSync(currentCatalog: Product[], crmRecords: unknown): Product[];
export function crmCatalogSyncEnabled(environment?: NodeJS.ProcessEnv): boolean;
