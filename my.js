/*jslint browser */

// Цены и правила видимости опций для каждого типа услуги.
const PRICES = {
    services: {
        consult: {hasOptions: false, hasProperty: false, price: 1500},
        site: {hasOptions: true, hasProperty: false, price: 20000},
        support: {hasOptions: false, hasProperty: true, price: 3000}
    },
    options: {
        basic: 0,
        extended: 5000,
        premium: 12000
    },
    property: 2000
};

const MESSAGE_INVALID = "Введите целое число не меньше 1 (только цифры).";

function formatRub(value) {
    return value.toLocaleString("ru-RU") + " ₽";
}

// Возвращает целое количество или 0, если ввод некорректен.
function parseQuantity(text) {
    const trimmed = text.trim();
    if (!(/^\d+$/).test(trimmed)) {
        return 0;
    }
    const value = Number(trimmed);
    return (Number.isSafeInteger(value) && value >= 1)
        ? value
        : 0;
}

function getSelectedService() {
    const checked = document.querySelector("input[name='service']:checked");
    return checked.value;
}

// Показываем или скрываем поля в зависимости от типа услуги.
function updateVisibility(service) {
    document.getElementById("options-group").classList.toggle(
        "d-none",
        !service.hasOptions
    );
    document.getElementById("property-group").classList.toggle(
        "d-none",
        !service.hasProperty
    );
}

function updatePrice() {
    const service = PRICES.services[getSelectedService()];
    const errorBox = document.getElementById("error-message");
    const quantityInput = document.getElementById("quantity");
    const result = document.getElementById("result");

    updateVisibility(service);

    const quantity = parseQuantity(quantityInput.value);
    if (quantity === 0) {
        errorBox.textContent = MESSAGE_INVALID;
        errorBox.hidden = false;
        quantityInput.classList.add("is-invalid");
        result.textContent = "";
        return;
    }
    errorBox.hidden = true;
    errorBox.textContent = "";
    quantityInput.classList.remove("is-invalid");

    let unitPrice = service.price;
    if (service.hasOptions) {
        const option = document.getElementById("option").value;
        unitPrice += PRICES.options[option];
    }
    if (service.hasProperty && document.getElementById("urgent").checked) {
        unitPrice += PRICES.property;
    }

    result.textContent = "Итого: " + formatRub(unitPrice * quantity)
            + " (" + formatRub(unitPrice) + " × " + quantity + ")";
}

window.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("order-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
    });
    form.addEventListener("input", updatePrice);
    form.addEventListener("change", updatePrice);

    updatePrice();
});
