<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Carbon;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index():JsonResponse
    {
        try {
            $data['products']= DB::table('products')
            // ->leftJoin('categories', 'categories.id', '=', 'products.catgeory_id')
            // ->select(["products.*", 'categories.name as category'])
            ->get();
            return $this->sendResponse("List fetched Successfully",$data, 200);
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    public function getCategories():JsonResponse
    {
        try {
            $data['categories']= DB::table('categories')->select('id', 'name')->get();
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
                "name"=> "required|string|max:255|unique:products,name",
                "category_id"=> "required",
                "stock"=> "required|numeric",
                "price"=> "required|numeric",
                "image"=> "required|mimes:jpeg,png,jpg|max:5000",
            ]);

            if($validator->fails()){
                return $this->sendError("Please Enter Valid input data", $validator->errors(),400);
            }

            $postData =$validator->validated();
            $imageFile=$postData['image'];
            $imageFileName=Carbon::now()->timestamp."-".uniqid().".".$imageFile->getClientOriginalExtension();

            if(!Storage::disk('public')->exists('product-category')){
                Storage::disk('public')->makeDirectory('product-category');
            }

            $imagePath =Storage::disk('public')->putFileAs('product-category', $imageFile, $imageFileName);
            $postData['image']=$imagePath;
            DB::beginTransaction();
            $data['product']=Product::create($postData);
            DB::commit();
            return $this->sendResponse("product created Successfully",$data,201);

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
            $data['product']= Product::with('category:id,name')->find($id);
            if(empty($data['product'])){
                return $this->sendError("Produc Not Found",["errors"=>["general"=>"product not found"]] ,404);
            }
            return $this->sendResponse("Product Found Successfully",$data,200);
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        $data['product']= Product::find($id);
        if(empty($data['product'])){
            return $this->sendError("Produc Not Found",["errors"=>["general"=>"product not found"]] ,404);
        }
        $validator= Validator::make($request->all(),[
            "name"=> "required|string|max:255|unique:products,name," .$data['product']->id,
            "category_id"=> "required",
            "stock"=> "required|numeric",
            "price"=> "required|numeric",
            "image"=> "sometimes|mimes:jpeg,png,jpg|max:5000",
        ]);

        if($validator->fails()){
            return $this->sendError("Please Enter Valid input data", $validator->errors(),400);
        }
        $postData =$validator->validated();
        if(!empty($postData['image'])){
            $imageFile=$postData['image'];
            $imageFileName=Carbon::now()->timestamp."-".uniqid().".".$imageFile->getClientOriginalExtension();

            if(!Storage::disk('public')->exists('product-category')){
                Storage::disk('public')->makeDirectory('product-category');
            }

            if(!Storage::disk('public')->exists($data['product']->image)){
                Storage::disk('public')->delete($data['product']->image);
            }

            $imagePath =Storage::disk('public')->putFileAs('product-category', $imageFile, $imageFileName);
            $postData['image']=$imagePath;
        }
        DB::beginTransaction();
        $data['product']=$data['product']->update();
        DB::commit();
        return $this->sendResponse("product created Successfully",$data,201);
    }


    public function destroy(string $id):JsonResponse
    {
        try {
            $data['product']= Product::find($id);
            if(empty($data['product'])){
                return $this->sendError("product Not Found",["errors"=>["general"=>"product not found"]] ,404);
            }else{
                
            if(Storage::disk('public')->exists($data['product']->image)){
                Storage::disk('public')->delete($data['product']->image);
            }
                DB::beginTransaction();
                $data['product']->delete();
                DB::commit();
                return $this->sendResponse("List deleted Successfully",$data, 200);
            }
        } catch (Exception $e) {
            DB::rollback();
            return $this->handleException($e);
        }
    }


}
