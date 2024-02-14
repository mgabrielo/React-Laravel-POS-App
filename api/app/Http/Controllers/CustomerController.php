<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index():JsonResponse
    {
        try {
            $data['customers']= DB::table('customers')->get();
            return $this->sendResponse("List fetched Successfully",$data, 200);
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request):JsonResponse
    {
        try {
            $validator= Validator::make($request->all(),[
                "first_name"=> "required|string|max:255",
                "last_name"=> "required|string|max:255",
                "email"=> "required|string|max:255|unique:customers,email",
                "phone_number"=> "required|string|max:255|unique:customers,phone_number",
                "zip_code"=> "required|string|min:6|max:6",
            ]);

            if($validator->fails()){
                return $this->sendError("Please Enter Valid input data", $validator->errors(),400);
            }
            DB::beginTransaction();
            $data['customer']=Customer::create($validator->validated());
            DB::commit();
            return $this->sendResponse("Customer created Successfully",$data,201);

        } catch (Exception $e) {
            DB::rollback();
            return $this->handleException($e);

        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id):JsonResponse
    {
        try {
            $data['customer']= Customer::find($id);
            if(empty($data['customer'])){
                return $this->sendError("Customer Not Found",["errors"=>["general"=>"customer not found"]] ,404);
            }
            return $this->sendResponse("Customer Found Successfully",$data,200);
        } catch (Exception $e) {
            return $this->handleException($e);

        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id):JsonResponse
    {
        try {
            $data['customer']= Customer::find($id);
            if(empty($data['customer'])){
                return $this->sendError("Customer Not Found",["errors"=>["general"=>"customer not found"]] ,404);
            }
            $validator= Validator::make($request->all(),[
                "first_name"=> "required|string|max:255",
                "last_name"=> "required|string|max:255",
                "email"=> "required|string|max:255|unique:customers,email," .$id,
                "phone_number"=> "required|string|max:255|unique:customers,phone_number," .$id,
                "zip_code"=> "required|string|min:6|max:6",
            ]);

            if($validator->fails()){
                return $this->sendError("Please Enter Valid input data", $validator->errors(),400);
            }
            DB::beginTransaction();
            $updateCustomerData=$validator->validated();
            $data['customer']->update($updateCustomerData); 
            DB::commit();
            return $this->sendResponse("Customer Updated Successfully",$data,200);

        } catch (Exception $e) {
            DB::rollback();
            return $this->handleException($e);

        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id):JsonResponse
    {
        try {
            $data['customer']= Customer::find($id);
            if(empty($data['customer'])){
                return $this->sendError("Customer Not Found",["errors"=>["general"=>"customer not found"]] ,404);
            }else{
                DB::beginTransaction();
                $data['customer']->delete();
                DB::commit();
                return $this->sendResponse("Product deleted Successfully",$data, 200);
            }
        } catch (Exception $e) {
            DB::rollback();
            return $this->handleException($e);
        }
    }
}
