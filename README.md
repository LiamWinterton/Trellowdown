# Trellowdown - v1.0.0

Trellodown is an interface for Trello that enables users to see priority tasks, and cards they are assigned to in one managable space.

## Our issue

Here at Dijitul, we use Trello every day. But one little annoyance we had was being able to fully implement Trello into our processes.

Whilst the `/username/cards` view is by no means bad, there are some features and functionality we wanted to jam into the page in order to get the most out of it.

There are two main things that we wanted out of the page. Those being:

* Be able to quickly see cards assigned to us that have due dates.
* The ability to flag a card as `complete`.

Thus, Trellowdown was created.

## Dev

Before compiling, you need to go into Trellowdown.js and change the hardcoded id in `authSuccess` to be the ID of the organisation owner.

### Commands

* npm run build - Runs the webpack dev server
* npm run build - Runs webpack for production.
