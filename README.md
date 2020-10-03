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
guessing problem. The `color_guess` context is there just to show how moving from
one context to another works.

A *context* is a collection of *nodes,* each of which lets the game handle one
kind of response from the player. In the `number_guess` context, there is a node
to handle a high guess, a node for a low guess, a node for input we don't understand,
and so on.

The way GitM understands input is through *keywords,* which move from one node
to another or solve a context. If a player enters input that contains the number 6
or the word "six," that keyword solves the `number_guess` context. A high guess moves
the player to the `n.high` node.

Keywords work best when there are plenty of synonyms to support them. In the Number
Guess game, there are synonyms that let the player enter the numeral 6 or the word "six,"
but more importantly all the higher numbers are synonyms for the `high_guess` keyword.
The effect is that any of those numbers, entered as input, move the player to the
`n.high` node. In a more interesting GitM game, there would be a large number of
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

**Important:** Node names must be unique across the entire game. Keep node names short.
The list of visited nodes uses the names in plain text, so it's easy to use up a whole
cookie with node names. Why did I do it this way? To make everything easier to read.
If you want to use numbers instead, you can.

### Synonyms

Every keyword should have a robust list of synonyms. Keywords are for navigation
and context solving, so they don't have to be pretty enough to display to the user.
A keyword can be something like `Abigail` or just `ghost_name_solution`. Take a look
at the Number Guess keywords; there are only enough keywords to accomplish the
navigation and the solution. You don't need to distinguish between 7 and 8. All you
need to know is that either of those guesses is too high and should go to the
`too_high` node. Synonyms might include variant spellings, misspellings, or other
ways of phrasing a keyword or answer.

**Important:** keywords and synonyms must all be lowercase, because input is changed
to lowercase before processing.

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

## Other Things to Know

GitM uses cookies to preserve some of the game state across sessions. If you want
people to be able to play multiple different games based on GitM without them
interfering with each other, you should change the names of the cookies. There aren't
too many of them and a find/replace should do it.

You can also change the names of the files if you want to host multiple games in one
directory for some reason.

Keep your node and context names short and meaningful!

90% of the time, if the game crashes or gets weird, it's a problem with the JSON. It could be that
you missed one of the places where you were trying to change a context name, or that
you pointed a node to the wrong place.


---
