const vystup = document.getElementById("vystup");

async function convert(amount, from, to) {
    try {
        const res = await fetch("https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD,CZK,GBP,PLN,CAD,CHF");
        const data = await res.json();

        const rates = data.rates;

        rates["EUR"] = 1;

        const value = (amount / rates[from]) * rates[to];

        return {
            value: value.toFixed(2),
            conversion: `${amount.toFixed(2)} ${from} = ${value.toFixed(2)} ${to}`,
            date: data.date,
        };
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

    let body = await convert(amount, cur1, cur2);

    if (typeof body !== "object") {
        vystup.textContent = body;
        return;
    }

    let value = body.value;

    let conversion = {
        cur1: [cur1, amount.toFixed(2)],
        cur2: [cur2, value],
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

    vystup.textContent = body.conversion;
}

function loadconv() {
    const box = document.getElementById("convbox");
    let conversions = JSON.parse(localStorage.getItem("conversions") || "[]");

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

async function loadrate() {
    const rate = document.getElementById("rate");
    const cur1 = document.getElementById("cur1").value;
    const cur2 = document.getElementById("cur2").value;

    let body = await convert(1, cur1, cur2);

    if (typeof body !== "object") {
        vystup.textContent = body;
        return;
    }

    rate.textContent = `${body.conversion} (updated ${body.date})`;
}

window.addEventListener("DOMContentLoaded", function () {
    loadrate();
    loadconv();
});
document.getElementById("convert").addEventListener("click", convertBtn);
document.getElementById("eur").addEventListener("click", function () {
    document.getElementById("cur1").value = "USD";
    document.getElementById("cur2").value = "EUR";
    loadrate();
});
document.getElementById("usd").addEventListener("click", function () {
    document.getElementById("cur1").value = "EUR";
    document.getElementById("cur2").value = "USD";
    loadrate();
});
document.getElementById("czk").addEventListener("click", function () {
    document.getElementById("cur1").value = "EUR";
    document.getElementById("cur2").value = "CZK";
    loadrate();
});
document.getElementById("gbp").addEventListener("click", function () {
    document.getElementById("cur1").value = "EUR";
    document.getElementById("cur2").value = "GBP";
    loadrate();
});
document.getElementById("pln").addEventListener("click", function () {
    document.getElementById("cur1").value = "EUR";
    document.getElementById("cur2").value = "PLN";
    loadrate();
});
document.getElementById("cad").addEventListener("click", function () {
    document.getElementById("cur1").value = "EUR";
    document.getElementById("cur2").value = "CAD";
    loadrate();
});
document.getElementById("chf").addEventListener("click", function () {
    document.getElementById("cur1").value = "EUR";
    document.getElementById("cur2").value = "CHF";
    loadrate();
});
document.getElementById("switch").addEventListener("click", function () {
    let value = document.getElementById("cur1").value;
    document.getElementById("cur1").value = document.getElementById("cur2").value;
    document.getElementById("cur2").value = value;
    loadrate();
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
document.querySelectorAll("select").forEach(function (select) {
    select.addEventListener("change", loadrate);
});
