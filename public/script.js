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
                txtValue = td[3].textContent || td[3].innerText;
                if (parseInt(txtValue) === n) {
                    tr[i].style.display = "";
                    break;
                } else {
                    tr[i].style.display = "none";
                }
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
                txtValue = td[4].textContent || td[4].innerText;
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

            const data = {
                type: cardData.humanReadableCardType,
                name: cardData.name,
                level: cardData.level,
                price: parseInt(cardData.card_prices[0].amazon_price) > 0 ?
                    cardData.card_prices[0].amazon_price : cardData.card_prices[0].tcgplayer_price,
            };
            const password = document.getElementById('modal-id');
            const cardName = document.getElementById('modal-name');
            const level = document.getElementById('modal-level');
            const type = document.getElementById('modal-type');
            const price = document.getElementById('modal-price');

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
            const data = {
                id: cardData.id,
                img: `/img/${cardData.id}.jpg`,
                type: cardData.humanReadableCardType,
                name: cardData.name,
                level: cardData.level,
                price: parseInt(cardData.card_prices[0].amazon_price) > 0 ?
                    cardData.card_prices[0].amazon_price : cardData.card_prices[0].tcgplayer_price,
                description: cardData.desc,
            };

            const password = document.getElementById('modal-view-id');
            const cardName = document.getElementById('modal-view-name');
            const level = document.getElementById('modal-view-level');
            const type = document.getElementById('modal-view-type');
            const price = document.getElementById('modal-view-price');
            const img = document.getElementById('modal-view-img');
            const quantity = document.getElementById('modal-view-quantity');
            const description = document.getElementById('modal-view-description');

            password.value = data.id;
            cardName.value = data.name;
            quantity.value = parseInt(cardData.quantity) === 0 ? 1 : parseInt(cardData.quantity);
            level.value = data.level || 0;
            type.value = data.type;
            price.value = data.price;
            img.src = data.img;
            description.value = data.description;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}