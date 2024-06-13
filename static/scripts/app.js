/**
 * The Interactive Playlist Maker - Javascript
 * for Application of Principles of Programming Assignment
 * @author Leo Hammond-Montana
 */
console.log("hello from external app.js");

//Initialise Playlist
document.addEventListener("DOMContentLoaded", function(){
    console.log("calling getPlaylist")
    getPlaylist();
});

//Event handlers
//  Playlist Entries Section
document.getElementById("songEntries").addEventListener('click', populateEntry);
document.getElementById("btnUploadPlaylist").addEventListener('click', uploadPlaylist);
//  Song Selected Section
document.getElementById("btnDeleteSong").addEventListener('click', deleteSong);
document.getElementById("btnEditSong").addEventListener('click', editSong);
document.getElementById("btnDeselectSong").addEventListener('click', deselect);
//  Add Song Section
document.getElementById("btnAddSong").addEventListener('click', addEntry);

/**
 * getUniqueKey()
 *
 * identify the current last song in the playlist
 * and return the next proceding id (also acting as song position)
 */
function getUniqueKey(){
  songEntries
  let songList = document.getElementById('songEntries');
  return Number(songList.lastElementChild.id) + 1;
};


/**
 * getPlaylist() - Get list of songs
 *
 * Retrieves the JSON file of songs,
 * Format the retrieved JSON into a single string with appropriate html tags,
 * Set the content of the "songEntries" element to the formatted string.
 */
function getPlaylist(){
  console.log("getting songs");
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let playlistResult = JSON.parse(this.responseText);
      let songList = "";
      for (let item of playlistResult.songs) {
        let id = playlistResult.songs.indexOf(item) + 1;
        songList = songList + "<li date='" + String(item.date) +  "' name='" + 		String(item.name) +  "' artist='" + 		String(item.artist) +  "' songURL='" + 		String(item.songURL) + "' note='" + String(item.note) + "' id='" + id + "' class=\"w3-ripple\">" + id + ") " + String(item.name) + " - " + String(item.artist) +"</li>";}
      document.getElementById("songEntries").innerHTML = songList;
    }
    else {
      console.log("xhttp request problem occurred")
    }
  }
  xhttp.open("GET", "../../data/playlist.json", true);
  xhttp.send();
}

/**
 * deselect()
 *
 * Calls clearEntry() and deselectAllSongs() as to
 * completely deselect any previously selected songs.
 */
function deselect(){
  clearEntry();
  deselectAllSongs();
}

/**
 * clearEntry()
 *
 * Clear the selected entry inputs.
 *
 */
function clearEntry(){
  document.getElementById("idSelected").value = "";
  document.getElementById("dateAddedSelected").value = "";
  document.getElementById("nameSelected").value = "";
  document.getElementById("artistSelected").value = "";
  document.getElementById("URLSelected").value = "";
  document.getElementById("noteSelected").value = ""; 
}

/**
 * deselectAllSongs()
 *
 * Remove the highlight from the 
 * songEntries list after deselecting a song.
 */
function deselectAllSongs(){
  console.log("deselect song");
	let songList = document.getElementById("songEntries").getElementsByTagName("li")
	for (let i = 0; i < songList.length ; i++){
    let itemClass = songList[i].getAttribute("class");
    itemClass = itemClass.replace(" w3-dark-gray", "");
    document.getElementById(i+1).setAttribute("class", itemClass);
	}
}

/**
 * populateEntry(item)
 *
 * Get the data for a single song entry from item parameter,
 * Extract the individual pieces of data from the song entry,
 * and put each piece of information into the text fields on the html page.
 * @param item
 */
function populateEntry(e){
  console.log("populate selected");
  deselect();//clear old entry and remove highlight from song
  let itemClass = e.target.getAttribute("class");//add highlight to currently selected
  itemClass += " w3-dark-gray";
  e.target.setAttribute("class", itemClass);
  //Retrieve Song data and return to 'Song Selected Section'
  let itemIndex = e.target.id;
  let itemDate = e.target.getAttribute("date");
  let itemName = e.target.getAttribute("name");
  let itemArtist = e.target.getAttribute("artist");
  let itemURL = e.target.getAttribute("songURL");
  let itemNote = e.target.getAttribute("note");
  document.getElementById("idSelected").value = itemIndex;
  document.getElementById("dateAddedSelected").value = itemDate;
  document.getElementById("nameSelected").value = itemName;
  document.getElementById("artistSelected").value = itemArtist;
  document.getElementById("URLSelected").value = itemURL;
  document.getElementById("noteSelected").value = itemNote; 
}

/**
 * addEntry() - add a song entry
 *
 * create a new node list item element
 * create a new text node element for the new list item and attach it to the new list item
 * set other values of the list item - date, id, name, artist, songURL, note and class
 * append the new node to the list 'songEntries'
 */
function addEntry(){
  console.log("Add entry")
  let uid = getUniqueKey();
  const dat = new Date();
  let newDate = dat.getDate() + "/" + (Number(dat.getMonth())+1) + "/" + dat.getFullYear();
  let newName = document.getElementById("nameAdd").value;
  let newArtist = document.getElementById("artistAdd").value;
  let newURL = document.getElementById("URLAdd").value;
  let newNote = document.getElementById("txtAdd").value;
  if(newName == "" || newArtist == "" || newURL == ""){
    alert("Please enter values in the Name, Artist and Song-Link inputs.");
  } else {
    let newEntry = document.createElement('li');
    newEntry.id = uid;
    newEntry.setAttribute("date", newDate);
    newEntry.setAttribute("name", newName);
    newEntry.setAttribute("artist", newArtist);
    newEntry.setAttribute("songURL", newURL);
    newEntry.setAttribute("note", newNote);
    newEntry.setAttribute("class", "w3-ripple");
    newEntry.innerText = uid + ") " + newName + " - " + newArtist;
    document.getElementById("songEntries").appendChild(newEntry);
    alert("Song added to clientside list. Upload to save the list.");
  }
}

/**
 * deleteSong()
 *
 * delete a song from the html page
 */
function deleteSong(){
  console.log("delete song");
  let idToDelete = document.getElementById("idSelected").value; 
  if(idToDelete != ""){
    document.getElementById(idToDelete).remove();
    deselect();//remove deleted details from selected entry boxes and remove highlight from song
    alert("Song deleted on clientside. Upload to save changes.")
  } else {
    alert("Please select a Song to delete.")
  }
}

/**
 * uploadPlaylist()
 *
 * get the data from the list 'songEntries' on the html page
 * put the songs from the list into a collection
 * convert the collection into a JSON object
 * send JSON object to the url in the flask api
 * and handle the response
 */
function uploadPlaylist(){
  console.log("Upload playlist");
  //retrieve data from the list 'songEntries'
	let uploadList = document.getElementById("songEntries");
	var songList = uploadList.getElementsByTagName("li")
  
	// make object to convert to JSON
	let uploadObject = {};
	uploadObject.songs = [];
  
  //list items and put into an array of objects
	for (let i = 0; i < songList.length ; i++){
		let objEntry = {}
		objEntry.date = songList[i].getAttribute("date");
		objEntry.name = songList[i].getAttribute("name");
		objEntry.artist = songList[i].getAttribute("artist");
		objEntry.songURL = songList[i].getAttribute("songURL");
		objEntry.note = songList[i].getAttribute("note");
		uploadObject.songs.push(objEntry);
	}
	//convert object to JSON and PUT to api
	let xhttp = new XMLHttpRequest();
	let url = "../../data/playlist.json"
	xhttp.onreadystatechange = function() {
		let strResponse = "Error: no response";
		if (this.readyState == 4 && this.status == 200) {
			strResponse = JSON.parse(this.responseText);
			alert(strResponse.message)
		}
	};
	xhttp.open("PUT", url, true);
	var data = JSON.stringify(uploadObject)
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(data);
}

/**
 * editSong() - modifies a song entry
 *
 * Uses the DOM to fetch values from the 'Selected Song Section'
 * And uses these to modify the values of the list item - name, artist, songURL, and note
 */
function editSong(){
  console.log("Edit Song");
	let songID = document.getElementById("idSelected").value;//find the id of the song in need to modifying
  //retrieve new values for the song entry
  let songEntry = document.getElementById(songID);
  let editName = document.getElementById("nameSelected").value;
  let editArtist = document.getElementById("artistSelected").value;
  let editURL = document.getElementById("URLSelected").value;
  let editNote = document.getElementById("noteSelected").value;
  //replace the old values for the song entry with the new values provided
  if(editName == "" || editArtist == "" || editURL == ""){
    alert("Please enter values in the Name, Artist and Song-Link inputs.");
  } else {
    songEntry.setAttribute("name", editName);
    songEntry.setAttribute("artist", editArtist);
    songEntry.setAttribute("songURL", editURL);
    songEntry.setAttribute("note", editNote);
    songEntry.innerText = songID + ") " + editName + " - " + editArtist;
    alert("Song changes made. Upload to save the list.");
  }
}