# nestjs-cashier

`nestjs-cashier` is a NestJS module designed to integrate with Stripe, providing a seamless way to manage Stripe-related operations within your NestJS application.

## Features

- Easy integration with Stripe
- Manage customers, price, product, subscriptions
- TypeScript support

## Installation

To install the `nestjs-cashier` module, use npm:

```bash
npm install @fazalerabbi/nestjs-cashier
```
## Usage

### Importing the Module

First, import the `NestjsCashierModule` into your NestJS application module:
You can configure the `NestjsCashierModule` by passing options to the `forRootAsync` method. The available options are:
- secret: Your Stripe secret key (required)

```typescript
import { Module } from '@nestjs/common';
import { NestjsCashierModule } from '@fazalerabbi/nestjs-cashier';

@Module({
  imports: [
    NestjsCashierModule.forRootAsync({
        useFactory: async () => ({
          secret: 'sk_test_',
        }),
        inject: [],
      })
  ],
})
export class AppModule {}
```
## Example

Here's an example of how to use the nestjs-cashier module to create a customer and a subscription:
```typescript
import { Injectable } from '@nestjs/common';
import { StripeService } from "@fazalerabbi/nestjs-cashier";

@Injectable()
export class PaymentService {
  constructor(private readonly stripeService: StripeService) {}

  async createCustomer(email: string, name: string) {
    const customer = await this.stripeService.customer.create({
      email,
      name,
    });
    return customer;
  }

  async createSubscription(customerId: string, priceId: string) {
    const subscription = await this.stripeService.subscription.create(customerId, {
      items: [{ price: priceId }],
    });
    return subscription;
  }
}
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.  
## License
This project is licensed under the MIT License.