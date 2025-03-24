<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        $query = Task::query();

        // Search by task name
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by due date
        if ($request->has('due_date')) {
            $query->whereDate('due_date', $request->due_date);
        }

        $tasks = $query->get();
        return response()->json([
            'data' => $tasks
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:To Do,In Progress,Done',
            'due_date' => 'nullable|date',
        ]);

        $task = Task::create($request->all());
        return response()->json($task, 201);
    }

    public function show($id)
    {
        $task = Task::findOrFail($id);
        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'status' => 'sometimes|in:To Do,In Progress,Done',
            'due_date' => 'sometimes|date',
        ]);

        $task = Task::findOrFail($id);
        $task->update($request->all());
        return response()->json($task);
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();
        return response()->json(null, 204);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:To Do,In Progress,Done',
        ]);

        $task = Task::findOrFail($id);
        $task->status = $request->status;
        $task->save();

        return response()->json($task);
    }
}
