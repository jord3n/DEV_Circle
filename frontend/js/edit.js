"use strict";
const id = new URLSearchParams(window.location.search).get('id');
let blog;
const url = `http://localhost:3000/blogs/${id}`;

const form = document.querySelector('form');
const titleBox = document.querySelector('#title');
const contentBox = document.querySelector('#content');
const submitBtn = form.querySelector('button');
const notifCont = document.querySelector('.notification-container');

window.addEventListener('DOMContentLoaded', fetchReview);

async function fetchReview(){
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw Error(`Error ${response.url} ${response.statusText}`);
        }
        blog = await response.json();
        populateForm();

    }catch(error){
        showError(error.message);
    }
}

function populateForm(){
    titleBox.value = blog.title;
    contentBox.value = blog.content;
}

submitBtn.addEventListener('click', updateBlog);

async function updateBlog(e){
    if(form.reportValidity())
        e.preventDefault();
        blog.title = titleBox.value;
        blog.content = contentBox.value;
        try{
            const response = await fetch(url, {
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(blog),
            });
            if(!response.ok)
                throw Error(`Error ${response.url} ${response.statusText}`);
            window.location.href = "index.html";
        }catch(error){
            showError(error.message);
        }
}

function showError(message){
    const closeBtn = notifCont.querySelector('button');
    const notif = notifCont.querySelector('.notification');

    notif.textContent = message;
    closeBtn.addEventListener('click', function(){notifCont.classList.add('hidden')});

    notifCont.classList.remove('hidden');
}