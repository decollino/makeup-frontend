init();
async function init() {
  listProducts().then((products) => {
    const brands = products.map((p) => p.brand).filter(onlyUnique);
    renderItems(brands, document.getElementById("filter-brand"));
    const types = products.map((p) => p.product_type).filter(onlyUnique);
    renderItems(types, document.getElementById("filter-type"));
  });
  search();
}

function listProducts() {
  //return fetchJson("http://makeup-api.herokuapp.com/api/v1/products.json");
  return fetchJson("/data/products.json");
}

function fetchJson(url) {
  return fetch(url)
    .then((r) => {
      if (r.ok) {
        return r.json();
      } else {
        throw new Error(r.statusText);
      }
    })
    .catch((error) => {
      showError("Error loading data", error);
      throw error;
    });
}

function search() {
  const nameField = document.getElementById("filter-name");
  const textName = nameField.value;
  const brandField = document.getElementById("filter-brand");
  const selectedBrand = brandField.options[brandField.selectedIndex].value;
  const typeField = document.getElementById("filter-type");
  const selectedType = typeField.options[typeField.selectedIndex].value;
  const sortField = document.getElementById("sort-type");
  const selectedSort = sortField.options[sortField.selectedIndex].value;

  listProducts().then((products) => {
    const productsFiltered = products
      .filter((p) => {
        return (
          p.name.toString().toLowerCase().includes(textName.toLowerCase()) &&
          (p.brand == selectedBrand || selectedBrand == "") &&
          (p.product_type == selectedType || selectedType == "")
        );
      })
      .sort(orderBy(selectedSort));
    renderData(productsFiltered);
  });
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function convertPrice(price) {
  return (price * 5.5).toFixed(2);
}

function orderBy(selectedSort) {
  switch (selectedSort) {
    case "0":
      // Melhor Avaliados
      return (a, b) =>
        parseFloat(a.rating == null ? 0 : a.rating) <
        parseFloat(b.rating == null ? 0 : b.rating)
          ? 1
          : parseFloat(b.rating == null ? 0 : b.rating) <
            parseFloat(a.rating == null ? 0 : a.rating)
          ? -1
          : 0;
    case "1":
      // Menores Precos
      return (a, b) =>
        parseFloat(a.price) > parseFloat(b.price)
          ? 1
          : parseFloat(b.price) > parseFloat(a.price)
          ? -1
          : 0;
    case "2":
      // Maiores Precos
      return (a, b) =>
        parseFloat(a.price) < parseFloat(b.price)
          ? 1
          : parseFloat(b.price) < parseFloat(a.price)
          ? -1
          : 0;
    case "3":
      // A Z
      return (a, b) => {
        let x = a.name.toUpperCase().trim();
        let y = b.name.toUpperCase().trim();
        return x == y ? 0 : x > y ? 1 : -1;
      };
    case "4":
      // Z A
      return (a, b) => {
        let x = b.name.toUpperCase().trim();
        let y = a.name.toUpperCase().trim();
        return x == y ? 0 : x > y ? 1 : -1;
      };
  }
}

function renderData(products) {
  document.getElementById("catalog").innerHTML = "";
  for (const product of products) {
    const divText = productItem(product);
    const div = document.createRange().createContextualFragment(divText);
    document.getElementById("catalog").appendChild(div.firstChild);
  }
}

function renderItems(items, select) {
  for (const item of items) {
    const option = document.createElement("option");
    option.textContent = item;
    option.value = item;
    select.appendChild(option);
  }
}

function productItem(product) {
  const item = `<div class="product" data-name=${product.name} data-brand=${
    product.brand
  } 
  data-type=${product.product_type} tabindex="508"> 
  <figure class="product-figure">
  <img src=${product.image_link} width="215" height="215" alt=${
    product.name
  } onerror="javascript:this.src='img/unavailable.png'">
  </figure>
  <section class="product-description">
    <h1 class="product-name">${product.name}</h1>
    <div class="product-brands"><span class="product-brand background-brand">${
      product.brand
    }</span>
<span class="product-brand background-price">R$ ${convertPrice(
    product.price
  )}</span></div>
  </section>
  ${loadDetails(product)}
</div>`;
  return item;
}

//EXEMPLO DO CÓDIGO PARA OS DETALHES DE UM PRODUTO
function loadDetails(product) {
  let details = `<section class="product-details"><div class="details-row">
        <div>Brand</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.brand}</div>
        </div>
      </div><div class="details-row">
        <div>Price</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${convertPrice(
            product.price
          )}</div>
        </div>
      </div><div class="details-row">
        <div>Rating</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.rating}</div>
        </div>
      </div><div class="details-row">
        <div>Category</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${
            product.category
          }</div>
        </div>
      </div><div class="details-row">
        <div>Product_type</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${
            product.product_type
          }</div>
        </div>
      </div></section>`;
  return details;
}
