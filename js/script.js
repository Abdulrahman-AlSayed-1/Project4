const login=document.getElementById('login')
const register=document.getElementById('register')
const username=document.getElementById('username')
const cart=document.getElementById('cart')
const logout=document.getElementById('logout')

if(localStorage.getItem('remember-me'))
{
   login.classList.add('d-none')
   register.classList.add('d-none')
   cart.classList.remove('d-none')
   logout.classList.remove('d-none')
   username.classList.remove('d-none')
   username.innerHTML=`WELCOME ${localStorage.getItem('first-name')}`
}

logout.addEventListener('click',()=>{
        localStorage.clear()

    setTimeout(()=>{location.assign('Login.html'),500});
})
class Cart{
    static added_products=document.getElementById('added-products')    
    constructor(name,number=0)
    {
       this.name=name
       this.number=number
    }
   add_product(){  
     if(Cart.added_products.firstElementChild.innerHTML==='Cart is Empty')
       Cart.added_products.firstElementChild.classList.add('d-none')

     Cart.added_products.innerHTML+=`
      <li class="added-item">
         <span>${this.name}</span>
         <div>
           <span id='${this.name.replace('/\s+/g','')}'>${this.number}</span>
           <a href="#"><i class="fa-solid fa-plus ms-1 text-success" onclick='Cart.event_listener("${this.name}" ,"add")'></i></a>
           <a href="#"><i class="fa-solid fa-minus ms-1 text-danger" onclick='Cart.event_listener("${this.name}" ,"minus")'></i></a>
         </div>
      </li>
         `   
    }
    add_num(){
         this.number++;
         document.getElementById(this.name.replace('/\s+/g','')).innerHTML=this.number.toString() 
    } 
    minus_num(count)
    {
        this.number--;
        document.getElementById(this.name.replace('/\s+/g','')).innerHTML=this.number.toString()
        if(this.number===0){
            Cart.remove(this.name,count)
        }
    }
   static event_listener(name ,flag)
    {
        const item= Product.cartItems_storage.find(item=>item[0].name===name)
        const found=new Cart(item[0].name,item[1])
        
        if(flag === 'add')
            found.add_num()
        else
           found.minus_num(item[0].count)


        const foundIndex=Product.cartItems_storage.indexOf(item)

        if(foundIndex!==-1)
          Product.cartItems_storage[foundIndex][1]=found.number

        localStorage.setItem('cart-products',JSON.stringify(Product.cartItems_storage))  
    }
   static remove(item,count){
      Product.cartItems_storage.splice(Product.cartItems_storage.findIndex(element=>element[0].name===item),1)
      Cart.added_products.removeChild(document.getElementById(item.replace('/\s+/g','')).parentElement.parentElement)
      document.getElementById(`add-btn-${count}`).classList.remove('d-none')
      document.getElementById(`remove-btn-${count}`).classList.add('d-none')
      Product.sign.innerHTML=Product.cartItems_storage.length.toString()
      if(Product.cartItems_storage.length===0){
        Cart.added_products.firstElementChild.classList.remove('d-none')
        Product.sign.classList.add('d-none')
      }
   } 
}

const arrow=document.getElementById('cart-arrow')
arrow.addEventListener('click',()=>{
  arrow.style.transform= arrow.style.transform === 'rotateX(180deg)' 
  ? 'rotateX(360deg)' 
  : 'rotateX(180deg)';
  
  document.getElementById('cart-container')
  .style.transform=
  arrow.style.transform === 'rotateX(180deg)'
  ?'scaleY(1)':'scaleY(0)'
})

const products=document.getElementById('products')

class Product
{
    static data= new WeakMap()  // privacy
    static fragDocument=document.createDocumentFragment() // performance optimization
    static cartItems_storage = null
    static favorites = null                 //for handling user activities
    static product_instancies=[]
    static count=0 
    static sign=document.getElementById('sign')
    constructor(name,price,image,category,discount)
    {
      Product.data.set(this,{name,price,image,category,discount,count:Product.count})
      Product.product_instancies[Product.count++]=this
    }

    get get_data(){
      return Product.data.get(this);
      }
    
    product(){

        const item = document.createElement('div');
        item.classList.add('container', 'pt-3', 'm-0','col-10' ,'col-md-6','col-lg-4');
        item.id = `item${this.get_data.count}`;
        
        item.innerHTML = `
            <div class="image p-sm-4 w-100 d-flex justify-content-center align-items-center">
                <img class="h-75" src="${this.get_data.image}" alt="">
            </div>
            <div class="info pt-3 pb-2">
                <p class="product">
                    <span class="header">Product:</span>
                    <span class="content">${this.get_data.name}</span>
                </p>
                <p class="price">
                    <span class="header">Price:</span>
                    <span class="content" style="color:#29d651">${this.get_data.price}</span> 
                    <span class="badge bg-danger ms-3">${this.get_data.discount}</span>
                </p>
                <p class="category">
                    <span class="header">Category:</span>
                    <span class="content">${this.get_data.category}</span> 
                </p>
                <div class="actions d-flex">
                    <button id='add-btn-${this.get_data.count}' class="add-btn py-2 px-3 rounded-5">
                        Add to Cart
                    </button>
                    <button id='remove-btn-${this.get_data.count}'class="rmv-btn py-2 px-3 rounded-5 d-none bg-danger">
                        Remove from Cart
                    </button>
                    <i id='heart-${this.get_data.count}'class="fa-solid fa-heart text-light ms-auto mt-3" style="cursor: pointer;"></i>
                </div>
            </div>`;
        
        //  event listeners
        const addBtn = item.querySelector(`#add-btn-${this.get_data.count}`); 
        addBtn.addEventListener('click', () =>{   //arrow function does not have its own 'this' so 'this' points to class instance not element of event 
          if(!localStorage.getItem('remember-me'))
            location.assign('Login.html');
          else
            Product.add_to_cart(this, 1)
        }); 
    
        const removeBtn = item.querySelector(`#remove-btn-${this.get_data.count}`);
        removeBtn.addEventListener('click', () => Product.remove_from_cart(this.get_data.name,this.get_data.count));
    
        const heartIcon = item.querySelector(`#heart-${this.get_data.count}`);
        heartIcon.addEventListener('click', () => {
          if(!localStorage.getItem('remember-me'))
            location.assign('Login.html');
          else
            Product.heartToggle(this);
        }); 

        Product.fragDocument.appendChild(item);
    }
    static add_to_cart(product,num,flag)
    {
      if(!flag){
        const {name,price,image,category,discount,count}=product.get_data // destruction
        Product.cartItems_storage.push([{name,price,image,category,discount,count},num])
      }

      new Cart(product.get_data.name,num).add_product()
      
      document.getElementById(`add-btn-${product.get_data.count}`).classList.add('d-none')
      document.getElementById(`remove-btn-${product.get_data.count}`).classList.remove('d-none')
      Product.sign.classList.remove('d-none')
      Product.sign.innerHTML=Product.cartItems_storage.length.toString()

      if(!flag)
       localStorage.setItem('cart-products',JSON.stringify(Product.cartItems_storage))
   
    }
    static remove_from_cart(product,count)
    {
       Cart.remove(product,count)
       localStorage.setItem('cart-products',JSON.stringify(Product.cartItems_storage))
    }  

    static searchByName(name)
    {
        const filtered_instancies=Product.product_instancies.filter(product=>product.get_data.name.toLowerCase().includes(name.toLowerCase())) 
        Array.from(products.children).forEach(item=>item.classList.add('d-none'))
        const HtmlElements=[]

        for(let instance of filtered_instancies)
          HtmlElements.push(document.getElementById(`item${instance.get_data.count}`))  
 
        HtmlElements.forEach(item=>item.classList.remove('d-none'))

    }
    static searchByCategory(category)
    {
      const filtered_instancies=Product.product_instancies.filter(product=>product.get_data.category.toLowerCase().includes(category.toLowerCase())) 
      Array.from(products.children).forEach(item=>item.classList.add('d-none'))
      const HtmlElements=[]
      for(let instance of filtered_instancies)
        HtmlElements.push(document.getElementById(`item${instance.get_data.count}`))  

      HtmlElements.forEach(item=>item.classList.remove('d-none'))
    }
    static heartToggle(product,flag)
    {
      const heart=document.getElementById(`heart-${product.get_data.count}`)
      let firstArg = undefined ;
      heart.classList.replace(firstArg = heart.classList.contains('text-danger')?
       'text-danger':'text-light' , firstArg == 'text-danger' ?
        'text-light' : 'text-danger')
       if(heart.classList.contains('text-danger') && !flag){
        const {name,price,image,category,discount,count}=product.get_data //destruction
        Product.favorites.push({name,price,image,category,discount,count}) 
       localStorage.setItem('favorites',JSON.stringify(Product.favorites))
       }
       else if(heart.classList.contains('text-light') && !flag){
        Product.favorites.splice(Product.favorites.findIndex(item=>item.name===product.get_data.name),1)
        localStorage.setItem('favorites',JSON.stringify(Product.favorites))
       }
    }
}


function swap(array,x,y)
{
    let z=array[x]
    array[x]=array[y]
    array[y]=z
    return array
}
function shuffle(products)       // Shuffling Algorithm so that we can benefit from the search feature.
{
    let random=undefined
    for(i=17;i>0;i--){
     random=Math.floor(Math.random()*(i+1))
     swap(products,i,random)
    }
    for(const item of products)   // for of loop to take advantage of the iterable array feature
        item.product()
    
}


//////Products///////////////////////Products///////////////////////

window.addEventListener('load',()=>{
 

const product1=new Product('Bright Purple T-shirt','50$','images/bright-purple-t-shirt_removed_bg.png','T-shirts','-30%')

const product2=new Product('Black Airpuds','85$','images/blackAirpuds_removed_bg.png','Phone Accessories','-25%')

const product3=new Product('White Iphone Charger','12$','images/white-iphone-charger_removed_bg.png','Phone Accessories','-7%')

const product4=new Product('Grey Wool Coat','90$','images/greyWoolCoat_removed_bg.png','Jackets & Coats','-40%')

const product5=new Product('Light Green T-shirt','25$','images/light-green-t-shirt_removed_bg.png','T-shirts','-33%')

const product6=new Product('Grey Iphone Charging Cable','5$','images/grey-iphone-charger-cable_removed_bg.png','Phone Accessories','-9%')

const product7=new Product('White Airpuds','100$','images/WhiteAirpuds_removed_bg.png','Phone Accessories','-10%')

const product8=new Product('Leather Biker Jacket','120$','images/LeatherBikerJacket_removed_bg.png','Jackets & Coats','-18%')

const product9=new Product('MT8 Ultra Smart Watch','180$','images/MT8-ultra-smartwatch_removed_bg.png','Smart Watches','-11%')

const product10=new Product('Blue Sunglasses','15$','images/blue_sunglasses_removed_bg.png','Sunglasses','-50%')

const product11=new Product('Iphone 13 Black Thunder Cover','15$','images/iphone13BlackThunderCover_removed_bg.png','Phone Accessories','-50%')   

const product12=new Product('Black T-shirt','11$','images/black-Tshirt_removed_bg.png','T-shirts','-3%')

const product13=new Product('Black Winter Jacket with Hood','22$','images/Jacket3_removed_bg.png','Jackets & Coats','-75%')

const product14=new Product('Iphone 14 Leather Wallet Cover','7$','images/iphone-14-leather-wallet-cover_removed_bg.png','Phone Accessories','-35%')

const product15=new Product('Markif S8 ULTRA Smart Watch','70$','images/french-LIGE-smartwatch_removed_bg.png','Smart Watches','-20%')

const product16=new Product('Black Square Sunglasses','40$','images/blacksunglasses_removed_bg.png','Sunglasses','-25%')

const product17=new Product('Solace Luxury Smart Watch','150$','images/solace-luxury-smartwatch.webp','Smart Watches','-5%') 

const product18=new Product('Black Aviator Sunglasses','200$','images/black_aviator_sunglasses_removed_bg.webp','Sunglasses','-10%')

shuffle(Product.product_instancies)

products.appendChild(Product.fragDocument)

Product.cartItems_storage=JSON.parse(localStorage.getItem('cart-products')) || []

if(Product.cartItems_storage.length!==0)
   Product.cartItems_storage.forEach(item=>Product.add_to_cart(Product.product_instancies.find(element=>element.get_data.name===item[0].name),item[1],'do not'))
  
Product.favorites=JSON.parse(localStorage.getItem('favorites')) || []

Product.favorites.forEach(item=>Product.heartToggle(Product.product_instancies.find(element=>element.get_data.name===item.name),'do not'))

})


////////////////////////////////////////////////////////////////////////////////////

const searchElement=document.querySelector('input[type=search]')
const select_type=document.getElementById('search-type')

select_type.addEventListener('change',()=>{
  searchElement.removeAttribute('disabled')
  searchElement.placeholder='Search'
})

searchElement.addEventListener('keyup',()=>{

   if(select_type.value==='name')
      Product.searchByName(searchElement.value)
   else
      Product.searchByCategory(searchElement.value)
})

//-----------Js element------------------------------------------------

const scrollBtn=document.createElement('i');
scrollBtn.style.padding='0.75rem 0.85rem';
scrollBtn.style.backgroundColor='#000000';
scrollBtn.style.position='fixed';
scrollBtn.style.bottom='5%';
scrollBtn.style.right='30px';
scrollBtn.style.display='none';
scrollBtn.style.borderRadius='10px';
scrollBtn.style.color='#FFFFFF';
scrollBtn.style.zIndex='10';
scrollBtn.style.cursor='pointer';
scrollBtn.style.border='1px solid rgb(67, 66, 66)';
scrollBtn.style.borderRadius='50%';
scrollBtn.onmouseenter=function(){
  scrollBtn.style.opacity='0.5';
}
scrollBtn.onmouseleave=function(){
  scrollBtn.style.opacity='1';
}
scrollBtn.classList.add('fa-solid','fa-arrow-up');

window.onscroll=function(){
  scrollBtn.style.display= window.scrollY>=650 ? 'block' :'none';
}

scrollBtn.onclick=function(){
  window.scrollTo({
    top:0,
    behavior:"smooth"
  })
}

document.body.appendChild(scrollBtn);

window.addEventListener('pageshow',(e)=>{
  if(e.persisted)
    window.location.reload();
})

//---------------------------------------------------------------------

const year=document.getElementById('year');
year.innerText=new Date().getFullYear().toString(); //2024 