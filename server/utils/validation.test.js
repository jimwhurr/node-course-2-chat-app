const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        const result = isRealString(123);
        expect(result).toBe(false);        
    }); // end it()

    it('should reject strings that are only spaces', () => {
        const result = isRealString('   ');
        expect(result).toBe(false);                
    }); // end it()

    it('should allow strings with non-space characters', () => {
        const result = isRealString('Jim');
        expect(result).toBe(true);                

    }); // end it()
}); // end describe()
