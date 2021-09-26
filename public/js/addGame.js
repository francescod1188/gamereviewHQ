import axios from 'axios';
//Add gane to my collection
export const addGame = async (gameId,gameImage,gameTitle) => {
    //Build game model when using this link
    try{
        const res = await axios({
            method:'POST',
            url: '/game/:id/addgame',
            data: {
                gameId,
                gameTitle,
                gameImage
            }
            
        });
        window.location.href = '/mycollection';
    }
    catch(err){
        alert("You have already reviewed this game!");
    }
    
};
