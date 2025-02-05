import Stripe from "stripe";
import {Test, TestingModule} from "@nestjs/testing";
import {StripeService} from "../stripe.service";
import {TestModuleMetaData} from "./constants";

jest.mock('stripe', () => {
    const mockStripe = {
        accountLinks: {
            create: jest.fn(),
        },
    };
    return {
        __esModule: true,
        default: jest.fn(() => mockStripe),
    };
});

describe('AccountLink', () => {
    let service: StripeService;
    let stripeMock: jest.Mocked<Stripe>;

    const accountId = 'acct_test';
    const accountLinkOptions = { account: accountId, refresh_url: 'https://example.com', return_url: 'https://example.com' };
    const createdAccountLink = { url: 'https://connect.stripe.com/setup/c/'+accountId };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule(TestModuleMetaData).compile();

        service = module.get<StripeService>(StripeService);
        stripeMock = new (Stripe as any)() as jest.Mocked<Stripe>;
    });

    describe('AccountLinkCreate', () => {
        it('should create an AccountLink', async () => {
            // @ts-ignore
            stripeMock.accountLinks.create.mockResolvedValue(createdAccountLink);

            const result = await service.accountLink.create(accountId, accountLinkOptions as Stripe.AccountLinkCreateParams);

            expect(result).toEqual(createdAccountLink);
            expect(stripeMock.accountLinks.create).toHaveBeenCalledWith(accountLinkOptions);
        });
    });

});