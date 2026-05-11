import { OrderRequest } from "../../../types/OrderRequest";
import { OrderResponse } from "../../../types/OrderResponse";

export abstract class OrderHandler {
 
    private next: OrderHandler | null = null;

    static processOrder (first:OrderHandler , ...chain:OrderHandler[]):OrderHandler{
        let head = first;
        for(const nextHandler of chain){
            head.next = nextHandler;
            head =nextHandler;
        }

        return first;
    }

    abstract handle (request:OrderRequest , response:OrderResponse):Promise<OrderResponse>;


    protected async handleNext(request:OrderRequest , response:OrderResponse):Promise<OrderResponse>{
       if(!this.next){
         return response;
       }
       return this.next.handle(request , response);
    }

}