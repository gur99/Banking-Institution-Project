let creditCards = [];


function creditCard(creditCardnumber, expirationDate) {
    this.creditCardnumber = creditCardnumber;
    this.expirationDate = expirationDate;
    this.creditTransactions = [];
    this.billingDay = "1st of each month";
}
function user(firstName, lastName, email, dateOfBirth, gender, username, password, creditCard) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.dateOfBirth = dateOfBirth;
    this.gender = gender;
    this.username = username;
    this.password = password;
    this.creditCards = [];
    this.creditCards.push(creditCard);
}


// function user(firstName, lastName, email, dateOfBirth, gender, username, password, creditCard, expirationDate) {
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.email = email;
//     this.dateOfBirth = dateOfBirth;
//     this.gender = gender;
//     this.username = username;
//     this.password = password;

//     this.creditCard = creditCard;
//     this.expirationDate = expirationDate;
//     this.billingDay = "1st of each month";
//     this.creditTransactions = [];
// }



// Initialize an empty array in localStorage if it doesn't exist
if (!localStorage.getItem("users")) {
    // localStorage.setItem("users", JSON.stringify([]));

    // const Card1 = new creditCard("4111-1111-1111-1111", "25/12");
    // const Card2 = new creditCard("4222-2222-2222-2222", "26/11");
    // const Card3 = new creditCard("4444-4444-4444-4444", "28/09");
    // const Card4 = new creditCard("4555-5555-5555-5555", "29/08");
    // const Card5 = new creditCard("4425-5225-5885-9555", "31/08");


    // let users = [];
    // const user1 = new user("Alice", "Smith", "alice.smith@example.com", "1995-06-15", "Female", "alice123", "password1", Card1);
    // const user2 = new user("Bob", "Johnson", "bob.johnson@example.com", "1990-03-22", "Male", "bobthebuilder", "password2", Card2);
    // const user3 = new user("Charlie", "Brown", "charlie.brown@example.com", "1988-09-05", "Male", "charlieB", "password3", Card3);
    // const user4 = new user("Diana", "White", "diana.white@example.com", "1993-12-01", "Female", "dianaW", "password4", Card4);
    // const user5 = new user("Ethan", "Green", "ethan.green@example.com", "1997-07-19", "Male", "ethanG", "password5", Card5);


    // users.push(user1, user2, user3, user4, user5);
    let users = [];
    console.log(users);
    // Enter manualy users
    localStorage.setItem("users", JSON.stringify(users));
}



// Retrieve existing users from local storage
let users = JSON.parse(localStorage.getItem("users"));

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=]).{8,}$/;
const CREDITCARD_REGEX = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
const EXPIRATION_REGEX = /^(0[1-9]|1[0-2])\/(\d{2})$/;

let form = document.getElementById("signUpForm");



function addUser() {
    debugger

    // Clear previous errors
    document.getElementById('emailError').style.display = "none";
    document.getElementById('passwordError').style.display = "none";
    document.getElementById('dobError').style.display = "none";
    document.getElementById('ccNumberError').style.display = "none";
    document.getElementById('ccExpirationError').style.display = "none";
    document.getElementById('firstNameError').style.display = "none";
    document.getElementById('usernameError').style.display = "none";

    valid = true;

    //Getting User First Name
    const firstName = document.getElementById('firstName').value;

    // Validate First Name
    if (!firstName) {
        document.getElementById('firstNameError').style.display = "block";
        valid = false;
    }
    // Getting User Last Name
    const lastName = document.getElementById('lastName').value;

    // Gender input
    let genderInput = document.querySelector('input[name="sex"]:checked').value;

    // Email validation
    //test function- return a boolean that indicates either a value has a pattern or not 
    let email = document.getElementById('email').value;
    if (!EMAIL_REGEX.test(email)) {
        document.getElementById('emailError').style.display = "block";
        valid = false;
    }

    // Password validation
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    let password = document.getElementById('password').value;
    if (!passwordRegex.test(password)) {
        document.getElementById('passwordError').style.display = "block";
        valid = false;
    }

    // Date of birth validation
    let dob = new Date(document.getElementById('dob').value);
    let currentDate = new Date();
    let ageLimit = currentDate.getFullYear() - dob.getFullYear() > 16 ||
        (currentDate.getFullYear() - dob.getFullYear() === 16 && currentDate.getMonth() > dob.getMonth()) ||
        (currentDate.getFullYear() - dob.getFullYear() === 16 && currentDate.getMonth() === dob.getMonth() && currentDate.getDate() >= dob.getDate());
    let formattedDate;
    if (isNaN(dob) || !ageLimit) {
        document.getElementById('dobError').style.display = "block";
        valid = false;
    } else {
        let year = dob.getFullYear(); // Example: 2025
        let month = dob.getMonth() + 1; // Example: 1 (January, so add 1 to make it 2-based)
        let day = dob.getDate();

        // Add leading zeros if needed
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        formattedDate = year + '-' + month + '-' + day;
    }

    // Credit card number validation
    const CREDITCARD_REGEX = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
    let ccNumber = document.getElementById('ccNumber').value;
    if (!CREDITCARD_REGEX.test(ccNumber)) {
        document.getElementById('ccNumberError').style.display = "block";
        valid = false;
    }

    // Credit card expiration validation
    let ccExpirationRegex = /^(0[1-9]|1[0-2])\/([2-9]\d)$/;
    let ccExpiration = document.getElementById('ccExpiration').value;

    // Split the expiration date into month and year
    let splitExpiration = ccExpiration.split('/');
    let expMonth = parseInt(splitExpiration[0], 10);  // Convert month to a number
    let expYear = parseInt(splitExpiration[1], 10);  // Convert year to a number

    const now = new Date();
    const expirationDate = new Date(`20${expYear}`, expMonth - 1); // Create a date object with the expiration date
    let formattedExpDate;
    if (!ccExpirationRegex.test(ccExpiration) || expirationDate <= now) {
        document.getElementById('ccExpirationError').style.display = "block";
        valid = false;
    }

    else {
        // Format MM-YY if valid
        if (expMonth < 10) {
            expMonth = '0' + expMonth; // Add leading zero to month if necessary
        }
        formattedExpDate = `${expMonth}/${expYear}`;
    }


    // Username and email uniqueness validation
    const usernameInput = document.querySelector('#username').value;

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    let isEmailTaken = false;
    let isUsernameTaken = false;

    if (!usernameInput) {
        document.getElementById('usernameError').style.display = "block";
        valid = false;
    }
    // Check if the email or username is already in use
    for (let i = 0; i < existingUsers.length; i++) {
        if (existingUsers[i].email === email) {
            isEmailTaken = true;
        }
        if (existingUsers[i].username === usernameInput) {
            isUsernameTaken = true;
        }
    }

    if (isEmailTaken) {
        document.getElementById('emailError').style.display = "block";
        valid = false;
    }

    if (isUsernameTaken) {
        document.getElementById('usernameError').style.display = "block";
        valid = false;
    }


    if (valid) {
        // Add Credit Card
        let newCard = new creditCard(ccNumber, formattedExpDate)
        // Add user to the array
        let newUser = new user(firstName, lastName, email, formattedDate, genderInput, usernameInput, password, newCard);
        users.push(newUser);
        console.log(newUser);
        // Add item to local storage
        localStorage.setItem("users", JSON.stringify(users));
        alert("User added successfully!");
        form.reset();

        // Redirect to the login page
        window.location.href = 'login.html';
    }
}

// Add Listener for dash inside XXXX-XXXX...
{
    // Get the input field
    let ccInput = document.getElementById('ccNumber');

    if (ccInput) {

        // Listen for input in the field
        ccInput.addEventListener('input', function () {
            // Get the value of the input and remove any dashes
            let value = ccInput.value.split('-').join('');

            // Add a dash after every 4 characters
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0 && i <= 12) {
                    formattedValue += '-'; // Add a dash after every 4 digits, but only 3 times
                }
                formattedValue += value[i];
            }

            // Set the formatted value back to the input field
            ccInput.value = formattedValue;
        });
    }
}


// Add Listener for slash '/' sign inside MM/YY
{
    // Get the input field
    let expirationInput = document.getElementById('ccExpiration');

    if (expirationInput) {


        // Listen for input in the field
        expirationInput.addEventListener('input', function () {
            // Get the input value and remove existing slashes
            let value = expirationInput.value.split('/').join('');

            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                // Add a slash after the first two digits
                if (i === 2) {
                    formattedValue += '/';
                }
                formattedValue += value[i];
            }

            // Set the formatted value back to the input
            expirationInput.value = formattedValue;
        });
    }
}



// LOG IN Page validate user and transaction to dash page

{
    // Add a click event listener to the login button


    function loginToAccount() {

        document.getElementById('loginUserError').style.display = "none";
        document.getElementById('loginPasswordError').style.display = "none";
        // Get the username and password from the input fields
        const usernameInput = document.querySelector(".loginField[placeholder='username']").value;
        const passwordInput = document.querySelector(".loginField[placeholder='password']").value;

        // Get the list of users from localStorage
        const users = localStorage.getItem("users"); // Get the data as a string
        let userList = []; // Initialize an empty array

        if (users) {
            userList = JSON.parse(users); // Convert the string back to an array
        }

        // Check if a user with the given username and password exists
        let userFound = false;
        let passwordCorrect = false;

        for (let i = 0; i < userList.length; i++) {
            const user = userList[i];
            if (user.username === usernameInput) {
                userFound = true;
                if (user.password === passwordInput) {
                    passwordCorrect = true;
                    break;
                }
            }
        }

        if (userFound && passwordCorrect) {
            // Find the current user's data
            let currentUser;
            for (let i = 0; i < userList.length; i++) {
                if (userList[i].username === usernameInput) {
                    currentUser = userList[i];
                    break;
                }
            }

            // Save the current user's data to localStorage
            localStorage.setItem("currentUser", JSON.stringify(currentUser));

            // Go to the dashboard page
            window.location.href = "dashboard.html";
        } else {
            if (!userFound)
                document.getElementById('loginUserError').style.display = "block";
            else if (!passwordCorrect)
                document.getElementById('loginPasswordError').style.display = "block";
        }
    }
}



