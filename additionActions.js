// let creditCards = [];
// function creditCard(creditCard, expirationDate) {
//     this.creditCard = creditCard;
//     this.expirationDate = expirationDate;
//     this.creditTransactions = [];
//     this.billingDay = "1st of each month";
// }







let LoadFilesBtn = document.getElementById('LoadFiles');
let AddNewCard = document.getElementById('AddCreditCard');
let mainBox = document.getElementById('actionBox');
let currentCreditCard;


let selectedCard;

// Load transactions file
{
    LoadFilesBtn.addEventListener("click", function () {
        // debugger
        // Clear the mainBox content
        mainBox.innerHTML = "";


        let fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.setAttribute("accept", ".csv"); // Restrict file selection to .csv files
        fileInput.setAttribute("id", "csvFileInput");
        // fileInput.style.display = "none";

        // Create a header
        let fileInputHeader = document.createElement("h2");
        fileInputHeader.textContent = "Choose file to upload with transactions (Please note that the system only accepts CSV files.)";

        // JUST FOR SELF VALIDATION-------------------------------------

        // Create an output container
        let output = document.createElement("pre");
        output.setAttribute("id", "output");



        // Check if there are more than 1 credit cards
        if (currentUser.creditCards.length > 1) {
            // Create a dropdown for selecting credit cards
            let selectCardHeader = document.createElement("h2");
            selectCardHeader.textContent = "Select a credit card to add transactions to.";

            let cardDropdown = document.createElement("select");
            cardDropdown.setAttribute("id", "cardDropdown");

            // Add options to the dropdown for each credit card
            for (item in currentUser.creditCards) {
                let option = document.createElement("option");
                option.value = parseInt(item);
                option.textContent = `${currentUser.creditCards[item].creditCardnumber}`;
                cardDropdown.appendChild(option);
            }

            // Append dropdown to the mainBox
            mainBox.appendChild(selectCardHeader);
            mainBox.appendChild(cardDropdown);

        }
        else {
            selectedCard = currentUser.creditCards[0];
        }



        // -------------------------------------------------------------






        let uploadBtn = document.createElement("ipnut");
        uploadBtn.type = "button";
        uploadBtn.textContent = "Upload File";
        uploadBtn.setAttribute("id", "uploadBtn");





        // Append elements to the mainBox
        mainBox.appendChild(fileInputHeader);
        mainBox.appendChild(fileInput);
        mainBox.appendChild(uploadBtn);
        mainBox.appendChild(output);

        // Add event listener to the upload button
        let indexOfSelectedCard = 0;
        uploadBtn.addEventListener("click", function () {
            // debugger
            if (document.getElementById("cardDropdown")) {
                // Find selected card index
                indexOfSelectedCard = document.getElementById("cardDropdown").value;

                // Assign the value of the selected Card
                selectedCard = currentUser.creditCards[indexOfSelectedCard];
            }

            const file = fileInput.files[0]; // Get the selected file

            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    const csvContent = e.target.result;
                    const transactions = parseCSV(csvContent);

                    // Display the parsed transactions
                    // output.textContent = JSON.stringify(transactions, null, 2);

                    // Update local storage with the transactions
                    let users = localStorage.getItem("users"); // Get the data as a string
                    let userList = []; // Initialize an empty array

                    if (users) {
                        userList = JSON.parse(users); // Convert the string back to an array
                    }

                    for (item in userList) {
                        if (currentUser.username === userList[item].username) {
                            // debugger
                            if (selectedCard.creditTransactions.length == 0) {
                                // Assign transactions to appropriate card of current user
                                currentUser.creditCards[indexOfSelectedCard].creditTransactions = transactions;
                                // Assign transactions to appropriate card of current user INSIDE users List
                                userList[item].creditCards[indexOfSelectedCard].creditTransactions = transactions;
                                break;
                            }
                            else {
                                // debugger
                                let concatenated = userList[item].creditCards[indexOfSelectedCard].creditTransactions.concat(transactions);//Concatenate the old transactions with the new
                                // FUNCTION TO REORDER  concatenate  NEW TRANSACTIONS 
                                let concatOrderedTransactions = sortTransactions(concatenated);
                                // Assign transactions to appropriate card of current user
                                currentUser.creditCards[indexOfSelectedCard].creditTransactions = concatOrderedTransactions;
                                // Assign transactions to appropriate card of current user INSIDE users List
                                userList[item].creditCards[indexOfSelectedCard].creditTransactions = concatOrderedTransactions;
                                break;
                            }
                        }
                    }
                    actionBox.textContent = "The file was uploaded successfully.";
                    localStorage.setItem("currentUser", JSON.stringify(currentUser));
                    localStorage.setItem("users", JSON.stringify(userList));
                };



                reader.readAsText(file); // Read the file as text
            } else {
                alert("Please select a file to upload.");
            }
        });

        // CSV parsing function
        function parseCSV(csvText) {
            const rows = csvText.split("\n"); // Split the content by newlines
            const headers = rows[0].split(","); // Extract headers
            const transactions = [];

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i].trim();
                if (row) { // Skip empty rows
                    const values = row.split(",");
                    const transaction = {};

                    for (let j = 0; j < headers.length; j++) {
                        transaction[headers[j].trim()] = values[j].trim();// Assign values to corresponding headers
                    }

                    transactions.push(transaction);
                }
            }

            return transactions;
        }



        uploadBtn.addEventListener("click", function () {


            // Get the indexOfSelected Card
            if (document.getElementById("cardDropdown")) {
                indexOfSelectedCard = document.getElementById("cardDropdown").value;
            }
            else {
                indexOfSelectedCard = 0;
            }


            const file = fileInput.files[0]; // Get the selected file

            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    const csvContent = e.target.result;
                    const transactions = parseCSV(csvContent);

                    // Display the parsed transactions
                    // output.textContent = JSON.stringify(transactions, null, 2);

                    // Show success indicator
                    // alert("File uploaded successfully!");

                    // Disable further uploads
                    actionBox.textContent = "File uploaded successfully!"
                };

                reader.readAsText(file); // Read the file as text
            } else {
                // alert("Please select a file to upload.");
            }
        });
    });


    // });

}



// // AddCreditCard

AddNewCard.addEventListener("click", function () {
    // Get the ActionBox element
    const actionBox = document.getElementById("actionBox");

    // Clear any existing content inside ActionBox
    actionBox.textContent = "";

    // Create the divCredit container
    const divCredit = document.createElement("div");
    divCredit.id = "divCredit";

    // Create the ccNumberBlock
    const ccNumberBlock = document.createElement("div");
    ccNumberBlock.className = "ccNumberBlock";

    // Add Credit Card description
    const ccNumberDescription = document.createElement("div");
    ccNumberDescription.className = "description";
    ccNumberDescription.innerHTML = '<i class="fa fa-credit-card"></i> Credit card';
    ccNumberBlock.appendChild(ccNumberDescription);

    // Add Credit Card Number input
    const ccNumberInput = document.createElement("input");
    ccNumberInput.type = "text";
    ccNumberInput.id = "ccNumber";
    ccNumberInput.placeholder = "XXXX-XXXX-XXXX-XXXX";
    ccNumberInput.maxLength = 19;
    ccNumberInput.required = true;
    ccNumberBlock.appendChild(ccNumberInput);

    // Add Credit Card Number Error message
    const ccNumberError = document.createElement("div");
    ccNumberError.id = "ccNumberError";
    ccNumberError.style.display = "none";
    ccNumberError.innerHTML =
        "Credit card number must be in the<br>format XXXX-XXXX-XXXX-XXXX.";
    ccNumberBlock.appendChild(ccNumberError);

    // Append ccNumberBlock to divCredit
    divCredit.appendChild(ccNumberBlock);

    // Create the ccExpBlock
    const ccExpBlock = document.createElement("div");
    ccExpBlock.className = "ccExpBlock";

    // Add Expiration description
    const ccExpirationDescription = document.createElement("div");
    ccExpirationDescription.className = "description";
    ccExpirationDescription.textContent = "Expiration (mm/yy)";
    ccExpBlock.appendChild(ccExpirationDescription);

    // Add Expiration input
    const ccExpirationInput = document.createElement("input");
    ccExpirationInput.type = "text";
    ccExpirationInput.id = "ccExpiration";
    ccExpirationInput.placeholder = "MM/YY";
    ccExpirationInput.maxLength = 5;
    ccExpirationInput.required = true;
    ccExpBlock.appendChild(ccExpirationInput);

    // Add Credit Card Expiration Error message
    const ccExpirationError = document.createElement("div");
    ccExpirationError.id = "ccExpirationError";
    ccExpirationError.style.display = "none";
    ccExpirationError.innerHTML = "Credit card expiration must be<br>a valid future date in mm/yy format.";
    ccExpBlock.appendChild(ccExpirationError);

    // Append ccExpBlock to divCredit
    divCredit.appendChild(ccExpBlock);

    // Create the billingDayBlock
    const billingDayBlock = document.createElement("div");
    billingDayBlock.className = "billingDayBlock";

    // Add Monthly Billing Day description
    const billingDayDescription = document.createElement("div");
    billingDayDescription.className = "description";
    billingDayDescription.textContent = "Monthly Billing Day";
    billingDayBlock.appendChild(billingDayDescription);

    // Add Monthly Billing Day input
    const billingDayInput = document.createElement("input");
    billingDayInput.type = "text";
    billingDayInput.value = "1st of each month";
    billingDayInput.disabled = true;
    billingDayBlock.appendChild(billingDayInput);

    // Append billingDayBlock to divCredit
    divCredit.appendChild(billingDayBlock);

    // Append divCredit to ActionBox
    actionBox.appendChild(divCredit);

    // Create the Submit Button container
    const submitBtn = document.createElement("div");
    submitBtn.id = "submitBtn";

    // Add Sign-Up Button
    let addCardBtn = document.createElement("input");
    addCardBtn.type = "button";
    addCardBtn.id = "signUpBtn";
    addCardBtn.value = "Add Card";
    // debugger
    addCardBtn.onclick = function () {
        // Add Card function--------------------------------------------------------------------------------------------------------------------------------------------

        // Clear previous errors
        document.getElementById('ccNumberError').style.display = "none";
        document.getElementById('ccExpirationError').style.display = "none";

        valid = true;

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
        let expMonth = parseInt(splitExpiration[0]);  // Convert month to a number
        let expYear = parseInt(splitExpiration[1]);  // Convert year to a number

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


        // debugger
        if (valid) {

            // create an array of creditCards of the current user 
            let newCreditCard = new creditCard(ccNumber, formattedExpDate);

            // Checking that there are no identical cards
            for (item of currentUser.creditCards) {
                if (item.creditCardnumber === newCreditCard.creditCardnumber) {
                    alert("The card already exists in the system.")
                    return;
                }
            }

            // Add user to the array
            currentUser.creditCards.push(newCreditCard);

            // Update local storage with the transactions
            let users = localStorage.getItem("users"); // Get the data as a string
            let userList = []; // Initialize an empty array

            if (users) {
                userList = JSON.parse(users); // Convert the string back to an array
            }

            for (item in userList) {
                if (currentUser.username === userList[item].username) {
                    // debugger
                    // Assign new card to appropriate user INSIDE users List
                    userList[item].creditCards.push(newCreditCard);
                    break;
                }
            }

            // Add item to local storage
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            localStorage.setItem("users", JSON.stringify(userList));

            actionBox.textContent = "Credit card added successfully.";
            alert('New Credit Card Added Successfully!');
        }

        // -----------------------------------------------------------------------------------------------------------------------------------------------------------------

    };
    submitBtn.appendChild(addCardBtn);

    // Append Submit Button container to ActionBox
    actionBox.appendChild(submitBtn);

    // Add Listener for dash inside XXXX-XXXX...
    {
        // debugger
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


});

