function validateLoginInput(username,email,password){
    if(username == null || username == undefined || username.length === 0){
        return {param: 'username', value: false, message:'No Username Provided!'};
    }else if(email == null || email == undefined || email.length === 0){
        return {param: 'email', value: false, message:'No Email Provided!'};
    }else if(password == null || password == undefined || password.length === 0){
        return {param: 'password', value: false, message:'No Password Provided!'};
    }

    if(!(email.includes('@'))){
        return {param: 'email', value: false, message:'Incorrect Email Format!'};
    }

    return {param: 'login', value:true, message:'Login Input Valid'};
}

function validateRegistrationInput(username,email,password){
    if(username == null || username == undefined || username.length === 0){
        return {param: 'username', value: false, message:'No Username Provided!'};
    }else if(email == null || email == undefined || email.length === 0){
        return {param: 'email', value: false, message:'No Email Provided!'};
    }else if(password == null || password == undefined || password.length === 0){
        return {param: 'password', value: false, message:'No Password Provided!'};
    }

    if(password.length < 10){
        return {param: 'password', value: false, message:'Minimum Password Length must be 10!'};
    }else if(!containsSpecialChars(password)){
        return {param: 'password', value: false, message:'Password must contain at least 1 special character!'};
    }

    if(!(email.includes('@'))){
        return {param: 'email', value: false, message:'Incorrect Email Format!'};
    }

    return {param: 'login', value:true, message:'Login Input Valid'};
}

function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
}


export {validateLoginInput, validateRegistrationInput}