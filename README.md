# Bracket Generator prototype
This repo is a sketch for an Angular component that generates [tournament bracket trees](https://en.wikipedia.org/wiki/Bracket_(tournament)), given a number of participants. The way the seeds are placed is inspired by the bracket trees on [Challonge.com](http://challonge.com/tournament/bracket_generator)

Essentially, binary tree traversal algorithms are used to determine the progression of matches, and how to configure team numbers that require [byes](https://en.wikipedia.org/wiki/Bye_(sports)).

The generator can easily be used for a single-elimination tournament bracket, and can be eaily extended to build a double-elimination system (winners' and losers' brackets with finals at the end, like the ones on Challonge).

# Dev Environment Setup
* nvm is recommended (optional—look it up, otherwise don't worry about it)
* Make sure you're running a later version of Node (4.2.6 or later definitely works)
* Install the necessary tools globally if you haven't yet
  * `npm install -g yo gulp bower`
  * `npm install -g generator-gulp-angular`
  * Check out this repository and load the Node and Bower packages once:
  * `npm install & bower install`
* Once the above has been done _once_, Just use `gulp` for workflow tasks:
  * run `gulp serve` to run the development server which compiles Js, Sass and the Jade templates on the fly, using BrowserSync to reload _all_ of your browsers on the fly
  * run `gulp build` to build all the assets in `dist`, optimized for production environments

# TODO
* Consider matchup pairings against byes
* Renumber match sequences to not count those not played because of byes
* Visual representation of next match (current markup provides a good starting point)
