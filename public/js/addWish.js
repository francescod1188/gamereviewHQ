import axios from 'axios';

export const addWish = async (gameId,gameImage,gameTitle) => {
    try{
        const res = await axios({
            method:'POST',
            url: 'http://127.0.0.1:3001/upcoming-game/:id/addwish',
            data: {
                gameId,
                gameTitle,
                gameImage
            }
            
        });
        if(res.data.status === 'success'){
            window.setTimeout(()=> {
                location.assign('/mycollection');
            },1500);
        }
    }
    catch(err){
        alert("You have already reviewed this game!");
    }
    
};
