import axios from 'axios';

export const signup = async (username,email,password,passwordConfirm) => {
    try{
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
        if(res.data.status === 'success'){
            window.setTimeout(()=> {
                location.assign('/');
            },1500);
        }
    }
    catch(err){
        alert("Sign Up Failed, try again");
    }
    
};
