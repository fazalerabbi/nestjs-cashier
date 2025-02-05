import Stripe from 'stripe';
import { BadRequestException, Injectable } from '@nestjs/common';
import { convertObjectToString } from '../../utils';
import { BaseService } from './base.service';

@Injectable()
export class CustomerService extends BaseService {

    /**
     * Create a new customer in Stripe.
     * Stripe documentation for creating a customer: https://stripe.com/docs/api/customers/create
     *
     * @param {Stripe.CustomerCreateParams} options - The customer creation options.
     * @returns {Promise<Stripe.Customer>} - The created customer object.
     */
    public async create(options: Stripe.CustomerCreateParams = {} as Stripe.CustomerCreateParams): Promise<Stripe.Customer> {
        return await this.stripe.customers.create(options);
    }

    /**
     * Update a customer in Stripe.
     * Stripe documentation for updating a customer: https://stripe.com/docs/api/customers/update
     *
     * @param {string} customerId - The customer id.
     * @param {Stripe.CustomerUpdateParams} options - The customer update options.
     * @returns {Promise<Stripe.Customer>} - The updated customer object.
     * @throws {BadRequestException} - If the customer id is not provided.
     */
    public async update(customerId: string, options: Stripe.CustomerUpdateParams = {} as Stripe.CustomerUpdateParams): Promise<Stripe.Customer> {
        if (!customerId) {
            throw new BadRequestException('Customer id is required');
        }
        return await this.stripe.customers.update(customerId, options);
    }

    /**
     * Retrieve a customer from Stripe.
     * Stripe documentation for retrieving a customer: https://stripe.com/docs/api/customers/retrieve
     *
     * @param {string} customerId - The customer id.
     * @returns {Promise<Stripe.Customer>} - The retrieved customer object.
     * @throws {BadRequestException} - If the customer id is not provided.
     */
    public async retrieve(customerId: string): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
        if (!customerId) {
            throw new BadRequestException('Customer id is required');
        }
        return await this.stripe.customers.retrieve(customerId);
    }

    /**
     * List customers in Stripe.
     * Stripe documentation for listing customers: https://stripe.com/docs/api/customers/list
     *
     * @param {Stripe.CustomerListParams} options - The customer list options.
     * @returns {Promise<Stripe.ApiList<Stripe.Customer>}
     */
    public list(options: Stripe.CustomerListParams = {} as Stripe.CustomerListParams): Promise<Stripe.ApiList<Stripe.Customer>> {
        return this.stripe.customers.list(options);
    }

    /**
     * Delete a customer from Stripe.
     * Stripe documentation for deleting a customer: https://stripe.com/docs/api/customers/delete
     *
     * @param {string} customerId - The customer id.
     * @returns {Promise<Stripe.DeletedCustomer>} - The deleted customer object.
     * @throws {BadRequestException} - If the customer id is not provided.
     */
    public async delete(customerId: string): Promise<Stripe.DeletedCustomer> {
        if (!customerId) {
            throw new BadRequestException('Customer id is required');
        }
        return await this.stripe.customers.del(customerId);
    }

    /**
     * Search customers in Stripe.
     * Stripe documentation for searching customers: https://stripe.com/docs/api/customers/search
     *
     * @param {object} query - The query object.
     * @param {object} options - The search options.
     * @returns {Promise<Stripe.ApiSearchResult<Stripe.Customer>}
     */
    public search(query: any, options: Stripe.CustomerSearchParams = {} as Stripe.CustomerSearchParams): Promise<Stripe.ApiSearchResult<Stripe.Customer>> {
        if (!query || Object.keys(query).length === 0) {
            throw new BadRequestException('Query is required');
        }
        const queryStr = convertObjectToString(query);
        return this.stripe.customers.search({...{query: queryStr}, ...options});
    }
}