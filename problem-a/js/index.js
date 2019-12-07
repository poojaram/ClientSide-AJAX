'use strict';

//An example of the response from searching for music on iTunes. Contains a
//`results` property that is an array of objects representing individual songs
const EXAMPLE_SEARCH_RESULTS = {results:[{
    artistName: "Queen",
    trackName: "Bohemian Rhapsody",
    previewUrl: "https://audio-ssl.itunes.apple.com/apple-assets-us-std-000001/Music3/v4/41/cc/ae/41ccae59-697a-414c-43b5-51bd4d88d535/mzaf_3150742134610995145.plus.aac.p.m4a",
    artworkUrl100: "http://is3.mzstatic.com/image/thumb/Music1/v4/94/92/a3/9492a374-e6e3-8e92-0630-a5761070b0f7/source/100x100bb.jpg",
  }, {
    artistName: "David Bowie",
    trackName: "Starman (2012 Remastered Version)",
    previewUrl: "https://audio-ssl.itunes.apple.com/apple-assets-us-std-000001/AudioPreview71/v4/d2/68/ea/d268ea6a-9e8b-fc0b-f519-0e8b59fd9a18/mzaf_6387986799378989474.plus.aac.p.m4a",
    artworkUrl100: "http://is3.mzstatic.com/image/thumb/Music6/v4/ab/4e/d9/ab4ed977-4b96-4791-bcec-e02c94283332/source/100x100bb.jpg",
  }, {
    artistName: "Beyoncé",
    trackName: "Formation",
    previewUrl: "https://audio-ssl.itunes.apple.com/apple-assets-us-std-000001/AudioPreview122/v4/5f/d7/5f/5fd75fd8-d0a5-ccb2-7822-bcaedee070fc/mzaf_3356445145838692600.plus.aac.p.m4a",
    artworkUrl100: "http://is1.mzstatic.com/image/thumb/Music20/v4/23/c1/9e/23c19e53-783f-ae47-7212-03cc9998bd84/source/100x100bb.jpg",
}]};


//For practice, define a function `renderTrack()` that takes as an argument an
//Object representing a SINGLE song track (like an element of the above array) 
//and adds a new DOM element to the `#records` div representing that track. The 
//new DOM element should be an `<img>` with a `src` that is the track's 
//`artworkUrl100` property (the album cover), and both `alt` text and a `title` 
//attributes that include the name of the track.
//
//You may use either the DOM API or jQuery (you will need to load jQuery). 
//Note that the included CSS provides some default styling to `<img>` elements 
//(to make them look like records!)
//
//You can test this function by passing it one of the above array items
//(e.g., `EXAMPLE_SEARCH_RESULTS.results[0]).

function renderTrack(song) {
  $('#records').append('<img src="' + song.artworkUrl100 + '" alt = "' + song.trackName + '" title = "' + song.trackName + '">');
}


//Define a function `renderSearchResults()` that takes in an object with a
//`results` property containing an array of music tracks; the same format as
//the above `EXAMPLE_SEARCH_RESULTS` variable.
//The function should render each item in the argument's `results` array into 
//the DOM by calling the `renderTrack()` function you just defined. Be sure to 
//"clear" the previously displayed results first!
//
//You can test this function by passing it the `EXAMPLE_SEARCH_RESULTS` object.

function renderSearchResults(song) {
  let ol = document.querySelector('#records');
  while (ol.firstChild) {
    ol.removeChild(ol.firstChild);
  }
  if (song.results.length == 0) {
    renderError(new Error("No results found"));
  }
  for (let i = 0; i < song.results.length; i++) {
    ol.append(renderTrack(song.results[i]));
  }
}


//Now it's the time to practice using `fetch()`! First, modify the `index.html`
//file to load the polyfills for _BOTH_ the fetch() function and Promises, so
//that your example will work on Internet Explorer.
//Use version 2.0.4 of the `fetch` polyfill.


//Define a function `fetchTrackList()` that takes in a "search term" string as a
//parameter and uses the `fetch()` function to downloads a list of tracks from 
//the iTunes Search API. You can use the below `URL_TEMPLATE` string for the URL,
//replacing `"{searchTerm}"` with the passed in search term (no {})
//Send the AJAX request, _then_ encode the response as JSON once it is received, 
//and _then_ should call you `renderSearchResults() function and pass it the 
//encoded data.
//
//IMPORTANT: Your `fetchTrackList()` method must also _return_ the Promise
//returned by the end of the `.then()` chain! This is so the method itself will
//be asynchronous, and can be further chained and utilized (e.g., by the tester).
//
//You can test this function by calling the method and passing it the name of 
//your favorite band (you CANNOT test it with the search button yet!)
const URL_TEMPLATE = "https://itunes.apple.com/search?entity=song&limit=25&term={searchTerm}";

function fetchTrackList(item) {
  let url = URL_TEMPLATE.replace("{searchTerm}", item);
  togglerSpinner();
  let promise = fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      renderSearchResults(data);
    })
    .catch(function (err) {
      renderError(err);
    })
    .then(function () {
      togglerSpinner();
    });
  return promise;
}


//Add an event listener to the "search" button so that when it is clicked (and 
//the the form is submitted) your `fetchTrackList()` function is called with the
//user-entered `#searchQuery` value. Use the `preventDefault()` function to keep
//the form from being submitted as usual (and navigating to a different page).

$('button').click(function (event) {
  event.preventDefault();
  fetchTrackList($('#searchQuery').val());
});

//Next, add some error handling to the page. Define a function `renderError()`
//that takes in an "Error object" and displays that object's `message` property
//on the page. Display this by creating a `<p class="alert alert-danger">` and
//placing that alert inside the `#records` element.

function renderError(error) {
  $('#records').append('<p class="alert alert-danger">' + error.message + '</p>');
}


//Add the error handing to your program in two ways:
//(1) Add a `.catch()` callback to the AJAX call in `fetchTrackList()` that
//    will render the error if one occurs in downloading or parsing.
//(2) Modify the above `renderSearchResults()` function so that if the `results`
//    array is empty, you instead call the `renderError()` function and pass
//    it an new Error object: `new Error("No results found")`
//
//You can test this error handling by trying to search with an empty query.


//Finally, add a "loading spinner" as user feedback in case the download takes a
//long time (so the page doesn't seem unresponsive). To do this, define a 
//function `togglerSpinner()` that modifies the existing `.fa-spinner` element 
//so that it is displayed if currently hidden, or hidden if currently displayed.
//Use the `classList.toggle()` method (or `.toggleClass()` with jQuery) to 
//toggle the presence of the `d-none` class.
//
//Modify the `fetchTrackList()` function once again so that you toggle the
//spinner (show it) BEFORE you send the AJAX request, and toggle it back off
//after the ENTIRE request is completed (including after any error catching---
//download the data and `catch()` the error, and `then()` show the spinner.

function togglerSpinner() {
  $('.fa-spinner').toggleClass('d-none');
}


//Optional extra: add the ability to "play" each track listing by clicking
//on it. Modify the `renderTrack()` function to assign a `'click'` listener to
//each track image it creates. When that image is clicked, call the below function
//(passing in the track to play and the `img` to spin)!
//
//(This is provided for you as an example; take some time to read through the
//code logic to understand how this works.

const state = { previewAudio: new Audio() };

//Plays the given track, spinning the given image.
function playTrackPreview(track, img) {
  if(state.previewAudio.src !== track.previewUrl){ //if a new track to play
    document.querySelectorAll('img').forEach(function(element){
      element.classList.remove('fa-spin');
    }); //stop whoever else is spinning

    state.previewAudio.pause(); //pause current
    state.previewAudio = new Audio(track.previewUrl); //create new audio
    state.previewAudio.play(); //play new
    img.classList.add('fa-spin'); //start the spinning
  } 
  else {
    if(state.previewAudio.paused){ 
      state.previewAudio.play();
    } else {
      state.previewAudio.pause();
    }
    img.classList.toggle('fa-spin'); //toggle the spinning
  }
}

//Make functions and variables available to tester. DO NOT MODIFY THIS.
if(typeof module !== 'undefined' && module.exports){
  /* eslint-disable */
  module.exports.EXAMPLE_SEARCH_RESULTS = EXAMPLE_SEARCH_RESULTS;
  if(typeof renderTrack !== 'undefined') 
    module.exports.renderTrack = renderTrack;
  if(typeof renderSearchResults !== 'undefined') 
    module.exports.renderSearchResults = renderSearchResults;
  if(typeof fetchTrackList !== 'undefined') 
    module.exports.fetchTrackList = fetchTrackList;
  if(typeof toggleSpinner !== 'undefined') 
    module.exports.toggleSpinner = toggleSpinner;
  module.exports.playTrackPreview = playTrackPreview;    
}