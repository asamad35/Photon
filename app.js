const auth = "563492ad6f91700001000001df79b3a9d9a74038ba28a0df8c9baba6";
const searchInput = document.querySelector(".search-input");
const submitBtn = document.querySelector(".submit-btn");
const gallery = document.querySelector(".gallery");
const fadeBg = document.querySelector(".fade-bg");
const popUp = document.querySelector(".pop-up");
var galleryImgs;

// const more = document.querySelector(".more");
let searchValue;
let fetchLink;
let page = 1;
let currentSearch;

// event listner
searchInput.addEventListener("input", updateInput);
submitBtn.addEventListener("click", (e) => {
  currentSearch = searchValue;
  clear();
  searchPhotos(searchValue);
  e.preventDefault();
});
document.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 1000
  ) {
    loadMore();
  }
});
//functions

function updateInput(e) {
  searchValue = e.target.value;
}
function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
}
// fetching data
//async keyword makes a function return a Promise
async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  return data;
}

function generatePictures(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
        
        <img src="${photo.src.large}"></img>
        `;
    const galleryInfo = document.createElement("div");
    galleryInfo.classList.add("gallery-info");
    galleryInfo.innerHTML = `
    <p>${photo.photographer}</p>
    <a href=${photo.src.large}>Download</a>
    `;
    galleryImg.appendChild(galleryInfo);
    galleryImg.addEventListener("mouseover", () => {
      galleryImg.children[0].style.transform = "scale(1.1)";
      fadeInDiv(galleryInfo);
    });
    galleryImg.addEventListener("mouseout", () => {
      galleryImg.children[0].style.transform = "scale(1)";
      fadeOutDiv(galleryInfo);
    });
    galleryImg.addEventListener("click", () => {
      fadeBgDiv();
      popUpDiv(photo);
    });

    gallery.appendChild(galleryImg);
  });
}

async function curatedPhotos() {
  // await keyword makes a function wait for a Promise
  fetchLink = "https://api.pexels.com/v1/curated/?page=1&per_page=15";
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

async function searchPhotos(query) {
  fetchLink = `https://api.pexels.com/v1/search/?page=1&per_page=15&query=${query}`;
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

async function loadMore() {
  page++;
  if (currentSearch)
    fetchLink = `https://api.pexels.com/v1/search/?page=${page}&per_page=15&query=${currentSearch}`;
  else {
    fetchLink = `https://api.pexels.com/v1/curated/?page=${page}&per_page=15`;
  }
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

curatedPhotos();

/////////////STYLING///////////////

function fadeInDiv(galleryInfo) {
  galleryInfo.style.height = "3rem";
  galleryInfo.style.opacity = "1";
  // }
}
function fadeOutDiv(galleryInfo) {
  galleryInfo.style.opacity = "0";
  galleryInfo.style.height = "2rem";
}
function fadeBgDiv() {
  fadeBg.classList.add("active");
}
function popUpDiv(photo) {
  popUp.classList.add("active");
  console.log(window.innerWidth, document.documentElement.clientHeight);
  popUp.style.top = `${window.pageYOffset + 50}px`;
  const popUpImg = popUp.children[0].children[0];
  const popUpInfo = popUp.children[1].children[0];
  popUpInfo.innerHTML = `<h2>Phtograher Name : ${photo.photographer}</h2>
  <a href="${photo.photographer_url}">Photograher Profile</a> 
  <p>Download Image</p>
  <a href="${photo.src.large}">Large</a> 
  <a href="${photo.src.medium}">Medium</a> 
  <a href="${photo.src.original}">Original</a> 
  `;
  popUpImg.src = photo.src.large;
}
fadeBg.addEventListener("click", (e) => {
  if (e.target.classList.contains("fade-bg")) {
    fadeBg.classList.remove("active");
    popUp.classList.remove("active");
  }
});
