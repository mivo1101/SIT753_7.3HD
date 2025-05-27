const createDB = require('../createDB');

jest.mock('../createDB', () => ({
    getAllSubscriptions: jest.fn(),
    addSubscription: jest.fn(),
    addFeedback: jest.fn(),
    addContact: jest.fn(),
}));

module.exports = createDB;