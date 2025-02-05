import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';

import { StripeService } from '../stripe.service';
import { convertObjectToString } from '../../utils';
import { TestModuleMetaData } from './constants';

jest.mock('stripe', () => {
    const mockStripe = {
        products: {
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
describe('Product', () => {
    let service: StripeService;
    let stripeMock: jest.Mocked<Stripe>;

    const productName = 'Test Product';
    const productOptions = { description: 'A test product' } as Stripe.ProductCreateParams;
    const createdProduct = { id: 'prod_test', name: productName, ...productOptions };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule(TestModuleMetaData).compile();

        service = module.get<StripeService>(StripeService);
        stripeMock = new (Stripe as any)() as jest.Mocked<Stripe>;
    });

    describe('ProductCreate', () => {
        it('should create a Product', async () => {
            // @ts-ignore
            stripeMock.products.create.mockResolvedValue(createdProduct);

            const result = await service.product.create(productName, productOptions);
            expect(result.id).toEqual('prod_test');

            expect(result).toEqual(createdProduct);
            expect(stripeMock.products.create).toHaveBeenCalledWith({ name: productName, ...productOptions });
        });

        it('should throw an error when the name parameter is not provided', async () => {
            await expect(service.product.create('', {} as Stripe.ProductCreateParams)).rejects.toThrow('Product name is required');
        });

        it('should throw an error when the options parameter is not an object', async () => {
            await expect(service.product.create('Test Product', 'invalid options' as any)).rejects.toThrow('Options must be an object');
        });
    });

    describe('ProductUpdate', () => {
        it('should update a product', async () => {
            const updatedProduct = { id: 'prod_test', name: 'Test Product updated', ...productOptions };

            // @ts-ignore
            stripeMock.products.update.mockResolvedValue(updatedProduct);

            const result = await service.product.update('prod_test', productOptions);
            expect(result.id).toEqual('prod_test');
            expect(result).toEqual(updatedProduct);
            expect(stripeMock.products.update).toHaveBeenCalledWith('prod_test', productOptions);
        });

        it('should throw an error when the productId parameter is not provided', async () => {
            // @ts-ignore
            stripeMock.products.update.mockRejectedValue(new BadRequestException());
            await expect(service.product.update('', {})).rejects.toThrow(BadRequestException);
        });

        it('should throw an error when the options parameter is not an object', async () => {
            // @ts-ignore
            stripeMock.products.update.mockRejectedValue(new BadRequestException());
            await expect(service.product.update('prod_test', '' as any)).rejects.toThrow(BadRequestException);
        });
    });

    describe('ProductRetrieve', () => {
        it('should retrieve a product', async () => {
            // @ts-ignore
            stripeMock.products.retrieve.mockResolvedValue(createdProduct);

            const result = await service.product.retrieve('prod_test');
            expect(result.id).toEqual('prod_test');
            expect(result).toEqual(createdProduct);
            expect(stripeMock.products.retrieve).toHaveBeenCalledWith('prod_test');
        });

        it('should throw an error when the productId parameter is not provided', async () => {
            // @ts-ignore
            stripeMock.products.retrieve.mockRejectedValue(new BadRequestException());
            await expect(service.product.retrieve('')).rejects.toThrow(BadRequestException);
        });
    });

    describe('ProductList', () => {
        it('should list products', async () => {
            const productList = {
                data: [createdProduct],
                has_more: false,
                object: 'list',
            };

            // @ts-ignore
            stripeMock.products.list.mockReturnValue(productList);

            const result = await service.product.list({});
            expect(result).toEqual(productList);
            expect(stripeMock.products.list).toHaveBeenCalledWith({});
        });
    });

    describe('ProductDelete', () => {
        it('should delete a product', async () => {
            const deletedProduct = { id: 'prod_test', deleted: true };

            // @ts-ignore
            stripeMock.products.del.mockResolvedValue(deletedProduct);

            const result = await service.product.delete('prod_test');
            expect(result).toEqual(deletedProduct);
            expect(stripeMock.products.del).toHaveBeenCalledWith('prod_test');
        });

        it('should throw an error when the productId parameter is not provided', async () => {
            // @ts-ignore
            stripeMock.products.del.mockRejectedValue(new BadRequestException());
            await expect(service.product.delete('')).rejects.toThrow(BadRequestException);
        });
    });

    describe('ProductSearch', () => {
        it('should search for products', async () => {
            const query = { "name": "Test Product", "metadata": {"order_id": "6735"}};
            const queryStr = convertObjectToString(query);
            const searchResult = {
                data: [createdProduct],
                has_more: false,
                object: 'search_result',
            };

            // @ts-ignore
            stripeMock.products.search.mockReturnValue(searchResult);

            const result = service.product.search({...query});
            expect(result).toEqual(searchResult);
            expect(stripeMock.products.search).toHaveBeenCalledWith({query: queryStr});
        });

        it('should throw an error when the query parameter is not provided', async () => {
            // @ts-ignore
            stripeMock.products.search.mockRejectedValue(new BadRequestException());
            await expect(service.product.search({})).rejects.toThrow(BadRequestException);
        });
    });
});
