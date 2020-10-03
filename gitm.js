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
	if(g.gitm_current_node = "start"){
		g.gitm_current_node = contexts[start.next_context].first_node;
		//alert(g.gitm_current_node);
		postReply(start.greeting);
	}
}

function hasVisited(node){
	console.log("visited " + node + "?");
	return false;
}

function isSolved(context){
	console.log("Solved " + context + "?");
	return false;
}

function pickFromGroup(phraseGroup){
	//return a random thing
}

function getPhrase(node){
	if(hasVisited(0)){
		// Pick a phrase
		console.log( "Node already visited. Picking a phrase.");
		return pickFromGroup();
	}else{
		// Use the greeting
		return "Node not visited. Using the greeting.";
	}
}

function processInput(e) {
  e.preventDefault();
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
	let reply = "ERROR - no reply!";
	let current = nodes[g.gitm_current_node].context;
	//alert(contexts[current].first_node);
	//alert(g.gitm_current_node);
	input = input.toLowerCase();
	//alert("Hmm");

	// Check for keywords...
	for (const keyword in synonyms){
		//console.log(keyword);
		//console.log("======");
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
		alert("Solved! Moved to " + g.gitm_current_node);
		if(g.gitm_current_node === "end"){
			alert("End game!");
			// do the end stuff
			// update the cookies
			return end.greeting;
		}
	}

	// Keyword moves us to a new node? But not if context solved.
	let move_to_node;

	for (keyword in nodes[g.gitm_current_node].exits){
		//console.log(keyword);
		if(input === keyword){
			console.log("Keyword '" + keyword + "' detected");
			move_to_node = nodes[g.gitm_current_node].exits[keyword];

			// If move_to_node's context is solved, just stay put
			// and return something from that context's sink
			if(isSolved(nodes[move_to_node].context)){
				console.log( "New node's context already solved. Not moving, picking from sink.");
				reply = pickFromGroup(nodes[move_to_node].sink);
			}else {
				// Otherwise, move
				g.gitm_current_node = move_to_node;
				console.log("Moved to: " + g.gitm_current_node);
				reply = getPhrase(g.gitm_current_node);
				//return getPhrase(g.gitm_current_node);
			}
		}else{ // No keyword match, don't go anywhere, grab from default
			//return "No keyword match. Using a default phrase.";
			reply = getPhrase(nodes[g.gitm_current_node].default);
		}
	} // for

return reply;
// tolower()
// process synonyms

// check for keywords

// context solution? if so, add to solved_contexts

// new context entry if solved

// node exit?

// go to node (new context entry or kw exit)

// If you go to a node in another context, you are not really in that
// context until you solve the previous context. Why? because the behavior
// for entering a new context is that you go to the first node and get
// the greeting, which is incompatible with just changing topics for a bit.
// You have to solve contexts in order. Therefore if you use a node from
// another context, it can't be a node that hints at solutions to its
// context. It must be a sink or default node, or a special node to handle
// this specific situation.

// see if context is solved

// if so, go to sink

// see if this node is in visited_nodes

// if not, use greeting and add to visited_nodes

// otherwise, use a phrase

// write cookie (this happens in chatReply())




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
