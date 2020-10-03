// Globals and Cookies

window.g = {
	playerInput: "", // don't need a cookie for this one
	gitm_visited_nodes: [],
	gitm_solved_contexts: [],
	gitm_game_finished: "",
	gitm_current_node: "",
	gitm_chat_history: "",
};


function setCookie(parameter, value) {
	document.cookie = parameter + "=" + value + "; SameSite=Lax";
}

function getCookie(parameter) {
  parameter = parameter + "=";
  let escapedCookie = decodeURIComponent(document.cookie);
  let cookies = escapedCookie.split(';');
  for(var i = 0; i <cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(parameter) == 0) {
      return cookie.substring(parameter.length, cookie.length);
    }
  }
  return "";
}


function setup(){
  console.log("Setup\n");
	// if we have no existing cookie
	if (getCookie("gitm_game_finished") === ""){
		//alert("No cookie");
		g.gitm_game_finished = "no";
		setCookie("gitm_game_finished", g.gitm_game_finished);
		g.gitm_current_node = "start";
		setCookie("gitm_current_node", g.gitm_current_node);
	}else{
		//alert("Cookies!");
		// g.gitm_visited_nodes: [],
		g.gitm_visited_nodes = getCookie("gitm_visited_nodes").split(",");
		// g.gitm_solved_contexts: [],
		g.gitm_solved_contexts = getCookie("gitm_solved_contexts").split(",");
		// g.gitm_game_finished: "yes" or "no"
		g.gitm_game_finished = getCookie("gitm_game_finished");
		// g.gitm_current_node: node name
		g.gitm_current_node = getCookie("gitm_current_node");
		// g.gitm_chat_history: the last 4000 bytes of the chat
		g.gitm_chat_history = getCookie("gitm_chat_history");
		console.log ("g.gitm_game_finished: " + g.gitm_game_finished);
	}
	if(g.gitm_current_node === "start"){
		postReply(start.greeting);
	}
}

function hasVisited(node){
	console.log("visited " + node + "?");
	if (g.gitm_visited_nodes.includes(node)){
		return true;
	}else{
		return false;
	}
}


function isSolved(context){
	console.log("Solved " + context + "?");
	return false;
}

function pickFromGroup(phraseGroup){
	//return a random thing
	//  var item = items[Math.floor(Math.random() * items.length)];.
	return phraseGroup[Math.floor(Math.random() * phraseGroup.length)];
}

function getPhrase(node){
	console.log("getPhrase(" + node + ")");
	if(hasVisited(node)){
		// Pick a phrase
		console.log( "Node already visited. Picking a phrase.");
		return pickFromGroup(nodes[node].phrases);
	}else{
		// push it
		g.gitm_visited_nodes.push(node);
		console.log(g.gitm_visited_nodes);
		// Use the greeting
		return nodes[node].greeting;
	}
}

function processInput(e) {
  e.preventDefault();
	if(g.gitm_game_finished === "yes"){
		return;
	}
	g.playerInput = document.getElementById("inputText").value;
	let inputHTML = '<br /><span class="player">' + g.playerInput + '</span>';
	let chatHistoryDiv = document.getElementById("chatHistory");
	let chat = chatHistoryDiv.innerHTML + inputHTML;
	chatHistoryDiv.innerHTML = chat;
	chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight; // = chatHistoryDiv.clientHeight;
	document.getElementById("inputText").value = "";
	setTimeout("chatReply(g.playerInput)", 1000);
}

// buildResponse() is where all the action takes place.
// This is where navigation happens, solutions and keywords
// are evaluated, and, yes, responses are built.
// The tricky thing to remember is that you enter buildResponse()
// in one node, but often leave it in another.

function buildResponse(input){
	console.log("Currently in " + g.gitm_current_node);
	let just_started, detected = false;
	// Process the very first input
	if(g.gitm_current_node === "start"){
		g.gitm_current_node = contexts[start.next_context].first_node;
		just_started = true;
	}
	let reply = "ERROR - no reply!";
	let current = nodes[g.gitm_current_node].context;
	input = input.toLowerCase();

	// Check for keywords...
	for (const keyword in synonyms){
		words = synonyms[keyword];
		for (const word of words){
			//console.log(word);
			if(input.indexOf(word) >= 0){
				console.log("Matched keyword:" + input);
				input = keyword;
				//alert(input);
			}
		}
	}
	console.log("input: " + input);
	// console.log("keyword: " + keyword);

	// Did player solve the context? Change nodes
	if(input === contexts[nodes[g.gitm_current_node].context].exit){
		console.log("Matched " + contexts[nodes[g.gitm_current_node].context].exit);
		current = contexts[current].next_context;
		g.gitm_current_node = contexts[current].first_node;
		//setCookie("gitm_current_node", g.gitm_current_node);
		//alert(g.gitm_current_node);
		// If this one's already solved, something's wrong
		if(isSolved(g.gitm_current_node)){
			alert("Warning: moved to " +	g.gitm_current_node + "but it's already solved!");
		}
		//alert("Solved! Moved to " + g.gitm_current_node);
		if(g.gitm_current_node === "end"){
			// alert("End game!");
			// do the end stuff
			// update the cookies
			g.gitm_game_finished = "yes";
			return end.greeting;
		}
	}

	// Keyword moves us to a new node? But not if context solved.
	let move_to_node;

	for (keyword in nodes[g.gitm_current_node].exits){
		if(input === keyword){
			detected = true;
			console.log("Keyword '" + keyword + "' detected");
			move_to_node = nodes[g.gitm_current_node].exits[keyword];

			// If move_to_node's context is solved, just stay put
			// and return something from that context's sink
			if(isSolved(nodes[move_to_node].context)){
				console.log( "New node's context already solved. Not moving, picking from sink.");
				reply = pickFromGroup(nodes[move_to_node].sink);
				break;
			}else {
				// Otherwise, move
				g.gitm_current_node = move_to_node;
				console.log("Moved to: " + g.gitm_current_node);
				reply = getPhrase(g.gitm_current_node);
				//return getPhrase(g.gitm_current_node);
			}
		}
	} // for

	if(!detected){
		// If it's the first time in after the start node, no keyword
		// means do the greeting
			if(just_started){
				reply = nodes[g.gitm_current_node].greeting;
			}else{
				// No keyword match, don't go anywhere, grab from default
				reply = getPhrase(nodes[g.gitm_current_node].default);
			}
	}

	return reply;

}


function postReply(response){
	let chatHistoryDiv = document.getElementById("chatHistory");
	response = '<br /><span class="computer">' + response + '</span>';
	g.gitm_chat_history = chatHistoryDiv.innerHTML + response;
	// Trim to the last 4000 characters of chat history so it will fit in a cookie
	if(g.gitm_chat_history.length > 4000){
		g.gitm_chat_history = g.gitm_chat_history.substr(g.gitm_chat_history.length-4000);
		g.gitm_chat_history = g.gitm_chat_history.substr(g.gitm_chat_history.indexOf("</span>")+7);
	}
	chatHistoryDiv.innerHTML = g.gitm_chat_history;
	chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
	setCookie("gitm_chat_history", g.gitm_chat_history);
}

function chatReply(input){
	if(g.gitm_current_node === "end"){
		//if (hasVisited(nodes.end){
			//postReply(nodes[g.gitm_current_node].greeting);
	}else{
	  postReply(buildResponse(input));
  }
}
