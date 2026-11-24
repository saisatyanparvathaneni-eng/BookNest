/* BookNest — accessible, dependency-free storefront demo.
   All data and interactions are local; no real payment or backend is connected. */
"use strict";

const BOOKS = [
  {id:"algorithm-life",title:"The Algorithm of Life",author:"Dr. Elena Vance",category:"Science & Technology",price:549,oldPrice:649,rating:4.9,reviews:128,badge:"Bestseller",color:"#315447",accent:"#e5bd77",symbol:"✳",year:2025,pages:312,description:"A warm, accessible exploration of how algorithms shape everyday decisions — and how human curiosity can keep technology working for people.",featured:true},
  {id:"whispers-code",title:"Whispers in the Code",author:"Marcus Sterling",category:"Mystery & Thriller",price:399,oldPrice:null,rating:4.7,reviews:86,badge:"New release",color:"#283b5b",accent:"#dca16e",symbol:"⌘",year:2026,pages:284,description:"When a junior developer spots a message hidden in a routine software update, a quiet city becomes the setting for a race to uncover the truth.",featured:true},
  {id:"architectural-wonders",title:"Architectural Wonders",author:"Sophia Chen",category:"Arts & Design",price:699,oldPrice:875,rating:4.8,reviews:74,badge:"20% off",color:"#b8664e",accent:"#f0d6ad",symbol:"⌂",year:2024,pages:240,description:"A beautifully considered tour of landmark buildings, the people who imagined them, and the design choices that make spaces unforgettable.",featured:true},
  {id:"beyond-horizon",title:"Beyond the Horizon",author:"Julian Ross",category:"Fiction",price:349,oldPrice:null,rating:4.6,reviews:102,badge:"Staff pick",color:"#446b77",accent:"#e8c779",symbol:"☼",year:2025,pages:328,description:"On a coastal town's quiet edge, an unexpected friendship gives two strangers the courage to reconsider the lives they thought they wanted.",featured:true},
  {id:"mastering-data",title:"Mastering Data Structures",author:"Prof. Alan Turing Jr.",category:"Education",price:799,oldPrice:null,rating:4.9,reviews:211,badge:"Student favourite",color:"#4c4a72",accent:"#d6b8e1",symbol:"⌘",year:2025,pages:460,description:"A student-friendly guide to arrays, linked lists, trees, graphs and algorithms, with practical examples and exercises for building strong fundamentals.",featured:true},
  {id:"shadows-tomorrow",title:"Shadows of Tomorrow",author:"Claire Dubois",category:"Fiction",price:459,oldPrice:null,rating:4.5,reviews:63,badge:"Limited edition",color:"#38463e",accent:"#dba47f",symbol:"☾",year:2026,pages:306,description:"In a city that records every memory, one person discovers the value of the things that cannot be stored, measured, or explained.",featured:true},
  {id:"small-habits",title:"Small Habits, Brighter Days",author:"Mira Sen",category:"Personal Growth",price:299,oldPrice:349,rating:4.6,reviews:93,badge:"Reader favourite",color:"#c17c59",accent:"#f2d9a6",symbol:"☀",year:2024,pages:196,description:"Practical, kind advice for creating routines that fit real life, building consistency, and making progress without chasing perfection.",featured:false},
  {id:"python-pocket",title:"Python in Practice",author:"Neel Rao",category:"Science & Technology",price:499,oldPrice:null,rating:4.8,reviews:156,badge:"For beginners",color:"#3e6581",accent:"#edcf78",symbol:"⌘",year:2025,pages:338,description:"Learn Python through short, useful projects, from variables and loops to files, functions and simple automation.",featured:false},
  {id:"last-train",title:"The Last Train at Nine",author:"Ishita Mehra",category:"Mystery & Thriller",price:329,oldPrice:null,rating:4.4,reviews:58,badge:"Page-turner",color:"#3b344b",accent:"#d9a16f",symbol:"◇",year:2024,pages:272,description:"Six passengers board the same late train. By the final stop, each has a reason to keep one small secret.",featured:false},
  {id:"colour-notes",title:"A Field Guide to Colour",author:"Leah Fernandes",category:"Arts & Design",price:599,oldPrice:null,rating:4.7,reviews:47,badge:"Design pick",color:"#b65d5b",accent:"#f0d0a0",symbol:"✳",year:2025,pages:224,description:"Explore colour relationships, visual balance, and creative experiments through a practical guide for students and curious makers.",featured:false},
  {id:"focus-study",title:"The Focused Student",author:"Arjun Iyer",category:"Education",price:279,oldPrice:null,rating:4.5,reviews:119,badge:"Study smarter",color:"#52705e",accent:"#e6d29d",symbol:"Aa",year:2025,pages:188,description:"A realistic toolkit for planning study sessions, taking useful notes, preparing for exams, and protecting time for rest.",featured:false},
  {id:"paper-moons",title:"Paper Moons",author:"Tara Williams",category:"Fiction",price:389,oldPrice:null,rating:4.6,reviews:82,badge:"Book club pick",color:"#6b718f",accent:"#f0c1a0",symbol:"☾",year:2025,pages:294,description:"A tender novel about letters never sent, a family shop full of old paper, and the unexpected ways people find their way home.",featured:false}
];

const TAX_RATE = 0.05;
const SHIPPING_FEE = 60;
const FREE_SHIPPING_THRESHOLD = 999;
const CART_KEY = "booknest_cart_v1";
const THEME_KEY = "booknest_theme_v1";
const ACCOUNT_KEY = "booknest_demo_account_v1";
let cart = loadCart();
let activeAuthTab = "login";
let lastFocusedElement = null;

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const rupees = value => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(value);
const bookById = id => BOOKS.find(book => book.id === id);

function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(stored)) return [];
    return stored.filter(item => bookById(item.id) && Number.isInteger(item.qty) && item.qty > 0 && item.qty <= 99);
  } catch { return []; }
}
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  catch { showToast("Your browser could not save the cart. It will last for this session."); }
}
function cartQuantity() { return cart.reduce((sum,item)=>sum+item.qty,0); }
function subtotal() { return cart.reduce((sum,item)=>sum+bookById(item.id).price*item.qty,0); }
function taxAmount() { return Math.round(subtotal()*TAX_RATE*100)/100; }
function shippingAmount() { return subtotal() === 0 || subtotal() >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE; }
function orderTotal() { return subtotal()+taxAmount()+shippingAmount(); }

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function coverMarkup(book, extraClass="") {
  return `<div class="book-cover ${extraClass}" style="background:${book.color};color:${book.accent}" aria-label="Illustrated cover for ${escapeHTML(book.title)}" role="img"><span class="cover-title">${escapeHTML(book.title)}</span><span class="cover-art" aria-hidden="true">${escapeHTML(book.symbol)}</span><span class="cover-author">${escapeHTML(book.author)}</span></div>`;
}
function renderBooks() {
  const query = $("#search-input").value.trim().toLocaleLowerCase();
  const category = $("#category-filter").value;
  const sort = $("#sort-select").value;
  let filtered = BOOKS.filter(book => {
    const matchesQuery = !query || `${book.title} ${book.author} ${book.category} ${book.description}`.toLocaleLowerCase().includes(query);
    return matchesQuery && (category === "all" || book.category === category);
  });
  if (sort === "price-asc") filtered.sort((a,b)=>a.price-b.price);
  if (sort === "price-desc") filtered.sort((a,b)=>b.price-a.price);
  if (sort === "rating") filtered.sort((a,b)=>b.rating-a.rating);
  $("#book-grid").innerHTML = filtered.map(book => `
    <article class="book-card" data-book-id="${book.id}">
      <div class="book-cover-wrap">${coverMarkup(book)}<span class="book-badge">${escapeHTML(book.badge)}</span></div>
      <div class="book-info">
        <span class="book-category">${escapeHTML(book.category)}</span>
        <h3 class="book-title">${escapeHTML(book.title)}</h3>
        <p class="book-author">by ${escapeHTML(book.author)}</p>
        <div class="book-rating" aria-label="${book.rating} out of 5 stars">★★★★★ <span>${book.rating.toFixed(1)} (${book.reviews})</span></div>
        <div class="book-card-bottom"><div class="book-price">${rupees(book.price)}${book.oldPrice?`<span class="book-old-price">${rupees(book.oldPrice)}</span>`:""}</div><button class="add-button" type="button" data-add="${book.id}" aria-label="Add ${escapeHTML(book.title)} to cart">＋ Add to bag</button></div>
        <button class="details-button" type="button" data-details="${book.id}">Book details →</button>
      </div>
    </article>`).join("");
  $("#results-count").textContent = `Showing ${filtered.length} of ${BOOKS.length} books`;
  $("#empty-state").hidden = filtered.length !== 0;
}
function renderCart() {
  $("#cart-count").textContent = cartQuantity();
  $("#cart-count").setAttribute("aria-label", `${cartQuantity()} items in cart`);
  const hasItems = cart.length > 0;
  $("#cart-empty").hidden = hasItems;
  $("#cart-summary").hidden = !hasItems;
  $("#cart-items").innerHTML = cart.map(item => {
    const book = bookById(item.id);
    return `<article class="cart-item">
      ${coverMarkup(book)}
      <div><h3>${escapeHTML(book.title)}</h3><p>${rupees(book.price)} each</p>
        <div class="quantity-control" aria-label="Quantity for ${escapeHTML(book.title)}">
          <button type="button" data-qty="${book.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button type="button" data-qty="${book.id}" data-change="1" aria-label="Increase quantity">＋</button>
        </div>
      </div>
      <div class="cart-item-end"><strong>${rupees(book.price*item.qty)}</strong><button class="remove-item" type="button" data-remove="${book.id}">Remove</button></div>
    </article>`;
  }).join("");
  $("#cart-subtotal").textContent = rupees(subtotal());
  $("#cart-tax").textContent = rupees(taxAmount());
  $("#cart-shipping").textContent = shippingAmount() === 0 ? "Free" : rupees(shippingAmount());
  $("#cart-total").textContent = rupees(orderTotal());
  $("#checkout-total").textContent = rupees(orderTotal());
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD-subtotal());
  $("#shipping-note").textContent = subtotal() >= FREE_SHIPPING_THRESHOLD ? "Lovely — your demo shipping is free!" : `Add ${rupees(remaining)} more for free demo shipping.`;
}
function addToCart(id) {
  const book = bookById(id);
  if (!book) return;
  const existing = cart.find(item=>item.id===id);
  if (existing) {
    if (existing.qty >= 99) return showToast("Maximum quantity is 99 per title.");
    existing.qty++;
  } else cart.push({id,qty:1});
  saveCart(); renderCart();
  showToast(`<strong>Added to your bag</strong><br>${escapeHTML(book.title)} is ready for your next chapter.`);
}
function changeQuantity(id, delta) {
  const item = cart.find(entry=>entry.id===id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(entry=>entry.id!==id);
  if (item.qty > 99) item.qty = 99;
  saveCart(); renderCart();
}
function removeFromCart(id) {
  cart = cart.filter(item=>item.id!==id);
  saveCart(); renderCart(); showToast("Book removed from your bag.");
}
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = message;
  $("#toast-region").append(toast);
  window.setTimeout(()=>toast.remove(),3500);
}
function openDialog(id) {
  const dialog = document.getElementById(id);
  if (!dialog) return;
  lastFocusedElement = document.activeElement;
  if (!dialog.open) dialog.showModal();
}
function closeDialog(id) {
  const dialog = document.getElementById(id);
  if (dialog?.open) dialog.close();
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
}
function showBookDetails(id) {
  const book = bookById(id);
  if (!book) return;
  $("#book-modal-content").innerHTML = `<div class="book-modal-layout">
    <div class="book-modal-cover">${coverMarkup(book)}</div>
    <div class="book-modal-copy"><button class="modal-close" type="button" data-close-dialog="book-modal" aria-label="Close book details">×</button>
      <span class="book-category">${escapeHTML(book.category)}</span><h2 id="book-modal-title">${escapeHTML(book.title)}</h2>
      <p>by ${escapeHTML(book.author)}</p><div class="book-rating" aria-label="${book.rating} out of 5 stars">★★★★★ <span>${book.rating.toFixed(1)} · ${book.reviews} reader ratings</span></div>
      <p>${escapeHTML(book.description)}</p><div class="modal-details"><div><small>Published</small><strong>${book.year}</strong></div><div><small>Length</small><strong>${book.pages} pages</strong></div></div>
      <div class="modal-price">${rupees(book.price)} ${book.oldPrice?`<small>${rupees(book.oldPrice)}</small>`:""}</div><button class="button button-primary" type="button" data-add="${book.id}">＋ Add to bag</button>
    </div></div>`;
  openDialog("book-modal");
}
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === "dark";
  $("#theme-toggle").textContent = dark ? "☀" : "☾";
  $("#theme-toggle").setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  try { localStorage.setItem(THEME_KEY,theme); } catch {}
}
function initTheme() {
  let saved = "";
  try { saved = localStorage.getItem(THEME_KEY) || ""; } catch {}
  setTheme(saved === "dark" ? "dark" : "light");
}
function setAuthTab(tab) {
  activeAuthTab = tab;
  const register = tab === "register";
  $("#login-tab").classList.toggle("active",!register);
  $("#register-tab").classList.toggle("active",register);
  $("#login-tab").setAttribute("aria-selected",String(!register));
  $("#register-tab").setAttribute("aria-selected",String(register));
  $("#auth-name").hidden = !register;
  $("#auth-name-label").hidden = !register;
  $("#auth-name").required = register;
  $("#auth-password").autocomplete = register ? "new-password" : "current-password";
  $("#auth-submit").textContent = register ? "Create demo account" : "Sign in";
  $("#auth-message").textContent = "Demo only: account details stay in this browser.";
}
function openAccount() {
  let account = null;
  try { account = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "null"); } catch {}
  if (account?.email) {
    showToast(`Signed in as <strong>${escapeHTML(account.name || account.email)}</strong> (demo).`);
  }
  setAuthTab("login");
  $("#auth-form").reset();
  $("#auth-message").textContent = account?.email ? `Demo account available: ${escapeHTML(account.email)}. Sign in below.` : "Demo only: account details stay in this browser.";
  openDialog("auth-modal");
}
function handleAuth(event) {
  event.preventDefault();
  const email = $("#auth-email").value.trim().toLowerCase();
  const password = $("#auth-password").value;
  const name = $("#auth-name").value.trim();
  if (password.length < 6) return;
  let account = null;
  try { account = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "null"); } catch {}
  if (activeAuthTab === "register") {
    if (!name) return;
    // Demo only: store a display name and email, never a password.
    account = {name,email};
    try { localStorage.setItem(ACCOUNT_KEY,JSON.stringify(account)); }
    catch { $("#auth-message").textContent = "Browser storage is unavailable; the demo account could not be saved."; return; }
    $("#auth-message").textContent = `Welcome, ${name}! Your demo account has been created on this device.`;
    showToast(`Welcome to BookNest, <strong>${escapeHTML(name)}</strong>!`);
  } else {
    if (!account || account.email !== email) {
      $("#auth-message").textContent = "No matching demo account found on this device. Choose Create account first.";
      return;
    }
    $("#auth-message").textContent = `Welcome back, ${escapeHTML(account.name || email)}. Demo sign-in successful.`;
    showToast(`Welcome back, <strong>${escapeHTML(account.name || email)}</strong>!`);
  }
}
function resetFilters() {
  $("#search-input").value = "";
  $("#category-filter").value = "all";
  $("#sort-select").value = "featured";
  renderBooks();
}
function setCategory(category) {
  $("#category-filter").value = [...$("#category-filter").options].some(option=>option.value===category) ? category : "all";
  $("#search-input").value = "";
  renderBooks();
  $("#featured").scrollIntoView({behavior:"smooth"});
}
function handleCheckout(event) {
  event.preventDefault();
  if (!cart.length) return;
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const orderId = "BN-" + Math.random().toString(36).slice(2,8).toUpperCase();
  $("#order-success-message").textContent = `Reference ${orderId}. Demo total: ${rupees(orderTotal())}. No payment was processed and no parcel will be sent.`;
  $("#checkout-form").hidden = true;
  $("#order-success").hidden = false;
  cart = []; saveCart(); renderCart();
}
function openCheckout() {
  if (!cart.length) return showToast("Add a book to your bag before checkout.");
  $("#checkout-form").hidden = false;
  $("#order-success").hidden = true;
  $("#checkout-total").textContent = rupees(orderTotal());
  closeDialog("cart-modal");
  openDialog("checkout-modal");
}

document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  if (add) { addToCart(add.dataset.add); return; }
  const details = event.target.closest("[data-details]");
  if (details) { showBookDetails(details.dataset.details); return; }
  const qty = event.target.closest("[data-qty]");
  if (qty) { changeQuantity(qty.dataset.qty,Number(qty.dataset.change)); return; }
  const remove = event.target.closest("[data-remove]");
  if (remove) { removeFromCart(remove.dataset.remove); return; }
  const close = event.target.closest("[data-close-dialog]");
  if (close) { closeDialog(close.dataset.closeDialog); return; }
  const authTab = event.target.closest("[data-auth-tab]");
  if (authTab) { setAuthTab(authTab.dataset.authTab); return; }
  const category = event.target.closest("[data-category]");
  if (category) { setCategory(category.dataset.category); return; }
  const offer = event.target.closest(".offer-filter");
  if (offer) { setCategory(offer.dataset.category); return; }
});
$("#search-form").addEventListener("submit",event=>{event.preventDefault();renderBooks();$("#featured").scrollIntoView({behavior:"smooth"});});
$("#search-input").addEventListener("input",renderBooks);
$("#category-filter").addEventListener("change",renderBooks);
$("#sort-select").addEventListener("change",renderBooks);
$("#clear-filters").addEventListener("click",resetFilters);
$("#theme-toggle").addEventListener("click",()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
$("#cart-open").addEventListener("click",()=>{renderCart();openDialog("cart-modal");});
$("#account-open").addEventListener("click",openAccount);
$("#footer-account").addEventListener("click",openAccount);
$("#footer-cart").addEventListener("click",()=>{renderCart();openDialog("cart-modal");});
$("#cart-continue").addEventListener("click",()=>{closeDialog("cart-modal");$("#featured").scrollIntoView({behavior:"smooth"});});
$("#checkout-open").addEventListener("click",openCheckout);
$("#checkout-form").addEventListener("submit",handleCheckout);
$("#order-done").addEventListener("click",()=>{closeDialog("checkout-modal");$("#featured").scrollIntoView({behavior:"smooth"});});
$("#auth-form").addEventListener("submit",handleAuth);
$("#menu-toggle").addEventListener("click",()=>{
  const expanded = $("#menu-toggle").getAttribute("aria-expanded") === "true";
  $("#menu-toggle").setAttribute("aria-expanded",String(!expanded));
  $("#nav-links").classList.toggle("open",!expanded);
});
$$(".nav-link").forEach(link=>link.addEventListener("click",()=>{
  $$(".nav-link").forEach(item=>item.classList.toggle("active",item===link));
  $("#nav-links").classList.remove("open");
  $("#menu-toggle").setAttribute("aria-expanded","false");
}));
$("#author-books").addEventListener("click",()=>showBookDetails("algorithm-life"));
$("#delivery-shop").addEventListener("click",()=>{resetFilters();$("#featured").scrollIntoView({behavior:"smooth"});});
$("#newsletter-form").addEventListener("submit",event=>{
  event.preventDefault();
  $("#newsletter-message").textContent = "Thanks for your interest! This is a demo, so no email was sent.";
  event.currentTarget.reset();
});
$$("dialog").forEach(dialog=>{
  dialog.addEventListener("click",event=>{
    if(event.target===dialog) closeDialog(dialog.id);
  });
});
$("#year").textContent = new Date().getFullYear();

initTheme();
renderBooks();
renderCart();
