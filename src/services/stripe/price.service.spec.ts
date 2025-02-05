import Stripe from 'stripe';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { StripeService } from '../stripe.service';
import { convertObjectToString } from '../../utils';
import { CurrencyEnum } from '../../enums';
import { TestModuleMetaData } from './constants';

jest.mock('stripe', () => {
    const mockStripe = {
        prices: {
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
describe('Price', () => {
    let stripeService: StripeService;
    let stripeMock: jest.Mocked<Stripe>;
    const priceOptions = { nickname: 'Price nickname' } as Stripe.PriceCreateParams;
    const priceId = 'price_test';
    const createdPrice = { id: priceId, ...priceOptions };
    const currency = CurrencyEnum.USD;

    beforeEach(async () => {

        const testModule: TestingModule = await Test.createTestingModule(TestModuleMetaData).compile();

        stripeService = testModule.get<StripeService>(StripeService);
        stripeMock = new (Stripe as any)() as jest.Mocked<Stripe>;
    });

    describe('PriceCreate', () => {
        it('should create a price', async () => {
            // @ts-ignore
            stripeMock.prices.create.mockResolvedValue({ ...createdPrice });

            const result = await stripeService.price.create(currency, {...priceOptions});
            expect(result.id).toEqual('price_test');
            expect(stripeMock.prices.create).toHaveBeenCalledWith({currency,...priceOptions});
        });

        it('should throw an error when the currency parameter is not provided', async () => {
            // @ts-ignore
            stripeMock.prices.update.mockRejectedValue(new BadRequestException());
            await expect(stripeService.price.create('abc' as CurrencyEnum, {} as Stripe.PriceCreateParams)).rejects.toThrow(BadRequestException);
        });
    });

    describe('PriceUpdate', () => {
        it('should update a price', async () => {
            // @ts-ignore
            stripeMock.prices.update.mockResolvedValue({ ...createdPrice });

            const result = await stripeService.price.update(priceId, {...priceOptions});
            expect(result.id).toEqual('price_test');
            expect(stripeMock.prices.update).toHaveBeenCalledWith(priceId, {...priceOptions});
        });

        it('should throw an error when the priceId parameter is not provided', async () => {
            // @ts-ignore
            stripeMock.prices.update.mockRejectedValue(new BadRequestException());
            await expect(stripeService.price.update('', {})).rejects.toThrow(BadRequestException);
        });
    });

    describe('PriceRetrieve', () => {
        it('should retrieve a price', async () => {
            // @ts-ignore
            stripeMock.prices.retrieve.mockResolvedValue({ ...createdPrice });

            const result = await stripeService.price.retrieve(priceId);
            expect(result.id).toEqual('price_test');
            expect(stripeMock.prices.retrieve).toHaveBeenCalledWith(priceId);
        });

        it('should throw an error when the priceId parameter is not provided', async () => {
            // @ts-ignore
            stripeMock.prices.retrieve.mockRejectedValue(new BadRequestException());
            await expect(stripeService.price.retrieve('')).rejects.toThrow(BadRequestException);
        });
    });

    describe('PriceList', () => {
        it('should list prices', async () => {
            const priceList = {
                object: 'list',
                has_more: false,
                data: [createdPrice]
            };
            // @ts-ignore
            stripeMock.prices.list.mockReturnValue(priceList);

            const result = await stripeService.price.list();
            expect(result.data[0].id).toEqual('price_test');
            expect(stripeMock.prices.list).toHaveBeenCalledWith({});
        });
    });

    describe('PriceSearch', () => {
        it('should search for prices', async () => {
            const priceList = {
                object: 'list',
                has_more: false,
                data: [createdPrice]
            };
            // @ts-ignore
            stripeMock.prices.search.mockReturnValue(priceList);
            const query = {
                active: true,
                metadata: {
                    order: 'order_1'
                }
            }

            const queryString = convertObjectToString(query);

            const result = await stripeService.price.search(query);
            expect(result.data[0].id).toEqual('price_test');
            expect(stripeMock.prices.search).toHaveBeenCalledWith({query: queryString});
        });
    });
});