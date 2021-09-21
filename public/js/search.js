//This file is the search game function
document.querySelector('.searchBar').addEventListener('submit', e=> {
    e.preventDefault();
    const search = document.getElementById('searchName').value;
    window.location.href = '/search/' + search;
});