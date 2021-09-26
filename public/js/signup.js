import axios from 'axios';
//When a user makes a post request on the sign up page, create an account
export const signup = async (username,email,password,passwordConfirm) => {
    try{
        //Build user
        const res = await axios({
            method:'POST',
            url: '/users/signup',
            data: {
                username,
                email,
                password, 
                passwordConfirm
            }
        });
        if(password != passwordConfirm){
            alert("Passwords must match!");
        }
        //If successful
        if(res.data.status === 'success'){
            window.setTimeout(()=> {
                location.assign('/');
            },1500);
        }
    }
    //If fails
    catch(err){
        alert("Sign Up Failed, try again");
    }
    
};
