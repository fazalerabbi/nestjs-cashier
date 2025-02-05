import { BaseService } from './base.service';
import Stripe from "stripe";
import {BadRequestException, Injectable} from "@nestjs/common";
import {convertObjectToString} from "../../utils";

@Injectable()
export class ProductService extends BaseService {
    /**
     * Create a new product in Stripe.
     * Stripe documentation for creating a product: https://docs.stripe.com/api/products/create
     *
     * @param {string} name - The name of the product.
     * @param {Stripe.ProductCreateParams} options - Additional options for product creation.
     * @returns {Promise<Stripe.Product>} - The created product object.
     */
    public async create(name: string, options: Stripe.ProductCreateParams = {} as Stripe.ProductCreateParams): Promise<Stripe.Product> {
        if (!name) {
            throw new Error('Product name is required');
        }
        if (options && typeof options !== 'object') {
            throw new Error('Options must be an object');
        }
        return await this.stripe.products.create({ name, ...options });
    }

    /**
     * Update a product in Stripe.
     * Stripe documentation for updating a product: https://docs.stripe.com/api/products/update
     *
     * @param {string} productId - The ID of the product to update.
     * @param {Stripe.ProductUpdateParams} options - Additional options for updating the product.
     * @returns {Promise<Stripe.Product>} - The updated product object.
     */
    public async update(productId: string, options: Stripe.ProductUpdateParams = {} as Stripe.ProductUpdateParams): Promise<Stripe.Product> {
        if (!productId) {
            throw new BadRequestException('Product ID is required');
        }
        if (options && typeof options !== 'object') {
            throw new BadRequestException('Options must be an object');
        }
        return await this.stripe.products.update(productId, options);
    }

    /**
     * Retrieve a product from Stripe by its ID.
     * Stripe documentation for retrieving a product: https://docs.stripe.com/api/products/retrieve
     *
     * @param {string} productId - The ID of the product to retrieve.
     * @returns {Promise<Stripe.Product>} - The retrieved product object.
     * @throws {BadRequestException} - If the product ID is missing.
     */
    public async retrieve(productId: string): Promise<Stripe.Product> {
        if (!productId) {
            throw new BadRequestException('Product Id is required');
        }
        return await this.stripe.products.retrieve(productId);
    }

    /**
     * List products from Stripe.
     * Stripe documentation for listing all products: https://docs.stripe.com/api/products/list
     *
     * @param {Stripe.ProductListParams} options - Additional options for listing products.
     * @returns {Promise<Stripe.ApiList<Stripe.Product>>} - A list of products from Stripe.
     */
    public list(options: Stripe.ProductListParams = {} as Stripe.ProductListParams): Promise<Stripe.ApiList<Stripe.Product>> {
        return this.stripe.products.list(options);
    }

    /**
     * Delete a product from Stripe by its ID.
     * Stripe documentation for deleting a product: https://docs.stripe.com/api/products/delete
     *
     * @param {string} productId - The ID of the product to delete.
     * @returns {Promise<Stripe.DeletedProduct>} - The deleted product object.
     * @throws {BadRequestException} - If the product ID is missing.
     */
    public async delete(productId: string): Promise<Stripe.DeletedProduct> {
        if (!productId) {
            throw new BadRequestException('Product Id is required');
        }
        return await this.stripe.products.del(productId);
    }

    /**
     * Search for products in Stripe based on the provided query and options.
     * Stripe documentation for searching products: https://stripe.com/docs/api/products/search
     *
     * @param {object} query - The query object to search for products.
     * @param {object} options - Additional options for the search.
     * @returns {Promise<Stripe.ApiSearchResult<Stripe.Product>>} - A promise that resolves to the search result.
     * @throws {BadRequestException} - If the query is missing.
     */
    public search(query: object, options: object = {}): Promise<Stripe.ApiSearchResult<Stripe.Product>> {
        if (!query) {
            throw new BadRequestException('Query is required');
        }
        const queryStr = convertObjectToString(query);
        return this.stripe.products.search({'query': queryStr, ...options});
    }
}