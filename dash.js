debugger
currentUser = JSON.parse(localStorage.getItem("currentUser"));
CardsTransactions = [];
let CurrnetUSerCards = [];
for (item of currentUser.creditCards) {
    CurrnetUSerCards.push(item);
    CardsTransactions.push(item.creditTransactions);
}

// transactions = [
//     {
//         "Date": "01/12/2024",
//         "Business Name": "Starbucks",
//         "Category": "Food & Beverage",
//         "Amount": "5.75"
//     },
//     {
//         "Date": "01/01/2024",
//         "Business Name": "Walmart",
//         "Category": "Retail & Shopping",
//         "Amount": "45.2"
//     },
//     {
//         "Date": "02/01/2025",
//         "Business Name": "Amazon",
//         "Category": "Retail & Shopping",
//         "Amount": "52.99"
//     },
//     {
//         "Date": "01/01/2025",
//         "Business Name": "Walmart",
//         "Category": "Retail & Shopping",
//         "Amount": "45.2"
//     },
//     {
//         "Date": "02/12/2024",
//         "Business Name": "Amazon",
//         "Category": "Retail & Shopping",
//         "Amount": "52.99"
//     }
// ]


// fill Virtual credit card
{
    for (item of currentUser.creditCards) {
        debugger

        // Call the function to create the template
        createCreditCardTemplate(item);
    }
}




// Calculate Former and Future Expneses
{
    debugger

    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-based
    const currentDay = currentDate.getMonth() + 1; // getday() is 0-based

    // Calculate the last month and its year 
    let lastMonth, lastMonthYear;
    if (currentMonth === 1) {
        lastMonth = 12;
        lastMonthYear = currentYear - 1;
    } else {
        lastMonth = currentMonth - 1;
        lastMonthYear = currentYear;
    }

    // Calculate the next month and its year
    // let nextMonth, nextMonthYear;
    // if (currentMonth === 12) {
    //     nextMonth = 1;
    //     nextMonthYear = currentYear + 1;
    // } else {
    //     nextMonth = currentMonth + 1;
    //     nextMonthYear = currentYear;
    // }

    if (transactions.length === 0) {
        document.getElementById("LastMonthCharge").append("No Transactions have been loaded yet.");
    }
    else {

        // Calculate totals for the last month and next month
        const lastMonthTotal = calculateTotalTransactionsForMonth(transactions, lastMonthYear, lastMonth);
        const nextMonthTotal = calculateTotalTransactionsForMonth(transactions, currentYear, currentMonth);

        // Insert totals into the HTML
        document.getElementById("LastMonthCharge").append(`Last Month payment for: ${lastMonth}/${lastMonthYear} | Charges were Total: ${lastMonthTotal} $`);
        let futureBilling = `Future payment for: ${currentMonth}/${currentYear}` + ' | ' + `Expected charge: ${nextMonthTotal} $`;
        document.getElementById("FutureBilling").append(futureBilling);
        document.getElementById("billingMethod").append('Billing method: ' + currentUser.billingDay);

        // Saving for local storage the next month billing message
        localStorage.setItem("futureBilling", JSON.stringify(futureBilling));
    }
}

{

    if (transactions.length == 0) {
        let transactionsContainer = document.querySelector('.transactionContainer');
        transactionsContainer.textContent = "No Transactions have been loaded yet. ";
    }
    else {

        debugger
        let transactionContainer = document.querySelector('.transactionContainer');
        for (let index = transactions.length - 1; index >= transactions.length - 5; index--) {
            // Create a transaction div
            const transactionDiv = document.createElement("div");
            transactionDiv.className = "transaction";

            // Create the dot element
            const dot = document.createElement("div");
            dot.className = "dot";
            transactionDiv.appendChild(dot);

            // Create the transaction description
            const transactionDesc = document.createElement("p");
            transactionDesc.append('Amount: ' + transactions[index].Amount + ' $');
            transactionDesc.appendChild(document.createElement("br"));
            transactionDesc.append('Business Name: ' + transactions[index]["Business Name"]);
            transactionDiv.appendChild(transactionDesc);

            // Append the transaction div to the container
            transactionContainer.appendChild(transactionDiv);

            // Add a line divider, except for the last transaction
            if (index !== transactions.length - 5) {
                const line = document.createElement("div");
                line.className = "line";
                transactionContainer.appendChild(line);
            }
        }
    }
}


// Function to create the template dynamically
function createCreditCardTemplate(item) {
    // Create the main wrapper
    const creditWrapper = document.createElement("div");
    creditWrapper.className = "creditWrapper";
    creditWrapper.title = "Press to view your transactions";

    // Create the link element
    const link = document.createElement("a");
    link.href = "transactions.html";

    // Create the credit card container
    const creditCard = document.createElement("div");
    creditCard.className = "credit-card";

    // Create the first circle
    const circle1 = document.createElement("div");
    circle1.className = "circle1";

    // Create the second circle
    const circle2 = document.createElement("div");
    circle2.className = "circle2";

    // Create the head section
    const head = document.createElement("div");
    head.className = "head";

    // Add two inner divs to the head
    const headDiv1 = document.createElement("div");
    const headDiv2 = document.createElement("div");
    headDiv2.textContent = "Cha-Ching Virtual Credit Card";

    head.appendChild(headDiv1);
    head.appendChild(headDiv2);

    // Create the number section
    const number = document.createElement("div");
    number.className = "number";

    // Add four empty divs to the number section
    for (let i = 0; i < 4; i++) {
        const numberDiv = document.createElement("div");
        number.appendChild(numberDiv);
    }

    // Create the tail section
    const tail = document.createElement("div");
    tail.className = "tail";

    // Add the card owner and expiration date sections to the tail
    const cardOwner = document.createElement("div");
    cardOwner.className = "cardOwner";

    const exp = document.createElement("div");
    exp.className = "exp";
    exp.textContent = "Exp: ";

    const expDate = document.createElement("span");
    expDate.className = "expDate";

    exp.appendChild(expDate);
    tail.appendChild(cardOwner);
    tail.appendChild(exp);

    // Assemble all parts of the credit card
    creditCard.appendChild(circle1);
    creditCard.appendChild(circle2);
    creditCard.appendChild(head);
    creditCard.appendChild(number);
    creditCard.appendChild(tail);

    // Append the credit card to the link
    link.appendChild(creditCard);

    // Append the link to the creditWrapper
    creditWrapper.appendChild(link);

    // Append the creditWrapper to the body or a specific container
    document.querySelector('.mainDashboard').appendChild(creditWrapper);


    debugger


    // Populate the details for the current credit card
    const numberDivs = number.querySelectorAll("div");
    const currentCardNumber = item.creditCardnumber;
    const numbers = currentCardNumber.split('-');

    // Populate card numbers
    for (let i = 0; i < numbers.length; i++) {
        numberDivs[i].textContent = numbers[i];
    }
    // Populate expiration date
    expDate.textContent = item.expirationDate;

    // Populate card owner's name
    cardOwner.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
}
