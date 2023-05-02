import {DateUtil} from '../dist/utils/date.js'
import {describe, it, expect} from 'vitest'

describe('Test the Date util formatDate method', ()=>{
    it('should return the correct date string',()=>{
        const dateObject = new Date('2023-05-02')
        const dateString = '2023-05-02'
        expect(DateUtil.formatDate(dateObject)).toBe(dateString)
    })
    
})