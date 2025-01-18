// Retrieve existing users from local storage
// let currentUser = JSON.parse(localStorage.getItem("currentUser"));




// Creating Month Selection
{
    if (currentUser.creditTransactions) {

        let monthSelect = document.getElementById("monthSelect");
        let startDate = new Date(2024, 0); // January 2024
        let endDate = new Date(); // Current date

        const MONTH_NAMES = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const monthOption = document.createElement("option");
        monthOption.value = 'PreChoice';
        monthOption.textContent = 'Select a month';
        monthSelect.appendChild(monthOption);

        while (startDate <= endDate) {
            const year = startDate.getFullYear();
            const month = startDate.getMonth();
            const monthOption = document.createElement("option");

            // Format the month to always be two digits without +, <, or ?
            let monthValue = String(month);
            if (monthValue.length === 1) {
                monthValue = "0" + String(parseInt(monthValue) + 1);
            } else {
                monthValue = String(parseInt(monthValue) + 1);
            }

            monthOption.value = `${year}-${monthValue}`;
            monthOption.textContent = `${MONTH_NAMES[month]} ${year}`;
            monthSelect.appendChild(monthOption);

            startDate.setMonth(month + 1); // Move to the next month
        }
    }
}




// Bar chart- Graph
let barChart;
let pieChart;



// Event listner for Month Selection
let selection = document.getElementById("monthSelect");

selection.addEventListener("change", function () {
    debugger
    if (currentUser.creditTransactions.length != 0) {
        if (selection.value == "PreChoice") //If NO Value selected
            return;
        let selectedValue = selection.value; // e.g., "2024-01"
        let splitValue = selectedValue.split("-");
        let year = parseInt(splitValue[0], 10); // Convert year to a number
        let month = parseInt(splitValue[1], 10); // Convert month to a number

        // Calculate the total transactions for the selected month and year
        let total = calculateTotalTransactionsForMonth(currentUser.creditTransactions, year, month);
        console.log(`Total for ${selectedValue}: $${total}`);

        // Optionally display the total on the page
        document.getElementById("totalDisplay").textContent = `Total Transactions: $${total}`;

        debugger
        let monthBefore, MonthYearBefore;
        if (month === 1) {
            monthBefore = 12;
            MonthYearBefore = year - 1;
        } else {
            monthBefore = month - 1;
            MonthYearBefore = year;
        }
        let twoMonthBefore, twoMonthYearBefore
        if (month === 1) {
            twoMonthBefore = 11;
            twoMonthYearBefore = year - 1;
        } else {
            twoMonthBefore = month - 2;
            twoMonthYearBefore = year;
        }


        let totalMonthBefore = calculateTotalTransactionsForMonth(currentUser.creditTransactions, MonthYearBefore, monthBefore);
        let totalTwoMonthBefore = calculateTotalTransactionsForMonth(currentUser.creditTransactions, twoMonthYearBefore, twoMonthBefore);

        createNewList(month, year);

        let selectedMonth = document.getElementById("SelectedMonth");
        selectedMonth.textContent = "Month Selected: " + numberToMonth(month);
        let tableHeader = document.getElementById("tableHeaderMonthSelected");
        tableHeader.textContent = "Expense breakdown for: " + numberToMonth(month) + "/" + year;



        // Pir Chart
        // Function to aggregate amounts by category
        function calculateCategoryTotals(transactions) {
            let categoryTotals = {}; // Initialize an empty object to store totals

            for (let i = 0; i < transactions.length; i++) {
                let item = transactions[i]; // Get the current transaction
                let category = item.Category; // Get the category
                let amount = parseFloat(item.Amount); // Convert the amount to a number

                // Check if the category already exists in the totals
                if (categoryTotals[category] === undefined) {
                    categoryTotals[category] = amount; // If not, initialize it with the current amount
                } else {
                    categoryTotals[category] += amount; // If it exists, add the current amount
                }
            }

            return categoryTotals; // Return the totals object
        }

        // Get totals by category
        const categoryTotals = calculateCategoryTotals(currentUser.creditTransactions);

        // Prepare data for the chart
        const categories = Object.keys(categoryTotals); // Labels
        const amounts = Object.values(categoryTotals); // Data

        // Define colors for the chart
        const colors = [
            '#4caf50', '#ff9800', '#2196f3', '#f44336', '#9c27b0', '#ffeb3b'
        ];

        if (pieChart) {
            pieChart.destroy();
        }
        // Create the Pie Chart
        let ctx = document.getElementById('PieChartID').getContext('2d');
        pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: amounts,
                    backgroundColor: colors,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true, // Ensure responsiveness
                maintainAspectRatio: false, // Allow resizing without keeping the aspect ratio
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Expenses by Category',
                        font: {
                            size: 18
                        }
                    }
                }
            }
        });





        // Bar Chart 
        {

            if (barChart) {
                barChart.destroy();
            }
            barChart = new Chart($("#barChartID"), {
                type: 'bar',
                options: {
                    responsive: true, // Ensure responsiveness
                    maintainAspectRatio: false, // Allow resizing without keeping the aspect ratio
                    plugins: {

                        // legend: { display: true },
                        // indexAxis: 'x',
                        title: {
                            display: true,
                            text: "Sum of Transactions Per Month",
                            font: {
                                size: 18
                            }
                        }
                    }
                },
                data: {
                    labels: [numberToMonth(twoMonthBefore) + '/' + twoMonthYearBefore, numberToMonth(monthBefore) + '/' + MonthYearBefore, numberToMonth(month) + '/' + year],
                    datasets: [
                        {
                            label: "Sum of transactions Per Month",
                            data: [totalTwoMonthBefore, totalMonthBefore, total],
                            backgroundColor: ['#6082B6', '#ADD8E6', '#088F8F'],
                        }
                    ]
                }
            });

        }

    }
    else {
        document.getElementById("totalDisplay").textContent = 'No transcations loaded yet';
    }

});


// UPDATING next month billing 
{
    let futureBilling = JSON.parse(localStorage.getItem("futureBilling"));
    document.getElementById("FutureBilling").append(futureBilling);
    document.getElementById("billingMethod").append('Billing method: ' + currentUser.billingDay);
}



// Create Expenses List (by monthand year)
function createNewList(month, year) {

    relevantTransactions = getAllTransactionsBy(month, year);

    let ListDiv = document.getElementById("ListOfMonthExpenses");
    ListDiv.textContent = "";
    let row = document.createElement("div");
    row.className = "row";
    ListDiv.appendChild(row);

    let dateTitle = document.createElement("div");
    dateTitle.append("Date");

    let BNameTitle = document.createElement("div");
    BNameTitle.append("Business Name");

    let CategoryTitle = document.createElement("div");
    CategoryTitle.append("Category");

    let AmountTitle = document.createElement("div");
    AmountTitle.append("Amount");

    dateTitle.className = "listHeader";
    BNameTitle.className = "listHeader";
    CategoryTitle.className = "listHeader";
    AmountTitle.className = "listHeader";


    row.appendChild(dateTitle);
    row.appendChild(BNameTitle);
    row.appendChild(CategoryTitle);
    row.appendChild(AmountTitle);




    debugger
    for (item of relevantTransactions) {
        row = document.createElement("div");
        row.className = "row";
        ListDiv.appendChild(row);

        let dateCol = document.createElement("div");
        dateCol.append(item.Date);

        let BNameCol = document.createElement("div");
        BNameCol.append(item["Business Name"]);

        let CategoryCol = document.createElement("div");
        CategoryCol.append(item.Category);

        let AmountCol = document.createElement("div");
        AmountCol.append(item.Amount + ' $');

        row.appendChild(dateCol);
        row.appendChild(BNameCol);
        row.appendChild(CategoryCol);
        row.appendChild(AmountCol);

    }

}





// Get all transactions by month & year
function getAllTransactionsBy(month, year) {
    transactionsByMonthNYear = [];
    for (item of currentUser.creditTransactions) {
        // Parse the transaction date
        let itemMonth = parseInt(item.Date.substring(3, 5));
        let itemYear = parseInt(item.Date.substring(6, 10));

        // Check if the transaction matches the given year and month
        if (
            itemYear === year &&
            itemMonth === month
        ) {
            // Add the transaction amount to the total (convert string to number)
            transactionsByMonthNYear.push(item);
        }
    }
    return transactionsByMonthNYear;
}



// CONVERT number to MONTH 

function numberToMonth(number) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    if (number < 1 || number > 12) {
        return null;
    }

    return months[number - 1];
}