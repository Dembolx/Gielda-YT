// Funkcja generująca losową wartość w określonym zakresie
function getRandomPrice(min = 19000, max = 20000) {
  return Math.random() * (max - min) + min; // Losowa cena w zakresie min-max
}

// Początkowe ceny kryptowalut
let btcPrice = getRandomPrice();
let ethPrice = getRandomPrice(1000, 2000); // Zakres dla Ethereum
let ltcPrice = getRandomPrice(100, 300); // Zakres dla Litecoin

// Przechowywanie stanu portfela użytkownika
let btcAmount = 0; // Ilość posiadanych Bitcoinów
let initialBtcPrice = btcPrice; // Cena zakupu BTC

// Dane do wykresu
let data = Array(60)
  .fill(btcPrice)
  .map(() => getRandomPrice());
let labels = Array(60)
  .fill("")
  .map((_, index) => `${index}s`);

// Funkcja generująca gradient dla wykresu
function getGradient(ctx, isPositive) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  if (isPositive) {
    gradient.addColorStop(0, "rgba(0, 255, 0, 0.5)");
    gradient.addColorStop(1, "rgba(0, 128, 0, 0.1)");
  } else {
    gradient.addColorStop(0, "rgba(255, 0, 0, 0.5)");
    gradient.addColorStop(1, "rgba(128, 0, 0, 0.1)");
  }
  return gradient;
}

function animateTableCell(cell) {
  cell.style.transition = "transform 0.5s ease";
  cell.style.transform = "scale(1.2)";
  setTimeout(() => {
    cell.style.transform = "scale(1)";
  }, 500);
}

function updateTable(price, change, priceCellId, changeCellId) {
  const priceCell = document.getElementById(priceCellId);
  const changeCell = document.getElementById(changeCellId);

  priceCell.innerText = price.toFixed(2);
  changeCell.innerText = `${change.toFixed(2)}%`;

  if (change > 0) {
    priceCell.classList.add("green");
    changeCell.classList.add("green");
    priceCell.classList.remove("red");
    changeCell.classList.remove("red");
  } else if (change < 0) {
    priceCell.classList.add("red");
    changeCell.classList.add("red");
    priceCell.classList.remove("green");
    changeCell.classList.remove("green");
  }

  animateTableCell(priceCell);
  animateTableCell(changeCell);
}

// Funkcja aktualizująca gradient i kolory wykresu
function updateGradient(chart, data) {
  const isPositive = data[data.length - 1] >= data[data.length - 2];
  chart.data.datasets[0].backgroundColor = getGradient(chart.ctx, isPositive);
  chart.data.datasets[0].borderColor = isPositive
    ? "rgba(0, 255, 0, 0.8)"
    : "rgba(255, 0, 0, 0.8)";
}

// Funkcja aktualizująca wykres
function updateChart() {
  // Losowa zmiana ceny
  const btcChange = (Math.random() - 0.5) * 200;
  btcPrice += btcChange;
  const btcPercentChange = (btcChange / initialBtcPrice) * 100;

  const ethChange = (Math.random() - 0.5) * 50;
  ethPrice += ethChange;
  const ethPercentChange = (ethChange / ethPrice) * 100;

  const ltcChange = (Math.random() - 0.5) * 10;
  ltcPrice += ltcChange;
  const ltcPercentChange = (ltcChange / ltcPrice) * 100;

  // Aktualizacja tabeli
  updateTable(btcPrice, btcPercentChange, "btcPriceTable", "btcChangeTable");
  updateTable(ethPrice, ethPercentChange, "ethPriceTable", "ethChangeTable");
  updateTable(ltcPrice, ltcPercentChange, "ltcPriceTable", "ltcChangeTable");

  // Zaktualizowanie wykresu
  data.shift();
  data.push(btcPrice);

  updateGradient(myChart, data);
  myChart.update();
}

setInterval(updateChart, 2000);

// Funkcja do obsługi kliknięć przycisków Kup/Sprzedaj
document.getElementById("buyBtn").addEventListener("click", () => {
  const amountToBuy = 0.1; // Określ ilość BTC do zakupu
  btcAmount += amountToBuy;
  initialBtcPrice = btcPrice;
  alert(`Kupiono ${amountToBuy} BTC za ${btcPrice.toFixed(2)} USD!`);
});

document.getElementById("sellBtn").addEventListener("click", () => {
  const amountToSell = 0.1; // Określ ilość BTC do sprzedaży
  if (btcAmount >= amountToSell) {
    btcAmount -= amountToSell;
    alert(`Sprzedano ${amountToSell} BTC za ${btcPrice.toFixed(2)} USD!`);
  } else {
    alert("Brak wystarczającej ilości BTC do sprzedaży.");
  }
});

// Inicjalizacja wykresu
const ctx = document.getElementById("myChart").getContext("2d");

const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Bitcoin Price (USD)",
        data: data,
        backgroundColor: getGradient(ctx, true),
        borderColor: "rgba(0, 188, 212, 0.8)",
        borderWidth: 2,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Czas",
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Cena (USD)",
        },
      },
    },
  },
});

// Funkcja do generowania rekomendacji rynkowych
// Funkcja do generowania rekomendacji rynkowych
function updateRecommendations() {
  const btcChange = parseFloat(
    document.getElementById("btcChangeTable").innerText
  );
  const ethChange = parseFloat(
    document.getElementById("ethChangeTable").innerText
  );
  const ltcChange = parseFloat(
    document.getElementById("ltcChangeTable").innerText
  );

  const changes = [
    { name: "Bitcoin", change: btcChange },
    { name: "Ethereum", change: ethChange },
    { name: "Litecoin", change: ltcChange },
  ];

  const maxChangeCrypto = changes.reduce(
    (max, curr) => (Math.abs(curr.change) > Math.abs(max.change) ? curr : max),
    changes[0]
  );

  let recommendationText = "";
  let recommendationAction = "";

  if (maxChangeCrypto.change > 0) {
    recommendationText = `Największa zmiana: ${
      maxChangeCrypto.name
    } (+${maxChangeCrypto.change.toFixed(2)}%)`;
    recommendationAction = `Rozważ sprzedaż ${maxChangeCrypto.name}.`;
  } else {
    recommendationText = `Największa zmiana: ${
      maxChangeCrypto.name
    } (${maxChangeCrypto.change.toFixed(2)}%)`;
    recommendationAction = `Rozważ zakup ${maxChangeCrypto.name}.`;
  }

  document.getElementById("recommendationText").innerText = recommendationText;
  document.getElementById("recommendationAction").innerText =
    recommendationAction;

  let btcRecommendation = "";
  if (btcChange > 0) {
    btcRecommendation = "Cena Bitcoina wzrasta. Rozważ sprzedaż.";
  } else if (btcChange < 0) {
    btcRecommendation = "Cena Bitcoina spada. Rozważ zakup.";
  } else {
    btcRecommendation = "Cena Bitcoina się nie zmienia. Obserwuj rynek.";
  }

  document.getElementById("btcBuySellRecommendation").innerText =
    btcRecommendation;
}

setInterval(updateRecommendations, 2000);
