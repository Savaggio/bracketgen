import _ from "lodash";

export class MainController {
  constructor ($log) {
    'ngInject';

    this.$log = $log;

    this.knownBrackets = [2, 4, 8, 16, 32, 64, 128, 256, 512];
    this.exampleTeams = _.shuffle(["New Jersey Devils", "New York Islanders", "New York Rangers", "Philadelphia Flyers", "Pittsburgh Penguins", "Boston Bruins", "Buffalo Sabres", "Montreal Canadiens", "Ottawa Senators", "Toronto Maple Leafs", "Carolina Hurricanes", "Florida Panthers", "Tampa Bay Lightning", "Washington Capitals", "Winnipeg Jets", "Chicago Blackhawks", "Columbus Blue Jackets", "Detroit Red Wings", "Nashville Predators", "St. Louis Blues", "Calgary Flames", "Colorado Avalanche", "Edmonton Oilers", "Minnesota Wild", "Vancouver Canucks", "Anaheim Ducks", "Dallas Stars", "Los Angeles Kings", "Phoenix Coyotes", "San Jose Sharks", "Montreal Wanderers", "Quebec Nordiques", "Hartford Whalers"]); // because a bracket needs some teams!

    this.seedslist = this.seedslist || '';

    this.bracketSizing = 'range';
    this.size = 14;

    this.onSizeChange();
  }

  setBracket() {
    /*eslint-disable */
    let base = this.getBaseSize();
    let numMatches = this.getSize() - 1;

    let rounds = this.getRoundsAndMatchesTree(numMatches);

    let seeds = _.map(_.times(base), (n) => _.get(this.seeds, n));
    seeds = _.map(seeds, (el, idx) => el && {name: el, rank: idx+1});

    // let rz = base; // Round seats depth (e.g. 1st:32 seats, 2nd:16, 3rd:8, etc.)
    // let mn = 1;    // Match number
    // for(let r=0; r<rounds.length; r++) {
      // let rmz = rz/2; // Round match depth

      // for(let i=1; i<=rmz; i++) {
        // let match = {
          // seq: mn,
          // teams: [],
          // round: r+1,
          // bye: !this.hasOpponent(seeds, i, rz)
        // };

        // if(match.round === 1 && match.bye === false) {
          // let seedIdx = seeds.indexOf(this.getSeedWithRank(seeds, i));
          // match.teams.push(seeds.splice(seedIdx, 1)[0]);

          // let opponentIdx = seeds.indexOf(this.getOpponentWithRank(seeds, i, rz));
          // match.teams.push(seeds.splice(opponentIdx, 1)[0]);
        // }
        // else if (match.round > 1) {
          // let seedIdx = seeds.indexOf(this.getSeedWithRank(seeds, i));
          // match.teams.push(seeds.splice(seedIdx, 1)[0]);

          // let opponentIdx = seeds.indexOf(this.getOpponentWithRank(seeds, i, rz));
          // match.teams.push(seeds.splice(opponentIdx, 1)[0]);
        // }

        // if(match.teams.length > 0) {
          // rounds[r].push(match);
          // mn++;
        // }
      // }

      // rz /= 2;
    // }

    this.bracket = rounds;

    /*eslint-enable */
  }

  getRoundsAndMatchesTree(numMatches) {
    numMatches = _.isUndefined(numMatches) ? this.getSize() - 1 : numMatches;

    let matchDepth = 1; // (i.e. # of matches in the current round)
    let matchSeq = numMatches;
    let matchesAdded = 0;

    let rounds = _.times(this.numRounds(numMatches), () => []);

    // Iterate through rounds backwards to do binary tree traversal
    for(let ri = rounds.length - 1; ri >= 0; ri--) {
      let matchesLeft = numMatches - matchesAdded;
      let matchesInRound = Math.min(matchesLeft, matchDepth);

      // Counting backwards, so technically the first to be added in the round
      // is the one with the highest sequence values, so this means first in
      // terms of lowest value
      let firstInThisRound = (matchSeq - matchDepth) + 1;
      let firstInNextRound = firstInThisRound + matchDepth;

      _.times(matchesInRound, () => {
        let nextMatchOffset = Math.floor((matchSeq - firstInThisRound) / 2);
        let nextMatch = firstInNextRound + nextMatchOffset;

        rounds[ri].unshift({
          seq: matchSeq,
          next: nextMatch > numMatches ? null : nextMatch,
          round: ri+1,
          teams: []
        });

        matchSeq--;
      })

      matchesAdded += matchesInRound;

      matchDepth *= 2;
    }

    return rounds;
  }

  /*eslint-disable */
  firstMatchInLargestEmptyFinals(rounds, roundIdx, matchIdx) {


  }

  getEmptyLevel(bracket, match) {
    let emptyLevel = 0;
    let matches = [];
    let allEmpty = true;
    let parent;

    while(allEmpty) {
      parent = this.getLaterMatch(bracket, match, emptyLevel+1);

      try{
        _.union(matches, this.getMatchesBefore(bracket, parent.seq));
        allEmpty = _.every(matches, (m) => _.isEmpty(m.teams));
      }
      catch (e) {
        allEmpty = false;
      }

      if(allEmpty) {
        emptyLevel++;
      }
    }

    return emptyLevel;
  }

  getLaterMatch(bracket, currentMatch, depth = 1) {
    let parent = currentMatch;
    let nextRoundIdx = currentMatch.round;

    for(let i=0; i<depth; i++) {
      parent = _.find(bracket[nextRoundIdx+i], (m) => m.seq === parent.next);
    }

    return parent;
  }

  getMatchesBefore(bracket, seq) {
    let matches = [];

    for(let ri=0; ri<bracket.length; ri++) {
      for(let mi=0; mi<bracket[ri].length; mi++) {
        if(bracket[ri][mi].next === seq) {
          matches.push(bracket[ri][mi]);
        }
      }
    }

    return matches;
  }
  /*eslint-enable */

  updateSeeds() {
    let list;

    if(this.bracketSizing === 'list') {
      list = this.seedslist.split('\n');

      if(list.length < 4) {
        list = _.map(_.times(4), (n) => `Team ${n+1}`);
        this.seedslist = list.join('\n');
      }

      this.size = list.length;
    }
    else if (this.bracketSizing === 'range') {
      this.size = parseInt(_.get(this, 'size', 4));
      list = _.map(_.times(this.size), (n) => `Team ${n+1}`);
    }

    this.seeds = list;

    return list;
  }

  hasOpponent(seeds, rank, depth) {
    let p1 = this.getSeedWithRank(seeds, rank);
    let p2 = this.getSeedWithRank(seeds, (depth - (rank-1)));

    return !_.isUndefined(p1) && !_.isUndefined(p2);
  }

  getSeedWithRank(seeds, rank) {
    return _.find(seeds, (s) => _.get(s, 'rank') === rank);
  }

  getOpponentWithRank(seeds, rank, depth) {
    return this.getSeedWithRank(seeds, (depth - (rank-1)));
  }

  onSizeChange() {
    this.updateSeeds();
    this.setBracket();
  }

  fontSize() {
    return Math.max(2, (16 / this.size)) + 'vw';
  }

  getSize() {
    if(typeof this.size === 'undefined') {
      this.updateSeeds();
    }

    return this.size;
  }

  getBaseSize() {
    let size = this.getSize();

    let baseSize = _.find(this.knownBrackets, (k) => k >= size);

    return baseSize;
  }

  numByes() {
    return this.getBaseSize() - this.getSize();
  }

  numRounds(base = this.getBaseSize()) {
    'ngInject';

    let rounds = 1;
    let teams = 0;
    let matches = 0;

    let nextRounds = 1;

    while(matches < base) {
      rounds = nextRounds;
      matches = (teams += Math.pow(2, nextRounds++)) / 2;
    }

    return rounds;
  }
}
