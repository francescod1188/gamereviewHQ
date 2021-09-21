import axios from 'axios';

export const createReview = async (gameId,gameImage,gameTitle,reviewSummary,reviewHeader,gameplayScore,graphicsScore,storyScore,audioScore,performanceScore,timePlayed) => {
    try{
        const res = await axios({
            method:'POST',
            url: '/reviews/:id/createreview',
            data: {
                gameId,
                gameTitle,
                gameImage,
                reviewSummary,
                reviewHeader,
                gameplayScore,
                graphicsScore,
                storyScore,
                audioScore,
                performanceScore,
                timePlayed
            }
            
        });

        window.setTimeout(()=> {
            location.assign('/');
        },1500);
        
    }
    catch(err){
        alert("You have already reviewed this game!");
    }
    
};
