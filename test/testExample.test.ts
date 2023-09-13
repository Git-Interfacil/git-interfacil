const { sum, multiply } = require('../testExample')

describe('testExample', () => {
    it('sum should work correctly', () => {
        expect(sum(1, 2)).toBe(3)
    })
    it('sum should work correctly', () => {
        expect(multiply(2, 4)).toBe(8)
    })
})