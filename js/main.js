 function createElemWithText(toBeCreated = "p", createdText = "", className = "") {
        // create the new HTML element
        let newlyCreatedElWithText = document.createElement(toBeCreated);
        newlyCreatedElWithText.textContent = createdText;
   
        // apply className if provided in parameter
        if(className) newlyCreatedElWithText.className = className;
   
        return newlyCreatedElWithText;
      }


function createSelectOptions(params) {
    if (!params) return undefined;
        // map and return the params
        return params.map((x) => {
            let options = [];
            let option = document.createElement('option')
            option.value = x.id;
            option.textContent = x.name;
            return option;
        });
        
 }

function toggleCommentSection(postId) {
    if (!postId || !postId instanceof Element || !postId instanceof HTMLDocument) return undefined;
    let section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (section) {
        // toggle on hide
        section.classList.toggle('hide');
    }
    return section;
}

function toggleCommentButton (postID) {
  // leave function if no postId
  if (!postID) {
    return;
  }

  const btnSelectedEl = document.querySelector(`button[data-post-id = "${postID}"`);

  if (btnSelectedEl != null) {
    btnSelectedEl.textContent === "Show Comments" ? (btnSelectedEl.textContent = "Hide Comments") : (btnSelectedEl.textContent = "Show Comments");
  }
  return btnSelectedEl;
}


function deleteChildElements(parentElement) {
    if (!/<\/?[a-z][\s\S]*>/i.test(parentElement)) {
        console.dir(parentElement)
        console.log('not html')
    }
    if (!parentElement || !parentElement instanceof Element || !parentElement instanceof HTMLDocument) return undefined;
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}


function addButtonListeners () {
  let mainEl = document.querySelector('main')
    let btnsList = mainEl.querySelectorAll('button')
    if(btnsList){
        for(let i = 0; i < btnsList.length; i++){
            let myButton = btnsList[i]
            let postId = myButton.dataset.postId
            myButton.addEventListener('click', function(event){
                toggleComments(event, postId), false
            })
        }
        return btnsList
  }
}


function removeButtonListeners() {
   let mainEl = document.querySelector('main')
    let btnsList = mainEl.querySelectorAll('button')
    if(btnsList){
        for(let i = 0; i < btnsList.length; i++){
            let myButton = btnsList[i]
            let postId = myButton.dataset.postId
            myButton.removeEventListener('click', function(event){ 
            toggleComments(event, postId), false
        })
        }
        return btnsList
}
}

function createComments(comments) {
      //The function createComments should return undefined if it does not receive a parameter.
      if (!comments) {
        return undefined;
      }
      let document_fragment = document.createDocumentFragment();
      for (let i = 0; i < comments.length; i++) {
        let comment = comments[i];
        
        let a = document.createElement("ARTICLE");
        let h3 = createElemWithText("h3", comment.name);
        let p1 = createElemWithText("p", comment.body);
        // Create an paragraph element with createElemWithText('p', `From: ${comment.email}`)
        let p2 = createElemWithText("p", `From: ${comment.email}`);
        
        a.appendChild(h3);
        a.appendChild(p1);
        a.appendChild(p2);
        
        document_fragment.appendChild(a);
      }
      return document_fragment;
}





 function populateSelectMenu(users) {
        // if users is empty, return undefined
        if (!users) return;
        // select the selectMenu id
        let menu = document.querySelector("#selectMenu");
        // passes the data to createSelectOptions to get an array
        let options = createSelectOptions(users);

        // loop through and append each option to the menu
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            menu.append(option);
        } // end for loop

        // return menu
        return menu;
      }


async function getUsers(){
        let users;
        try {
          // users fetch at pre-defined URL
            users = await fetch("https://jsonplaceholder.typicode.com/users");
          let users_info = await users.json(); 
          return users_info; 
        } 
        catch (error) {
            console.error(error);
        } 
    }


async function getUserPosts(userId) {
        // leave functtion if no userId
        if (!userId) return;

        let user_posts;
        try {
            user_posts = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
          let users_post_info = await user_posts.json();
          return users_post_info
        } 
        catch (error) {
            console.error(error);
        } 

    }

async function getUser(userId){
        // leave function if no userId
        if (!userId) return;

        let user;
        try {
            user = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
           return user.json();
        } 
        catch (error) {
            console.error(error);
        } 
    }


async function getPostComments(postId) {
    if(!postId) return;
    try {
        let found_comments = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        let post_comments = await found_comments.json();
        return post_comments;
        } catch(error){
            console.error(error);
    }
}


async function displayComments(postId) {
  // leave function if no postId
    if(!postId) return;
  
    let section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
  
  // get our comments for our post
    let comments = await getPostComments(postId);
    let fragment = createComments(comments);
    section.append(fragment);
    return section;
}


async function createPosts(jsonPosts) {
  // leave function if no jsonPosts
    if(!jsonPosts) return;

    let post_fragment = document.createDocumentFragment();

    for (let i = 0; i < jsonPosts.length; i++) {
        // lock-in our individual post, 1 at a time
        let post = jsonPosts[i];

        let article = document.createElement("article");
      // call to get our comments
        let section = await displayComments(post.id);
      // make sure we have our users
        let author = await getUser(post.userId);

        let h2 = createElemWithText("h2", post.title);
        let p = createElemWithText("p", post.body);
        let p2 = createElemWithText("p", `Post ID: ${post.id}`);

        let p3 = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
        let p4 = createElemWithText("p", `${author.company.catchPhrase}`);

        let button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;

        article.append(h2, p, p2, p3, p4, button, section); 

        post_fragment.append(article);
    }
    return post_fragment;
};


async function displayPosts(posts) {
    let myMain = document.querySelector("main");
  // if we have a posts send it to createPosts function
  // else, make our own
    let post = (posts) ? await createPosts(posts) : document.querySelector("main p");
    myMain.append(post);
    return post;
}

function toggleComments(event, postId){
  // leave if we are missing any params
    if (!event || !postId){
        return undefined;
    }
    event.target.listener = true;
    let section  = toggleCommentSection(postId);
    let button = toggleCommentButton(postId);
    return [section, button];
}

async function refreshPosts(posts) {
  // reuturn if we are missing params 
  if (!posts){
        return undefined;
    }
    let buttons = removeButtonListeners();
    let myMain = deleteChildElements(document.querySelector("main"));
  // get our posts to be displayed
    let posts_to_display = await displayPosts(posts);
    let button = addButtonListeners();
    return [buttons, myMain, posts_to_display, button];
}


async function selectMenuChangeEventHandler(event) {
  // make sure we have all of our event values, if not ignore the error with ? operator
    let userId = event?.target?.value || 1;
    let posts = await getUserPosts(userId);
    let refreshPostsArray = await refreshPosts(posts);
    return [userId, posts, refreshPostsArray];
}

async function initPage() {
  // make sure we get our users
    let users = await getUsers();
    let select = populateSelectMenu(users);
    return [users, select];
}

function initApp(){
    initPage();
    let select = document.getElementById("selectMenu");
    select.addEventListener("change", selectMenuChangeEventHandler, false);
}


document.addEventListener("DOMContentLoaded", initApp, false);