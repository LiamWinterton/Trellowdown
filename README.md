# Trellowdown - v1.0.0

Trellowdown is an interface for Trello that enables users to see, and action priority tasks.

## Our issue

Here at Dijitul, we use Trello every day. But one little annoyance we had was being able to fully implement Trello into our processes.

Whilst the new homepage view is by no means bad, there are some features and functionality we wanted to jam into the page in order to get the most out of it.

There are two main things that we wanted out of the page. Those being:

* Be able to quickly see cards assigned to us that have due dates.
* The ability to flag a card as `complete`.
* The ability to push a card's duedate back with ease.
* The ability to quickly add a card to any of our boards

Thus, Trellowdown was created.

## Dev

Before compiling, you need to go into the App container, and change the state of the `superUserID`.

### Commands

* npm run start - Runs the webpack dev server @ `http://localhost:3000`
* npm run build - Runs webpack for production.
