<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductOrder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $data['orders']= DB::table('orders')
            ->leftJoin('customers', 'customers.id' ,'=', 'orders.customer_id')
            ->select(["orders.*", DB::raw("CONCAT(customers.first_name, ' ', customers.last_name) as customer_name")])
            ->get();
            return $this->sendResponse("List fetched Successfully",$data, 200);

        } catch (Exception $e) {
            DB::rollback();
            return $this->handleException($e);
        }
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $validator= Validator::make($request->all(),[
                "customer_id"=> "required|string|max:255|exists:customers,id",
                "products"=> "required|array|min:1",
                "products.*.product_id"=> "required|exists:products,id",
                "products.*.quantity"=> "required|numeric|min:1",
                "products.*.discount"=> "required|numeric|min:0|max:100",
            ]);
            if($validator->fails()){
                return $this->sendError("Please Enter Valid input data", $validator->errors(),400);
            }
            $postData = $validator->validated();
            DB::beginTransaction();
            $data['order']=Order::create([
                "customer_id"=>$postData['customer_id'],
                "order_number"=>"POS".uniqid(),
            ]);
            $data['order']->price=0;
            foreach ($postData["products"] as $product) {
                $productData=Product::find($product['product_id']);
                if(empty($productData)){
                    return $this->sendError("Product Not Found",["errors"=>["general"=>"product not found"]] ,404);
                }                

                if($productData->stock <  $product['quantity']){
                    return $this->sendError($productData->name." Is Out of Stock",$validator->errors() ,400);
                }

                ProductOrder::create([
                    "order_id"=>$data['order']->id,
                    "product_id"=>$productData->id,
                    "product_name"=>$productData->name,
                    "product_price"=>$productData->price,
                    "product_quantity"=>$product['quantity'],
                    "product_discount"=>$product['discount'],
                ]);

                $productData->stock= ($productData->stock - $product['quantity']);
                $productData->save();

                $calculatedPrice=$productData->price - ($productData->price * $product['discount']/100);
                $data['order']->price +=floatval($calculatedPrice * $product['quantity']);
                $data['order']->quantity += intval($product['quantity']);
            }
            $data['order']->save();
            DB::commit();

            return $this->sendResponse("Order created Successfully",$data,201);
        } catch (Exception $e) {
            DB::rollback();
            return $this->handleException($e);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $data['order']= Order::with('items', 'customer')->find($id);
            if(empty($data['order'])){
                return $this->sendError("Order Not Found",["errors"=>["general"=>"Order not found"]] ,404);
            }
            return $this->sendResponse("Order Found Successfully",$data,200);
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }


}
