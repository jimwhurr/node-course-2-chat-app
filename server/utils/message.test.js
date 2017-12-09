const expect = require('expect');

const {generateMessage} = require('./message');

describe('#generateMessage', () => {

    it('should generate a correct message object', () => {
        const from = 'jim';
        const text = 'Test message';

        const msg = generateMessage(from, text);

        expect(msg.from).toBe(from);
        expect(msg.text).toBe(text);
        expect(msg.createdAt).toBeA('number');
    });

});