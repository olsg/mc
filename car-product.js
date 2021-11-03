let myUrl = new URL(document.location.href);
let myParam = myUrl.searchParams.get("id");

let request = new XMLHttpRequest();

// TODO: Change mondaycarUrl depending on which domain we're on : staging or production

let mondaycarUrl = new URL(`https://api.mondaycar.com/catalog/${myParam}`);

/*

if (document.location.href.includes("webflow.io")) {
  mondaycarUrl = new URL(
    `https://api-staging.mondaycar.com/catalog/${myParam}`
  );
}
*/

const getCar = () => {
  let request = new XMLHttpRequest();

  request.open("GET", mondaycarUrl, true);

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      let res = JSON.parse(this.response);
      let car = res?.data;
      console.log(car);
      let leasePrices = leasePlan(car.leasePrices);

      const carGrid = document.getElementById("car-grid");

      const carTitle = document.getElementById("car-title");
      carTitle.textContent = `${car.manufacturer} ${car.model}`;

      const carImage = document.getElementById("car-image");
      carImage.src = mainImage(car).uri;

      const carShift = document.getElementById("att-shift");
      carShift.textContent = car.transmission;

      const carFuel = document.getElementById("att-fuel");
      carFuel.textContent = car.fuel;

      const carDoors = document.getElementById("att-doors");
      carDoors.textContent = `${car.doors} Portes`;

      const carSeats = document.getElementById("att-seats");
      carSeats.textContent = `${car.seats} Places`;

      const carFeature = document.getElementById("att-feature");
      carFeature.textContent = "classique";

      const propType = document.getElementById("prop-type");
      propType.textContent = car.vehicleType;

      const propManufacturer = document.getElementById("prop-manufacturer");
      propManufacturer.textContent = car.manufacturer;

      const propModel = document.getElementById("prop-model");
      propModel.textContent = car.model;

      const propPower = document.getElementById("prop-power");
      propPower.textContent = car.power;

      const propYear = document.getElementById("prop-year");
      propYear.textContent = car.modelYear;

      const propFeatures = document.getElementById("prop-features");
      propFeatures.textContent =
        "Elle est équipée au moins de la climatisation manuelle, de la connexion bluetooth, d’une prise USB et du régulateur de vitesse.";

      const priceStart = document.getElementById("price-start");
      priceStart.textContent = `${printPrice(
        leasePrices.cheapest.amountInclVatMonthly
      )}/mois`;

      // LEASE PRICE SELECTOR BEGIN

      const leasePricesForm = document.getElementById("lease-prices-form-bis");
      let selectedUUID = leasePrices.cheapest.uuid;

      let commitment_duration = leasePrices.cheapest.commitmentDurationInMonths;
      let commitment_price = printPrice(
        leasePrices.cheapest.amountInclVatMonthly
      );
      let commitment_uuid = leasePrices.cheapest.uuid;

      let selectedLease = leasePrices.cheapest;

      car.leasePrices.map((price) => {
        const leaseRadioShape = document.createElement("div");
        leaseRadioShape.setAttribute("class", "lease-radio-shape");

        const radio = document.createElement("input");
        radio.setAttribute("id", price.uuid);
        radio.setAttribute("class", "lease-radio-button");
        radio.type = "radio";
        radio.name = "commitment";
        radio.value = price.uuid;
        radio.checked = price.uuid === selectedUUID;

        const label = document.createElement("label");
        label.setAttribute("class", "lease-radio-price");
        label.textContent = `${printPrice(
          price.amountInclVatMonthly
        )} par mois`;
        label.htmlFor = price.uuid;

        const commitmentPeriod = document.createElement("div");
        commitmentPeriod.setAttribute("class", "lease-radio-commitment");
        commitmentPeriod.textContent = price.commitmentDurationInMonths
          ? price.commitmentDurationInMonths + " mois"
          : "Sans engagement";

        if (radio.checked) {
          label.style.color = "#32e0c4";
          label.style.border = "1px solid #32e0c4";
          commitmentPeriod.style.color = "#32e0c4";
        }

        const commitmentRecap = document.getElementById("recap-commitment");
        const commitmentRecapTitle = document.getElementById(
          "recap-commitment-title"
        );
        const commitmentRecapValue = document.getElementById(
          "recap-commitment-value"
        );

        commitmentRecapTitle.textContent = `Engagement ${leasePrices.cheapest.commitmentDurationInMonths} mois`;
        commitmentRecapValue.textContent = `${printPrice(
          leasePrices.cheapest.amountInclVatMonthly
        )}/mois`;

        const configTotalPrice = document.getElementById("config-total-price");

        const configTotalCommitment = document.getElementById(
          "config-total-commitment"
        );

        const configTotalSaving = document.getElementById(
          "config-total-saving"
        );

        const configDeposit = document.getElementById(
          "config-disclaimer-deposit"
        );
        const configFees = document.getElementById("config-fees");

        configTotalPrice.textContent = `${printPrice(
          leasePrices.cheapest.amountInclVatMonthly
        )}/mois`;
        configTotalCommitment.textContent =
          leasePrices.cheapest.commitmentDurationInMonths;

        configTotalSaving.textContent = `d'économiser ${printPrice(
          (leasePrices.expensive.amountInclVatMonthly -
            leasePrices.cheapest.amountInclVatMonthly) *
            leasePrices.cheapest.commitmentDurationInMonths
        )}`;

        configDeposit.textContent = printPrice(
          car.deposit ? car.deposit : leasePrices.expensive.amountInclVatMonthly
        );

        configFees.textContent = printPrice(
          car.feePrice && car.feePrice.length
            ? car.feePrice[0].amountInclVat
            : leasePrices.expensive.amountInclVatMonthly
        );

        radio.addEventListener("change", function () {
          commitment_duration = price.commitmentDurationInMonths;
          commitment_price = printPrice(price.amountInclVatMonthly);
          commitment_uuid = price.uuid;
          selectedLease = price;

          commitmentRecapTitle.textContent = price.commitmentDurationInMonths
            ? `Engagement ${price.commitmentDurationInMonths} mois`
            : `Sans engagement`;
          commitmentRecapValue.textContent = `${printPrice(
            price.amountInclVatMonthly
          )}/mois`;

          configTotalPrice.textContent = `${printPrice(
            price.amountInclVatMonthly
          )}/mois`;

          configTotalCommitment.textContent = price.commitmentDurationInMonths;

          configTotalSaving.textContent = `d'économiser ${printPrice(
            (leasePrices.expensive.amountInclVatMonthly -
              price.amountInclVatMonthly) *
              price.commitmentDurationInMonths
          )}`;

          commitmentRecap.appendChild(commitmentRecapTitle);
          commitmentRecap.appendChild(commitmentRecapValue);

          label.style.color = "#32e0c4";
          label.style.border = "1px solid #32e0c4";
          commitmentPeriod.style.color = "#32e0c4";

          var allRadiosQuery = document.querySelectorAll(
            'input[name="commitment"]'
          );
          for (
            var i = 0, len = allRadiosQuery.length | 0;
            i < len;
            i = (i + 1) | 0
          ) {
            if (!allRadiosQuery[i].checked) {
              const unchekedCommitment = allRadiosQuery[i].nextElementSibling;
              const unchekedLabel = unchekedCommitment.nextElementSibling;
              unchekedLabel.style.color = "#747f90";
              unchekedLabel.style.border = "1px solid #747f90";
              unchekedCommitment.style.color = "#747f90";
            }
          }
        });

        leaseRadioShape.appendChild(radio);
        leaseRadioShape.appendChild(commitmentPeriod);
        leaseRadioShape.appendChild(label);

        leasePricesForm.appendChild(leaseRadioShape);

        //TODO : SET THE CHOSEN ONE IN SESSION STORAGE

        // LEASE PRICE SELECTOR END
      });

      // MILEAGE PRICE SELECTOR BEGIN

      const selector = document.getElementById("mileage-select");

      let mileage_distance = 1000;
      let mileage_price = "0€";
      let selectedMileage = car.mileagePrices.find(
        (price) => price.allowedMileageMonthly === 1000
      );
      // Create an option for each mileage price
      console.log(car.mileagePrices);
      car.mileagePrices
        .sort(
          (priceA, priceB) =>
            priceA.allowedMileageMonthly - priceB.allowedMileageMonthly
        )
        .forEach((price) => {
          const { allowedMileageMonthly, amountInclVatMonthly } = price;
          let option = document.createElement("option");
          option.text = amountInclVatMonthly
            ? `${allowedMileageMonthly}km/mois (${printPrice(
                amountInclVatMonthly
              )})`
            : `${allowedMileageMonthly}km/mois (inclus)`;
          option.value = `${price.amountInclVatMonthly},${price.allowedMileageMonthly}`;

          selector.add(option);
        });

      const mileageRecap = document.getElementById("recap-mileage");
      const mileageRecapTitle = document.getElementById("recap-mileage-title");
      const mileageRecapValue = document.getElementById("recap-mileage-value");

      mileageRecap.appendChild(mileageRecapTitle);
      mileageRecap.appendChild(mileageRecapValue);

      mileageRecapTitle.textContent = `Forfait 1000km/mois`;
      mileageRecapValue.textContent = "inclus";

      selector.addEventListener("change", (e) => {
        const [amountInclVatMonthly, allowedMileageMonthly] =
          e.target.value.split(",");
        mileageRecapTitle.textContent = `Forfait ${allowedMileageMonthly}km/mois`;
        mileageRecapValue.textContent = amountInclVatMonthly
          ? `+ ${printPrice(amountInclVatMonthly)}/mois`
          : "ìnclus";

        mileage_distance = allowedMileageMonthly;
        mileage_price = printPrice(amountInclVatMonthly);
        selectedMileage = {
          allowedMileageMonthly: parseInt(allowedMileageMonthly),
          amountInclVatMonthly: parseInt(amountInclVatMonthly),
        };
      });

      //TODO : SET THE CHOSEN ONE IN SESSION STORAGE

      // MILEAGE PRICE SELECTOR END

      // INSURANCE SELECTOR BEGIN

      const insuranceForm = document.getElementById("insurance-selector");
      const insuranceOptions = [
        {
          uuid: "mondaycar",
          title: "Vous m’assurez",
          description: "J’utilise l’assurance tous risques de mondaycar",
        },
        {
          uuid: "customer",
          title: "Je m’assure",
          description: "J’utilise ma propre solution d’assurance tous risques.",
        },
      ];

      let selectedInsuranceUUID = insuranceOptions[0].uuid;
      let insurance = selectedInsuranceUUID;
      let selectedInsurance = insuranceOptions[0].uuid;

      insuranceOptions.map((option) => {
        const insuranceRadioShape = document.createElement("div");
        insuranceRadioShape.setAttribute("class", "insurance-radio-shape");

        const radio = document.createElement("input");
        radio.setAttribute("id", option.uuid);
        radio.setAttribute("class", "insurance-radio-button");
        radio.type = "radio";
        radio.name = "insurance";
        radio.value = option.uuid;
        radio.checked = option.uuid === selectedInsuranceUUID;

        const label = document.createElement("label");
        label.setAttribute("class", "insurance-label");
        label.textContent = option.title;
        label.htmlFor = option.uuid;

        const span = document.createElement("span");
        span.setAttribute("class", "insurance-desc");
        span.textContent = option.description;

        if (radio.checked) {
          label.style.color = "#32e0c4";
          label.style.border = "1px solid #32e0c4";
        }

        radio.addEventListener("change", function (e) {
          selectedInsurance = e.target.value;
          insurance = e.target.value;
          const insuranceCollapse =
            document.getElementById("insurance-collapse");
          if (e.target.value !== "mondaycar") {
            insuranceCollapse.style.display = "none";
          } else {
            insuranceCollapse.style.display = "block";
          }

          label.style.color = "#32e0c4";
          label.style.border = "1px solid #32e0c4";

          var allRadiosQuery = document.querySelectorAll(
            'input[name="insurance"]'
          );
          for (
            var i = 0, len = allRadiosQuery.length | 0;
            i < len;
            i = (i + 1) | 0
          ) {
            if (!allRadiosQuery[i].checked) {
              const unchekedLabel = allRadiosQuery[i].nextElementSibling;
              unchekedLabel.style.color = "#747f90";
              unchekedLabel.style.border = "1px solid #747f90";
            }
          }
        });

        label.appendChild(span);

        insuranceRadioShape.appendChild(radio);
        insuranceRadioShape.appendChild(label);

        insuranceForm.appendChild(insuranceRadioShape);

        //TODO : SET THE CHOSEN ONE IN SESSION STORAGE

        // LEASE PRICE SELECTOR END
      });

      const signupButton = document.getElementById("signup-button");

      // Use this chunck of code in order to signup the user when he clicks on "Ce vehicule m'intéresse"

      //   signupButton.addEventListener("click", (e) => {
      //     console.log("button clicked");
      //     let webAuth;
      //     /* if (document.location.href.includes("webflow.io")) {
      //       webAuth = new auth0.WebAuth({
      //         domain: "mondaycar.eu.auth0.com",
      //         clientID: "5q9jO4QxVTbKSjIgRHa6P2ckbL9Ynfv9",
      //         redirectUri: `https://mondaycar.webflow.io/confirmation`,
      //       });
      //     }
      //      else { */
      //     /*
      //     webAuth = new auth0.WebAuth({
      //         domain: "mondaycar-production.eu.auth0.com",
      //         clientID: "ctnZpedOtXcbWqecL6fEQfAdcdxemhEK",
      //         redirectUri: `https://mondaycar.com/confirmation`,
      //       });
      //       */
      //     // }

      //     console.log("webauth", webAuth);

      //     /* const userSelection = {
      //       car_id: car.listingUUID,
      //       car_name: `${car.manufacturer} ${car.model}`,
      //       car_finition: car.edition,
      //       car_engine: car.engine,
      //       commitment_duration,
      //       commitment_price,
      //       commitment_uuid,
      //       mileage_distance,
      //       mileage_price,
      //       insurance,
      //       utm: "",
      //     };

      //     webAuth.authorize({
      //       responseType: "code",
      //       leadData: userSelection,
      //       state: car.listingUUID,
      //     });
      //   });
      //   */

      //     // Use this chunck of code in order to collect the lead via zapier workflow
      //   });
      signupButton.addEventListener("click", (e) => {
        console.log("button clicked");

        sessionStorage.setItem(
          "selection",
          JSON.stringify({
            selectedLease,
            selectedMileage,
            selectedInsurance,
            total: printPrice(
              selectedLease.amountInclVatMonthly +
                selectedMileage.amountInclVatMonthly
            ),
          })
        );

        document.location.href = `reservation?id=${car.listingUUID}`;
      });
    } else {
      document.location.href = "voitures";
    }
  };

  request.send();
};

(function () {
  getCar();
})();

// HELPERS
/*
const printPrice = (amountX100 = 0, currentSymbol = "€", precision = 0) => {
  return `${(amountX100 / 100).toFixed(precision)}${currentSymbol}`;
};

const mainImage = (car) => {
  const byPriorityLowToHigh = car.images.sort(
    (a, b) => a.priority - b.priority
  );
  return byPriorityLowToHigh[0];
};

const leasePlan = (leasePrices) => {
  const byExpensivePrice = leasePrices.sort(
    (a, b) =>
      b.amountInclVatMonthly - a.amountInclVatMonthly ||
      b.commitmentDurationInMonths - a.commitmentDurationInMonths
  );
  return {
    cheapest: byExpensivePrice[byExpensivePrice.length - 1],
    expensive: byExpensivePrice[0],
  };
};
*/
