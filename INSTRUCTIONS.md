#Instructions

## Requirements

- Keep in mind that we'll focus on code efficiency and readability.
- You shall provide some code that you consider **production ready**.
- The single objective of this test is to evaluate how you handle the business logic, not the UI/UX. **Do not waste your time on front-end stuff**.

## How to answer this test

Do **not** fork this repository on github. Instead please follow these steps:
- clone this repository: `git clone https://github.com/streamroot/webRTC-test`
- create a new empty github repository (please do not use the  “Streamroot” brand name in the repository's name, as it's a registred trademark)
- remove streamroot's remote on your local git `git remote remove origin`
- add your repository to your local git `git remote add origin git@github.com:< … >`
- commit and push as usual on your github repository.

## Questions

### 1. Create a peer to peer application that allows several peers to send message to each other (implementation needed)

- There should be a single page (no separation between caller & callee).
- Once on the page, every page must see the list of all the other peers connected.
- A peer connection must be established with the other peers immediately after the connection to the page.
- A peer must be able to send a message to any other connected peer directly. (broadcast not needed)



### 2. to go further (no implementation needed)

- What are the problems of this architecture?
- Describe an architecture that could solve those problems.
