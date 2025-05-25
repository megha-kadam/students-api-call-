const cl = console.log;

const stdForm = document.getElementById('stdForm');
const fNameControl = document.getElementById('fName');
const lNameControl = document.getElementById('lName');
const emailControl = document.getElementById('email');
const weightControl = document.getElementById('weight');
const heightControl = document.getElementById('height');
//const genderControl = document.querySelector('input[name="gender"]:checked');
//const requireTrainerControl = document.querySelector('input[name="requireTrainer"].checked')
const requirePackageControl = document.getElementById('requirePackage');
const impControl = document.getElementById('imp');
const entryDateControl = document.getElementById('entryDate');
const register = document.getElementById('register');
const reset = document.getElementById('reset');
const stdContainer = document.getElementById('stdContainer');
const addStdBtn = document.getElementById('addStdBtn');
const updateStdBtn = document.getElementById('updateStdBtn');
const loader = document.getElementById('loader');


const baseURL = `https://students-api-call-default-rtdb.firebaseio.com`;
const stdURL = `${baseURL}/students.json`;

const snackBar = (msg, icon) => {
    swal.fire({
        title : msg,
        icon : icon,
        timer : 3000
    })
}

const apiCall = async (url, methodName, msgBody) => {
    try{
        msgBody = msgBody ? JSON.stringify(msgBody) : null;

        loader.classList.remove('d-none');

        let res = await fetch(url, {
            method : methodName,
            body : msgBody, 
            headers : {
                Authorization : 'Token',
                'Content-Type' : 'application.json'
            }
        })
        return res.json();
    }
    catch(err){
        snackBar('Something went wrong!!', 'error')
    }
    finally{
        loader.classList.add('d-none')
    }
}

const createCards = (arr) => {
    let result = '';
    arr.forEach((std, i) => {
        result += `<tr id='${std.id}'>
                        <td>${i + 1}</td> 
                        <td>${std.fName}</td>
                        <td>${std.lName}</td>
                        <td>${std.email}</td>
                        <td>${std.weight}</td>
                        <td>${std.height}</td>
                        <td>${std.gender}</td>
                        <td>${std.requirePackage}</td>
                        <td>${std.imp}</td>
                        <td>${std.entryDate}</td>
                        <td>
                            <button class="btn btn-md btn-outline-info" onclick='onEditStd(this)'>Edit</button>
                        </td>
                        <td>
                            <button class="btn btn-md btn-outline-danger" onclick='onRemoveStd(this)'>Remove</button>
                        </td>
                    </tr>`
    });
    stdContainer.innerHTML = result;
}

//<td>${std.gender}</td>
//<td>${std.requireTrainer}</td>

const objToArr = (obj) => {
    let arr = [];
    for (const key in obj) {
      arr.push({...obj[key], id : key})
    }
    return arr
}

let stdArr = [];

const fetchData = async () => {
    let res = await apiCall(stdURL, 'GET')
    cl(res);
 stdArr = objToArr(res);
    createCards(stdArr);
}
fetchData();


const onAddStd = async (eve) => {
    eve.preventDefault();

    const genderControl = document.querySelectorAll('input[name="gender"]:checked');
    // const requireTrainerControl = document.querySelectorAll('input[name="requireTrainer"].checked')

    let stdObj = {
        fName : fNameControl.value,
        lName : lNameControl.value,
        email :emailControl.value,
        weight : weightControl.value,
        height : heightControl.value,
        gender : genderControl ? genderControl.value : '',
        // requireTrainer : requireTrainerControl ? requireTrainerControl.value : '',
        requirePackage : requirePackageControl.value,
        imp : impControl.value,
        entryDate : entryDateControl.value,
    }
    cl(stdObj);
    eve.target.reset();

    let res = await apiCall(stdURL, 'POST', stdObj)
    let tr = document.createElement('tr');

    tr.id = res.name;

    tr.innerHTML = `    <td>${stdArr.length}</td>
                        <td>${stdObj.fName}</td>
                        <td>${stdObj.lName}</td>
                        <td>${stdObj.email}</td>
                        <td>${stdObj.weight}</td>
                        <td>${stdObj.height}</td>
                        <td>${stdObj.gender}</td>
                        <td>${stdObj.requirePackage}</td>
                        <td>${stdObj.imp}</td>
                        <td>${stdObj.entryDate}</td>
                        <td>
                            <button class="btn btn-md btn-outline-info" onclick='onEditStd(this)'>Edit</button>
                        </td>
                        <td>
                            <button class="btn btn-md btn-outline-danger" onclick='onRemoveStd(this)'>Remove</button>
                        </td>
                       `;
    
    stdContainer.append(tr);

    snackBar(`New student created successfully with id ${tr.id}!!`, 'success');
}


const onEditStd = async (ele) => {
    window.scrollTo({
        top : 0,
        behavior : 'smooth'
    })

    let editId = ele.closest('tr').id;
    cl(editId);
    localStorage.setItem('editId', editId);

    let editURL = `${baseURL}/students/${editId}.json`;

    let res = await apiCall(editURL, 'GET')
    fNameControl.value = res.fName;
    lNameControl.value = res.lName;
    emailControl.value = res.email;
    weightControl.value = res.weight;
    heightControl.value = res.height;
    
    document.querySelectorAll('input[name="gender"]').forEach(input => {
        input.checked = (input.value === res.gender)
    });

    //  document.querySelectorAll('input[name="requireTrainer"]').forEach(input => {
    //     input.checked = (input.value === res.requireTrainer);
    // });
    
    requirePackageControl.value = res.requirePackage;
    impControl.value = res.imp;
    entryDateControl.value = res.entryDate;

    addStdBtn.classList.add('d-none');
    updateStdBtn.classList.remove('d-none');
}

const onUpdateStd = async () => {
     const genderControl = document.querySelectorAll('input[name="gender"]:checked');
    const requireTrainerControl = document.querySelectorAll('input[name="requireTrainer"].checked')

    let updateId = localStorage.getItem('editId');
    let updateObj = {
        fName : fNameControl.value,
        lName : lNameControl.value,
        email :emailControl.value,
        weight : weightControl.value,
        height : heightControl.value,
        gender : genderControl ? genderControl.value : '',
        // requireTrainer : requireTrainerControl ? requireTrainerControl.value : '',
        requirePackage : requirePackageControl.value,
        imp : impControl.value,
        entryDate : entryDateControl.value,
    }
    cl(updateObj);
    stdForm.reset();

    let updateURL = `${baseURL}/students/${updateId}.json`;

    let res = await apiCall(updateURL, 'PATCH', updateObj)
    addStdBtn.classList.remove('d-none');
    updateStdBtn.classList.add('d-none');

    let tr = [...document.getElementById(updateId).children];
    tr[1].innerHTML = res.fName;
    tr[2].innerHTML = res.lName;
    tr[3].innerHTML = res.email;
    tr[4].innerHTML = res.weight;
    tr[5].innerHTML = res.height;
    tr[6].innerHTML = document.querySelectorAll('input[name:"gender"].checkes').forEach(input => {
        input.checked = (input.value === res.gender)
    })
    // tr[7].innerHTML = document.querySelectorAll('input[name="requireTrainer"].checked').forEach(input => {
    //     input.checked = (input.value === res.requireTrainer)
    // })
    tr[8].innerHTML = res.requirePackage;
    tr[9].innerHTML = res.imp;
    tr[10].innerHTML = res.entryDate;

    let updateStd = document.getElementById(updateId);
    updateStd.scrollTo({
        behavior : 'smooth'
    })

    snackBar(`Student with id ${updateId} updated successfully!!`, 'success');
}


const onRemoveStd = async (ele) => {
   let result = await Swal.fire({
        title: "Do you want to Remove the changes?",
        showCancelButton: true,
        confirmButtonText: "Remove",
    });
    if(result.isConfirmed){
         let removeId = ele.closest('tr').id;
        let removeURL = `${baseURL}/students/${removeId}.json`;

        let res = await apiCall(removeURL, 'DELETE')
        ele.closest('tr').remove();

        snackBar(`Student with id ${removeId} removed sucdessfully!!`, 'success')
    }
}


stdForm.addEventListener('submit', onAddStd);
updateStdBtn.addEventListener('click', onUpdateStd)