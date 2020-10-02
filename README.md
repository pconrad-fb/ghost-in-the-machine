# Ghost in the Machine

Ghost in the Machine (GitM) is a framework for creating natural-seeming chat-based games.
It's hard to parse human language, so GitM doesn't try to do that. Instead, the
framework provides a way for you to create directed conversations in JSON, setting
up a few keywords that provide the appearance that the game understands the player's
input.

The intention is that all game play can be encoded in JSON, with no modification
to the JavaScript required to create a new game. The big disadvantage of this approach is that
because the game is not programmatic, the outcome is deterministic. The Number Guess
example shows this: the number is always 6 (or whatever is encoded in the JSON).

This makes GitM a very bad framework for creating the kind of game that requires
dynamic or random conditions. It is a very bad framework for a Number Guess game
specifically. But if you want to create a game that tells a story, GitM lets you
build a directed conversation that helps the player along from beginning to end, and
lets you build in some variety along the way.

The power of a GitM game comes from directing the conversation, anticipating and
rewarding input that moves in the right direction, and providing specific information
at the right points in the story.

## Structure of a Story

A *story* in GitM is a progression from start to end through one or more *contexts,*
each of which expresses a specific topic or question. A context is a single problem
for the player to solve. The Number Guess game uses one context for the number
guessing problem. The `vowel_guess` context is there just to show how moving from
one context to another works.

A *context* is a collection of *nodes,* each of which lets the game handle one
kind of response from the player. In the `number_guess` context, there is a node
to handle a high guess, a node for a low guess, a node for input we don't understand,
and so on.

The way GitM understands input is through *keywords,* which move from one node
to another or solve a context. If a player enters input that contains the number 6
or the word "six," that keyword solves the `number_guess` context. A high guess moves
the player to the `too_high` node.

Keywords work best when there are plenty of synonyms to support them. In the Number
Guess game, there are synonyms that let the player enter the numeral 6 or the word "six,"
but more importantly all the higher numbers are synonyms for the `high_guess` keyword.
The effect is that any of those numbers, entered as input, move the player to the
`too_high` node. In a more interesting GitM game, there would be a large number of
synonyms to anticipate a wider range of input.

## What to Create

Here are the parts of a GitM story:

- Start
- Contexts
- Nodes
- Synonyms
- End

The first task in creating a story is to figure out a quest for the player to
follow. Who are they chatting with, and what is the goal for the conversation?
For example, the GitM bot might be a ghost who doesn't remember who she was, and
the player's job is to help her remember.

Break the story into specific tasks or questions, each of which will become a context.
One context might be for helping the ghost remember her name, or realize that her
father was a gardener.

Now you can start to figure out the flow for each context. When the player is guessing
the ghost's name, how can you narrow down the nearly infinite possibilities? What
hints can you drop? What are the possible player inputs you can anticipate? There might
be a keyword `begins_with` that moves the player to a node where the ghost reveals
that she thinks her name begins with 'a' and reminds her of a character from *The Crucible.*

The flow among nodes and from context to context are the game map.

### Start and End

The `start` and `end` are special nodes that exist only to start and end the
game. They each have a *greeting*&mdash;special text that only gets displayed
the first time the player visits the node. For the `start` and `end`, of course,
the first time is also the last time.

For the `start`, create introductory text that helps the player understand what the
game is about and how to get started. For the `end`, congratulate the player on
solving the game. If you want to be funny, you can also say something like
`The agent has left the chat.`

### Contexts

A context encapsulates a specific problem or question for the player to solve, and
consists of nodes and phrases that guide the player (or mislead the player) in the
effort to find the solution.

It's a good idea to name the context in a way that will help you remember what it's
about, in case you want to add to it later on.

The context object itself doesn't need to know what nodes it contains. The nodes know
what context they belong to and they handle all the navigation. All the context needs to
know is:

- `first_node` &ndash; the first node to display when entering this context
- `exit` &ndash; the keyword that solves this context
- `next_context` &ndash; the next context to display when the player solves this context
- `sink` &ndash; what to say if the player tries to return after solving this context

The `sink` is there in case a player manages to get to a node in the context after
it's solved. It prevents the bot from seeming to have forgotten that part of the
conversation.

### Nodes

A node handles a single condition in a context and contains the following parts:

- `context` - the problem or question this node is a part of
- `greeting` - the text to display on the first visit
- `phrases` - choices for text to display on subsequent visits (chosen randomly)
- `exits` - a list of keywords and the nodes they go to from here
- `default` - a node to pull phrases from if no keywords are detected

Most nodes function as navigation points to move the player to a solution, but you
can create nodes whose only purpose is to be the `default` for other nodes. In fact,
it's a good idea to have a single `default` node for each context. That lets you
re-use "I didn't understand" responses across nodes, making your JSON smaller, but
also lets you keep these generic replies context-sensitive, making them more realistic.

### Synonyms

Every keyword should have a robust list of synonyms. Keywords are for navigation
and context solving, so they don't have to be pretty enough to display to the user.
A keyword can be something like `Abigail` or just `ghost_name_solution`. Take a look
at the Number Guess keywords; there are only enough keywords to accomplish the
navigation and the solution. You don't need to distinguish between 7 and 8. All you
need to know is that either of those guesses is too high and should go to the
`too_high` node. Synonyms might include variant spellings, misspellings, or other
ways of phrasing a keyword or answer.

## How it All Works Together

When the player begins, GitM displays the greeting from the `start` node. No matter
what the player types, the game navigates to the first context's `first_node` and
displays the greeting there.

When the player types again, GitM looks for keywords (and synonyms) to determine
which node to go to next. If no keywords are found, the game stays at that node and
displays something from the `default` (which could be the same node, or a default
node for the context).

The first time a player visits any node, the game displays the `greeting`. On subsequent
visits, the game shows one of the `phrases`, randomly chosen.

Any time the player types the keyword (or synonym) that solves the current context,
the game navigates to the next context's `first_node` and displays the greeting. If
the player manages to navigate back to a node in a solved context, only phrases from
the `sink` are available. There is one context-to-context path through the game.
Variety is accomplished with nodes within each context.

When the player solves the final context, the `greeting` from the `end` node is
displayed and the game is over.

---





## Stuff

- test.html and test.js for developing code techniques
- ghost.html and ghost.js for building the game

## Ingredients

- Chat window
	+ &lt;textarea> plus an iframe?
	+ 2 &lt;textarea>s?
	+ Has to be a way for Abigail to pause and think, if the
      user keeps typing it's added to a queue of unprocessed input
      And then Abby can reply at her leisure
    + Maybe when the user types it resets a timer
    + **Decided:**
	    * `<div>` plus a text input
	    * Inputting text sets a random timer on Abby reply
	    * Assumption: player won't type too many lines at one time
- Eliza engine
	+ Plenty of basic rules
	+ Core substitutions
	+ Node-specific substitutions
	+ Keywords that do things (with variants)
		* Unlock new script that leads conversation forward to next keyword
		  in same or different node
		* Record achievement in state cookie
		* Unlock new script that points to another node
	+ **Logic:**
		* In reply function, grab buffer of unprocessed input (from global state cookie)  
		  and clear buffer
		* How long has it been since last input?
			- If it's been a really long time, say so
			- "I've been lost in here a long time"
		* Are any keywords or phrases in the input?
			- Unlock or lock node or path
			- Change sentiment if needed
			- Construct response based on script, choose from
			  keyword/node/path/sentiment (plus options)
		* Any tags in the input?
			- Construct a reply
		* Failover: generic response
- Global state object
	+ Full chat history?
	+ Name of player
	+ Time of original interaction
	+ Time of most recent interaction
	+ Unprocessed queue of input
	+ Nodes unlocked and what phraes unlocked them
		* Can use this for hints
	+ Abigail's sentiment
		* Positive
		* Neutral
		* Negative
		* Game over
- Cookie manager
	+ How much can we store in a cookie?
	+ Can we store some amount of the chat text?
- A way to represent the map
	+ Nodes, paths, keywords, goals, dead ends, scripts
	+ Modular so we can do more games
	+ Simple sentiment to change available scripts
		* Each node/path/script has sentiment values

## Definitions

- Keyword: a word that has meaning or performs an action
- Command: a keyword that does something like tell the player
  what the game status is, or gets a hint,
  Something like "I don't know" or "How am I doing"
- Variant: a synonym for a keyword
- Tag: a recognizable word that has no game function but affects how   
  a reply is constructed. Example "you" in Eliza triggers "We were talking about
  you, not me" types of responses
- Map: conceptual or conversational locations: nodes and paths
- Option: for any given script chunk, there might be several ways to say it  
  just in case it ends up getting said more than once

## Planning

- Map of nodes
	+ What needs to be done at each?
	+ 3 keywords that make the conversation build to a conclusion
	+ Variants on the keywords - a master dictionary of variants on words
	  that mean something in the game
	+ Script prompts that lead to keywords
- Timers
	+ If you're taking too long to get past a challenge, unlock hint prompts
- Is there a way to see game progress?
	+ "I feel like I've got answers to three of the five questions that were tormenting me"
	+ "You've really helped me... but I feel like we're not done yet"

## Story

- She's a young ghost from long ago
- She doesn't know she's dead
	+ She's trapped in a world she doesn't understand
	+ She's been alone for a long time but strangely doesn't feel lonely
- She wants revenge...on the player?
- Are ghosts sad?
- What truths about life can we reveal?
- She doesn't understand emojis - Why are you just writing punctuation?
  What did you mean by that?


## Goals

1. Learn she's dead and tell her
2. Learn who she was and help her remember - she was a murderer
3. Learn why she's been unable to rest - she must now kill you!
