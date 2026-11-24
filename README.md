# BookNest — Online Bookstore Project

A responsive, front-end online bookstore built with semantic HTML5, modern CSS3, and vanilla JavaScript. This is a student project/demo, not a production commerce system.

## 1. Project overview

**Project title:** BookNest — Online Bookstore  
**Project type:** Front-end e-commerce website  
**Technologies:** HTML5, CSS3, JavaScript (ES6+)  
**Dependencies:** None. Google Fonts are optional; the page falls back to system fonts.  
**Data storage:** Browser `localStorage` for cart, theme, and demo account name/email.

### Problem statement

Readers need a simple way to discover books by topic, compare basic details and prices, and manage a shopping list in a clear interface. BookNest demonstrates a front-end solution with search, filters, book details, a cart, and a simulated checkout.

### Objectives

- Build a semantic and accessible storefront.
- Use responsive CSS Grid, Flexbox, media queries, and reusable design tokens.
- Demonstrate JavaScript data rendering, event handling, filtering, sorting, and state updates.
- Persist cart contents and theme preferences across refreshes.
- Demonstrate form validation and modal/dialog interactions.
- Keep code readable and explainable for an engineering viva.

## 2. Run the project

1. Download and extract `BookNest.zip`.
2. Open the `booknest` folder.
3. Double-click `index.html` to open it in a modern browser.
4. For a more realistic local development setup, open the folder in VS Code and use the Live Server extension.
5. No package installation, build step, API key, or database is required.

## 3. File structure

```text
booknest/
├── index.html    # Semantic page structure and dialogs/forms
├── styles.css    # Design system, responsive layout, dark theme
├── script.js     # Book data and all interactions
└── README.md     # Project report, setup and viva notes
```

## 4. Main features

1. **Responsive navigation:** Sticky header, mobile menu, section links, and active link styling.
2. **Book catalogue:** Twelve original demo book records, generated into cards from a JavaScript data array.
3. **Live search:** Searches title, author, category, and description as the user types.
4. **Category filters:** Six category choices, with category cards and offer links that apply filters.
5. **Sorting:** Featured order, price ascending/descending, and rating.
6. **Book details dialog:** Shows description, author, rating, publication year, page count, and price.
7. **Shopping cart:** Add, remove, and change quantities. Cart badge and totals update without reloading.
8. **Price calculation:** 5% illustrative tax and ₹60 demo shipping below ₹999; shipping is free at or above ₹999.
9. **Persistent cart:** Cart state is stored in `localStorage`.
10. **Dark mode:** Theme preference persists in `localStorage`.
11. **Demo account UI:** Registration and sign-in flow uses a local display name and email. The password is not stored.
12. **Checkout form:** Browser validation checks required fields and a six-digit PIN code. Submitting produces a simulated order reference and clears the cart.
13. **Newsletter demo:** Validates email format, but does not send email.
14. **Accessible feedback:** Labels, keyboard focus styles, skip link, `aria-live` regions, semantic sections, and native `<dialog>` elements.
15. **Reduced motion:** Honors `prefers-reduced-motion`.

## 5. Price calculation

The example uses these transparent demo rules:

- Subtotal = sum of each book price × quantity.
- Tax = 5% of subtotal.
- Shipping = ₹0 if subtotal is ₹0 or at least ₹999; otherwise ₹60.
- Total = subtotal + tax + shipping.

For example, if the subtotal is ₹800:
- Tax = ₹40
- Shipping = ₹60
- Total = ₹900

These rates are for demonstrating calculations only, not tax or shipping advice.

## 6. Accessibility and responsive design

- Semantic `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>` elements.
- A skip link lets keyboard users move directly to the main content.
- Form fields have labels; decorative symbols are hidden from assistive technology where appropriate.
- Buttons have descriptive accessible names when their visible labels alone are not enough.
- Dialogs use native HTML `<dialog>` and `showModal()`.
- `aria-live` announces cart and newsletter feedback.
- Keyboard focus has a visible outline.
- CSS media queries adapt the page for desktop, tablet, and mobile.
- CSS Grid and Flexbox are used for responsive layouts.
- Reduced-motion settings are respected.

**Exam note:** Run a contrast checker and test with keyboard navigation and a screen reader before claiming full WCAG conformance. This project uses accessibility-conscious patterns but has not been formally audited.

## 7. JavaScript concepts demonstrated

- Arrays and objects for the catalogue.
- Functions for rendering, searching, sorting, and calculating totals.
- `filter()` and `sort()` for catalogue operations.
- `find()` and `reduce()` for cart updates and calculations.
- Event listeners and event delegation.
- Template literals for rendering cards.
- JSON serialization with `JSON.stringify()` and `JSON.parse()`.
- `localStorage` persistence and error handling.
- Form events, `reportValidity()`, and input constraints.
- DOM updates without page reloads.

## 8. Testing checklist

- [ ] Open `index.html` and confirm the page renders.
- [ ] Search for a book title, an author, and a category.
- [ ] Apply each category and reset filters.
- [ ] Sort by price and rating.
- [ ] Open and close a book details dialog.
- [ ] Add the same book more than once.
- [ ] Increase/decrease quantity and remove an item.
- [ ] Check subtotal, tax, shipping, and total.
- [ ] Refresh and verify the cart remains.
- [ ] Toggle dark mode and refresh.
- [ ] Register a demo account, then sign in with the same email.
- [ ] Try checkout with missing or invalid fields.
- [ ] Submit valid demo checkout details and confirm the order is labelled as simulated.
- [ ] Test mobile layout using browser developer tools.
- [ ] Use keyboard-only navigation and check visible focus.
- [ ] Check the browser console for errors.

## 9. Limitations and future scope

This is a front-end demonstration. It has no backend, inventory service, real user authentication, email delivery, shipping integration, or payment gateway. The demo account is local to one browser and should not be used for real credentials. The checkout is simulated and does not create a real order.

Possible future upgrades:
- Backend API and database (for example, Node.js/Express and PostgreSQL).
- Secure server-side authentication and password hashing.
- Inventory management and order history.
- Real payment provider integration in a secure, compliant environment.
- Admin dashboard, book reviews, wishlist, and recommendations.
- Automated unit and end-to-end tests.

## 10. Suggested viva questions

**Q1. What is HTML5 used for?**  
It defines the semantic structure and content of the page.

**Q2. What is CSS Grid?**  
A two-dimensional layout system used to arrange cards and page sections in rows and columns.

**Q3. Why use Flexbox?**  
It is useful for one-dimensional alignment, such as navigation, buttons, and header content.

**Q4. What is responsive design?**  
A design approach that adapts layout and content to different screen sizes and input devices.

**Q5. What does `localStorage` do?**  
It stores string data in the browser across page reloads. It is not a secure database.

**Q6. How does live search work?**  
An input event reads the query, filters the book array, and re-renders matching cards.

**Q7. What is event delegation?**  
A parent listener handles events from child controls, which is useful for cards created dynamically.

**Q8. How is the total calculated?**  
The program calculates subtotal from prices and quantities, adds the demo tax, then adds shipping when applicable.

**Q9. Is checkout real?**  
No. It validates fields and simulates an order locally. It never processes a payment.

**Q10. Why separate HTML, CSS, and JavaScript?**  
Separation of concerns makes structure, appearance, and behaviour easier to maintain and debug.

## 11. Academic integrity and evaluation

Use this project as a learning template. Read the code, customise the design and content, test the interactions, and be prepared to explain each feature in your own words. Marks depend on the instructor's rubric and demonstration; no particular score can be guaranteed.
