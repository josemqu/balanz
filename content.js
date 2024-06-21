/*
 * This is a sample of a tbody tr element from the page to use it
 * as a reference to create the summary row.
 *
 * <tr _ngcontent-iux-c215="" class="tr-row-ticker ng-star-inserted">
  <td _ngcontent-iux-c215="" class="pl-3 text-left">
      AMD
  </td>
  <td _ngcontent-iux-c215="" class="text-size-4">
    <span _ngcontent-iux-c215=""> 15 </span>
  </td>

  <td _ngcontent-iux-c215="">
    <div _ngcontent-iux-c215="" class="rounded">
      <span
        _ngcontent-iux-c215=""
        class="text-size-4 text-color-primary-alt-dark"
      >
        $ 19.971,00
      </span>
    </div>
  </td>
  <td _ngcontent-iux-c215="" class="text-size-4">
    <span _ngcontent-iux-c215="">19/06/2024</span>
  </td>
  <td _ngcontent-iux-c215="" class="text-size-4">
    <span _ngcontent-iux-c215=""> $ 299.565 </span>
  </td>
  <td _ngcontent-iux-c215="" class="text-size-4">
    <span _ngcontent-iux-c215=""> $ 311.202 </span>
  </td>
  <td _ngcontent-iux-c215="" class="text-size-4 bg-color-base">
    <div _ngcontent-iux-c215="" class="exchange-lower">
      <span _ngcontent-iux-c215="">$ -11.637</span>
    </div>
  </td>
  <td _ngcontent-iux-c215="" class="text-break">
    <div _ngcontent-iux-c215="" class="rounded">
      <span _ngcontent-iux-c215="" class="text-size-4"> 0.00 (0.00%) </span>
    </div>
  </td>
  <td
    _ngcontent-iux-c215=""
    class="text-left py-2 column-last-fix td-custom-border-left"
  >
    <div
      _ngcontent-iux-c215=""
      class="d-flex justify-content-center align-items-center"
    >
      <button _ngcontent-iux-c215="" class="cursor-pointer btn" id="AMD">
        <img
          _ngcontent-iux-c215=""
          alt=""
          src="https://cms.balanz.com/PFS/076909_ellipsisverticalsolid_dark.svg"
        />
      </button>
    </div>
  </td>
</tr>
 *
 */

let summaryLoaded = false;

function summarizeTable(table) {
  let tableName = table.parentNode.parentNode.previousElementSibling
    .querySelectorAll("span")[1]
    .textContent.replace(/[^a-zA-Z0-9]+/g, "");
  const summaryRowExists = document.querySelector(`.summary-tr-${tableName}`);
  if (tableName === "Fondo" || summaryRowExists) return;

  console.log(tableName);
  let rows = table.querySelectorAll("tbody tr");
  const summary = {
    Name: tableName,
    Ticker: "Total (USD)",
    Nominales: 0,
    Precio: 0,
    vActual: 0,
    vInicial: 0,
    Rendimiento: 0,
    Variacion: 0,
    UpperOrLower: "lower",
  };

  const arsUsdChange = parseFloat(
    document
      .querySelector(
        "app-mi-disponible > app-balanz-card > div > div > div:nth-child(2) > div > div > div > p > b"
      )
      .textContent.replace(/[^0-9,$]+/g, "")
  );

  console.log({ arsUsdChange });

  // convert rows collection to array
  rows = Array.from(rows);

  // descartar la primera y la segunda filas
  rows.shift();
  const lastRow = rows.pop();

  const vActualArs = parseFloat(
    lastRow
      .querySelector("td:nth-child(3)")
      .textContent.replace(/[^0-9-]+/g, "")
  );
  const vInicialArs = parseFloat(
    lastRow
      .querySelector("td:nth-child(4)")
      .textContent.replace(/[^0-9-]+/g, "")
  );

  console.log({
    vActualArs,
    vInicialArs,
  });

  const { vActualUSD, vInicialUSD } = {
    vActualUSD: vActualArs / arsUsdChange,
    vInicialUSD: vInicialArs / arsUsdChange,
  };

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    summary.Nominales += parseFloat(cells[1]?.textContent) || 0;
    summary.vActual = vActualUSD;
    summary.vInicial = vInicialUSD;
    summary.Rendimiento = vActualUSD - summary.vInicial;
  });
  // summary.vInicial = summary.Nominales;
  summary.Precio = "-"; //summary["V. Actual"] / summary.Nominales;
  summary.Variacion =
    ((summary.vActual - summary.vInicial) / summary.vInicial) * 100;

  const summaryRow = document.createElement("tr");
  summaryRow.classList.add(
    `summary-tr-${tableName}`,
    "tr-row-ticker",
    "ng-star-inserted",
    "tr-cumulative-performance",
    "ng-star-inserted"
  );
  summary.UpperOrLower = summary.Rendimiento < 0 ? "lower" : "upper";
  summaryRow.setAttribute("_ngcontent-iux-c215", "");
  summaryRow.style.height = "43px";
  // border bottom color to rgb(128, 128, 128)
  summaryRow.style.borderBottom = "1px solid rgb(128, 128, 128) !important";

  summaryRow.innerHTML = `
    <td class="pl-3 text-left text-size-4">${summary.Ticker}</td>
    <td class="text-size-4 text-center"><span>${summary.Nominales.toFixed(
      0
    )}</span></td>
    <td><div class="rounded"><span class="text-size-4 text-center text-color-primary-alt-dark"></span></div></td>
    <td class="text-size-4"></td>
    <td class="text-size-4 text-center tr-cumulative-performance__text text-color-primary-alt-dark">${summary.vActual.toLocaleString(
      "es-AR",
      {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }
    )}</td>
    <td class="text-size-4 text-center tr-cumulative-performance__text text-color-primary-alt-dark">${summary.vInicial.toLocaleString(
      "es-AR",
      {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }
    )}</td>
    <td class="text-center exchange-${
      summary.UpperOrLower
    } tr-cumulative-performance__text text-size-4 tr-cumulative-performance__text_${
    summary.UpperOrLower
  }">US$ ${summary.Rendimiento.toLocaleString("es-AR", {
    maximumFractionDigits: 0,
    type: "percent",
  })}</td>
    <td class="text-break text-center"><div class="rounded"><span class="text-center text-size-4">${summary.Variacion.toFixed(
      2
    )} %</span></div></td>
    <td class="text-left py-2 column-last-fix td-custom-border-left"></td>
  `;
  // set padding of each td to 2px on y axis and 17px on x axis
  summaryRow.querySelectorAll("td").forEach((td) => {
    td.style.padding = "2px 17px";
    td.style.borderBottom = "1px solid rgb(128, 128, 128) !important";
  });

  // append the summary row just before the last row of the actual table
  table
    .querySelector("tbody")
    .querySelector("tr:last-child")
    .before(summaryRow);

  // observer.observe(document.querySelector(`tr.tr-${tableName}`), {
  //   childList: true,
  //   subtree: true,
  // });
}

function processTables() {
  const tables = document.querySelectorAll("table");
  tables.forEach(summarizeTable);
  summaryLoaded = true;
}

// generate a DOM mutation observer to listen for changes in the page
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.removedNodes.length) {
      console.log("Node removed", mutation.removedNodes);
      checkAndAddSummary();
      summaryLoaded = false;
    }
  });
});

// observe the tables of the page
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Run the script when the page is fully loaded
if (document.readyState === "loading") {
  console.log("Page not loaded yet");
  document.addEventListener(
    "DOMContentLoaded",
    setTimeout(() => processTables(), 3000)
  );
} else {
  console.log("Page already loaded");
  setTimeout(() => {
    processTables();
  }, 1500);
}

const checkAndAddSummary = () => {
  const summaryRows = document.querySelectorAll("tr.tr[class^='summary-tr-']");
  console.log({ summaryRows });
  if (summaryRows.length === 0) {
    processTables();
  }
};
