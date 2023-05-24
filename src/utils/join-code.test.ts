import { generateJoinCode } from './join-code';

jest.mock('@deps/lib/supabase', () => ({
    from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        // Mock the data returned by the chained methods
        then: jest.fn(callback => callback({ data: [] })),
    })),
}));

describe('Join Code Generation', () => {
    it('generates a 6 character alphanumeric code', () => {
        const joinCode = generateJoinCode();
        expect(joinCode).toHaveLength(6);
        expect(joinCode).toMatch(/^[A-Z0-9]+$/);
    });
});
