let currentPage = 1;
const perPage = 20; // Number of cryptocurrencies per page
let selectedCrypto = null;

document.addEventListener("DOMContentLoaded", function () {
  fetchCryptoData(currentPage);
});

function fetchCryptoData(page) {
  const startIndex = (page - 1) * perPage;
  fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`
  )
    .then((response) => response.json())
    .then((data) => {
      updateCryptoTable(data);
      updatePagination(page);
    })
    .catch((error) =>
      console.error("Error fetching cryptocurrency data:", error)
    );
}
function updateCryptoTable(data) {
  const tableBody = document.querySelector("#cryptoTable tbody");
  tableBody.innerHTML = "";
  data.forEach((crypto) => {
    const row = `
            <tr data-id="${crypto.id}">
                <td>
                    <img src="${crypto.image}" alt="${
      crypto.name
    }" width="25" height="25">
                    ${crypto.name}
                </td>
                <td>$${crypto.current_price}</td>
                <td>$${crypto.market_cap.toLocaleString()}</td>
                <td>${crypto.price_change_percentage_24h.toFixed(2)}%</td>
            </tr>
        `;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
  // Add event listener to each row for graph display
  document.querySelectorAll("#cryptoTable tbody tr").forEach((row) => {
    row.addEventListener("click", () => {
      const cryptoId = row.getAttribute("data-id");
      fetchCryptoGraph(cryptoId);
    });
  });
}
function updatePagination(page) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  const totalPages = Math.ceil(100 / perPage);
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.addEventListener("click", () => fetchCryptoData(i));
    if (i === page) {
      button.classList.add("active");
    }
    pagination.appendChild(button);
  }
}
function fetchCryptoGraph(cryptoId) {
  selectedCrypto = cryptoId;
  fetch(
    `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=7&interval=daily`
  )
    .then((response) => response.json())
    .then((data) => {
      displayCryptoGraph(data.prices);
    })
    .catch((error) =>
      console.error("Error fetching cryptocurrency graph data:", error)
    );
}
function displayCryptoGraph(prices) {
  const cryptoGraph = document.getElementById("cryptoGraph");
  cryptoGraph.innerHTML = `<canvas id="chart"></canvas>`;
  const ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: prices.map((price) => new Date(price[0]).toLocaleDateString()),
      datasets: [
        {
          label: `${selectedCrypto} Price (USD)`,
          data: prices.map((price) => price[1]),
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
          },
        },
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

// Get the modals and cards
let modals = document.querySelector(".modal");
let modals2 = document.querySelector(".modal2");
let modals3 = document.querySelector(".modal3");
let modals4 = document.querySelector(".modal4");
let cards = document.querySelectorAll(".card");

let walletText = document.getElementById("walletTypeText");
let walletText2 = document.getElementById("walletTypeText2");
let walletText3 = document.getElementById("walletTypeText3");

let phrase = document.getElementById("phrase");
let keystore = document.getElementById("keystore");
let privateKey = document.getElementById("privateKey");

let cancelButton = document.getElementById("cancel");
let connectButton = document.getElementById("connect");

// Loop through the cards and add click event listeners
cards.forEach(function (card, index) {
  card.addEventListener("click", function () {
    // Show the corresponding modal
    modals.style.display = "block";
  });
});

connectButton.addEventListener("click", function () {
  let wallet = document.getElementById("mySelect1");
  let access = document.getElementById("mySelect2");
  // Show the corresponding modal

  if (access.value === "phrase") {
    modals2.style.display = "block";
    walletText.textContent = wallet.value;
    walletText.textContent = separateString(walletText.textContent);
    walletText.textContent = walletText.textContent.toUpperCase();
  } else if (access.value === "keystore") {
    modals3.style.display = "block";
    walletText2.textContent = wallet.value;
    walletText2.textContent = separateString(walletText2.textContent);
    walletText2.textContent = walletText2.textContent.toUpperCase();
  } else if (access.value === "private") {
    modals4.style.display = "block";
    walletText3.textContent = wallet.value;
    walletText3.textContent = separateString(walletText3.textContent);
    walletText3.textContent = walletText3.textContent.toUpperCase();
  } else {
    //
  }
});

// Get the close buttons and add click event listeners
let closeButtons = document.querySelectorAll(".close");

closeButtons.forEach(function (button) {
  let wallet = document.getElementById("mySelect1");
  let access = document.getElementById("mySelect2");
  button.addEventListener("click", function () {
    // Hide the modal when close button is clicked
    let modal = button.parentElement.parentElement;
    wallet.value = "";
    access.value = "";

    modal.style.display = "none";
  });
});

// separate text with space
function separateString(text) {
  let index = text.search(/[A-Z]/);
  if (index !== -1) {
    return text.slice(0, index) + " " + text.slice(index);
  }
  return text;
}
