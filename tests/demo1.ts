import { expect, type Locator, type Page } from '@playwright/test';

let message1 : string = "Bye"; //static typing
//message1 = 2; //doesn't work, strong typing

let age1 : number = 21;
let isActive : boolean = false;

let  numbers1 : number[] = [1,2,3]

let data : any = "this could be anything";
data = 42;
console.log(message1);
console.log(age1);


function add(a:number, b:number): number {
    return a+b;
}
add(3,4);

let user: {name:string, age:number} = { name: "Bob", age: 34 };

class CheckoutPage {
    page: Page; //need to declare 
    checkoutBtn: Locator;
    selectCountryField: Locator;
    userNameLabel: Locator;
    placeOrderBtn: Locator;
    constructor(page:any) {
        this.page = page;
        this.checkoutBtn = page.getByRole('button', { name: 'Checkout' });
        this.selectCountryField = page.getByPlaceholder("Select Country");
        this.userNameLabel = page.locator(".user__name label");
        this.placeOrderBtn = page.locator(".action__submit");
    }
}

