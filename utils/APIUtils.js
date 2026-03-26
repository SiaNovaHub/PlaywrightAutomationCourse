const {expect} = require('@playwright/test');
class APIUtils
{

    constructor(apiContext, loginPayLoad) //this apiContext is created in the beforeAll hook of the test file and passed to the constructor of this class when creating an object of this class in the beforeAll hook of the test file
    {
        this.apiContext = apiContext; //creates local variable for apiContext to be used in the class methods within the class file
        this.loginPayLoad = loginPayLoad; //creates local variable for loginPayLoad to be used in the class methods within the class file
    }

    async getToken()
    {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", { // this.apiContext is used to send the login request using the apiContext created in the beforeAll hook of the test file
            data: this.loginPayLoad
        }); // sends the login request using payload data
        expect(loginResponse.ok()).toBeTruthy(); // checks if the login response is successful
        const loginResponseJson =  await loginResponse.json(); //returns the json response from the login request
        const token = loginResponseJson.token; //saves the token from the login response
        console.log("Token:" + token);
        return token;
    }

    async createOrder(orderPayLoad)
    {
        let response = {};
        response.token = await this.getToken();
        const createOrderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
            data: orderPayLoad,
            headers: {
                "Content-Type": "application/json",
                "Authorization": response.token //adds the token to the header of the order creation request to authenticate the request, so that the order can be created successfully
            }});
        expect(createOrderResponse.ok()).toBeTruthy(); // checks if the order creation response is successful
        const createOrderResponseJson =  await createOrderResponse.json(); //returns the json response from the order creation request
        const orderId = createOrderResponseJson.orders[0]; //saves the order id from the order creation response
        console.log("Order Placed!");
        console.log("OrderId:" + orderId);
        response.orderId = orderId;
        return response;
    }
}
module.exports = {APIUtils}; //exports the APIUtils class to be used in the test file