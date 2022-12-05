'use strict';


const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

let Voter = require('./Voter.js');
let Party = require('./Party.js')

class VotingContract extends Contract {

    async InitLedger(ctx) {
        let voters = [];
        let votableParties = [];

    //create voters
    let voter1 = await new Voter('V1', 'Yusaf');
    let voter2 = await new Voter('V2', 'Tupac');

    //update voters array
    voters.push(voter1);
    voters.push(voter2);

    //add the voters to the world state
    await ctx.stub.putState(voter1.voterId, Buffer.from(JSON.stringify(voter1)));
    await ctx.stub.putState(voter2.voterId, Buffer.from(JSON.stringify(voter2)));

    const parties = ['LA', 'DF', 'V']

    let la = await new Party(ctx, 'LA')
    let df = await new Party(ctx, 'DF')
    let v = await new Party(ctx, 'V')
    
    votableParties.push(la)
    votableParties.push(df)
    votableParties.push(v)


    for (let i = 0; i < votableParties.length; i++) {
        
        await ctx.stub.putState(votableParties[i].partyId, Buffer.from(JSON.stringify(votableParties[i])))
        
    }

    return [voters, votableParties]

    }

    async createVoter(ctx, args) {

        args = JSON.parse(args);
    
        let newVoter = await new Voter(args.voterId, args.firstName);
    
        await ctx.stub.putState(newVoter.voterId, Buffer.from(JSON.stringify(newVoter)));
    
        let response = `voter with voterId ${newVoter.voterId} is updated in the world state`;
        return response;
      }

      async applyVote(ctx, args) {

        args = JSON.parse(args);

        let partyId = args.picked;
        //create a new voter
        let voterAsBytes = await ctx.stub.getState(args.voterId);
        let voter = await JSON.parse(voterAsBytes);
    
        if(voter.voted) {
            throw new Error('This voter has already voted!')
        }

        let partyBytes = await ctx.stub.getState(partyId);
        let votedParty = await JSON.parse(partyBytes);
    
        await votedParty.count++;

        voter.voted = true;
        voter.vote = partyId
        
        let result = await ctx.stub.putState(partyId, Buffer.from(JSON.stringify(votedParty)));
        console.log(result);
    
        //update state to say that this voter has voted, and who they picked
        let response = await ctx.stub.putState(voter.voterId, Buffer.from(JSON.stringify(voter)));
        console.log(response);
        
        return [voter]
      
    }


    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}

module.exports = VotingContract;


