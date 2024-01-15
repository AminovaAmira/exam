const API_KEY = '61cb8271-7f9f-4e29-b714-f10e5f73fc86'
const GET_ALL_ROUTS_URL = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${API_KEY}`
const GET_ALL_ORDERS_URL = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=${API_KEY}`


const routesTableEl = document.querySelector('.table-content')
const guideTableEl = document.querySelector('.guide-table-content')
const previousRoutesPageBtn = document.querySelector('#previous-routes')
const nextRoutesPageBtn = document.querySelector('#next-routes')
const searchRoutInput = document.querySelector('#search-rout-inp')
const selectRout = document.querySelector('#select-rout')
const selectLanguage = document.querySelector('#select-language')
const guidesRouteNameEl = document.getElementById('guide-rout-name')
const guideInfoEl = document.querySelector('.guide-info')
const expFromEl = document.getElementById('exp-from')
const expToEl = document.getElementById('exp-to')
const expFindBtn = document.getElementById('exp-find-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
let currentPage=0


const main = async(page)=>{
    const routes = await getAllRouts()
    paginationButtunHandler(routes)

    searchRoutInput.addEventListener('input', (e)=>{
        if(e.target.value!=''){
            renderRoutTable(findRoutsByName(routes, e.target.value))
        }else{
          renderTableWithPagination(routes, page)

        }
        
    })
    selectRout.addEventListener('change',(e)=>{
        if( e.target.value!='Основные объекты'){
            renderRoutTable(findRoutsByObject(routes, e.target.value))
        }else{
          renderTableWithPagination(routes, page)

        }
    })

    


    renderRoutSelectOptions(routes)
    renderTableWithPagination(routes, page)
    selectRoutBtnHandler(document.querySelectorAll('.select-rout-btn'))
    showSelectedRout(localStorage.getItem('selectedRoutId'))
    showGuideInfo()
    
}




 const getAllRouts = async()=>{
    const response = await fetch(GET_ALL_ROUTS_URL)
    const routes = await response.json()
    return routes
}

const getGuidesByRoutId = async(routId)=>{
    const response = await fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routId}/guides?api_key=${API_KEY}&api_key=${API_KEY}`)
    const guides = await response.json()
    return guides
}


const showGuideInfo = async ()=>{
    if(localStorage.getItem('selectedRoutName')){
        const selectedRoutId = localStorage.getItem('selectedRoutId').split('_')[1]
        guideInfoEl.classList.remove('d-none')
        guidesRouteNameEl.innerText = `Доступные гиды по маршруту: ${localStorage.getItem('selectedRoutName')} `

        const guides =  await getGuidesByRoutId(selectedRoutId)
        renderGuidesTable(guides)
        renderGuideSelectOptions(guides)

        selectLanguage.addEventListener('change',(e)=>{
            if( e.target.value!='Язык экскурсии'){
                renderGuidesTable(findGuideByLanguage(guides,e.target.value))
            }else{
                renderGuidesTable(guides)    
            }
        })


        
        expFindBtn.addEventListener('click', (e)=>{
            if(expFromEl.value!='' || expToEl.value !=''){
                renderGuidesTable(findGuideByExperience(guides,expFromEl.value, expToEl.value))
            }else{
                renderGuidesTable(guides)  

            }
            
        })

        selectGuideBtnHandler(document.querySelectorAll('.select-guide-btn'))
    }
}
    




const paginationButtunHandler = (routes)=>{
    if(currentPage===0){
        previousRoutesPageBtn.classList.add('disabled')
    }else{
        previousRoutesPageBtn.classList.remove('disabled')
    }
    if(currentPage ===routes.length){
        nextRoutesPageBtn.classList.add('disabled')
    }
} 

const renderTableWithPagination = (routes, page)=>{
    routesTableEl.innerHTML= ''

    for(let i=page ; i<page+3 ; i++){
        routesTableEl.innerHTML+=`
        <div id='rout_${routes[i].id}' class="row border  ">
            <div class="col border d-flex align-items-center justify-content-center"><p class=" p-0 text-center fs-5">${routes[i].name}</></div>
            <div class="col border d-flex align-items-center justify-content-center"><p class=" text-center fs-5">${routes[i].description}</></div>
            <div class="col border d-flex align-items-center justify-content-center "><p class=" text-center fs-5">${routes[i].mainObject}</></div>
            <div class="col border d-flex align-items-center justify-content-center "><button class="btn btn-secondary select-rout-btn" >Выбрать</button></div>
            </div>
        `
    }
}
const renderRoutTable = (routes)=>{
    routesTableEl.innerHTML= ''
    for(let i=0 ; i<routes.length ; i++){
        routesTableEl.innerHTML+=`
        <div id='rout_${routes[i].id} class="row border  ">
            <div class="col border d-flex align-items-center justify-content-center"><p class=" p-0 text-center fs-5">${routes[i].name}</></div>
            <div class="col border d-flex align-items-center justify-content-center"><p class=" text-center fs-5">${routes[i].description}</></div>
            <div class="col border d-flex align-items-center justify-content-center "><p class=" text-center fs-5">${routes[i].mainObject}</></div>
            <div class="col border d-flex align-items-center justify-content-center "><button class="btn btn-secondary select-rout-btn" >Выбрать</button></div>
            </div>
        `
    }
}

const renderGuidesTable = (guides)=>{
    guideTableEl.innerHTML= ''
    for(let i=0 ; i<guides.length ; i++){
        guideTableEl.innerHTML+=`
        <div id='guide_${guides[i].id}' class="row border  ">
            <div class="col border d-flex align-items-center justify-content-center"><p class=" p-0 text-center fs-5">${guides[i].name}</></div>
            <div class="col border d-flex align-items-center justify-content-center"><p class=" text-center fs-5">${guides[i].language}</></div>
            <div class="col border d-flex align-items-center justify-content-center "><p class=" text-center fs-5">${guides[i].workExperience}</></div>
            <div class="col border d-flex align-items-center justify-content-center "><p class=" text-center fs-5">${guides[i].pricePerHour}</></div>
            <div class="col border d-flex align-items-center justify-content-center "><button class="btn btn-secondary select-guide-btn" >Выбрать</button></div>
            </div>
        `
    }
}




const findRoutsByName = (routes , name)=>{
    return routes.filter(el=>el.name ===name)
}
const findRoutsByObject = (routes , object)=>{
    return routes.filter(el=>el.mainObject.slice(0,60) ===object.slice(0,-3))
}

const findGuideByExperience = (guides , expFrom , expTo)=>{
    return guides.filter(el=> el.workExperience>=expFrom && el.workExperience<=expTo)
}

const findGuideByLanguage = (guides , language)=>{
    console.log(guides[0].language)
    return guides.filter(el=> el.language === language)
}

const renderRoutSelectOptions = (routes)=>{
    for(i in routes){
        selectRout.innerHTML+=`<option class="w-25">${routes[i].mainObject.slice(0,60)}...</option>`

    }
}

const renderGuideSelectOptions = (guides)=>{
    for(i in guides){
        selectLanguage.innerHTML+=`<option class="w-25">${guides[i].language}</option>`
    }
}

const selectRoutBtnHandler= (btns)=>{
    btns.forEach(btn => {
        btn.addEventListener('click', (e)=>{
            const row = e.target.parentNode.parentNode
            // const routId = row.id.split('_')[0]
            const routId = row.id
            const routName = row.firstElementChild.firstElementChild.textContent

            localStorage.setItem('selectedRoutId', routId)
            localStorage.setItem('selectedRoutName', routName)
            showSelectedRout(routId)
        })
    });
}
const selectGuideBtnHandler= (btns)=>{
    btns.forEach(btn => {
        btn.addEventListener('click', (e)=>{
            // document.textContent
            const row = e.target.parentNode.parentNode
            // const routId = row.id.split('_')[0]
            const guideId = row.id.split('_')[1]
            console.log()
            const guideFio = row.firstElementChild.firstElementChild.textContent
            const guidePrice = row.childNodes[7].firstElementChild.textContent
            localStorage.setItem('selectedGuideFio', guideFio)
            localStorage.setItem('selectedGuidePrice', guidePrice)



            showModal()
           
        })
    });
}


const showModal = ()=>{
    document.querySelector('#myModal').style.display = 'block'
    document.querySelector('#myModal').classList.add('show')
    document.querySelector('#route').value = localStorage.getItem('selectedRoutName')
    document.querySelector('#guide').value = localStorage.getItem('selectedGuideFio')


}




const showSelectedRout = (id)=>{
    routesTableEl.childNodes.forEach(el=>{
        if( el.nodeName=='DIV' && el.classList.contains('bg-body-tertiary') ){

            el.classList.remove('bg-body-tertiary')
        }
    })
    document.getElementById(`${id}`).classList.add('bg-body-tertiary')
    showGuideInfo()

}


nextRoutesPageBtn.addEventListener('click', (e)=>{
        currentPage+=3
        routesTableEl.innerHTML= ''
        main(currentPage)
})
previousRoutesPageBtn.addEventListener('click', ()=>{
        currentPage-=3
        routesTableEl.innerHTML= ''
        main(currentPage)
})
closeModalBtn.addEventListener('click',()=>{
    document.querySelector('#myModal').style.display = 'none'
    document.querySelector('#myModal').classList.remove('show')
})


main(currentPage)
