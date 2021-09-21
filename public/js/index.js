import '@babel/polyfill';
import {login,logout} from './login';
import {signup} from './signup';
import {createReview} from './review';
import {addGame} from './addGame';

const logoutBtn = document.querySelector('.nav-link.logout');
const loginForm = document.querySelector('.form');
const signupForm = document.querySelector('.signupForm');
const reviewForm = document.querySelector('.reviewForm');
const gameForm = document.querySelector('.gameForm');

if(loginForm)
    loginForm.addEventListener('submit', e=> {
        e.preventDefault();    
        //console.log('LOGIN');
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        //console.log(email);
        login(email,password);
    });

if(logoutBtn) logoutBtn.addEventListener('click',logout);

if(signupForm)
    signupForm.addEventListener('submit', e=> {
        e.preventDefault();    
        //console.log('SIGNUP');
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const passwordConfirm = document.getElementById('signupConfirmPassword').value;
        signup(username,email,password,passwordConfirm);
    });


if(reviewForm)
    reviewForm.addEventListener('submit', e=> {    
        e.preventDefault();    
        const gameId = document.getElementById('gameIdValue').innerHTML;
        const gameTitle = document.getElementById('gameTitleValue').innerHTML;
        const gameImage = document.getElementById('gameImageSrc').src;
        const reviewSummary = document.getElementById('review-summary').value;
        const select = document.getElementById('rHeaders');
        const reviewHeader = select.options[select.selectedIndex].value;
        const gameplayScore = document.getElementById('gameplayScoreInput').value;
        const graphicsScore = document.getElementById('graphicsScoreInput').value;
        const storyScore = document.getElementById('storyScoreInput').value;
        const audioScore = document.getElementById('audioScoreInput').value;
        const performanceScore = document.getElementById('performanceScoreInput').value;
        const timePlayed = document.getElementById('playtimeInput').value;
        createReview(gameId,gameImage,gameTitle,reviewSummary,reviewHeader,gameplayScore,graphicsScore,storyScore,audioScore,performanceScore,timePlayed);
    });

document.querySelector('.searchBar').addEventListener('submit', e=> {
    e.preventDefault();
    const search = document.getElementById('searchName').value;
    window.location.href = '/search/' + search;
});






