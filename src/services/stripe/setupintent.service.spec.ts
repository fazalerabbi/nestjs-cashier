import { Test, TestingModule } from '@nestjs/testing';
import Stripe from 'stripe';
import { StripeService } from '../stripe.service';
import { TestModuleMetaData } from './constants';

jest.mock('stripe', () => {
    const mockStripe = {
        setupIntents: {
            create: jest.fn(),
            update: jest.fn(),
            retrieve: jest.fn(),
            list: jest.fn(),
            cancel: jest.fn(),
            confirm: jest.fn(),
        },
    };
    return {
        __esModule: true,
        default: jest.fn(() => mockStripe),
    };
});
describe('SetupIntent', () => {
    let service: StripeService;
    let stripeMock: jest.Mocked<Stripe>;

    const intentDescription = 'Test Intent';
    const setupIntentOption = {customer: 'cus_test', description: intentDescription} ;
    const createdSetupIntent = { id: 'seti_test', ...setupIntentOption };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule(TestModuleMetaData).compile();

        service = module.get<StripeService>(StripeService);
        stripeMock = new (Stripe as any)() as jest.Mocked<Stripe>;
    });

    describe('SetupIntentCreate', () => {
        it('should create a SetupIntent', async () => {
            // @ts-ignore
            stripeMock.setupIntents.create.mockResolvedValue(createdSetupIntent);

            const result = await service.setupIntent.create(setupIntentOption as Stripe.SetupIntentCreateParams);
            expect(result.id).toEqual('seti_test');

            expect(result).toEqual(createdSetupIntent);
            expect(stripeMock.setupIntents.create).toHaveBeenCalledWith({ description: intentDescription, ...setupIntentOption });
        });
    });

    describe('SetupIntentUpdate', () => {
        it('should update a SetupIntent', async () => {
            // @ts-ignore
            stripeMock.setupIntents.update.mockResolvedValue(createdSetupIntent);

            const result = await service.setupIntent.update('seti_test', setupIntentOption as Stripe.SetupIntentUpdateParams);
            expect(result.id).toEqual('seti_test');

            expect(result).toEqual(createdSetupIntent);
            expect(stripeMock.setupIntents.update).toHaveBeenCalledWith('seti_test', setupIntentOption);
        });

        it('should throw an error when the SetupIntent ID is not provided', async () => {
            await expect(service.setupIntent.update('', setupIntentOption as Stripe.SetupIntentUpdateParams)).rejects.toThrow('Setup intent ID is required');
        });
    });


    describe('SetupIntentRetrieve', () => {
        it('should retrieve a SetupIntent', async () => {
            // @ts-ignore
            stripeMock.setupIntents.retrieve.mockResolvedValue(createdSetupIntent);

            const result = await service.setupIntent.retrieve('seti_test');
            expect(result.id).toEqual('seti_test');

            expect(result).toEqual(createdSetupIntent);
            expect(stripeMock.setupIntents.retrieve).toHaveBeenCalledWith('seti_test');
        });

        it('should throw an error when the SetupIntent ID is not provided', async () => {
            await expect(service.setupIntent.retrieve('')).rejects.toThrow('Setup intent ID is required');
        });
    });

    describe('SetupIntentListAll', () => {
        it('should list all SetupIntents', async () => {
            const setupIntentList = { data: [createdSetupIntent] } as Stripe.ApiList<Stripe.SetupIntent>;
            // @ts-ignore
            stripeMock.setupIntents.list.mockResolvedValue(setupIntentList);

            const result = await service.setupIntent.list({} as Stripe.SetupIntentListParams);
            expect(result.data.length).toEqual(1);

            expect(result).toEqual(setupIntentList);
            expect(stripeMock.setupIntents.list).toHaveBeenCalledWith({});
        });
    });

    describe('SetupIntentCancel', () => {
        const canceledSetupIntentOption = { cancellation_reason: 'abandoned'};
        it('should cancel a SetupIntent', async () => {
            // @ts-ignore
            stripeMock.setupIntents.cancel.mockResolvedValue(createdSetupIntent);

            const result = await service.setupIntent.cancel('seti_test', canceledSetupIntentOption as Stripe.SetupIntentCancelParams);
            expect(result.id).toEqual('seti_test');

            expect(result).toEqual(createdSetupIntent);
            expect(stripeMock.setupIntents.cancel).toHaveBeenCalledWith('seti_test', canceledSetupIntentOption);
        });

        it('should throw an error when the SetupIntent ID is not provided', async () => {
            await expect(service.setupIntent.cancel('', canceledSetupIntentOption as Stripe.SetupIntentCancelParams)).rejects.toThrow('Setup intent ID is required');
        });
    });

    describe('SetupIntentConfirm', () => {
        const confirmSetupIntentOption = { payment_method: 'pm_test'};
        it('should confirm a SetupIntent', async () => {
            // @ts-ignore
            stripeMock.setupIntents.confirm.mockResolvedValue(createdSetupIntent);

            const result = await service.setupIntent.confirm('seti_test', confirmSetupIntentOption as Stripe.SetupIntentConfirmParams);
            expect(result.id).toEqual('seti_test');

            expect(result).toEqual(createdSetupIntent);
            expect(stripeMock.setupIntents.confirm).toHaveBeenCalledWith('seti_test', confirmSetupIntentOption);
        });

        it('should throw an error when the SetupIntent ID is not provided', async () => {
            await expect(service.setupIntent.confirm('', confirmSetupIntentOption as Stripe.SetupIntentConfirmParams)).rejects.toThrow('Setup intent ID is required');
        });
    });

    describe('SetupIntentVerifyMicroDeposits', () => {
        const verifyMicroDepositsOption = { amounts:  [32, 45]};
        it('should verify micro deposits for a SetupIntent', async () => {
            // @ts-ignore
            stripeMock.setupIntents.confirm.mockResolvedValue(createdSetupIntent);

            const result = await service.setupIntent.confirm('seti_test', verifyMicroDepositsOption as Stripe.SetupIntentVerifyMicrodepositsParams);
            expect(result.id).toEqual('seti_test');

            expect(result).toEqual(createdSetupIntent);
            expect(stripeMock.setupIntents.confirm).toHaveBeenCalledWith('seti_test', verifyMicroDepositsOption);
        });

        it('should throw an error when the SetupIntent ID is not provided', async () => {
            await expect(service.setupIntent.confirm('', verifyMicroDepositsOption as Stripe.SetupIntentVerifyMicrodepositsParams)).rejects.toThrow('Setup intent ID is required');
        });
    });
});