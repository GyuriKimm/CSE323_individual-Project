// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.\
const db = firebase.firestore();
var pairs = [];
var rand;
var country;
var capital;
function csv_To_Array(str, delimiter = ",") {
  //https://www.delftstack.com/ko/howto/javascript/csv-to-array-in-javascript/
  const header_cols = str.slice(0, str.indexOf("\n") - 1).split(delimiter);
  const row_data = str.trim().slice(str.indexOf("\n") + 1).split("\r\n");

  const arr = row_data.map(function (row) {
    const values = row.split(delimiter);
    const el = header_cols.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
}
fetch('https://development-korea-seoul.s3.ap-northeast-2.amazonaws.com/country_capital_pairs.csv').then(response => response.text()).then(data => {
      //https://www.daleseo.com/js-window-fetch/
      window.pairs = csv_To_Array(data.trim());
      rand = Math.floor(Math.random() * pairs.length);
      country = document.getElementById("quiz-question").innerText = pairs[rand].country;
      capital = pairs[rand].capital;
    });

db.collection("quiz").orderBy("sort", "asc").get().then((quesrySnapshot) => {
  quesrySnapshot.forEach((doc) => {
    data_from_firebase(doc.data(), doc.id);
  })
})

function clear_table() {
  db.collection("quiz").get().then((quesrySnapshot) => {
    quesrySnapshot.forEach((doc)=>{
      db.collection("quiz").doc(doc.id).delete().then(() => {
        console.log("deleted successfully ");
      }).catch((error) =>{
        console.error("Error removing: ", error);
      })
    })
  })
  var correct = document.getElementsByClassName('correct');
  var incorrect = document.getElementsByClassName('incorrect');
    while(incorrect.length > 0){
        incorrect[0].parentNode.removeChild(incorrect[0]);
    }
    while(correct.length > 0){
      correct[0].parentNode.removeChild(correct[0]);
  }
}

function reset_text(){
  rand = Math.floor(Math.random() * pairs.length);
  country = document.getElementById('quiz-question').innerHTML = pairs[rand].country;
  capital = pairs[rand].capital;
  document.getElementById('quiz-answer').value = '';
}

function ifchecked(){
  var capital_ans = document.getElementById("quiz-answer").value;
  if(capital_ans === capital&&document.getElementById('wrong').checked===true){
    document.getElementById('All').checked= true;
    types('All');
  }
  if(capital_ans!==capital&&document.getElementById('correct').checked===true){
    document.getElementById('All').checked=true;
    types('All');
  }
}

function del(row){
  //https://firebase.google.com/docs/firestore/manage-data/delete-data?hl=ko
    db.collection("quiz").doc(row.id).delete().then(() => {
      console.log("deleted successfully ");
    }).catch((error) =>{
      console.error("Error removing: ", error);
    })
  document.getElementById('table').deleteRow(row.rowIndex);
}

function update() {
  var capital_ans = document.getElementById("quiz-answer").value;
  var table, row,c1,c2,c3;
  var ID;
  db.collection("quiz").add({
    capital_ans: capital_ans,
    capital: capital,
    country: country,
    sort: new Date()
  }).then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
    ID = docRef.id;
  }).catch((error) => {
    console.error("Error adding document: ", error);
  });
  table = document.getElementById('table');
  row = table.insertRow(3);
  c1 = row.insertCell(0);
  c2 = row.insertCell(1);
  c3 = row.insertCell(2);
  if (capital_ans === capital) {
    row.className = "correct";
    row.id = ID;
    c1.innerText = country;
    c2.innerText = capital_ans;
    c3.innerHTML = "<div><i class=\"fas fa-check\"></i><button class='delete' onclick='del(this.parentNode.parentNode.parentNode)'>Delete</button</div>";
    ifchecked();
  } else {
    row.className = "incorrect";
    row.id = ID;
    c1.innerText = country;
    c2.innerHTML = "<del>" + capital_ans + "</del>";
    c3.innerHTML = "<div>" + capital + "<button class='delete' onclick='del(this.parentNode.parentNode.parentNode)'>Delete</button></div>";
    ifchecked();
  }
  reset_text();
  document.getElementById("quiz-answer").focus();
}
function types(ID) {
  var correct = document.getElementsByClassName('correct');
  var incorrect = document.getElementsByClassName('incorrect');
  if (ID === 'All') {
    for (let i = 0; i < correct.length; i++) {
      correct.item(i).style.display = '';
    }
    for (let i = 0; i < incorrect.length; i++) {
      incorrect.item(i).style.display = '';
    }
  } else if (ID === 'correct') {
    for (let i = 0; i < correct.length; i++) {
      correct.item(i).style.display = '';
    }
    for (let i = 0; i < incorrect.length; i++) {
      incorrect.item(i).style.display = 'none';
    }
  } else if (ID === 'wrong') {
    for (let i = 0; i < correct.length; i++) {
      correct.item(i).style.display = 'none';
    }
    for (let i = 0; i < incorrect.length; i++) {
      incorrect.item(i).style.display = '';
    }
  }
}
function data_from_firebase(data, ID) {
  var table, row,c1,c2,c3;
  table = document.getElementById('table');
  row = table.insertRow(3);
  c1 = row.insertCell(0);
  c2 = row.insertCell(1);
  c3 = row.insertCell(2);
  if (data.capital_ans === data.capital) {
    row.className = "correct";
    row.id = ID;
    c1.innerText = data.country;
    c2.innerText = data.capital_ans;
    c3.innerHTML = "<div><i class=\"fas fa-check\"></i><button class='delete' onclick='del(this.parentNode.parentNode.parentNode)'>Delete</button</div>";
  } else {
    row.className = "incorrect";
    row.id = ID;
    c1.innerText = data.country;
    c2.innerHTML = "<del>" + data.capital_ans + "</del>";
    c3.innerHTML = "<div>" + data.capital + "<button class='delete' onclick='del(this.parentNode.parentNode.parentNode)'>Delete</button></div>";
  }
}