// TODO dynamic queued task assignment here...
/*let queued_tasks=[{id: 'task:tam:reminder1', title: 'Visit Customer', status: 'queued', due_date: '20-10-2020', description: 'Visit your loved customer'},{id: 'task:tam:reminder2', title: 'Visit Customer2', status: 'queued', due_date: '20-10-2020', description: 'Visit your loved customer'},{id: 'task:tam:reminder3', title: 'Visit Customer3', status: 'queued', due_date: '20-10-2020', description: 'Visit your loved customer'}]
let members=[{ id: 'user:app:steffen', firstname: 'Steffen', lastname: '', displayname: 'Steffen', color: '#3498DB', avatar: 'avatar3.gif' , pendingTasks:[{id: 'task:tam:reminder4', title: 'Visit Customer4', status: 'queued', due_date: '20-10-2020', description: 'Visit your loved customer'}]},
    { id: 'user:app:jmolina', firstname: 'Jose', lastname: 'Molina', displayname: 'Jose', color: '#F39C12', avatar: 'avatar2.gif', pendingTasks:[{id: 'task:tam:reminder5', title: 'Visit Customer5', status: 'queued', due_date: '20-10-2020', description: 'Visit your loved customer'}]},
    { id: 'user:app:raul', firstname: 'Raul', lastname: '', displayname: 'Raul', color: 'green', avatar: 'avatar1.gif', pendingTasks:[{id: 'task:tam:reminder6', title: 'Visit Customer6', status: 'queued', due_date: '20-10-2020', description: 'Visit your loved customer'}]}]
*/

let board_index = {
    QUEUED : 0,
    jmolina: 1,
    raul: 2,
    steffen: 3,
    DONE: 4
};

let board_data =
    [  {
        "username": "QUEUED",
        "displayname": "QUEUED",
        "color": "gray",
        "avatar": "QUEUED.gif",
        "tasks": [
            {
                "id": "task:tam:reminder1",
                "title": "Visit Customer",
                "type": "VISIT",
                "description": "Visit your beloved customer",
                "status": "QUEUED",
                "dueDate": "2020-10-20",
                "supervisedBy": "jmolina",
                "createdAt": "2020-08-20",
                "createdBy": "jmolina",
                "lastModifiedAt": "2020-09-03"
            },
            {
                "id": "task:tam:reminder2",
                "title": "Visit Customer2",
                "type": "VISIT",
                "description": "Visit your beloved customer",
                "status": "QUEUED",
                "dueDate": "2020-10-20",
                "supervisedBy": "jmolina",
                "createdAt": "2020-08-20",
                "createdBy": "jmolina",
                "lastModifiedAt": "2020-09-03"
            }
        ]
    },
        {
            "id": "user:app:jmolina",
            "firstname": "Jose",
            "lastname": "Molina",
            "displayname": "Jose Molina",
            "color": "#F39C12",
            "avatar": "avatar2.gif",
            "username": "jmolina",
            "tasks": [
                {
                    "id": "task:tam:reminder3",
                    "title": "Visit Customer",
                    "type": "VISIT",
                    "description": "Visit your beloved customer",
                    "status": "ASSIGNED",
                    "dueDate": "2020-10-20",
                    "assignTo": "jmolina",
                    "supervisedBy": "jmolina",
                    "createdAt": "2020-08-20",
                    "createdBy": "jmolina",
                    "lastModifiedAt": "2020-09-03"
                },
                {
                    "id": "task:tam:reminder4",
                    "title": "Visit Customer",
                    "type": "VISIT",
                    "description": "Visit your beloved customer",
                    "status": "QUEUED",
                    "dueDate": "2020-10-20",
                    "assignTo": "jmolina",
                    "supervisedBy": "jmolina",
                    "createdAt": "2020-08-20",
                    "createdBy": "jmolina",
                    "lastModifiedAt": "2020-09-03",
                    "channels": [
                        "pending_jmolina"
                    ]
                }
            ]
        },
        {
            "id": "user:app:raul",
            "firstname": "Raul",
            "lastname": "",
            "displayname": "Raul",
            "color": "green",
            "avatar": "avatar1.gif",
            "username": "raul",
            "tasks": [
                {
                    "id": "task:tam:reminder5",
                    "title": "Visit Customer",
                    "type": "VISIT",
                    "description": "Visit your beloved customer",
                    "status": "ASSIGNED",
                    "dueDate": "2020-10-20",
                    "assignTo": "raul",
                    "supervisedBy": "jmolina",
                    "createdAt": "2020-08-20",
                    "createdBy": "jmolina",
                    "lastModifiedAt": "2020-09-03",
                    "channels": [
                        "private_jmolina"
                    ]
                }
            ]
        },
        {
            "id": "user:app:steffen",
            "firstname": "Steffen",
            "lastname": "",
            "displayname": "Steffen",
            "color": "#3498DB",
            "avatar": "avatar3.gif",
            "username": "steffen",
            "tasks": []
        },
        {
            "username": "DONE",
            "displayname": "DONE",
            "color": "gray",
            "avatar": "DONE.gif",
            "tasks": []
        }
    ];

async function load() {
    let board = document.getElementById("task-board");
    await load_board(board);
}

async function load_board(board) {
    //TODO load data here
    let supervisor_id = 'jmolina';
/*    let response = await fetch('/connect/board/'+supervisor_id);
    board_data = await response.json();*/
    board_data = await fetch_board(supervisor_id);
    console.log('Board data: '+board_data);
    board_data.forEach( m => add_column(board, m));
}

async function fetch_board(supervisor_id) {
    let response = await fetch('/connect/board/'+supervisor_id);
    return await response.json();
}

function add_task(column, task){
    column.innerHTML = column.innerHTML+ '<article class="card" draggable="true" ondragstart="drag(event)" data-id="'+task.id+'">'+
                    ' <h5>'+task.title+'</h5>' +
                    ' <p>'+task.dueDate+'</p>'+
                    '</article>';
}


function add_column(board, member) {
    let column = document.createElement('div');
    let subclass = ( member.username === "QUEUED") ? " column-unassigned":
        (member.username === "DONE") ? " column-done": "";

    column.setAttribute("class","column"+subclass);
    column.setAttribute("ondrop", "drop(event)");
    column.setAttribute("ondragover", "allowDrop(event)");
    column.setAttribute("data-id", member.username);
    column.innerHTML =  '<img src="images/'+member.avatar+'.gif" class="rounded-circle" width="180" height="180"  data-alt="images/'+member.avatar+'.gif">'+
        '<h2 style="background: '+member.color+'">'+member.displayname+'</h2>';

    // Adding tasks card
    member.tasks.forEach(queue => add_task(column, queue ));
    // Adding column
    board.appendChild(column);
}

function remove_component(dataId){
    document.querySelector(`[data-id="${dataId}"]`).remove();
}

function move_task(task_id, member_dest) {
        //TODO call move endpoint here
        console.log('move ',encodeURIComponent(task_id),' task to ',encodeURIComponent(member_dest));
        let action = (member_dest === "QUEUED" || member_dest === "DONE") ? "alter": "move";
        fetch('/connect/tasks/'+encodeURIComponent(task_id)+'/'+action+'/'+encodeURIComponent(member_dest), { method: 'PUT'})
            .then(r => fetch_board("jmolina"))
            .then(data => {
                console.log('data: ',data);
                board_data = data;
            });
    /*
    remove_component(task_id);
    let column = document.querySelector(`[data-id="${member_dest.id}"]`);
    add_task(column, task);
     */
}

// ===========================================================

