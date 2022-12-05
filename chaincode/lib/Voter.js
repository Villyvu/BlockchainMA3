'use strict';

class Voter {

  constructor(voterId, firstName) {

    if (this.validateVoter(voterId)) {

      this.voterId = voterId;
      this.firstName = firstName;
      this.voted = false;
      this.type = 'voter';
      this.vote = '';
      if (this.__isContract) {
        delete this.__isContract;
      }
      if (this.name) {
        delete this.name;
      }
      return this;

    } else if (!this.validateVoter(voterId)){
      throw new Error('the voterId is not valid.');
    } else {
      throw new Error('the registrarId is not valid.');
    }

  }

  async validateVoter(voterId) {
    //VoterId error checking here, i.e. check if valid drivers License, or state ID
    if (voterId) {
      return true;
    } else {
      return false;
    }
  }


}
module.exports = Voter;