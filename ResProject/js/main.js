const swiper = new Swiper(
    '.swiper-container',{
        loop: true,
        navigation:{
            nextEl:'.slider-button-next',
            prevEl: '.slider-button-prev'
        }
    }
);

let allGoods = [];

function getGoods(){
    fetch('json/inf.json').then(res => res.json()).then(result => {allGoods = result});
}


//корзина поля и методы там
const cart ={
    cartGoods:[], //массив объектов, будем добовлять в корзину
    addCartId(id){
        const goodsItems = this.cartGoods.find(good => good.id === id);
        if(goodsItems){
            this.plusGood(id)
        } else{
            const {id: idx, name, price} = allGoods.find(good => good.id === id)
            this.cartGoods.push({id: idx, name, price, count:1});
            this.cartRender();
        }

    },
    cartRender(){
        tableCard.textContent ='';
        this.cartGoods.forEach(({id, name, price, count}) =>{
            const tr = document.createElement('tr');
            tr.className = 'cart-item'
            tr.dataset.id = id;
            tr.innerHTML = `
            <td> ${name} </td>
            <td> ${price} </td>
            <td><button class = "mines" data-id = ${id}>-</button></td>
            <td> ${count} </td>
            <td><button class = "plus" data-id = ${id}>+</button></td>
            <td> ${count * price} </td>
            <td><button class = "delete" data-id = ${id}>X</button></td>`

            tableCard.append(tr);
        })
        const totalPrice = this.cartGoods.reduce((sum,item) => sum +item.price * item.count, 0);
        total.textContent = `${totalPrice}`;
        //*
    },
    plusGood(id){
        const elem = this.cartGoods.find(el => el.id === id);
        if(elem){
            elem.count++;
        }
        this.cartRender();
    },
    minusGood(id){
        const elem = this.cartGoods.find(good => good.id == id);
        if(elem.count === 1){
            this.deleteGood(id);
        } else{
            elem.count--;
        }
        this.cartRender();
    },
    deleteGood(id){
        this.cartGoods = this.cartGoods.filter(el => el.id !== id);
        this.cartRender();
    }
}
const buttonBuy = document.querySelector('.buy');
const modalCard = document.querySelector('.overlay');
const tableCard = document.querySelector('.modal-goods');
const total = document.querySelector('.modal-sum');
const navigation = document.querySelectorAll('.navigation-items');
const logotipe = document.querySelector('.logotipe');

function renderCart(data){
    document.body.classList.add('show-goods');
}

logotipe.addEventListener('click', ()=>{
    if(document.body.classList.contains('show-goods')){
        document.body.classList.remove('show-goods');
    }
})



function filterCarts(field, value){
    renderCart(allGoods.filter(good => good[field] === value));
}

navigation.forEach((link) => {
    link.addEventListener('click', (e)=>{
        const fields = link.dataset.field;
        if(fields){
            const value = link.textContent;
            filterCarts(fields,value);
            return;
        }
        renderCart(allGoods);
    })
})


//делаем рабочие кнопки
tableCard.addEventListener('click', (e)=>{
    const target = e.target;
    if(target.tagName === 'BUTTON'){
        const className = target.className;
        const id = target.dataset.id;

        switch(className){
            case 'plus':
                cart.plusGood(id);
                break;
            case 'mines':
                cart.minusGood(id);
                break;
            case 'delete':
                cart.deleteGood(id);
                break;
        }
    }
})

//закрыть окно корзины
document.addEventListener('mouseup', (e) =>{
    if(!e.target.closest('.modal') || e.target.classList.contains('modal-btn')){
        modalCard.classList.remove('show');
    }
})
//открыть окно
buttonBuy.addEventListener('click', ()=>{
    //card.renderCart();
    modalCard.classList.add('show')
    
})
//добавляем в корзину по клике на кнопку
document.body.addEventListener('click', (el) =>{
    const target = el.target.closest('.in-box');
    if(target){
        cart.addCartId(target.dataset.id);
    }
})
getGoods();


