"use strict";
const url = `http://localhost:3000/blogs`;

let blogs = [];
const form = document.querySelector('form');
const submitBtn = document.querySelectorAll('button')[1];
const titleBox = document.getElementById('title');
const authorBox = document.getElementById('author');
const contentBox = document.getElementById('content');
const notifCont = document.querySelector('.notification-container');

submitBtn.addEventListener('click', postBlog);

async function postBlog(e){
    if(form.reportValidity()){
        e.preventDefault();
        try{
            const response = await fetch(url);
            if(!response.ok)
                throw Error(`Error ${response.url} $${response.statusText}`);
            blogs = await response.json();
        }catch(error){
            showError(error.message);
        }
    
        const id = blogs.length + 1;
        const title = titleBox.value;
        const author = authorBox.value;
        const date = new Date().toISOString();
        const profile = 'images/default.jpeg';
        const content = contentBox.value;

        titleBox.value = '';
        authorBox.value = '';
        contentBox.value = '';

        let blog = {id, title, author, date, profile, content};
        blog = JSON.stringify(blog);

        try{
            const response2 = await fetch(url, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: blog,
            });
            if(!response2.ok)
                throw Error(`Error ${response2.url} $${response2.statusText}`);
            blog = await response2.json();
            blogs.push(blog);
        }catch(error){
            showError(error.message);
        }

        window.location.href = "index.html";
    }
}

function showError(message){
    const closeBtn = notifCont.querySelector('button');
    const notif = notifCont.querySelector('.notification');

    notif.textContent = message;
    closeBtn.addEventListener('click', function(){notifCont.classList.add('hidden')});

    notifCont.classList.remove('hidden');
}
