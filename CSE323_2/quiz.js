// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
$( document ).ready(function() {
  var country_capital_pairs = pairs;
});
var rand = Math.floor(Math.random() * pairs.length);
var country = document.getElementById('quiz-question').innerText = pairs[rand].country;
var capital = pairs[rand].capital;
var capital_ans,table, row,c1,c2,c3;

function reset_text(){
  rand = Math.floor(Math.random() * pairs.length);
  country = document.getElementById('quiz-question').innerHTML = pairs[rand].country;
  capital = pairs[rand].capital;
  document.getElementById('quiz-answer').value = '';
}
function ifchecked(){
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
  document.getElementById('table').deleteRow(row.rowIndex);
}
function update(){
  capital_ans = document.getElementById('quiz-answer').value;
  table = document.getElementById('table');
  row = table.insertRow(3);
  c1 = row.insertCell(0);
  c2 = row.insertCell(1);
  c3 = row.insertCell(2);
  if(capital_ans === capital){
    row.className = 'correct';
    c1.innerText = country;
    c2.innerText = capital_ans;
    c3.innerHTML = "<div><tr><i class=\"fas fa-check\"></i><button class = 'del' onclick = 'del(this.parentNode.parentNode.parentNode)'>Delete</button</tr></div>";
    ifchecked();
    reset_text();
  }
  else{
    row.className = 'incorrect';
    c1.innerText = country;
    c2.innerHTML = "<del>" +capital_ans+"</del>";
    c3.innerHTML = "<div><tr>" + capital + "<button class = 'del' onclick='del(this.parentNode.parentNode.parentNode)'>Delete</button></tr></div>";
    ifchecked();
    reset_text();
  }
  document.getElementById('quiz-answer').focus();
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


