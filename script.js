async function show() {
  let headers = {};
  await fetch("https://api-mobilespecs.azharimm.site/v2/search?query=iphone", {
    method: "GET",
    mode: "cors",
    headers: headers,
  })
    .then((response) => response.json())
    .then((response) => {
      updateUi(response.data.phones);
    });
}
show();

const searchBUtton = document.querySelector(".search-button");
searchBUtton.addEventListener("click", async function () {
  try {
    const inputKeyword = document.querySelector(".input-keyword");
    const phones = await getPhones(inputKeyword.value);
    // console.log(phones);
    updateUi(phones);
  } catch (err) {
    console.log(err);
    alert(err);
  }
});

function getPhones(keyword) {
  return fetch("https://api-mobilespecs.azharimm.site/v2/search?query= " + keyword)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response.data.phones;
    });
}

function updateUi(phone) {
  let cards = "";
  phone.forEach((phone) => {
    cards += showCards(phone);
    const phoneContainer = document.querySelector(".phones-container");
    phoneContainer.innerHTML = cards;
  });
}

// event binding
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("modal-detail-button")) {
    console.log("klik");
    const slug = e.target.dataset.slug;
    const phoneDetail = await getPhoneDeatil(slug);
    updateUiDetail(phoneDetail);
  }
});

function getPhoneDeatil(slugId) {
  return fetch("https://api-mobilespecs.azharimm.site/v2/" + slugId)
    .then((response) => response.json())
    .then((p) => p);
}

function updateUiDetail(p) {
  const phonD = p.data;
  const phoneDetail = showPhoneDetail(phonD);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = phoneDetail;
}

function showCards(phone) {
  return `<div class="col-md-4 my-4">
            <div class="card" style="width: 18rem">
              <img src="${phone.image}" class="card-img-top" alt="..." />
              <div class="card-body">
                <h5 class="card-title">${phone.phone_name}</h5>
                <a href="#" class="btn btn-sm  btn-primary modal-detail-button" data-bs-toggle="modal" data-bs-target="#phoneDetailModal" data-slug="${phone.slug}">Show Details</a>
              </div>
            </div>
          </div>`;
}

function showPhoneDetail(phonD) {
  return `<div class="container-fluid">
            <div class="row">
              <div class="col-md-4">
                <img src="${phonD.phone_images[1]}" alt="" class="img-fluid" width="180" />
              </div>
              <div class="col-md">
                <ul class="list-group list-group-flush">
                <li class="list-group-item">Name : <b>${phonD.phone_name}</b></li>
                  <li class="list-group-item">Release_date :<b> ${phonD.release_date}</b></li>
                  <li class="list-group-item">Dimensions :<b> ${phonD.dimension}</b></li>
                  <li class="list-group-item">OS : <b>${phonD.os}</b></li>
                </ul>
              </div>
            </div>
          </div>`;
}
