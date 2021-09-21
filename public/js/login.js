import axios from 'axios';

export const login = async (email,password) => {
    //console.log(email,password);
    try{
        const res = await axios({
            method:'POST',
            url: '/users/login',
            data: {
                email,
                password
            }
        });
        if(res.data.status === 'success'){
            window.setTimeout(()=> {
                location.assign('/');
            },1500);
        }
    }
    catch(err){
        alert("Incorrect email or password");
    }
    
};

export const logout = async() => {
    try{
        const res = await axios({
            method:'GET',
            url:'http://127.0.0.1:3001/users/logout',
        });
        if(res.data.status === 'success') location.assign('/');
    }
    catch(err){
        showAlert('error', 'error logging out!')
    }
}


