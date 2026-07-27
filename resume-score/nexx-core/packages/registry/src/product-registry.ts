import type { CoreEnvironment } from "../../contracts/src/index.ts";

export type RegisteredProduct = Readonly<{
  productKey: string;
  contractVersion: string;
  allowedEnvironments: readonly CoreEnvironment[];
}>;

/**
 * Phase 1 in-memory registry for contract verification. Production registration
 * will be persisted in core_registry.products after Gate B preparation.
 */
export class ProductRegistry {
  private readonly products = new Map<string, RegisteredProduct>();

  register(product: RegisteredProduct): void {
    this.products.set(product.productKey, product);
  }

  find(productKey: string): RegisteredProduct | undefined {
    return this.products.get(productKey);
  }
}
