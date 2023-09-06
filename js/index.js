// fetch('https://dummyjson.com/products?skip=0&limit=20')
// .then(res => res.json())
// .then(console.log);
async function getData(arg) {
    console.log(arg)
    const response = await fetch(`https://dummyjson.com/products${arg}`);
    const data = await response.json();

    return data
}
let basketArr = []
async function selectCat(){
    let categoriesData = await getData("/categories");
    let categoriesList = document.querySelector('#categories')
    categoriesData.forEach(e=>{
        let option = new Option(e);
        option.value = e
        categoriesList.append(option)
    })

    categoriesList.addEventListener('change',(event)=>{
        if (categoriesList.value !== "all") {
            main('/category/'+categoriesList.value)
        }else{
            main("?limit=0&skip=0")
        }
    })
}
selectCat()
async function search() {
    let search_input = document.querySelector('.search-input');
    let search_button = document.querySelector('.search-button');
    search_button.addEventListener('click',(e)=>{

        if (search_input.value !== "") {
            main('/search?q='+search_input.value)
        }else{
            main("?limit=0&skip=0")

        }
        })

}
search()
async function main(arg = "?limit=0&skip=0"){

    let productsData = await getData(arg);
    let currentPage = 1;
    let rows = 20;

    function displayList(arrData, rowPerPage, page) {
        const productsEl = document.querySelector('.products');
        productsEl.innerHTML="";
        page--;
        const start = rowPerPage * page;
        const end = start  + rowPerPage;
        const paginatedData = arrData.slice(start,end);

        paginatedData.forEach((el,i) => {
            let id = el.id
            const productEl = document.createElement("div");
            productEl.classList.add("product");
            productEl.innerHTML = `
            <div class="info-product">
                <div class="image"> <img src="${el.thumbnail}"></div>
                <div class="info-product__items">
                    <div class="title">${el.title}</div>
                    <div class="description">Описание: ${el.description}</div>
                </div>
            </div>
                <div class="category">Категория: ${el.category}</div>
                <div class="price">Цена: ${el.price}</div>
                <div class="rating">Рейтинг: ${el.rating}</div>
                <button class="product__basket"><div value="${el.id}" class="display-none">${el.id}</div>В корзину <img src="./images/basket.png" alt=""></button>
            `;
            // basket(i)
            productsEl.appendChild(productEl);
        });
    }
    function displayPagination(arrData, rowPerPage) {
        const paginationEl = document.querySelector('.pagination');
        paginationEl.innerHTML="";
        const pagesCount = Math.ceil(arrData.length / rowPerPage);
        const ulEl = document.createElement("ul");
        ulEl.classList.add('pagination__list');

        for (let i = 0; i < pagesCount; i++) {
          const liEl = displayPaginationBtn(i + 1);
          ulEl.appendChild(liEl)
        }
        paginationEl.appendChild(ulEl)
      }

      function displayPaginationBtn(page) {
        const liEl = document.createElement("li");
        liEl.classList.add('pagination__item')
        liEl.innerText = page

        if (currentPage == page) liEl.classList.add('pagination__item--active');

        liEl.addEventListener('click', () => {
          currentPage = page
          displayList(productsData.products, rows, currentPage)

          let currentItemLi = document.querySelector('li.pagination__item--active');
          currentItemLi.classList.remove('pagination__item--active');

          liEl.classList.add('pagination__item--active');
        })

        return liEl;
      }
      async function basket(id) {
        let backet__count = document.querySelector('.backet__count')
        let product__basket = document.querySelectorAll('.product__basket');
        backet__count.innerHTML= basketArr.length;

        product__basket.forEach((item)=>{
            let basket__id = item.querySelector('.display-none')
            item.addEventListener('click',(e)=>{
                basketArr.push(basket__id.getAttribute('value'));
                backet__count.innerHTML= basketArr.length;

            })
        })


      }

    displayList(productsData.products,rows,currentPage);
    displayPagination(productsData.products, rows);
    basket();
}
main();

async function modalOpen() {
    let modal = document.querySelector('.modal');
    let basketMain = document.querySelector('.basket');
    let basketItems = document.querySelector('.basket__items ul');
    let close = document.querySelector('.close')
    let productsData = await getData("?limit=0&skip=0");
    let downButton = document.querySelector('.down')
    basketItems.innerHTML = ""
    basketArr.forEach((item)=>{
        productsData.products.forEach((element)=>{
            if (element.id == item) {
                const basketEl = document.createElement("li");
                basketEl.innerHTML= `<li>${element.title}</li>`
                basketItems.appendChild(basketEl);
            }
        })


    })

    downButton.addEventListener('click',(e)=>{
        basketArr = [];
        modalOpen();
    })
    basketMain.addEventListener('click',(e)=>{
        modal.classList.add('show')
        modalOpen();
    })
    close.addEventListener('click',(e)=>{
        modal.classList.remove('show')

    })

}
modalOpen();