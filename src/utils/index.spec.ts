import {convertObjectToString} from "./index";

describe('Util', () => {
    it('should convert a flat object with primitive values to a string', () => {
        const input = { a: 1, b: 'test', c: true };
        const result = convertObjectToString(input);
        expect(result).toBe("a:'1' AND b:'test' AND c:'true'");
    });
});