"use strict";

const id = new URLSearchParams(window.location.search).get('id');
let blog;
const url = `http://localhost:3000/blogs/${id}`;
const notifCont = document.querySelector('.notification-container');

window.addEventListener('DOMContentLoaded', fetchBlog);

async function fetchBlog(){
    try{
        const response = await fetch(url);
        if(!response.ok)
            throw Error(`Error ${response.url} $${response.statusText}`);
        blog = await response.json();
        displayBlog(blog);
    }catch(error){
        showError(error.message);
    }
}

function displayBlog(blog){
    const article = document.querySelector('.wrapper');
    

    //create header
    const header2 = document.createElement('h2');
    header2.textContent = blog.title;

    //create div1
    const div1 = document.createElement('div');
    div1.classList.add('article-header');

    //img for div
    const image = document.createElement('img');
    image.src = blog.profile;
    image.alt = "profile picture";
    image.width = "60";
    image.height = "60";
    image.classList.add('avatar');

    //div for div
    const divDiv = document.createElement('div');
    const date = new Date(blog.date);
    divDiv.textContent = blog.author + ' · ' + date.toDateString();

    //second div for div
    const divDiv2 = document.createElement('div');
    divDiv2.classList.add('btn-container');

    //a for second div for div
    const anchor = document.createElement('a');
    anchor.classList.add('btn');
    anchor.innerHTML = '<i class="fa-solid fa-pen"></i>';
    anchor.href = `edit.html?id=${id}`;

    //button for second div for div
    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    btn.addEventListener('click', deleteBlog);

    divDiv2.appendChild(anchor);
    divDiv2.appendChild(btn);

    div1.appendChild(image);
    div1.appendChild(divDiv);
    div1.appendChild(divDiv2);

    //p for div
    const para = document.createElement('p');
    para.classList.add('article-body');
    para.textContent = blog.content;

    article.appendChild(header2);
    article.appendChild(div1);
    article.appendChild(para);

}

async function deleteBlog(){
    try{
        const response = await fetch(url, {method: 'DELETE'});
        if(!response.ok){
            throw Error(`Error ${response.url} $${response.statusText}`);
        }

        const response2 = await fetch("http://localhost:3000/blogs");
        if(!response2.ok){
            throw Error(`Error ${response2.url} $${response2.statusText}`);
        }

        blog = await response.json();
        window.location.href = "index.html";
        let index = blog.findIndex(element => element.id == id);
        if(index === id){
            blog.splice(index, 1);
        };
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