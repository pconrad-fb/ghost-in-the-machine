// Build response

function buildResponse(input){

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


//	alert(start.greeting);
  context = contexts.number_guess;
	node_name = context.first_node;
	current_node = nodes[node_name];

//	alert (node.greeting);
	alert (node_name);

	return input + " ..." + data.responses[0];

}

// Globals

let g = {
	game_name: "",
	player_name: "",
	playerInput: "",
	visited_nodes: [],
	solved_contexts: [],
	game_finished: "",
	last_interaction: {},
	current_node: "",
	chat_history: ""
}
