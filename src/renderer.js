const dropzone = document.getElementById("dropzone");
const buttonEnviar = document.getElementById("buttonEnviar");
const inputDir = document.getElementById("inputDir");

window.electronAPI.onAlertError((value) => {
    alert(value);
  })

window.electronAPI.onAlertSuccess((value) => {
    //all process end ok, clean html.
    alert("Success");
})

window.electronAPI.resultFilePath((isTar) => {
    if (isTar){
        dropzone.parentElement.classList.remove("border-info");
        dropzone.parentElement.classList.add("border-success");
    }
    else{
        dropzone.parentElement.classList.remove("border-info");
        dropzone.parentElement.classList.add("border-danger");
        alert("El archivo no es .tar");
    }
})  

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    //guardo el path del archivo que se hizo drop
    let filePath = e.dataTransfer.files[0].path;
    console.log('RENDERER: File Path of dragged files: ', filePath);
    
    window.electronAPI.sendFilePath(filePath);
});
 
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
 
  dropzone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('RENDERER: File is in the Drop Space');
    dropzone.parentElement.classList.remove("border-danger");
    dropzone.parentElement.classList.remove("border-success");
    dropzone.parentElement.classList.add("border-info");
});
 
dropzone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('RENDERER: File has left the Drop Space');
    dropzone.parentElement.classList.remove("border-info");
});

buttonEnviar.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(inputDir.value);
    window.electronAPI.checkDir(inputDir.value);
});