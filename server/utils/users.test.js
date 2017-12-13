const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [
            {
                id: '1',
                name: 'Jim',
                room: 'Conservatory'
            },
            {
                id: '2',
                name: 'Ben',
                room: 'Study'
            },
            {
                id: '3',
                name: 'Sue',
                room: 'Conservatory'
            }
        ]; 
    });

    it('should add a new user', () => {
        const users = new Users();
        const user = {
            id: '123',
            name: 'Jim',
            room: 'Headbangers'
        };

        const result = users.addUser(user.id, user.name, user.room)

        expect(users.users).toEqual([user]);
    }); // end it()

    it('should remove a user', () => {
        const uID = '2';
        const user = users.removeUser('2');
        expect(user.id).toBe(uID);
        expect(users.users.length).toBe(2);
    });

    it('should not remove a user', () => {
        const uID = '99';
        const user = users.removeUser(uID);
        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });
    
    it('should find user', () => {
        const uID = '1';
        const user = users.getUser(uID);
        expect(user.id).toBe(uID);
    });

    it('should not find user', () => {
        const uID = '19'
        const user = users.getUser(uID);
        expect(user).toBe(undefined);
    });
           
    it('should return names of users in the Conservatory', () => {
        const userList = users.getUserList('Conservatory');

        expect(userList).toEqual(['Jim', 'Sue']);
    }); // end it()

    it('should return names of users in the Study', () => {
        const userList = users.getUserList('Study');

        expect(userList).toEqual(['Ben']);
    }); // end it()

}); // end describe()

