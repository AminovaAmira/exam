


const API_KEY = '61cb8271-7f9f-4e29-b714-f10e5f73fc86'
const GET_ALL_ROUTS_URL = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${API_KEY}`
const GET_ALL_ORDERS_URL = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=${API_KEY}`
const routesTableEl = document.querySelector('.table')

 const getAllRouts = async()=>{
    const response = await fetch(GET_ALL_ROUTS_URL)
    const routes = await response.json()
    return routes
}


const renderRoutes = async()=>{
    const routes = await getAllRouts()
    for(let i=3 ; i<6 ; i++){
        routesTableEl.innerHTML+=`
        <div class="row border  ">
            <div class="col border d-flex align-items-center justify-content-center"><p class=" p-0 text-center fs-5">${routes[i].name}</></div>
            <div class="col border d-flex align-items-center justify-content-center"><p class=" text-center fs-5">${routes[i].description}</></div>
            <div class="col border d-flex align-items-center justify-content-center "><p class=" text-center fs-5">${routes[i].mainObject}</></div>
            <div class="col border d-flex align-items-center justify-content-center "><button class="btn btn-secondary" >Выбрать</button></div>
            </div>
        `
    }
    // routes.forEach(rout => {
       
    // });
}

renderRoutes()

