var {saveToDB, loadFromDB} = require('./database.js');

// Counter for the cards, so that we can have unique index for checkboxes
// trough all lists
// Is now set at the number of initial example cards
var amountIssues = 0;

class Issue {
    constructor (id="", title, description, colon) {
        this.title = title;
        this.description = description;
        this.colon = colon;
		if(id === ""){
			this.id = 'issue' + amountIssues;
        	amountIssues++;
		}else{
			this.id = id;
		}	
    }
};

var allIssues = [];


function addIssue(title, description, colon) {
    let new_issue = new Issue(title, description, colon);
    allIssues.push(new_issue);
	// Save the issue to the DB
	let temp_array = [];
	temp_array.push(new_issue);
	saveToDB(temp_array);
    return new_issue.id;
}

function editIssue(id, title, description) {
    // Update issue with id with title and description
	for(let i = 0; i < allIssues.length; i++){
		if(allIssues[i].id === id){
			allIssues[i].title = title;
			allIssues[i].description = description;
			return;
		}
	}
}

function removeIssue(id) {
    for(let i = 0; i < allIssues.length; i++){
        if(allIssues[i].id === id) {
            // Remove 1 element at index i
            allIssues.splice(i, 1);
        }
    }
}

module.exports = {allIssues, addIssue, removeIssue, editIssue, Issue};
