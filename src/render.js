const { ipcRenderer } = require('electron');

sortable('.sortable-list', {
    forcePlaceholderSize: true,
    placeholderClass: 'ph-class fade',
    hoverClass: 'bg-maroon yellow'
});

function createAddWindow() {
    ipcRenderer.send('addWindow', 'create');
}

function clearFirst() {
    // Remove first element
    let ul = document.getElementById('mainList');
    let firstElem = ul.getElementsByTagName('li')[0];
    firstElem.parentNode.removeChild(firstElem);
}

function removeSelectedElements() {
    // Remove all selected Elements
    let ul = document.getElementById('mainList');
    let listCheckboxes = ul.getElementsByTagName('input');
    for(let i = 0; i < listCheckboxes.length+1; i++){
        // If Element is selected remove
        if(listCheckboxes[i].checked === true){
            // Move back to main li with parentNode
            listCheckboxes[i].parentNode.parentNode.parentNode.removeChild(listCheckboxes[i].parentNode.parentNode);
        }
    }
}

function addToList(name, order){
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
    let h3 = document.createElement('h3');
    h3.innerText = name;
    let p = document.createElement('p');
    p.innerText = order;
    let div = document.createElement('div');
    div.classList.add('custom-control');
    div.classList.add('custom-checkbox');
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.classList.add('custom-control-input');
    input.id = `defaultUnchecked${ul.getElementsByTagName("li").length + 1}`;
    let label = document.createElement('label');
    label.classList.add('custom-control-label');
    label.setAttribute('for', `defaultUnchecked${ul.getElementsByTagName("li").length + 1}`);
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
    // Get Name and Order out of string
    args = args.split(":", 2);
    let name = args[0];
    let order = args[1];
    addToList(name, order);
});
