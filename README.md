# Ghost in the Machine
A chat-based game

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

