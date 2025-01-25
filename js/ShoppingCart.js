
const cartItems=JSON.parse(localStorage.getItem('cart-products')) || []
const products=document.getElementById('cartProducts')
class Cart_Product
{
    
    static fragDocument=document.createDocumentFragment() // performance optimization
    static totalPrice=0;
    constructor(name,price,image,category,discount,count,num)
    {
      Object.assign(this,{name,price,image,category,discount,count,num})
      document.querySelector('.cart-empty').classList.add('d-none')
      Cart_Product.totalPrice+=parseInt(price.slice(0,price.indexOf('$')))*num
      Cart_Product.show_price()
    }
    
    add_product(){

        const item = document.createElement('div');
        item.classList.add('container', 'd-flex', 'rounded-4' ,'col-12','col-md-8','col-lg-5','mx-auto' ,'mx-lg-0');
        item.id = `item${this.count}`;
        
        item.innerHTML = `
            <div class="image w-50 d-flex justify-content-center align-items-center">
              <img class="col-9 col-lg-6" src="${this.image}" alt="">
            </div>
            <div class="info pt-1 w-50">
              <p class="product">
                <span class="header">Product:</span>
                <span class="content">${this.name}</span>
              </p>
              <p class="price">
                <span class="header">Price:</span>
                <span class="content" style="color:#29d651">${this.price}</span> 
              </p>
              <p class="category">
                <span class="header">Category:</span>
                <span class="content">${this.category}</span> 
              </p>
              <div class="actions d-flex justify-content-between  align-items-center">
                <div>
                  <span id='count-${this.count}'>${this.num}</span>
                  <a href="#"><i class="fa-solid fa-plus ms-1 text-success"></i></a>
                  <a href="#"><i class="fa-solid fa-minus ms-1 text-danger"></i></a>
                </div>
                <button id='remove-btn-${this.count}' class="py-2 px-3 rounded-pill bg-danger">Remove</button>
              </div>  
          </div>`;
        
        //  event listeners
      
        const removeBtn = item.querySelector(`#remove-btn-${this.count}`);
        removeBtn.addEventListener('click', (e) =>{
          e.preventDefault()
          Cart_Product.remove_from_cart(this.count)
          Cart_Product.totalPrice-=parseInt(this.price.slice(0,this.price.indexOf('$')))*this.num
          Cart_Product.show_price()
        });
    
        const plusIcon = item.querySelector(`.fa-plus`);
        plusIcon.addEventListener('click', (e) => {
          e.preventDefault()
          Cart_Product.event_listener(this,'add')
        }); 

        const minusIcon = item.querySelector(`.fa-minus`);
        minusIcon.addEventListener('click', (e) => {
          e.preventDefault()
          Cart_Product.event_listener(this,'minus')
        }); 

        Cart_Product.fragDocument.appendChild(item);
    }
    static remove_from_cart(count)
    {
       products.removeChild(document.getElementById(`item${count}`))
       cartItems.splice(cartItems.findIndex(item=>item[0].count===count),1)
       localStorage.setItem('cart-products',JSON.stringify(cartItems))
    }  
    add_num(){
      this.num++;
      document.getElementById(`count-${this.count}`).innerHTML=this.num.toString() 
      Cart_Product.totalPrice+=parseInt(this.price.slice(0,this.price.indexOf('$')))
    } 
    minus_num(count)
    {
      this.num--;
      document.getElementById(`count-${this.count}`).innerHTML=this.num.toString() 
     if(this.num===0){
         Cart_Product.remove_from_cart(count)
     }
      Cart_Product.totalPrice-=parseInt(this.price.slice(0,this.price.indexOf('$')))
    }
    static event_listener(item,flag)
    {
     const found=cartItems.find(element=>element[0].count===item.count)

     if(flag === 'add')
         item.add_num()
     else
        item.minus_num(item.count)

     const foundIndex=cartItems.indexOf(found)

     if(foundIndex!==-1){
       cartItems[foundIndex][1]=item.num
      localStorage.setItem('cart-products',JSON.stringify(cartItems))  
     }
     Cart_Product.show_price()
    }
    static show_price()
    {
      const priceElement=document.getElementById('price-num');
      priceElement.innerHTML=Cart_Product.totalPrice.toString()
      if(cartItems.length!==0)
        priceElement.parentElement.classList.remove('d-none')
      else{
        priceElement.parentElement.classList.add('d-none')
        document.querySelector('.cart-empty').classList.remove('d-none')
      }
      
    }

}

cartItems.forEach(element => {
  new Cart_Product(...Object.values(element[0]),element[1]).add_product()
});

products.appendChild(Cart_Product.fragDocument)

const favorites=JSON.parse(localStorage.getItem('favorites'))
const favoritesDOM=document.getElementById('favorites')
const arrowLeft=document.querySelector('.fa-arrow-left')
const arrowRight=document.querySelector('.fa-arrow-right')

class Favorite
{
  static fragDocument=document.createDocumentFragment() // performance optimization
  static count=0;
  constructor(name,category,image)
  {
     Object.assign(this,{name,category,image,count:Favorite.count++})
     document.querySelector('.fav-empty').classList.add('d-none')
     arrowLeft.classList.remove('d-none')
     arrowRight.classList.remove('d-none')
  }

      
  add_product(){

    const item = document.createElement('div');
    item.classList.add('container', 'pt-4', 'rounded-4' , 'pb-3' ,'col-7','col-md-4');
    item.id = `fav${this.count}`;
    
    item.innerHTML = `
            <div class="image h-50 d-flex justify-content-center align-items-center">
               <img class="h-75" src="${this.image}" alt="">
            </div>
            <div class="d-flex flex-column justify-content-between pt-3 h-50">
              <p class="product">
                  <span class="header">Product:</span>
                  <span class="content">${this.name}</span>
              </p>
              <p class="category">
                <span class="header">Category:</span>
                <span class="content">${this.category}</span> 
              </p>
              <div class="d-flex justify-content-end">
                 <i id='heart-${this.count}' class="fa-solid fa-heart text-danger" style="cursor: pointer; bottom:15px"></i>
              </div>
            </div>`;
    
    //  event listeners

    const heartIcon = item.querySelector(`.fa-heart`);
    heartIcon.addEventListener('click', (e) => {
      e.preventDefault()
      Favorite.remove_from_favorites(this)
    }); 

    Favorite.fragDocument.appendChild(item);
}
static remove_from_favorites(element)
{
   favoritesDOM.removeChild(document.getElementById(`fav${element.count}`))
   favorites.splice(favorites.findIndex(item=>item.name===element.name),1)
   if(favorites.length===0){
    document.querySelector('.fav-empty').classList.remove('d-none')
    arrowLeft.classList.add('d-none')
    arrowRight.classList.add('d-none')
   }

   localStorage.setItem('favorites',JSON.stringify(favorites))
}  
}

favorites.forEach(element=>{
  new Favorite(element.name,element.category,element.image).add_product()
})

favoritesDOM.appendChild(Favorite.fragDocument)


function smoothScroll(container, targetScroll, duration) {
  const startScroll = container.scrollLeft;
  const startTime = performance.now(); //e.g 2000
  
  function step(currentTime) { //e.g 2100 2200
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-in-out transition
    const easeInOut = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    container.scrollLeft = startScroll + targetScroll * easeInOut;

    if (progress < 1) 
      requestAnimationFrame(step); //recursion
  }

  requestAnimationFrame(step);

}
// Usage for Right Arrow
arrowRight.addEventListener('click', (e) => {
  e.preventDefault();
  smoothScroll(favoritesDOM, +350 , 350); // 350ms duration
});

// Usage for Left Arrow
arrowLeft.addEventListener('click', (e) => {
  e.preventDefault();
  smoothScroll(favoritesDOM, -350 , 350); // 350ms duration
});

