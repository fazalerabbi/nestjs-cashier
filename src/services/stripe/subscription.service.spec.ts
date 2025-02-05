import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';

import { StripeService } from '../stripe.service';
import { CurrencyEnum } from '../../enums';
import { TestModuleMetaData } from './constants';
import {convertObjectToString} from '../../utils';

jest.mock('stripe', () => {
    const mockStripe = {
        subscriptions: {
            create: jest.fn(),
            update: jest.fn(),
            retrieve: jest.fn(),
            list: jest.fn(),
            cancel: jest.fn(),
            resume: jest.fn(),
            search: jest.fn(),
        },
    };
    return {
        __esModule: true,
        default: jest.fn(() => mockStripe),
    };
});

describe('Subscription', () => {
    let service: StripeService;
    let stripeMock: jest.Mocked<Stripe>;

    const subscriptionId = 'sub_test';
    const customerId = 'cus_test';
    const subscriptionOptions = { description: 'Subscription description', currency: CurrencyEnum.USD };
    const createdSubscription = { id: subscriptionId, description: 'Subscription description', currency: CurrencyEnum.USD, customer: customerId };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule(TestModuleMetaData).compile();

        service = module.get<StripeService>(StripeService);
        stripeMock = new (Stripe as any)() as jest.Mocked<Stripe>;
    });

    describe('SubscriptionCreate', () => {
        it('should create a subscription', async () => {
            // @ts-ignore
            stripeMock.subscriptions.create.mockResolvedValue({ id: subscriptionId, ...subscriptionOptions });

            const result = await service.subscription.create(customerId, subscriptionOptions as Stripe.SubscriptionCreateParams);
            expect(result.id).toBe('sub_test');
            expect(stripeMock.subscriptions.create).toHaveBeenCalledWith({customer: customerId, ...subscriptionOptions});
        });

        it('should throw an error if the customer Id is not provided', async () => {
            // @ts-ignore
            await expect(service.subscription.create('', subscriptionOptions as Stripe.SubscriptionCreateParams)).rejects.toThrow(BadRequestException);
        });
    });

    describe('SubscriptionUpdate', () => {
        it('should update a subscription', async () => {
            // @ts-ignore
            stripeMock.subscriptions.update.mockResolvedValue({ id: subscriptionId, ...subscriptionOptions });

            const result = await service.subscription.update(subscriptionId, subscriptionOptions as Stripe.SubscriptionUpdateParams);
            expect(result.id).toBe('sub_test');
            expect(stripeMock.subscriptions.update).toHaveBeenCalledWith(subscriptionId, subscriptionOptions);
        });

        it('should throw an error if the subscription Id is not provided', async () => {
            // @ts-ignore
            await expect(service.subscription.update('', {} as Stripe.SubscriptionUpdateParams)).rejects.toThrow(BadRequestException);
        });
    });

    describe('SubscriptionRetrieve', () => {
        it('should retrieve a subscription', async () => {
            // @ts-ignore
            stripeMock.subscriptions.retrieve.mockResolvedValue({ id: subscriptionId, ...subscriptionOptions });

            const result = await service.subscription.retrieve(subscriptionId);
            expect(result.id).toBe('sub_test');
            expect(stripeMock.subscriptions.retrieve).toHaveBeenCalledWith(subscriptionId);
        });

        it('should throw an error if the subscription Id is not provided', async () => {
            // @ts-ignore
            await expect(service.subscription.retrieve('')).rejects.toThrow(BadRequestException);
        });
    });

    describe('SubscriptionList', () => {
        it('should list subscriptions', async () => {
            // @ts-ignore
            stripeMock.subscriptions.list.mockResolvedValue({ data: [createdSubscription] });

            const result = await service.subscription.list({} as Stripe.SubscriptionListParams);
            expect(result.data).toEqual([createdSubscription]);
            expect(stripeMock.subscriptions.list).toHaveBeenCalledWith({} as Stripe.SubscriptionListParams);
        });
    });

    describe('SubscriptionCancel', () => {
        it('should cancel a subscription', async () => {
            // @ts-ignore
            stripeMock.subscriptions.cancel.mockResolvedValue({ id: subscriptionId, ...subscriptionOptions });

            const result = await service.subscription.cancel(subscriptionId);
            expect(result.id).toBe('sub_test');
            expect(stripeMock.subscriptions.cancel).toHaveBeenCalledWith(subscriptionId, {} as Stripe.SubscriptionCancelParams);
        });

        it('should throw an error if the subscription Id is not provided', async () => {
            // @ts-ignore
            await expect(service.subscription.cancel('')).rejects.toThrow(BadRequestException);
        });
    });

    describe('SubscriptionResume', () => {
        it('should resume a subscription', async () => {
            // @ts-ignore
            stripeMock.subscriptions.resume.mockResolvedValue({ id: subscriptionId, ...subscriptionOptions });

            const result = await service.subscription.resume(subscriptionId);
            expect(result.id).toBe('sub_test');
            expect(stripeMock.subscriptions.resume).toHaveBeenCalledWith(subscriptionId, {} as Stripe.SubscriptionResumeParams);
        });

        it('should throw an error if the subscription Id is not provided', async () => {
            // @ts-ignore
            await expect(service.subscription.resume('')).rejects.toThrow(BadRequestException);
        });
    });

    describe('SubscriptionSearch', () => {
        const query = {status: 'active'};
        it('should search for subscriptions', async () => {
            // @ts-ignore
            stripeMock.subscriptions.search.mockResolvedValue({ data: [createdSubscription] });
            const queryStr = convertObjectToString(query);

            const result = await service.subscription.search(query, {});
            expect(result.data).toEqual([createdSubscription]);
            expect(stripeMock.subscriptions.search).toHaveBeenCalledWith({query: queryStr});
        });
    });

});