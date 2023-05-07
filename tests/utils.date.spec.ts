import {DateUtil} from '../src/js/utils/date'
import {expect, jest, test, describe, it} from '@jest/globals';

describe('Test the Date util formatDate method', () => {
    it('should return the correct date string', () => {
        const dateObject = new Date('2023-05-02')
        const dateString = '2023-05-02'
        expect(DateUtil.formatDate(dateObject)).toEqual(dateString)
    })
})
