import Stripe from 'stripe';
import {BadRequestException, Injectable} from '@nestjs/common';
import { BaseService } from './base.service';
import { CurrencyEnum } from '../../enums';
import { convertObjectToString } from '../../utils';

@Injectable()
export class PriceService extends BaseService {
    /**
     * Create a new price in Stripe.
     * Stripe documentation for creating a price: https://stripe.com/docs/api/prices/create
     * @param {CurrencyEnum} currency - The currency of the price.
     * @param options - The properties of the price.
     * @returns {Promise<Stripe.Price>} - The created price object.
     * @throws {BadRequestException} - If the currency is not provided or invalid.
     */
    public async create(currency: CurrencyEnum, options: Stripe.PriceCreateParams = {} as Stripe.PriceCreateParams): Promise<Stripe.Price> {
        if (!currency || !Object.values(CurrencyEnum).includes(currency)) {
            throw new BadRequestException('Invalid currency');
        }
        return await this.stripe.prices.create({ currency, ...options });
    }

    /**
     * Update a price in Stripe.
     * Stripe documentation for updating a price: https://stripe.com/docs/api/prices/update
     * @param {string} priceId - The ID of the price to update.
     * @param options - The properties to update.
     * @returns {Promise<Stripe.Price>} - The updated price object.
     * @throws {BadRequestException} - If the price ID is not provided.
     */
    public async update(priceId: string, options: Stripe.PriceUpdateParams = {} as Stripe.PriceUpdateParams): Promise<Stripe.Price> {
        if (!priceId) {
            throw new BadRequestException('Price id is required');
        }
        return await this.stripe.prices.update(priceId, options);
    }

    /**
     * Retrieve a price from Stripe.
     * Stripe documentation for retrieving a price: https://stripe.com/docs/api/prices/retrieve
     * @param {string} priceId - The ID of the price to retrieve.
     * @returns {Promise<Stripe.Price>} - The retrieved price object.
     * @throws {BadRequestException} - If the price ID is not provided.
     */
    public async retrieve(priceId: string): Promise<Stripe.Price> {
        if (!priceId) {
            throw new BadRequestException('Price id is required');
        }
        return await this.stripe.prices.retrieve(priceId);
    }

    /**
     * List prices from Stripe.
     * Stripe documentation for listing prices: https://stripe.com/docs/api/prices/list
     * @param options - The options to filter the list of prices.
     * @returns {Promise<Stripe.ApiList<Stripe.Price>>}
     */
    public list(options: Stripe.PriceListParams = {} as Stripe.PriceListParams): Promise<Stripe.ApiList<Stripe.Price>> {
        return this.stripe.prices.list(options);
    }

    /**
     * Search for prices in Stripe.
     * Stripe documentation for searching prices: https://stripe.com/docs/api/prices/search
     * @param query - The options to search for prices.
     * @param options - The options to filter the search results.
     * @returns {Promise<Stripe.ApiSearchResult<Stripe.Price>>}
     * @throws {BadRequestException} - If the options are not provided or invalid.
     */

    public search(query: object, options: object = {}): Promise<Stripe.ApiSearchResult<Stripe.Price>> {
        if (!query) {
            throw new BadRequestException('Query is required');
        }
        const queryStr = convertObjectToString(query);
        return this.stripe.prices.search({query: queryStr, ...options});
    }
}