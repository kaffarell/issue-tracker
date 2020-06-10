const { ipcRenderer } = require('electron');

function closeAddWindow() {
    ipcRenderer.send('addWindow', 'close');
}

function sendData() {
    // class is-invalid
    // id orderHelp and nameHelp remove display:none
    let inputName = document.getElementById('inputName');
    let inputOrder = document.getElementById('inputOrder');
    let inputNameCheck = false;
    let inputOrderCheck = false;

    // Reset Helper Text and valid and invalid flags
    inputName.classList.remove('is-invalid');
    inputName.classList.remove('is-valid');
    document.getElementById('nameHelp').setAttribute('string', 'display: none;');
    inputOrder.classList.remove('is-invalid');
    inputOrder.classList.remove('is-valid');
    document.getElementById('orderHelp').setAttribute('string', 'display: none;');



    if(inputName.value === ''){
        inputName.classList.add('is-invalid');
        document.getElementById('nameHelp').removeAttribute('style');
        inputNameCheck = false;
    }else{
        inputName.classList.add('is-valid');
        inputNameCheck = true;
    }

    if(inputOrder.value === ''){
        inputOrder.classList.add('is-invalid');
        document.getElementById('orderHelp').removeAttribute('style');
        inputOrderCheck = false;
    }else{
        inputName.classList.add('is-valid');
        inputOrderCheck = true;
    }

    if(inputNameCheck && inputOrderCheck){
        ipcRenderer.send('addWindowInfo', `${inputName.value}:${inputOrder.value}`);
        closeAddWindow();
    }
}