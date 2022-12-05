/* eslint-disable indent */
'use strict';

class Party {

  constructor(ctx, partyId) {

    this.partyId = partyId;
    this.count = 0;
    this.type = 'party';
    
    if (this.__isContract) {
      console.log('delete')
      delete this.__isContract;
    }
    return this;
  }
}
module.exports = Party;