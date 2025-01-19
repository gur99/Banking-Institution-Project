let transactions = [];
// Retrieve existing users from local storage
let currentUser = JSON.parse(localStorage.getItem("currentUser"));



let helloMessage = document.getElementById("helloMessage");


let messageBase = "Hello " + currentUser.firstName + ", Welcome back";
helloMessage.append(messageBase);

// Store the login time when the script loads
let loginTime = new Date();

function displayLastLogin() {
    const currentTime = new Date(); // Get the current date and time

    // Extract date and time components
    let day = currentTime.getDate();
    let month = currentTime.getMonth() + 1; // Months are 0-indexed
    let year = currentTime.getFullYear().toString().slice(-2); // Get the last two digits of the year
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();

    // Add leading zero if necessary
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    // Format the date and time as "DD/MM/YY HH:MM"
    const formattedDateTime = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;

    // Display the formatted date and time
    document.getElementById('dateDisplay').textContent = "Today's date: " + formattedDateTime;
}



// Calculate total Transaction per month:

function calculateTotalTransactionsForMonth(transactions, year, month) {
    let total = 0;

    // Iterate through each transaction
    for (item of transactions) {

        // Parse the transaction date
        let itemMonth = parseInt(item.Date.substring(3, 5));
        let itemYear = parseInt(item.Date.substring(6, 10));

        // Check if the transaction matches the given year and month
        if (
            itemYear === year &&
            itemMonth === month
        ) {
            // Add the transaction amount to the total (convert string to number)
            total += parseFloat(item.Amount);
        }
    }

    return total.toFixed(2); // Return total rounded to 2 decimal places
}



// SORT Concatenated Transactions
function sortTransactions(transactions) {
    // Helper function to convert a "DD/MM/YYYY" string to a Date object
    function parseDate(dateString) {
        let parts = dateString.split('/');
        return new Date(parts[2], parts[1] - 1, parts[0]); // YYYY, MM-1, DD
    }

    //  sorting function
    function compareTransactions(transaction1, transaction2) {
        var date1 = parseDate(transaction1.Date);
        var date2 = parseDate(transaction2.Date);

        if (date1 < date2) {
            return -1; // transaction1 comes before transaction2
        }
        if (date1 > date2) {
            return 1; // transaction1 comes after transaction2
        }
        return 0; // Both dates are equal
    }

    // Sort the transactions using the comparison function
    transactions.sort(compareTransactions);

    // Return the sorted array
    return transactions;
}
