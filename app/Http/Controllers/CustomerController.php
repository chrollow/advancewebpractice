<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\User;
use Storage;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Customer::with('user')->orderBy('id', 'DESC')->get();

        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = new User([
            'name' => $request->fname . ' ' . $request->lname,
            'email' => $request->email,
            'password' => bcrypt($request->input('password')),
        ]);
        $user->save();

        $customer = new Customer();
        $customer->user_id = $user->id;
        $customer->username = $request->fname . ' ' . $request->lname;
        $customer->address = $request->addressline;
        $customer->contact_number = $request->phone;

        $file = $request->file('uploads');
        if ($file) {
            $filePath = 'storage/images/' . $file->getClientOriginalName();
            Storage::put('public/images/' . $file->getClientOriginalName(), file_get_contents($file));
            $customer->img_path = $filePath;
        }

        $customer->save();

        return response()->json([
            "success" => "customer created successfully.",
            "customer" => $customer,
            "status" => 200
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $customer = Customer::with('user')->where('id', $id)->first();
        return response()->json($customer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $customer = Customer::find($id);
        $user = User::where('id', $customer->user_id)->first();

        $customer->username = $request->fname . ' ' . $request->lname;
        $customer->address = $request->addressline;
        $customer->contact_number = $request->phone;
        $file = $request->file('uploads');
        if ($file) {
            $filePath = 'storage/images/' . $file->getClientOriginalName();
            Storage::put('public/images/' . $file->getClientOriginalName(), file_get_contents($file));
            $customer->img_path = $filePath;
        }
        $customer->save();

        $user->name = $request->fname . ' ' . $request->lname;
        $user->email = $request->email;
        if ($request->password) {
            $user->password = bcrypt($request->password);
        }
        $user->save();

        return response()->json([
            "success" => "customer updated successfully.",
            "customer" => $customer,
            "status" => 200
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();
		$data = array('success' => 'deleted','code'=>200);
        return response()->json($data);
    }
}
