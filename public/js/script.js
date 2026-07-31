(() => {
    "use strict";

    const forms = document.querySelectorAll(".needs-validation");

    Array.from(forms).forEach((form) => {
        form.addEventListener("submit", (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add("was-validated");
        });
    });
})();

(() => {
    "use strict";
    const TAX_RATE = 0.18; // 18% GST — adjust as per your actual tax rule

    const priceToggle = document.getElementById("priceToggle");
    const priceContainers = document.querySelectorAll(".listing-price, .mb-2:has(.price-amount)");

    function formatINR(amount) {
        return Math.round(amount).toLocaleString("en-IN");
    }

    function updatePrices(showBeforeTax) {
        document.querySelectorAll(".price-amount").forEach((el) => {
            const basePrice = Number(el.dataset.basePrice);
            const displayPrice = showBeforeTax
                ? basePrice
                : basePrice + basePrice * TAX_RATE;

            el.textContent = formatINR(displayPrice);

            const note = el.closest("p")?.querySelector(".tax-note");
            if (note) {
                note.textContent = showBeforeTax
                    ? `+ ${TAX_RATE * 100}% taxes`
                    : "Taxes included";
            }
        });
    }

    if (priceToggle) {
        const saved = localStorage.getItem("showBeforeTax") === "true";
        priceToggle.checked = saved;
        updatePrices(saved);

        priceToggle.addEventListener("change", () => {
            localStorage.setItem("showBeforeTax", priceToggle.checked);
            updatePrices(priceToggle.checked);
        });
    } else {
        // No toggle on this page (edge case), still show default state
        updatePrices(false);
    }
})();