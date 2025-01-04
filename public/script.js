function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.querySelector('table');
    switching = true;
    /*Make a loop that will continue until no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare, one row below the other:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            //check if the two rows should switch place:
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

function filterTable() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.querySelector('table');
    tr = table.getElementsByTagName("tr");
    filterStars = document.getElementById("filter-stars");
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

function showDetails(id) {
    // Fetch details for the specific ID (replace with your actual data fetching logic)
    // For this example, we'll simply display the ID in the details content
    var detailsContent = document.getElementById('detailsContent');
    detailsContent.innerHTML = 'Details for Password: ' + id;

    // Show the modal
    var modal = document.getElementById('detailsModal');
    modal.style.display = 'block';
}

function updateQuantity(amount, password) { }

function prefillData() {
    const buildURL = `https://yugipedia.com/wiki/${document.getElementById('prefillData-password').value}`
    getDataFromWebsite(buildURL)

    function getDataFromWebsite(url) {
        return fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Extract data using the provided selectors
                const data = {
                    type: extractType(doc),
                    cardName: extractTitle(doc),
                    stars: extractLevel(doc),
                    price: 0
                };
                // set modal fields to vars
                const prefillPassword = document.getElementById('prefillData-password');
                const password = document.getElementById('modal-password');
                const cardName = document.getElementById('modal-cardName');
                const quantity = document.getElementById('modal-quantity');
                const stars = document.getElementById('modal-stars');
                const type = document.getElementById('modal-type');
                const price = document.getElementById('modal-price');

                fetch(`/searchCard?password=${prefillPassword.value}`)
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
                        // set values for the fields
                        password.value = document.getElementById('prefillData-password').value;
                        cardName.value = data.cardName;
                        quantity.value = cardData.found === 0 ? 1 : cardData.found;
                        stars.value = data.stars || 0;
                        type.selectedIndex = mapTypes(data.type);
                        price.value = 0;
                    })
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function extractType(doc) {
        const innerTableText = doc.getElementsByClassName('innertable')[0].innerText;
        // return innerTableText.split('Types\t')[1].split(' /')[1].split('\n')[0].split(' ')[1];

        let typesIndex = innerTableText.indexOf("Types");
        let isMagic = false;

        // If "Types" is not found, return an empty string
        if (typesIndex === -1) {
            typesIndex = innerTableText.indexOf("type\n");
            isMagic = true;
            if (typesIndex === -1) {
                typesIndex = innerTableText.indexOf("type\n")
                return "";
            }
        }

        // Extract the substring starting from the index of "Types"
        const substring = innerTableText.substring(typesIndex);

        // Find the first occurrence of a newline or the end of the string
        const endIndex = substring.indexOf("Level") === -1 ? substring.length : substring.indexOf("Level");

        // Extract the type by removing "Types" and any leading/trailing whitespace
        const type = substring.substring("Types".length, endIndex).trim();

        return !isMagic ? type.split('/ ')[1] : type.split(' ')[0];
    }

    function extractTitle(doc) {
        let title = doc.title.split(' -');
        if (title.length > 2) {
            return `${title[0]} -${title[1]}`
        } else {
            return title[0];
        }
    }

    function extractLevel(doc) {
        const innerTableText = doc.getElementsByClassName('innertable')[0].innerText;

        const typesIndex = innerTableText.indexOf("Types");

        // If "Types" is not found, return an empty string
        if (typesIndex === -1) {
            return "";
        }

        // Extract the substring starting from the index of "Types"
        const substring = innerTableText.substring(typesIndex);

        // Find the first occurrence of a newline or the end of the string
        const endIndex = substring.indexOf("ATK") === -1 ? substring.length : substring.indexOf("ATK");

        // Extract the type by removing "Types" and any leading/trailing whitespace
        const type = substring.substring("Types".length, endIndex).trim();

        return type.split('\n')[2].split(' ')[0];

    }

    function mapTypes(inputType) {
        switch (inputType.trim()) {
            case 'Normal':
                return 0;
            case 'Effect':
                return 1;
            case 'Magic':
            case 'Spell':
                return 2;
            case 'Trap':
                return 3;
            case 'Synchro':
                return 4;
            case 'Xyz':
                return 5;
            case 'Fusion':
                return 6;
            case 'Ritual':
                return 7;
            case 'Pendulum':
                return 8;
            case 'Link':
                return 9;
            case 'God Cards':
                return 10;
            case 'Token':
            default:
                return 0;
        }
    }
}

function getDataFromWebsite(url) {
    return fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Extract data using the provided selectors
            const data = {
                type: extractType(doc),
                cardName: extractTitle(doc),
                stars: extractLevel(doc),
                price: 0
            };
            function mapTypes(inputType) {
                switch (inputType.trim()) {
                    case 'Normal':
                        return 0;
                    case 'Effect':
                        return 1;
                    case 'Magic':
                    case 'Spell':
                        return 2;
                    case 'Trap':
                        return 3;
                    case 'Synchro':
                        return 4;
                    case 'Xyz':
                        return 5;
                    case 'Fusion':
                        return 6;
                    case 'Ritual':
                        return 7;
                    case 'Pendulum':
                        return 8;
                    case 'Link':
                        return 9;
                    case 'God Cards':
                        return 10;
                    case 'Token':
                    default:
                        return 0;
                }
            }
            const password = document.getElementById('modal-password');
            const cardName = document.getElementById('modal-cardName');
            const quantity = document.getElementById('modal-quantity');
            const stars = document.getElementById('modal-stars');
            const type = document.getElementById('modal-type');
            const price = document.getElementById('modal-price');

            password.value = document.getElementById('prefillData-password').value;
            cardName.value = data.cardName;
            quantity.value = 1;
            stars.value = data.stars || 0;
            type.selectedIndex = mapTypes(data.type);
            price.value = 0;

            // return data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            return null;
        });
}