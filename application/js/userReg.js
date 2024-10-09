//pulls information from registration form for validation.
const resgistrationForm=document.getElementById("userRegForm");
const validate = (input, validators)=>{
    let isValid = true;
    validators.forEach(validator => {
        isValid = validator(input)
    });
    return isValid;
}

//event listening for registration submission.
resgistrationForm && resgistrationForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault(); // Prevent default form submission

        const firstName = event.target.elements["regFirstName"].value;
        const lastName = event.target.elements["regLastName"].value;
        const username = event.target.elements["regUsername"].value;
        const email = event.target.elements["regEmail"].value;
        const password = event.target.elements["regPass"].value;
        const confirmPassword = event.target.elements["regConfirmPass"].value;

        validateUsername(username);
        validatePassword(password);

    }

);

const usernameLengthValidator = (username) => {
    if (username.length > 2){
        return true;
    }
    else {
        throw new Error('Username must be at least 3 characters long.', { cause: "username_length"});
    }
};

const usernameAlphanumpericValidator = (username) => {
    const regex = new RegExp("^[a-zA-Z0-9]*$");
    if (regex.test(username)){
        return true;
    }
    else{
        throw new Error('Username must contain only alphanumeric characters.', {cause: "username_Num_Letter"});
    }
};

const usernameFirstCharacterValidator = (username) =>{
    const regex = new RegExp("^[a-zA-Z]*$");
    if (regex.test(username[0])){
        return true;
    }
    else {
        throw new Error('Username must start with a letter.', {cause: "username_First_Character"});
    }
};

//starts username validation
const validateUsername = (username)=>{

    try{
        const validators = [usernameAlphanumericValidator, usernameFirstCharacterValidator, usernameLengthValidator];
        const isValidUsername = validate(username, validators);

    }
    catch(e){
        const passwordField = document.getElementById("regPassword");
        const confirmPasswordField = document.getElementById("regConfirmPassword");
        passwordField.value = "";
        confirmPasswordField.value = "";
     }

};

//checks password validity. Having certain speficications for a valid password.
const passwordCharacterValidity = (password) =>{

    
    const regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[(\/*-+!@#$^&*)]).{8,}$");
    if (regex.test(password)){
        return true;
    }
    else{
        throw new Error('Password must be between 8 - 18 characters long AND contain at least 1 number, 1 capital letter, and one special character (\/*-+!@#$^&*)', { cause: "password_Valid_Error"});
    }

};
//Validates password match for password and confirm password.
const passwordMatchValidator = (password) =>{
    const regConfirmPassword = document.getElementById("regConfirmPassword").value;

    if (password === regConfirmPassword){
        return true;
    }
    else{
        throw new Error('Passwords must match.', {cause: "password_mismatch"});
    }

};
//calls password validators to check password security.
const validatePassword = (password)=>{
    try{
        const validators = [passwordCharacterValidity, passwordMatchValidator];
        const isValidPassword = validate(password, validators);

    }
    catch(e){
        const passwordField = document.getElementById("regPassword");
        const confirmPasswordField = document.getElementById("regConfirmPassword");
        passwordField.value = "";
        confirmPasswordField.value = "";
    }

};