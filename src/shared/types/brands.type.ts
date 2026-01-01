export type ObjectId = string & { __brand: 'ObjectId' }
export type Email = string & { __brand: 'Email' }
export type ShortId = string & { __brand: 'ShortId' & { length: 6 } }
