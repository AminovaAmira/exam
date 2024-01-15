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
            console.log(findRoutsByObject(routes, e.target.value))
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
            <div class="col border d-flex align-items-center justify-content-center"><p class="  text-center fs-5" title="${routes[i].description}">${routes[i].description.slice(0,200)}</></div>
            <div class="col border d-flex align-items-center justify-content-center "><p class=" text-center fs-5" title="${routes[i].mainObject}">${routes[i].mainObject.slice(0,60)}</></div>
            <div class="col border d-flex align-items-center justify-content-center "><button class="btn btn-secondary select-rout-btn" >Выбрать</button></div>
            </div>
        `
    }
}
const renderRoutTable = (routes)=>{
    routesTableEl.innerHTML= ''
    for(let i=0 ; i<routes.length ; i++){
        routesTableEl.innerHTML+=`
        <div id='rout_${routes[i].id}' class="row border  ">
            <div class="col border d-flex align-items-center justify-content-center"><p class=" p-0 text-center fs-5">${routes[i].name}</></div>
            <div class="col border d-flex align-items-center justify-content-center"><p class=" text-center fs-5"title="${routes[i].description}">${routes[i].description.slice(0,200)}</></div>
            <div class="col border d-flex align-items-center justify-content-center "><p class=" text-center fs-5" title="${routes[i].mainObject}">${routes[i].mainObject.slice(0,60)}</></div>
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
    // console.log(routes[0].mainObject.slice(0,60) ===object.slice(0,-3) )
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
            const guideFio = row.firstElementChild.firstElementChild.textContent
            const guidePrice = row.childNodes[7].firstElementChild.textContent
            localStorage.setItem('selectedGuideFio', guideFio)
            localStorage.setItem('selectedGuideId', guideId)
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
    document.querySelector('#groupSize').addEventListener('input', (e)=>{
        if(Number(e.target.value)>10){

            document.querySelector('#option2').disabled= true
        } 
        if(Number(e.target.value)<=10){
            document.querySelector('#option2').disabled= false
        }
    })


    document.querySelector('#calc').addEventListener('click', ()=>{
        const guidePrice = localStorage.getItem('selectedGuidePrice')
        const date = document.querySelector('#date').value
        const numberOfVisitors = document.querySelector('#groupSize').value
        const startTime = document.querySelector('#time').value
        const hours = document.querySelector('#duration').value
        const option1 = document.querySelector('#option1').checked 
        const option2 = document.querySelector('#option2').checked 

        const totalPrice = calcPrice(guidePrice,hours,numberOfVisitors,startTime,date, option1 , option2)

        document.querySelector('#totalCost').value=totalPrice
        
        if(parseInt(startTime.split(':')[0], 10) <9 ||parseInt(startTime.split(':')[0]<23 )){
            alert("Время с 9 до 23")
            document.querySelector('#time').value = ''
        }
        console.log(new Date(date).getDate())
        console.log(new Date().getDate())
        if(new Date().getDate() == new Date(date).getDate()){
            alerе('Выберите следующую дату!')
            document.querySelector('#date').value = ''
        }

        if(guidePrice&&date&& numberOfVisitors&& startTime&&hours && totalPrice){
            document.querySelector('#send').disabled = false
        }else{
            alert('Заполнены не все поля!')
        }

        document.querySelector('#send').addEventListener('click', ()=>{
            var details = {
                'guide_id': localStorage.getItem('selectedGuideId'),
                'route_id': localStorage.getItem('selectedRoutId').split('_')[1],
                'date': date,
                'time': startTime,
                'duration': hours,
                'persons': numberOfVisitors,
                'price':totalPrice,
                'optionFirst': option1?1:0,
                'optionSecond': option2?1:0,
            };
            
            var formBody = [];
            for (var property in details) {
              var encodedKey = encodeURIComponent(property);
              var encodedValue = encodeURIComponent(details[property]);
              formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            
            fetch('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=61cb8271-7f9f-4e29-b714-f10e5f73fc86', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              },
              body: formBody
            }).then(res=>{
                alert("Заявка создана!")
            })
        })

    })

}




const showSelectedRout = (id)=>{
    routesTableEl.childNodes.forEach(el=>{
        if( el.nodeName=='DIV' && el.classList.contains('bg-body-tertiary') ){

            el.classList.remove('bg-body-tertiary')
        }
    })
    showGuideInfo()

    document.getElementById(`${id}`).classList.add('bg-body-tertiary')

}



const calcPrice = (guidePrice, hours , numberOfVisitors, startTime, date, option1, option2)=>{
    const isWeekend = isWeekendToday(date)?1.5:1
    const morningCoast = isMorning(startTime)?400:0
    const eveningCoast = isEvening(startTime)?1000:0
    const visitorsCoast = increaseInNumbersOfVisitors(numberOfVisitors)
    
    let total = (guidePrice*hours*isWeekend)+morningCoast+eveningCoast+visitorsCoast

    if(option2){
        if(numberOfVisitors<5){
             total*=1.15
        }
        if(numberOfVisitors>=5 && numberOfVisitors<=10){
             total*=1.25
        }
    }



    if(option1) total+=numberOfVisitors*1000
    return total.toFixed()
}

function isWeekendToday(date) {
    let today = new Date(date);
    let dayOfWeek = today.getDay(); 
  
    return (dayOfWeek === 0 || dayOfWeek === 6); 
  }

function isMorning(time){
   let hour = parseInt(time.split(':')[0], 10) 
   if(hour>=9 && hour<=12){
    return true
   }
   return false 
}

function isEvening(time){
    let hour = parseInt(time.split(':')[0], 10) 
    if(hour>=20 && hour<=23){
     return true
    }
    return false 
 }

function increaseInNumbersOfVisitors(numberOfVisitors){
    if(numberOfVisitors<5){
        return 0
    }
    if(numberOfVisitors>=5 && numberOfVisitors<10){
        return 1000
    }
    if(numberOfVisitors>=10 && numberOfVisitors<=20){
        return 1500
    }
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
