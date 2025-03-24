<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed database or set up fake data if needed
        Task::factory()->count(3)->create(); // Use factories to seed tasks
    }

    public function test_it_can_list_tasks_with_filters_and_search()
    {
        // Create a sample task matching the filters
        Task::factory()->create([
            'name' => 'Sample Task',
            'status' => 'To Do',
            'due_date' => '2025-03-25',
        ]);

        $response = $this->actingAsUser()
            ->getJson('/api/tasks?search=Sample&status=To Do&due_date=2025-03-25');

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => [['id', 'name', 'status', 'due_date']]]);
    }

    public function test_it_can_create_a_task_with_valid_data()
    {
        $taskData = [
            'name' => 'New Task',
            'description' => 'This is a new task description.',
            'status' => 'To Do',
            'due_date' => '2025-03-30',
        ];

        $response = $this->actingAsUser()->postJson('/api/tasks', $taskData);

        $taskData['due_date'] = '2025-03-30T00:00:00.000000Z'; // Adjust the date format if needed

        $response->assertStatus(201)
            ->assertJsonFragment($taskData);

        $this->assertDatabaseHas('tasks', ['name' => 'New Task']); // Check task is in DB
    }


    /** @test */
    public function it_returns_validation_error_when_creating_task_with_invalid_data()
    {
        $taskData = [
            'name' => '', // Invalid name
            'description' => 'Test description',
            'status' => 'Invalid Status', // Invalid status
        ];

        $response = $this->actingAsUser()->postJson('/api/tasks', $taskData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'status']);
    }

    /** @test */
    public function it_can_show_a_specific_task()
    {
        $task = Task::factory()->create();

        $response = $this->actingAsUser()->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $task->id,
                'name' => $task->name,
            ]);
    }

    /** @test */
    public function it_can_update_a_task_with_valid_data()
    {
        $task = Task::factory()->create();
        $updateData = ['name' => 'Updated Task Name', 'status' => 'In Progress'];

        $response = $this->actingAsUser()->putJson("/api/tasks/{$task->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonFragment($updateData);

        $this->assertDatabaseHas('tasks', $updateData);
    }

    /** @test */
    public function it_can_delete_a_task()
    {
        $task = Task::factory()->create();

        $response = $this->actingAsUser()->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    /** @test */
    public function it_can_update_task_status()
    {
        $task = Task::factory()->create(['status' => 'To Do']);

        $response = $this->actingAsUser()->patchJson("/api/tasks/{$task->id}/status", ['status' => 'Done']);

        $response->assertStatus(200)
            ->assertJsonFragment(['status' => 'Done']);

        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'status' => 'Done']);
    }

    // Helper method to authenticate a user
    private function actingAsUser()
    {
        $user = \App\Models\User::factory()->create(); // Create and authenticate a user
        return $this->actingAs($user, 'api');
    }
}
