// function sortTable(n) {
//     var table, rows, switching, i, x, y, shouldSwitch;
//     table = document.querySelector('table');
//     switching = true;
//     /*Make a loop that will continue until no switching has been done:*/
//     while (switching) {
//         //start by saying: no switching is done:
//         switching = false;
//         rows = table.rows;
//         /*Loop through all table rows (except the first, which contains table headers):*/
//         for (i = 1; i < (rows.length - 1); i++) {
//             //start by saying there should be no switching:
//             shouldSwitch = false;
//             /*Get the two elements you want to compare, one row below the other:*/
//             x = rows[i].getElementsByTagName("TD")[n];
//             y = rows[i + 1].getElementsByTagName("TD")[n];
//             //check if the two rows should switch place:
//             if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
//                 //if so, mark as a switch and break the loop:
//                 shouldSwitch = true;
//                 break;
//             }
//         }
//         if (shouldSwitch) {
//             /*If a switch has been marked, make the switch and mark that a switch has been done:*/
//             rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
//             switching = true;
//         }
//     }
// }

function filterTable() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.querySelector('table');
    tr = table.getElementsByTagName("tr");
    filterStars = document.getElementById("filter-level");
    filterType = document.getElementById("filter-types")

    if (filterStars.value !== '') {
        filterTableStar(parseInt(filterStars.value))
    } if (filterType.value != '') {
        filterTableType(filterType.value)
    } else {
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td");
            if (tr[i].style.display === "none") {
                tr[i].style.display = "";
            }
        }

    }
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        if (tr[i].style.display !== "none") {
            for (var j = 0; j < td.length; j++) {
                if (td[j]) {
                    txtValue = td[j].textContent || td[j].innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                        break;
                    } else {
                        tr[i].style.display = "none";
                    }
                }
            }
        }
    }
}

function filterTableStar(n) {
    var input, filter, table, tr, td, i, txtValue;
    input = n;
    // filter = input.value.toUpperCase();
    table = document.querySelector('table');
    tr = table.getElementsByTagName("tr");
    if (n === 0) {
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td");
            if (tr[i].style.display === "none") {
                tr[i].style.display = "";
            }
        }
    } else {
        for (i = 1; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td");
            for (var j = 0; j < td.length; j++) {
                // if (td[3]) {
                txtValue = td[3].textContent || td[3].innerText;
                if (parseInt(txtValue) === n) {
                    tr[i].style.display = "";
                    break;
                } else {
                    tr[i].style.display = "none";
                }
                // }
            }
        }
    }
}

function filterTableType(n) {
    var input, filter, table, tr, td, i, txtValue;
    input = n;
    filter = input.toUpperCase() || input;
    table = document.querySelector('table');
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        if (tr[i].style.display === "none") {
            tr[i].style.display = "";
        }
    }
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        if (tr[i].style.display !== "none") {
            for (var j = 0; j < td.length; j++) {
                // if (td[j]) {
                txtValue = td[4].textContent || td[4].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                } else {
                    tr[i].style.display = "none";
                }
                // }
            }
        }
    }
}

// function showDetails(id) {
//     // Fetch details for the specific ID (replace with your actual data fetching logic)
//     // For this example, we'll simply display the ID in the details content
//     var detailsContent = document.getElementById('detailsContent');
//     detailsContent.innerHTML = 'Details for Password: ' + id;

//     // Show the modal
//     var modal = document.getElementById('detailsModal');
//     modal.style.display = 'block';
// }

function getDataFromWebsite() {
    const prefillPassword = document.getElementById('prefillData-id');
    const quantity = document.getElementById('modal-quantity');
    return fetch(`/searchCard?id=${prefillPassword.value}`)
        .then(response => {
            if (!response.ok) {
                alert('issue with getting the data')
                console.log('issue with getting the data')
            }
            return response.json();
        })
        .then(cardData => {
            if (parseInt(cardData.found) > 0) {
                alert('You already have this card. Make sure to increase the amount!')
                quantity.focus();
            }

            // Extract data using the provided selectors
            const data = {
                type: cardData.humanReadableCardType,
                name: cardData.name,
                level: cardData.level,
                price: parseInt(cardData.card_prices[0].amazon_price) > 0 ?
                    cardData.card_prices[0].amazon_price : cardData.card_prices[0].tcgplayer_price,
            };
            // set modal fields to vars
            const password = document.getElementById('modal-id');
            const cardName = document.getElementById('modal-name');
            const level = document.getElementById('modal-level');
            const type = document.getElementById('modal-type');
            const price = document.getElementById('modal-price');

            // set values for the fields
            password.value = prefillPassword.value;
            cardName.value = data.name;
            quantity.value = parseInt(cardData.quantity) === 0 ? 1 : parseInt(cardData.quantity);
            level.value = data.level || 0;
            type.value = data.type;
            price.value = data.price;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function getViewData(id) {
    return fetch(`/searchCard?id=${id}`)
        .then(response => {
            if (!response.ok) {
                alert('issue with getting the data')
                console.log('issue with getting the data')
            }
            return response.json();
        })
        .then(cardData => {
            // Extract data using the provided selectors
            const data = {
                id: cardData.id,
                img: `/img/${cardData.id}.jpg`,
                type: cardData.humanReadableCardType,
                name: cardData.name,
                level: cardData.level,
                price: parseInt(cardData.card_prices[0].amazon_price) > 0 ?
                    cardData.card_prices[0].amazon_price : cardData.card_prices[0].tcgplayer_price,
            };
            // set modal fields to vars
            const password = document.getElementById('modal-view-id');
            const cardName = document.getElementById('modal-view-name');
            const level = document.getElementById('modal-view-level');
            const type = document.getElementById('modal-view-type');
            const price = document.getElementById('modal-view-price');
            const img = document.getElementById('modal-view-img');
            const quantity = document.getElementById('modal-view-quantity');

            // set values for the fields
            password.value = data.id;
            cardName.value = data.name;
            quantity.value = parseInt(cardData.quantity) === 0 ? 1 : parseInt(cardData.quantity);
            level.value = data.level || 0;
            type.value = data.type;
            price.value = data.price;
            img.src = data.img;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}