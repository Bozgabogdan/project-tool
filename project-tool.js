function Issue(id, type, name, sprint, createdBy, description, status) {
	this.id = id;
	this.type = type;
	this.name = name;
	this.sprint = sprint;
	this.createdBy = createdBy;
	this.description = description;
	this.assignee = "";
	this.status = status;
	this.tasks = [];
	this.createdAt = new Date();
	this.updatedAt;
}

function Sprint(id, name) {
	this.id = id;
	this.name = name;
}

function User(id, name) {
	this.id = id;
	this.name = name;
}

function Comment(id, name) {
	this.id = id;
	this.name = name;
}

function Status(id, type) {
	this.id = id;
	this.type = type;
}

function createStates() {
	let states = [];
	states.push(new Status(generateId(), 'New'));
	states.push(new Status(generateId(), 'In progress'));
	states.push(new Status(generateId(), 'Feedback'));
	states.push(new Status(generateId(), 'Rework'));
	states.push(new Status(generateId(), 'Resolved'));
	states.push(new Status(generateId(), 'Ready for testing'));

	return states;
}

function Project(id) {
	this.id = id;
	this.sprintIds = [];
}

function createSprint(name) {
	const newSprint = new Sprint(generateId(), name);
	project.sprintIds.push(newSprint.id);
	localStorage.setItem('project', JSON.stringify(project));
	localStorage.setItem('sprints', JSON.stringify(sprints));
	return newSprint;
}

function createIssue(type, name, sprint, description, parentIssue) {
	const newIssue = new Issue(generateId(), type, name, sprint, user.id, description, states[0].id);
	if (parentIssue) {
		parentIssue.tasks.push(newIssue.id);
	}
	return newIssue;
}

function generateId() {
	return '_' + Math.random().toString(36).substr(2, 9);
}




function populateSprintIssues(issues, sprintId) {
	const sprintIssues = [];
	for (let i = 0 ; i < issues.length ; i++) {
		if (issues[i].sprint == sprintId) {
			sprintIssues.push(issues[i]);
			issues[i].tasks = populateIssueSubtasks(issues[i].tasks)
		}
	}
	return sprintIssues;
}

function populateIssueSubtasks(tasks) {
	const issueSubtasks = [];
	for (let i = 0 ; i < tasks.length ; i++) {
		for (let j = 0 ; j < issues.length ; j++) {
			if (tasks[i] == issues[j].id) {
				issueSubtasks.push(issues[j]);
			}
		}
	}
	return issueSubtasks;
}

function showProjectSprints() {
	const projectSprints = JSON.parse(localStorage.getItem('sprints'));
	for (let i = 0 ; i < projectSprints	.length ; i++) {
		projectSprints[i] = new Sprint(projectSprints[i].id, projectSprints[i].name)
	}
	return projectSprints;
}


function createIssues() {
	for (let i = 0 ; i < issues.length ; i++) {
		issues[i] = new Issue(issues[i].id, issues[i].type, issues[i].name, issues[i].sprint, user.id, issues[i].description, issues[i].status)
	}
}

function createSprints() {
	for (let i = 0 ; i < sprints.length ; i++) {
		sprints[i] = new Sprint(sprints[i].id, sprints[i].name);
	}
}



let project = new Project(generateId());
const user = new User('Bozga');
const states = createStates();

let sprints = [];
let issues = [];
localStorage.setItem('sprints', []);
localStorage.setItem('issues', []);
localStorage.setItem('project', project);

sprints.push(createSprint('first sprint'));
sprints.push(createSprint('second sprint'));
localStorage.setItem('sprints', JSON.stringify(sprints));


issues.push(createIssue('bug','1_spring2' ,sprints[0].id,'safasf'));
issues.push(createIssue('feature','2_spring2',sprints[0].id,'safasf'));
issues.push(createIssue('feature','3_spring2',sprints[0].id,'safasf'));
issues.push(createIssue('feature','4_spring2',sprints[0].id,'safasf'));
issues.push(createIssue('task','5_spring2',sprints[0].id,'safasf'));
issues.push(createIssue('task','6_spring2',sprints[0].id,'safasf'));
issues.push(createIssue('task','7_spring2',sprints[0].id,'safasf', issues[1]));
issues.push(createIssue('bug','1_spring_1' ,sprints[1].id,'safasf'));
issues.push(createIssue('bug','2_spring_1',sprints[1].id,'safasf'));
issues.push(createIssue('task','3_spring_1',sprints[1].id,'safasf'));
issues.push(createIssue('task','4_spring_1',sprints[1].id,'safasf'));
issues.push(createIssue('task','5_spring_1',sprints[1].id,'safasf'));
issues.push(createIssue('feature','6_spring_1',sprints[1].id,'safasf'));
issues.push(createIssue('bug','7_spring_1',sprints[1].id,'safasf'));
issues.push(createIssue('bug','7_spring_1',sprints[1].id, 'sss'));
localStorage.setItem('issues', JSON.stringify(issues));

const sprintIssues = populateSprintIssues(issues, sprints[0].id);

let groupedIssues = { };
let groupedIssuesByType = { };

function groupByStatus() {
	for (let i = 0 ; i < states.length ; i++) {
		groupedIssues[states[i].id] = [];
		groupedIssuesByType[states[i].id] = [];
	}
	for (let i = 0 ; i < sprintIssues.length ; i++) {
		groupedIssues[sprintIssues[i].status].push(sprintIssues[i])
	}
}

function groupByType(type) {
	let keys = Object.keys(groupedIssues);
	for (let i = 0 ; i < keys.length ; i++) {
		for (let j = 0 ; j < groupedIssues[keys[i]].length ; j++) {
			if (groupedIssues[keys[i]][j].type === type) {
				groupedIssuesByType[keys[i]].push(groupedIssues[keys[i]][j]);
			}
		}
	}
}

groupByStatus();
groupByType('bug');

function updateSubTasks(currentSprint, updatedIssue) {
	const subTasks = populateIssueSubtasks(updatedIssue.tasks);
	if (updatedIssue.sprint !== currentSprint) {
		for (let i = 0 ; i < subTasks.length; i++) {
			subTasks.sprint = updatedIssue.sprint;
		}
	}
}

updateSubTasks('_fvrmqnsad', sprintIssues[1]);


// addSprints();


 document.addEventListener("DOMContentLoaded", function() {
	document.getElementById('show-sprints').addEventListener('click', function() {
		sprints = showProjectSprints();
		console.log(sprints)
		renderSprints(sprints);
	});
});


function renderSprints(sprints) {
	const sprintsContainer = document.getElementById('sprints-container');
	while (sprintsContainer.firstChild) {
    	sprintsContainer.removeChild(sprintsContainer.firstChild);
	}

	for (let i = 0 ; i < sprints.length	 ; i++) {
		let sprintContainer = document.createElement('div');
		let button = document.createElement('span');
		button.innerHTML = '+';
		sprintContainer.classList.add('sprint-container');
		var sprint = sprints[i].name;
		sprintContainer.append(button);
		sprintContainer.append(sprint);

		document.getElementById('sprints-container').append(sprintContainer);	
	}
	
}