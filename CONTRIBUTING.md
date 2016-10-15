# Contributing to the API

Thanks for your interest in our project!

The following is a set of guidelines for contributing. These are just guidelines,
not rules, so use your best judgment and feel free to propose changes to this
document in a pull request.

#### Table Of Contents

[How to Contribute](#how-to-contribute)
* [Reporting Bugs](#reporting-bugs)
* [Suggesting Enhancements](#suggesting-enhancements)
* [Pull Requests](#pull-requests)

[Styleguides](#styleguides)
* [JavaScript Styleguide](#javascript-styleguide)
* [Branch Styleguide](#branch-styleguide)
* [Commit Styleguide](#commit-styleguide)

## How to Contribute

### Reporting Bugs

Bugs include problems in the `staging` or `master` branches that produce unexpected
behavior.

Before submitting a bug report, please perform a quick search to see if it has already
been reported. If your issue has already been reported but you have new information
to offer, add a comment. Otherwise, read on!

#### How Do I Submit a (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://help.github.com/articles/about-issues/).
When adding a new issue, explain the problem and include additional details to
help maintainers reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps for reproducing the problem** using as many details
as possible.
* **Provide specific examples to demonstrate the steps**. Include links to files,
GitHub projects, or copy/pasteable snippets in which you use in those examples.
If you're providing snippets in the issue, use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the behavior you observed after following the steps** and point out
what exactly is the problem with that behavior.
* **Explain the behavior you expected to see instead and why.**

### Suggesting Enhancements

Enhancements include everything from suggestions to completely new features or
minor improvements to existing functionality.

Before proposing an enhancement, please perform a quick search to see if it has
already been proposed. If your enhancement has already been proposed but you have
new ideas to offer, add a comment. Otherwise, read on!

#### How Do I Submit a (Good) Enhancement Suggestion?

Enhancements are tracked as [GitHub issues](https://help.github.com/articles/about-issues/).
When adding a new proposal, collect your reasons for why this enhancement should
be implemented and do the following:

* **Use a clear and descriptive title** for the issue to identify the proposal.
* **Provide a step-by-step description of the suggested enhancement** in as many
details as possible.
* **Describe the current behavior** and/or **explain which behavior you want to
see instead**
* **Explain why this enhancement would be useful**

### Pull Requests

Issues that we need help on will be tagged as `help-wanted` and listed under "To Do" in [Projects](https://github.com/HackIllinois/api-2017/projects).
If you're interested in tackling an open issue, leave a comment and let us know your
intent.

New contributors will want to look for issues that are also tagged as
`beginner`. These are issues that we think are well-suited for individuals that
are not too well-acquainted with the codebase.

After you've made the appropriate changes, open a new [GitHub pull request](https://help.github.com/articles/about-pull-requests/).
Be sure to review the guidelines below!

#### How Do I Submit a (Good) Pull Request?

All changes must be reviewed before being merged into the codebase, and some
additional changes may be requested before the pull request is accepted. In order
to make this process as easy as possible, be sure to do the following:

* **Select your merge target** to be `staging` or a branch that has been branched off of `staging`
* **Provide a general summary** of the changes you've made in 1-3 sentences
* **Provide specific summaries in check-list format** (skip any that do not apply)
	* The application/testing changes should come first
	* The database changes should come next
	* The documentation changes should come last
* **Update any related documentation and tests**
* **Link any related issues** using their issue number, by pasting a link
* **Periodically check back** to see if any changes have been requested

## Styleguides

The following styleguides help us to keep the codebase consistent and readable.
Certain styles (i.e. the JavaScript Styleguide) are enforced by our build system while
others are not formally enforced. Regardless, please adhere to them as closely as possible.

### JavaScript Styleguide

All JavaScript must adhere to the [Airbnb JavaScript Styleguide](https://github.com/airbnb/javascript#airbnb-javascript-style-guide-). The build
_will_ fail if your code does not observe it.

### Branch Styleguide

Attempt to name your branches in a sensible way, and prefix the branch name with
the type of changes that will be made. Moreover, keep the branch entirely lowercase.
For instance, `feature/example` would be a branch that implements an "example" feature.

In general, these rules should be followed:
* Issues that are marked as `feature` should have a branch that is prefixed with `feature/`
* Issues that are marked as `refactor` should have a branch that is prefixed with `refactor/`
* Issues that are marked as `bug` should have a branch that is prefixed with `fix/`
* Other miscellaneous issues or changes do not need to be prefixed

### Commit Styleguide

* Provide meaningful, complete commits
* Keep commit history tidy by squashing commits when appropriate (before pushing)
* Use the past tense ("added new feature" not "add new feature")
* Keep messages entirely lowercase and as concise as possible
* Do not end messages with a period

## Special Thanks

Parts of this document were adapted from the [atom.io](https://github.com/atom/atom)
[contributions guide](https://github.com/atom/atom/blob/master/CONTRIBUTING.md).
