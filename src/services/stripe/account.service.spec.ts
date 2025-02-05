import {StripeService} from "../stripe.service";
import Stripe from "stripe";
import {Test, TestingModule} from "@nestjs/testing";
import {TestModuleMetaData} from "./constants";

jest.mock('stripe', () => {
    const mockStripe = {
        accounts: {
            create: jest.fn(),
            update: jest.fn(),
            retrieve: jest.fn(),
        },
    };
    return {
        __esModule: true,
        default: jest.fn(() => mockStripe),
    };
});

describe('Account', () => {
    let service: StripeService;
    let stripeMock: jest.Mocked<Stripe>;

    const accountOptions = { country: 'US', email: 'customer@example.com'};
    const createdAccount = { id: 'acct_test', ...accountOptions };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule(TestModuleMetaData).compile();

        service = module.get<StripeService>(StripeService);
        stripeMock = new (Stripe as any)() as jest.Mocked<Stripe>;
    });

    describe('AccountCreate', () => {
        it('should create an Account', async () => {
            // @ts-ignore
            stripeMock.accounts.create.mockResolvedValue(createdAccount);

            const result = await service.account.create(accountOptions as Stripe.AccountCreateParams);
            expect(result.id).toEqual('acct_test');

            expect(result).toEqual(createdAccount);
            expect(stripeMock.accounts.create).toHaveBeenCalledWith(accountOptions);
        });
    });

    describe('AccountUpdate', () => {
        it('should update an Account', async () => {
            // @ts-ignore
            stripeMock.accounts.update.mockResolvedValue(createdAccount);

            const result = await service.account.update('acct_test', accountOptions as Stripe.AccountUpdateParams);
            expect(result.id).toEqual('acct_test');

            expect(result).toEqual(createdAccount);
            expect(stripeMock.accounts.update).toHaveBeenCalledWith('acct_test', accountOptions);
        });

        it('should throw an error when the account ID is not provided', async () => {
            await expect(service.account.update('', {} as Stripe.AccountUpdateParams)).rejects.toThrow('Account ID is required');
        });
    });

    describe('AccountRetrieve', () => {
        it('should retrieve an Account', async () => {
            // @ts-ignore
            stripeMock.accounts.retrieve.mockResolvedValue(createdAccount);

            const result = await service.account.retrieve('acct_test');
            expect(result.id).toEqual('acct_test');

            expect(result).toEqual(createdAccount);
            expect(stripeMock.accounts.retrieve).toHaveBeenCalledWith('acct_test');
        });

        it('should throw an error when the account ID is not provided', async () => {
            await expect(service.account.retrieve('')).rejects.toThrow('Account ID is required');
        });
    });
});
