import { ConfigService } from './config.service';
import { NestjsCashierModuleOptions } from '../interfaces/config-options.interface';

describe('ConfigService', () => {
    let service: ConfigService;
    const options: NestjsCashierModuleOptions = { secret: 'sk_secret' };

    beforeEach(() => {
        service = new ConfigService(options);
    });

    it('should return the stripe Secret key', () => {
        expect(service.secret).toBe('sk_secret');
    });
});
