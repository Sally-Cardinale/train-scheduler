//Initialize Firebase
  var config = {
    apiKey: "AIzaSyCHDUiVEquFL56RDqEmtTcelPykioaLh9k",
    authDomain: "train-scheduler-5a0fe.firebaseapp.com",
    databaseURL: "https://train-scheduler-5a0fe.firebaseio.com",
    projectId: "train-scheduler-5a0fe",
    storageBucket: "train-scheduler-5a0fe.appspot.com",
    messagingSenderId: "297453349139"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  
  //Button for adding Trains
  $("#submit-btn").on("click", function(event) {
    event.preventDefault();
  
    //Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTime = moment($("#first-time-input").val().trim(), "HH:mm").format("HH:mm");
    var frequency = $("#frequency-input").val().trim();
  
    //Creates local "temporary" object for holding new train data
    var newTrain = {
      name: trainName,
      destination: destination,
      firstTime: firstTime,
      frequency: frequency,
    };
  
    // Uploads new train data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTime);
    console.log(newTrain.frequency);
    alert("New train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-time-input").val("");
    $("#frequency-input").val("");
  });
  
  //Create Firebase event for adding new train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    //on interval function to refresh every 15 minutes (on value)
  
    //Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTime = childSnapshot.val().firstTime;
    var frequency = childSnapshot.val().frequency;
    var nextArrival = childSnapshot.val().nextArrival;
    var minutesAway = childSnapshot.val().minutesAway;

    //Train info 
    console.log(trainName);
    console.log(destination);
    console.log(firstTime);
    console.log(frequency);
 
    //First time with one year subtracted to make sure it comes before the current time.
	var firstTimeConverted = moment(firstTime, "HH:mm A").subtract(1, "years");
	console.log(firstTimeConverted);

	//Current time
	var currentTime = moment();
	console.log("CURRENT TIME:" + currentTime);

	//Difference between times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	console.log("DIFFERENCE IN TIME: " + diffTime);

	//Time apart (remainder)
	var tRemainder = diffTime % frequency;
	console.log(tRemainder);

	// Mins until train arrives
	var minutesAway = frequency - tRemainder;
	console.log("MINUTES TILL TRAIN: " + minutesAway);

	// Next train arrival time using standard 12 hour time (i.e. 10:30 PM) to improve user experience.
	var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");
	console.log("ARRIVAL TIME: " + nextArrival);

    // Create the new row
    var newRow = $("<tr scope='row'>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minutesAway)
    );
  
    // Append the new row to the table
    $("#train-scheduler-table > tbody").append(newRow);
  });
  
