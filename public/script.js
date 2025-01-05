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
            quantity.value = parseInt(cardData.quantity);
            level.value = data.level || 'N/A';
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
            quantity.value = parseInt(cardData.quantity);
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

function loadChunk() {
    const tbody = document.getElementById('ygocardTable');
    data.forEach(item => {
        const row = document.createElement('tr');
        const idCell = row.insertCell();
        const detailsButton = document.createElement('button');
        detailsButton.type = 'button';
        detailsButton.classList.add = ('btn', 'btn-outline-primary');
        detailsButton.dataset.bsToggle = 'modal';
        detailsButton.dataset.bsTarget = '#modal-details';
        detailsButton.onclick = () => getViewData(item.id);
        detailsButton.textContent = item.id
        idCell.appendChild(detailsButton);

        row.insertCell().textContent = item.name;
        row.insertCell().textContent = item.quantity;
        row.insertCell().textContent = item.level;
        row.insertCell().textContent = item.type;
        row.insertCell().textContent = parseInt(item.card_prices[0].amazon_price) > 0 ?
            item.card_prices[0].amazon_price :
            item.card_prices[0].tcgplayer_price
        tbody.append(row);
    });
    currentChunkIndex++;
    if (currentChunkIndex < totalChunks) {
        loadChunk();
    }
}

function search() {
    const searchTerm = document.getElementById('searchInput').value;
    window.location.href = `/search?q=${searchTerm}`;
}