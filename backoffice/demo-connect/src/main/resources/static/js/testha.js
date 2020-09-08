const interval = 10000 ;
const offset = 5000;
let counter = 0;
var runningApp;
var runningRead;
var runningWrite;
var runningQuery;

var context_url="/connect";
var url_sufix="tasks";
var url=context_url+'/simulator/'+url_sufix;
var doc_prefix = 'task:test:test_'

async function emulateRead() {
    let item_id = doc_prefix+Math.floor(Math.random()*counter);
    let response = await fetch(url+'/'+item_id);
    let item = await response.json();

    insert_row(counter, item);
}

async function emulateWrite() {
    let index = (counter%100);
    let input = {
        id: doc_prefix+index,
        city: 'test',
        createdAt: '2020-08-20',
        createdBy: 'test',
        description: 'Visit your beloved customer',
        dueDate: '2020-10-20',
        lastModifiedAt: '2020-09-03',
        lastModifiedBy: 'test',
        status: 'QUEUED',
        supervisedBy: "test_user",
        title: "Visit Customer",
        type: "VISIT"
    };


    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(input)
    });

    let data = await response.json();
    insert_row(counter, data);
}

async function emulateQuery() {
    let response = await fetch(url);
    let item = await response.json();

    insert_row(counter, item);
}

function setSimulationStatusRunning(status) {
    let startButton = document.getElementById("start-button");
    let stopButton = document.getElementById("stop-button");
    startButton.hidden = !status;
    stopButton.hidden = status;
}

function startAppSimulation() {
    console.log("starting...");
    counter = 0;
    setSimulationStatusRunning(false);
    emulateWrite().then(()=> //TODO await/then
        runningApp = setInterval(emulateApp, interval));
}

function emulateApp() {
    counter += 1;
    let offsetRead = Math.floor(Math.random() * offset);
    let offsetWrite = Math.floor(Math.random() * offset);
    let offsetQuery = Math.floor(Math.random() * offset);
    runningRead = setTimeout(emulateRead, offsetRead);
    runningWrite = setTimeout(emulateWrite, offsetWrite);
    runningQuery = setTimeout(emulateQuery, offsetQuery);
}

function insert_row(nrow, item) {
    insert_row_values(nrow, item.type, item.activeClusters, item.latency, item.value, item.status);
}

function insert_row_values(nrow, operation, clustername, latency, value,success)
{
    draw_operation(operation, clustername, success === 'SUCCESS');
    var x=document.getElementById('table').insertRow(1);
    var y = x.insertCell(0);
    var z = x.insertCell(1);
 //   var a = x.insertCell(2);
    var b = x.insertCell(2);
    var c = x.insertCell(3);
    var d = x.insertCell(4);
    y.innerHTML=nrow;
    z.innerHTML=operation;
//    a.innerHTML=clustername;
    b.innerHTML=latency;
    var valStr = JSON.stringify(value);
    c.innerHTML= (valStr.length >90) ? valStr.substr(0,90)+"...": valStr;
    d.innerHTML=success === 'SUCCESS' ? "<span class=\"alert alert-success\">Sucess </span>" :
        "<span class=\"alert alert-danger\">Failure </span>";

    if(table.rows.length >10) {
        table.deleteRow(10);
    }

}

function draw_operation(type, clusters, success) {
    var svg=document.getElementById('hideMe');
    //TODO draw lines
    //svg.innerHTML = '';

}


function stopAppSimulation() {
    console.log("stopped");
    setSimulationStatusRunning(true);
    clearInterval(runningApp);
    clearTimeout(runningRead);
    clearTimeout(runningWrite);
    clearTimeout(runningQuery);
}