const { ipcRenderer } = require('electron');
var { allIssues, addIssue, removeIssue, editIssue} = require('./model');

// Make the Kanban-Board lists sortable (enable drag and drop)
sortable('.sortable-list', {
    acceptFrom: '.sortable-list1, .sortable-list2',
    forcePlaceholderSize: true,
    placeholderClass: 'ph-class fade',
    hoverClass: 'bg-maroon yellow'
});

sortable('.sortable-list1', {
    acceptFrom: '.sortable-list, .sortable-list2',
    forcePlaceholderSize: true,
    placeholderClass: 'ph-class fade',
    hoverClass: 'bg-maroon yellow'
});

sortable('.sortable-list2', {
    acceptFrom: '.sortable-list, .sortable-list1',
    forcePlaceholderSize: true,
    placeholderClass: 'ph-class fade',
    hoverClass: 'bg-maroon yellow'
});


sortable('.sortable-list')[0].addEventListener('sortstop', function(e) {
	let id = e.detail.item.id;
	for(let i = 0; i < allIssues.length; i++){
		if(allIssues[i].id === id){
			allIssues[i].colon = 0;
		}
	}

});

sortable('.sortable-list1')[0].addEventListener('sortstop', function(e) {
	let id = e.detail.item.id;
	for(let i = 0; i < allIssues.length; i++){
		if(allIssues[i].id === id){
			allIssues[i].colon = 1;
		}
	}

});

sortable('.sortable-list2')[0].addEventListener('sortstop', function(e) {
	let id = e.detail.item.id;
	for(let i = 0; i < allIssues.length; i++){
		if(allIssues[i].id === id){
			allIssues[i].colon = 2;
		}
	}

});

function refreshDOMIssues(){
	for(let i = 0; i < allIssues.length; i++){
		// Overwrite the DOM elements data with the data from the array 
		$('#' + allIssues[i].id + ' h3').text(allIssues[i].title);
		$('#' + allIssues[i].id + ' p').text(allIssues[i].description);
	}
}


function openModal(element){
    // Open modal
    $("#modal").modal();
    let li = element.parentNode;
    let title = $('#' + li.id + ' h3').text();
    let description = $('#' + li.id + ' p').text();
    $('.modal-title').text(title);
    $('.modal-body p').text(description);
	
    // Make paragraph a input box on click
    $('body').on('click', '[data-editable]', function(){
  
        var $el = $(this);
                    
        var $input = $('<input/>').val( $el.text() );
        $el.replaceWith( $input );
        
        var save = function(){
          var $p = $('<h5 class="modal-title" data-editable />').text( $input.val() );
          $input.replaceWith( $p );
        };
        $input.one('blur', save).focus();
        
    });
	

    // Make paragraph a input box on click
    $('body').on('click', '[data-editable1]', function(){
  
        var $el = $(this);
                    
        var $input = $('<input/>').val( $el.text() );
        $el.replaceWith( $input );
        
        var save = function(){
          var $p = $('<p data-editable1 />').text( $input.val() );
          $input.replaceWith( $p );
        };
        $input.one('blur', save).focus();
        
    });


    $('#save-edit').off().click('click', () => {
		
        // Save modal text to issue
		// Wait until DOM is ready 
		$(document).ready( () => {
        	let title = document.getElementsByClassName('modal-title')[0].innerText; 
        	let description = $('.modal-body p').text();
			editIssue(li.id, title, description);
			refreshDOMIssues();
        	// Click cancel to exit modal
        	$('#cancel-edit').trigger('click');
		});
    });
}


function createAddWindow() {
    ipcRenderer.send('addWindow', 'create');
}


function removeSelectedElements() {
    // Remove all selected Elements
    // Go trough all lists
    let kanbanCharts = ['mainList', 'mainList1', 'mainList2'];
    for(let a = 0; a < kanbanCharts.length; a++){
        let ul = document.getElementById(kanbanCharts[a]);
        // List with html-objects of checkboxes
        let listCheckboxesCache = ul.getElementsByTagName('input');
        // List with ids of checkboxes
        let listCheckboxes = [];
        for(let i = 0; i < listCheckboxesCache.length; i++){
            listCheckboxes.push(listCheckboxesCache[i].id);
        }

        for(let i = 0; i < listCheckboxes.length; i++){
            // If Element is selected remove
           
            if(document.getElementById(listCheckboxes[i]).checked === true){
                // Move back to main li with parentNode
                document.getElementById(listCheckboxes[i]).parentNode.parentNode.parentNode.removeChild(document.getElementById(listCheckboxes[i]).parentNode.parentNode);
            }
        }
    }
    
}

function addToList(title, description){
    // Create this element:
    /*
    <li>
        <h3>Name</h3>
        <p>Pizza, etc</p>
        <div class="custom-control custom-checkbox">
            <!--change name of id(Checkbox) and for(label) for individual boxes-->
            <input type="checkbox" class="custom-control-input" id="defaultUnchecked">
            <label class="custom-control-label" for="defaultUnchecked">Select</label>
        </div>
    </li>
    */

    let id = addIssue(title, description, 0);

    let ul = document.getElementById('mainList');
    let li = document.createElement('li');
    li.setAttribute('id', id)
    let h3 = document.createElement('h3');
    h3.setAttribute('onclick', 'openModal(this)')
    h3.innerText = title;
    let p = document.createElement('p');
    p.innerText = description;
    let div = document.createElement('div');
    div.classList.add('custom-control');
    div.classList.add('custom-checkbox');
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.classList.add('custom-control-input');
    input.id = `defaultUnchecked${id}`;
    let label = document.createElement('label');
    label.classList.add('custom-control-label');
    label.setAttribute('for', `defaultUnchecked${id}`);
    label.innerText = 'Select';

    ul.appendChild(li);
    li.appendChild(h3);
    li.appendChild(p);
    li.appendChild(div);
    div.appendChild(input);
    div.appendChild(label);

    // Make newly added Element sortable
    sortable('.sortable-list', {
        forcePlaceholderSize: true,
        placeholderClass: 'ph-class fade',
        hoverClass: 'bg-maroon yellow'
    });

}


ipcRenderer.on("addWindowInfoMain", (event, args) => {
    // Get Title and Description out of string
    args = args.split(":", 2);
    let title = args[0];
    let description = args[1];
    addToList(title, description);
});
