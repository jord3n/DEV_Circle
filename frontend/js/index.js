"use strict";

const url = `http://localhost:3000/blogs`;
let blogs = [];
var CURRENT_PAGE = 1;
var SEARCH = " ";
const articlesWrap = document.querySelector('.articles-wrapper');
const pagWrap = document.querySelector('.pagination-container');
const searchBar = document.querySelector('input');
const notifCont = document.querySelector('.notification-container');
const MAX_LENGTH = 50;//maximum length of the blog content shown on the page, i.e., if the blog content is longer, truncate it.
const PAGE_LIMIT = 12;//number of blogs per page

window.addEventListener('DOMContentLoaded', fetchBlogs(CURRENT_PAGE, SEARCH));


async function fetchBlogs(pageNum, search){
    try{
        const response = await fetch(`${url}?_sort=date&_order=desc&_page=${pageNum}&_limit=${PAGE_LIMIT}&q=${search}`);
        if(!response.ok)
            throw Error(`Error ${response.url} $${response.statusText}`);
        blogs = await response.json();
        loadBlogs();
        loadPagBtns(response.headers.get('x-total-count'));
    }catch(error){
        showError(error.message);
    }
}

function loadBlogs(){
    const fragment = document.createDocumentFragment();
    blogs.forEach(blog => fragment.append(generateBlog(blog)));
    articlesWrap.innerHTML = '';
    articlesWrap.appendChild(fragment);
}

function loadPagBtns(totalPosts){

    const numOfBtns = totalPosts/PAGE_LIMIT;
    const fragment = document.createDocumentFragment();
    for(let i = 0; i < numOfBtns; i++){
        fragment.append(generatePageBtn(i+1));
    }
    pagWrap.innerHTML = '';
    pagWrap.appendChild(fragment);
}

function generateBlog(blog){
    const article = document.createElement('article');
    article.classList.add('card');
 
    //create div
    const div1 =document.createElement('div');
    div1.classList.add('card-header');
 
    //image for div
    const img = document.createElement('img');
    img.classList.add('avatar');
    img.src = blog.profile;
    img.height = "60";
    img.width = "60";
    img.alt = "profile picture";
    img.className = "avatar";

    //div for div
    const divDiv = document.createElement('div');
    const date = new Date(blog.date);
    divDiv.textContent = blog.author + " · " + date.toDateString();

    div1.appendChild(img);
    div1.appendChild(divDiv);

    //create second div 
    const div2 = document.createElement('div');
    div2.classList.add('card-body');
 
    //creaete h3 and p elements
    const header3 = document.createElement('h3');
    header3.textContent = blog.title;

    const para = document.createElement('p');

    if(blog.content.length > MAX_LENGTH){
        para.textContent = blog.content.substring(0, MAX_LENGTH) + '...';
      }else{
        para.textContent = blog.content;
    }

    div2.appendChild(header3);
    div2.appendChild(para);

    article.appendChild(div1);
    article.appendChild(div2);
    article.addEventListener('click', function(){window.location.href = `details.html?id=${blog.id}`;});

    return article;
}

function generatePageBtn(numberOfBtns){
    const btn = document.createElement('button');
    btn.classList.add('page-btn');
    btn.textContent = numberOfBtns;
    btn.addEventListener('click', changePage);
    if(btn.textContent == CURRENT_PAGE){
        btn.classList.add('active');
    }

    return btn;
}

function changePage(e){
    CURRENT_PAGE = e.target.textContent;
    SEARCH = document.querySelector('input').value;
    const btns = document.querySelectorAll('.page-btn');
    btns.forEach(i => {
        if(i.classList.contains('active')){
          i.classList.remove('active');
        }
      });
    
    e.target.classList.add('active');
    fetchBlogs(CURRENT_PAGE, SEARCH);
}

searchBar.addEventListener("change", searchFor);

function searchFor(e){
    CURRENT_PAGE = 1;
    fetchBlogs(CURRENT_PAGE, e.target.value);
}

function showError(message){
    const closeBtn = notifCont.querySelector('button');
    const notif = notifCont.querySelector('.notification');

    notif.textContent = message;
    closeBtn.addEventListener('click', function(){notifCont.classList.add('hidden')});

    notifCont.classList.remove('hidden');
}