const { ipcRenderer } = require('electron');

// Counter for the cards, so that we can have unique index for checkboxes
// trough all lists
// Is now set at the number of initial example cards
var amountCards = 9;

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


function openModal(element){
    // Open modal
    $("#modal").modal();
    // Make paragraph a input box on click
    $('body').on('click', '[data-editable]', function(){
  
        var $el = $(this);
                    
        var $input = $('<input/>').val( $el.text() );
        $el.replaceWith( $input );
        
        var save = function(){
          var $p = $('<p data-editable />').text( $input.val() );
          $input.replaceWith( $p );
        };
        $input.one('blur', save).focus();
        
    });
    let li = element.parentNode;
    let title = $('#' + li.id + ' h3').text();
    let description = $('#' + li.id + ' p').text();
    $('.modal-title').text(title);
    $('.modal-body p').text(description);
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
    let ul = document.getElementById('mainList');
    let li = document.createElement('li');
    li.setAttribute('id', `issue${amountCards}`)
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
    input.id = `defaultUnchecked${amountCards}`;
    let label = document.createElement('label');
    label.classList.add('custom-control-label');
    label.setAttribute('for', `defaultUnchecked${amountCards}`);
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

    amountCards++;
}


ipcRenderer.on("addWindowInfoMain", (event, args) => {
    // Get Title and Description out of string
    args = args.split(":", 2);
    let title = args[0];
    let description = args[1];
    addToList(title, description);
});
