
// Helpers
const isTouch = matchMedia('(hover:none),(pointer:coarse)').matches;

// Header shrink + progress
const header = document.querySelector('.site-header');
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  const doc = document.documentElement;
  const scrolled = (doc.scrollTop) / (doc.scrollHeight - doc.clientHeight) * 100;
  progressBar.style.width = scrolled + '%';
});

// Preloader -> header/hero reveal
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  setTimeout(()=>{
    pre.classList.add('hidden');
    document.querySelector('.site-header').classList.add('revealed');

    const title = document.querySelector('.hero-title');
    const subtitle = document.querySelector('.hero-subtitle');
    const cta = document.querySelector('.hero-btn');
    requestAnimationFrame(()=>{
      title.style.opacity = 1; title.style.transform = 'translateY(0)';
      setTimeout(()=>{ subtitle.style.opacity = 1; subtitle.style.transform = 'translateY(0)'; }, 150);
      setTimeout(()=>{ cta.style.opacity = 1; cta.style.transform = 'translateY(0)'; }, 300);
    });
  }, 1200);
});

// Reveal on scroll
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); }});
},{threshold:0.15});
document.querySelectorAll('.section-animate').forEach(sec=>observer.observe(sec));

// Back to top
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', ()=>{ if(window.scrollY>400) backBtn.classList.add('show'); else backBtn.classList.remove('show'); });
backBtn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

// Cursor FX
const cursor = document.getElementById('cursor');
if (!isTouch) {
  let x=0,y=0, tx=0, ty=0; const speed = 0.18;
  function animate(){ tx += (x-tx)*speed; ty += (y-ty)*speed; cursor.style.transform = `translate(${tx}px,${ty}px)`; requestAnimationFrame(animate); }
  window.addEventListener('mousemove', e=>{ x=e.clientX; y=e.clientY; });
  animate();
} else { cursor.style.display='none'; }

// Animation toggle
const animSwitch = document.getElementById('animSwitch');
const animStateText = document.getElementById('animState');
const saved = localStorage.getItem('bunker_anim_enabled');
const enabled = saved === null ? true : saved === 'true';
animSwitch.checked = enabled; setAnim(enabled);
animSwitch.addEventListener('change', ()=>{ const on = animSwitch.checked; setAnim(on); localStorage.setItem('bunker_anim_enabled', String(on)); });
function setAnim(on){ if(on){ document.body.classList.remove('anim-off'); animStateText.textContent='ON'; } else { document.body.classList.add('anim-off'); animStateText.textContent='OFF'; } }

// Cart system (text-only drawer)
const cartBtn = document.getElementById('cartButton');
const cartClose = document.getElementById('cartClose');
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');

let cart = [];
try {
  const savedCart = localStorage.getItem('bunker_cart');
  cart = savedCart ? JSON.parse(savedCart) : [];
} catch(e){ cart = []; }

function saveCart(){ localStorage.setItem('bunker_cart', JSON.stringify(cart)); }
function updateCount(){ const count = cart.reduce((n,i)=>n+i.qty,0); cartCountEl.textContent = count; }

function addToCart(id, name, price){
  const found = cart.find(i=>i.id===id);
  if(found){ found.qty += 1; } else { cart.push({id,name,price: Number(price), qty:1}); }
  saveCart(); renderCart(); showToast('ADDED TO CART ✓');
}

function removeOne(id){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty -= 1;
  if(it.qty<=0){ cart = cart.filter(i=>i.id!==id); }
  saveCart(); renderCart();
}

function addOne(id){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty += 1; saveCart(); renderCart();
}

function clearCart(){ cart = []; saveCart(); renderCart(); }

function cartTotal(){ return cart.reduce((s,i)=> s + i.price*i.qty, 0).toFixed(2); }

function renderCart(){
  updateCount();
  cartItemsEl.innerHTML = '';
  if(cart.length===0){
    cartItemsEl.innerHTML = '<div class="empty">Your cart is empty.</div>';
    cartTotalEl.textContent = '0.00';
    return;
  }
  cart.forEach(item=>{
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="name">${item.name}</div>
      <div class="qty">
        <button aria-label="Decrease" data-action="dec" data-id="${item.id}">-</button>
        <span>${item.qty}</span>
        <button aria-label="Increase" data-action="inc" data-id="${item.id}">+</button>
        <span>$${(item.price*item.qty).toFixed(2)}</span>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });
  cartTotalEl.textContent = cartTotal();
}
renderCart();

cartItemsEl.addEventListener('click', (e)=>{
  const btn = e.target.closest('button'); if(!btn) return;
  const id = btn.getAttribute('data-id'); const act = btn.getAttribute('data-action');
  if(act==='dec') removeOne(id);
  if(act==='inc') addOne(id);
});

cartBtn.addEventListener('click', ()=> toggleCart(true));
cartClose.addEventListener('click', ()=> toggleCart(false));
function toggleCart(open){ if(open){ cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); } else { cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); } }

document.querySelectorAll('.add-to-cart').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const card = e.target.closest('.product-card');
    addToCart(card.dataset.id, card.dataset.name, card.dataset.price);
  });
});

checkoutBtn.addEventListener('click', ()=>{
  alert('Checkout is not connected yet. Cart total: $'+cartTotal());
});
clearCartBtn.addEventListener('click', clearCart);

// Toast
let toastTimer = null;
const toastEl = document.getElementById('toast');
function showToast(msg){
  if(toastTimer){ clearTimeout(toastTimer); toastTimer = null; }
  toastEl.textContent = msg.toUpperCase();
  toastEl.classList.add('show');
  toastTimer = setTimeout(()=>{ toastEl.classList.remove('show'); }, 1500);
}
