import Stripe from 'stripe';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { StripeService } from '../stripe.service';
import { convertObjectToString } from '../../utils';
import { TestModuleMetaData } from './constants';

jest.mock('stripe', () => {
    const mockStripe = {
        customers: {
            create: jest.fn(),
            update: jest.fn(),
            retrieve: jest.fn(),
            list: jest.fn(),
            del: jest.fn(),
            search: jest.fn(),
        },
    };
    return {
        __esModule: true,
        default: jest.fn(() => mockStripe),
    };
});

describe('Customer', () => {
    let service: StripeService;
    let stripeMock: jest.Mocked<Stripe>;

    const customerName = 'Test Customer';
    const createdCustomer = { id: 'cus_test', name: customerName } as Stripe.CustomerCreateParams;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule(TestModuleMetaData).compile();

        service = module.get<StripeService>(StripeService);
        stripeMock = new (Stripe as any)() as jest.Mocked<Stripe>;
    });

    describe('CustomerCreate', () => {
        it('should create a customer', async () => {
            // @ts-ignore
            stripeMock.customers.create.mockResolvedValue(createdCustomer);

            const result = await service.customer.create(createdCustomer);
            expect(result.id).toBe('cus_test');
            expect(stripeMock.customers.create).toHaveBeenCalledWith(createdCustomer);
        });

        it('should throw an error when the email parameter is not valid', async () => {
            // @ts-ignore
            stripeMock.customers.create.mockRejectedValue(new BadRequestException());

            await expect(service.customer.create(createdCustomer)).rejects.toThrow(BadRequestException);
            expect(stripeMock.customers.create).toHaveBeenCalledWith(createdCustomer);

        });
    });

    describe('CustomerUpdate', () => {
        it('should update a customer', async () => {
            const updatedCustomer = { id: 'cus_test', name: 'Updated Customer' } as Stripe.CustomerUpdateParams;
            // @ts-ignore
            stripeMock.customers.update.mockResolvedValue(updatedCustomer);

            const result = await service.customer.update('cus_test', updatedCustomer);
            expect(result.name).toBe('Updated Customer');
            expect(stripeMock.customers.update).toHaveBeenCalledWith('cus_test', updatedCustomer);
        });

        it('should throw an error when the customer id is not provided', async () => {
            // @ts-ignore
            stripeMock.customers.update.mockRejectedValue(new BadRequestException());
            await expect(service.customer.update('', {})).rejects.toThrow(BadRequestException);
        });

    });

    describe('CustomerRetrieve', () => {
        it('should retrieve a customer', async () => {
            const retrieveCustomer= {...createdCustomer};
            // @ts-ignore
            stripeMock.customers.retrieve.mockReturnValue(retrieveCustomer);
            const result = await service.customer.retrieve('cus_test');
            expect(result.id).toBe('cus_test');
            expect(stripeMock.customers.retrieve).toHaveBeenCalledWith('cus_test');
        });

        it('should throw an error when the customer id is not provided', async () => {
            // @ts-ignore
            stripeMock.customers.retrieve.mockRejectedValue(new BadRequestException());

            await expect(service.customer.retrieve('cus_test')).rejects.toThrow(BadRequestException);
            expect(stripeMock.customers.retrieve)
        });
    });

    describe('CustomerList', () => {
        it('should list customers', async () => {
            const customerList = {
                'object': 'list',
                'has_more': false,
                data: [createdCustomer]
            };
            // @ts-ignore
            stripeMock.customers.list.mockReturnValue(customerList);
            const result = await service.customer.list({});
            expect(result.data[0].id).toBe('cus_test');
            expect(stripeMock.customers.list).toHaveBeenCalledWith({});
        });
    });

    describe('CustomerDelete', () => {
        it('Should delete a customer', async () => {
            const deletedCustomer = {id: 'cus_test', deleted: true};
            // @ts-ignore
            stripeMock.customers.del.mockResolvedValue(deletedCustomer);
            const result = await service.customer.delete('cus_test');
            expect(result.id).toBe('cus_test');
            expect(stripeMock.customers.del).toHaveBeenCalledWith('cus_test');
        });

        it('should throw an error when the customer id is not provided', async () => {
            await expect(service.customer.delete('')).rejects.toThrow(BadRequestException);
        });
    });

    describe('CustomerSearch', () => {
        it('should search for customers', async () => {
            const searchResult = {
                'object': 'list',
                'has_more': false,
                data: [createdCustomer]
            };
            // @ts-ignore
            stripeMock.customers.search.mockResolvedValue(searchResult);
            const result = await service.customer.search({name: customerName});
            const queryStr = convertObjectToString({name: customerName});
            expect(result.data[0].name).toBe(customerName);
            expect(stripeMock.customers.search).toHaveBeenCalledWith({query: queryStr});
        });
    });
});
