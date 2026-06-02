const vystup = document.getElementById("vystup");

async function convert(amount, from, to) {
    try {
        const res = await fetch("https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD,CZK,GBP");
        const data = await res.json();

        const rates = data.rates;

        rates["EUR"] = 1;

        return (amount / rates[from]) * rates[to];
    } catch (error) {
        return "nothing ever happens";
    }
}

async function convertBtn() {
    let amount = document.getElementById("value1").value;
    const cur1 = document.getElementById("cur1").value;
    const cur2 = document.getElementById("cur2").value;

    amount = parseFloat(amount);

    if (Number.isNaN(amount)) {
        vystup.textContent = "nothing ever happens";
        return;
    }

    let value = await convert(amount, cur1, cur2);

    let conversion = {
        cur1: [cur1, amount.toFixed(2)],
        cur2: [cur2, value.toFixed(2)],
    };

    let conversions = localStorage.getItem("conversions");

    if (conversions === null) {
        conversions = [];
    } else {
        conversions = JSON.parse(conversions);
    }

    console.log(conversions);

    conversions.push(conversion);

    if (conversions.length > 5) {
        conversions = conversions.slice(-5);
    }

    localStorage.setItem("conversions", JSON.stringify(conversions));

    loadconv();

    vystup.textContent = value.toFixed(2);
}

function loadconv() {
    const box = document.getElementById("convbox");
    let conversions = localStorage.getItem("conversions");

    if (conversions === null) {
        return;
    }
    conversions = JSON.parse(conversions);

    box.innerHTML = "";

    conversions.forEach(function (i) {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.flexDirection = "column";
        let p = document.createElement("p");
        let node = document.createTextNode(`${i["cur1"][0]}: ${i["cur1"][1]}`);
        p.appendChild(node);
        div.appendChild(p);
        p = document.createElement("p");
        node = document.createTextNode(`${i["cur2"][0]}: ${i["cur2"][1]}`);
        p.appendChild(node);
        div.appendChild(p);
        box.appendChild(div);
    });
}

window.addEventListener("DOMContentLoaded", loadconv);
document.getElementById("convert").addEventListener("click", convertBtn);
document.getElementById("eur").addEventListener("click", function () {
    document.getElementById("cur1").value = "EUR";
    document.getElementById("cur2").value = "USD";
});
document.getElementById("usd").addEventListener("click", function () {
    document.getElementById("cur1").value = "USD";
    document.getElementById("cur2").value = "EUR";
});
document.getElementById("czk").addEventListener("click", function () {
    document.getElementById("cur1").value = "CZK";
    document.getElementById("cur2").value = "EUR";
});
document.getElementById("gbp").addEventListener("click", function () {
    document.getElementById("cur1").value = "GBP";
    document.getElementById("cur2").value = "EUR";
});
document.getElementById("switch").addEventListener("click", function () {
    let value = document.getElementById("cur1").value;
    document.getElementById("cur1").value = document.getElementById("cur2").value;
    document.getElementById("cur2").value = value;
});
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        convertBtn();
    }
});
document.getElementById("clear").addEventListener("click", function () {
    localStorage.clear();
    loadconv();
});
