const expect = require('expect');

const {generateMessage,generateLocationMessage} = require('./message');

describe('#generateMessage', () => {

    it('should generate a correct message object', () => {
        const from = 'jim';
        const text = 'Test message';

        const msg = generateMessage(from, text);

        expect(msg.from).toBe(from);
        expect(msg.text).toBe(text);
        expect(msg.createdAt).toBeA('number');
    }); // end it()
}); // end decribe()

describe('#generateLocationMessage', () => {
    it('should generate correct location object', () => {
        const from = 'ben';
        const lat = 15.65;
        const lon = -1.51

        const msg = generateLocationMessage(from, lat, lon);

        expect(msg.from).toBe(from);
        expect(msg.url).toBe(`https://www.google.com/maps?q=${lat},${lon}`);
        expect(msg.createdAt).toBeA('number');        
    });
})