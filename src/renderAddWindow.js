const { ipcRenderer } = require('electron');

function closeAddWindow() {
    ipcRenderer.send('addWindow', 'close');
}

function sendData() {
    // class is-invalid
    // id descriptionHelp and titleHelp remove display:none
    let inputTitle = document.getElementById('inputTitle');
    let inputDescription = document.getElementById('inputDescription');
    let inputTitleCheck = false;
    let inputDescriptionCheck = false;

    // Reset Helper Text and valid and invalid flags
    inputTitle.classList.remove('is-invalid');
    inputTitle.classList.remove('is-valid');
    document.getElementById('titleHelp').setAttribute('string', 'display: none;');
    inputDescription.classList.remove('is-invalid');
    inputDescription.classList.remove('is-valid');
    document.getElementById('descriptionHelp').setAttribute('string', 'display: none;');


    // Check if boxes are empty
    if(inputTitle.value === ''){
        inputTitle.classList.add('is-invalid');
        document.getElementById('titleHelp').removeAttribute('style');
        inputTitleCheck = false;
    }else{
        inputTitle.classList.add('is-valid');
        inputTitleCheck = true;
    }

    if(inputDescription.value === ''){
        inputDescription.classList.add('is-invalid');
        document.getElementById('descriptionHelp').removeAttribute('style');
        inputDescriptionCheck = false;
    }else{
        inputDescription.classList.add('is-valid');
        inputDescriptionCheck = true;
    }

    if(inputTitleCheck && inputDescriptionCheck){
        ipcRenderer.send('addWindowInfo', `${inputTitle.value}:${inputDescription.value}`);
        closeAddWindow();
    }
}